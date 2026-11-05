import { getDb } from '../db/connection';
import type { Job, JobMatchScore, WorkerProfile } from '@rozgar-mitra/shared';

function parseJob(row: any): Job {
  return {
    ...row,
    required_skills: JSON.parse(row.required_skills || '[]'),
    is_demo: Boolean(row.is_demo),
  };
}

// ── Search & filter jobs ──────────────────────────────────────────────────────
export function searchJobs(params: {
  q?: string;
  category?: string;
  state?: string;
  district?: string;
  employment_type?: string;
  wage_unit?: string;
  page: number;
  per_page: number;
}) {
  const db = getDb();
  const conditions: string[] = ["j.status = 'active'"];
  const args: any[] = [];

  if (params.q) {
    conditions.push("(j.title LIKE ? OR j.description LIKE ? OR j.category LIKE ?)");
    args.push(`%${params.q}%`, `%${params.q}%`, `%${params.q}%`);
  }
  if (params.category) { conditions.push("j.category = ?"); args.push(params.category); }
  if (params.state) { conditions.push("j.location_state = ?"); args.push(params.state); }
  if (params.district) { conditions.push("j.location_district = ?"); args.push(params.district); }
  if (params.employment_type) { conditions.push("j.employment_type = ?"); args.push(params.employment_type); }
  if (params.wage_unit) { conditions.push("j.wage_unit = ?"); args.push(params.wage_unit); }

  const where = conditions.join(' AND ');
  const offset = (params.page - 1) * params.per_page;

  const total = (db.prepare(`
    SELECT COUNT(*) as cnt FROM jobs j WHERE ${where}
  `).get(...args) as any).cnt;

  const rows = db.prepare(`
    SELECT j.*, ep.company_name as employer_name
    FROM jobs j
    JOIN employer_profiles ep ON ep.id = j.employer_id
    WHERE ${where}
    ORDER BY j.posted_date DESC
    LIMIT ? OFFSET ?
  `).all(...args, params.per_page, offset);

  return { data: rows.map(parseJob), total, page: params.page, per_page: params.per_page };
}

export function getJobById(id: number): Job | null {
  const db = getDb();
  const row = db.prepare(`
    SELECT j.*, ep.company_name as employer_name
    FROM jobs j
    JOIN employer_profiles ep ON ep.id = j.employer_id
    WHERE j.id = ?
  `).get(id) as any;
  return row ? parseJob(row) : null;
}

// ── Employer job management ───────────────────────────────────────────────────
export function createJob(employerId: number, data: Partial<Job>): Job {
  const db = getDb();
  const result = db.prepare(`
    INSERT INTO jobs (employer_id, title, category, location_district, location_state,
      wage_min, wage_max, wage_unit, employment_type, required_skills,
      description, application_method, expiry_date, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
  `).run(
    employerId, data.title, data.category, data.location_district, data.location_state,
    data.wage_min, data.wage_max, data.wage_unit, data.employment_type,
    JSON.stringify(data.required_skills || []),
    data.description, data.application_method, data.expiry_date
  );
  return getJobById(result.lastInsertRowid as number)!;
}

export function updateJob(jobId: number, employerId: number, data: Partial<Job>): Job {
  const db = getDb();
  const existing = db.prepare(`SELECT * FROM jobs WHERE id = ? AND employer_id = ?`).get(jobId, employerId) as any;
  if (!existing) throw new Error('JOB_NOT_FOUND');

  db.prepare(`
    UPDATE jobs SET
      title = ?, category = ?, location_district = ?, location_state = ?,
      wage_min = ?, wage_max = ?, wage_unit = ?, employment_type = ?,
      required_skills = ?, description = ?, application_method = ?, expiry_date = ?,
      updated_at = datetime('now')
    WHERE id = ? AND employer_id = ?
  `).run(
    data.title ?? existing.title,
    data.category ?? existing.category,
    data.location_district ?? existing.location_district,
    data.location_state ?? existing.location_state,
    data.wage_min ?? existing.wage_min,
    data.wage_max ?? existing.wage_max,
    data.wage_unit ?? existing.wage_unit,
    data.employment_type ?? existing.employment_type,
    JSON.stringify(data.required_skills ?? JSON.parse(existing.required_skills)),
    data.description ?? existing.description,
    data.application_method ?? existing.application_method,
    data.expiry_date ?? existing.expiry_date,
    jobId, employerId
  );
  return getJobById(jobId)!;
}

export function closeJob(jobId: number, employerId: number): void {
  const db = getDb();
  const result = db.prepare(`
    UPDATE jobs SET status = 'closed', updated_at = datetime('now')
    WHERE id = ? AND employer_id = ?
  `).run(jobId, employerId);
  if (result.changes === 0) throw new Error('JOB_NOT_FOUND');
}

export function getEmployerJobs(employerId: number) {
  const db = getDb();
  return db.prepare(`
    SELECT j.*, ep.company_name as employer_name
    FROM jobs j JOIN employer_profiles ep ON ep.id = j.employer_id
    WHERE j.employer_id = ?
    ORDER BY j.created_at DESC
  `).all(employerId).map(parseJob);
}

// ── Match scoring (deterministic) ─────────────────────────────────────────────
export function computeMatchScore(job: Job, profile: WorkerProfile): JobMatchScore {
  const workerSkills = new Set(profile.skills.map(s => s.toLowerCase()));
  const jobSkills = job.required_skills.map(s => s.toLowerCase());

  const matched = jobSkills.filter(s => workerSkills.has(s));
  const missing = jobSkills.filter(s => !workerSkills.has(s));

  let score = 0;
  const reasons: string[] = [];

  // Skills: up to 50 points
  if (jobSkills.length > 0) {
    const skillScore = Math.round((matched.length / jobSkills.length) * 50);
    score += skillScore;
    reasons.push(`Skills: ${matched.length}/${jobSkills.length} matched (+${skillScore})`);
  }

  // Category: up to 20 points
  const categoryMatch = profile.work_categories.map(c => c.toLowerCase()).includes(job.category.toLowerCase());
  if (categoryMatch) { score += 20; reasons.push('Category matches (+20)'); }

  // Location: up to 15 points
  const locationMatch = profile.state?.toLowerCase() === job.location_state.toLowerCase();
  if (locationMatch) { score += 15; reasons.push('Same state (+15)'); }

  // Wage: up to 15 points
  let wageMatch = false;
  if (profile.wage_unit === job.wage_unit) {
    if (profile.expected_wage <= job.wage_max && profile.expected_wage >= job.wage_min * 0.8) {
      wageMatch = true;
      score += 15;
      reasons.push('Wage expectation matches (+15)');
    }
  }

  return {
    job_id: job.id,
    score: Math.min(score, 100),
    matched_skills: matched,
    missing_skills: missing,
    location_match: locationMatch,
    wage_match: wageMatch,
    category_match: categoryMatch,
    explanation: reasons.join('. ') || 'No strong match signals found.',
  };
}

// ── Applications ──────────────────────────────────────────────────────────────
export function applyToJob(jobId: number, workerId: number, coverNote?: string) {
  const db = getDb();
  try {
    const result = db.prepare(`
      INSERT INTO job_applications (job_id, worker_id, cover_note)
      VALUES (?, ?, ?)
    `).run(jobId, workerId, coverNote ?? null);
    return db.prepare(`SELECT * FROM job_applications WHERE id = ?`).get(result.lastInsertRowid);
  } catch (err: any) {
    if (err.message?.includes('UNIQUE constraint failed')) throw new Error('ALREADY_APPLIED');
    throw err;
  }
}

export function getWorkerApplications(workerId: number) {
  const db = getDb();
  return db.prepare(`
    SELECT ja.*, j.title as job_title, j.category, j.location_district, j.location_state,
           ep.company_name as employer_name
    FROM job_applications ja
    JOIN jobs j ON j.id = ja.job_id
    JOIN employer_profiles ep ON ep.id = j.employer_id
    WHERE ja.worker_id = ?
    ORDER BY ja.applied_at DESC
  `).all(workerId);
}

export function getJobApplicants(jobId: number, employerId: number) {
  const db = getDb();
  // Verify job belongs to employer
  const job = db.prepare(`SELECT id FROM jobs WHERE id = ? AND employer_id = ?`).get(jobId, employerId);
  if (!job) throw new Error('JOB_NOT_FOUND');
  return db.prepare(`
    SELECT ja.id, ja.status, ja.cover_note, ja.applied_at,
           u.full_name, wp.skills, wp.experience_years, wp.district, wp.state
    FROM job_applications ja
    JOIN worker_profiles wp ON wp.id = ja.worker_id
    JOIN users u ON u.id = wp.user_id
    WHERE ja.job_id = ?
    ORDER BY ja.applied_at DESC
  `).all(jobId).map((row: any) => ({
    ...row,
    skills: JSON.parse(row.skills || '[]'),
  }));
}

export function updateApplicationStatus(appId: number, employerId: number, status: string) {
  const db = getDb();
  const app = db.prepare(`
    SELECT ja.id FROM job_applications ja
    JOIN jobs j ON j.id = ja.job_id
    WHERE ja.id = ? AND j.employer_id = ?
  `).get(appId, employerId);
  if (!app) throw new Error('APPLICATION_NOT_FOUND');
  db.prepare(`UPDATE job_applications SET status = ?, updated_at = datetime('now') WHERE id = ?`)
    .run(status, appId);
}

// ── Saved Jobs ────────────────────────────────────────────────────────────────
export function saveJob(workerId: number, jobId: number) {
  const db = getDb();
  try {
    db.prepare(`INSERT INTO saved_jobs (worker_id, job_id) VALUES (?, ?)`).run(workerId, jobId);
  } catch {
    // Already saved — ignore
  }
}

export function unsaveJob(workerId: number, jobId: number) {
  const db = getDb();
  db.prepare(`DELETE FROM saved_jobs WHERE worker_id = ? AND job_id = ?`).run(workerId, jobId);
}

export function getSavedJobs(workerId: number) {
  const db = getDb();
  return db.prepare(`
    SELECT j.*, ep.company_name as employer_name, sj.saved_at
    FROM saved_jobs sj
    JOIN jobs j ON j.id = sj.job_id
    JOIN employer_profiles ep ON ep.id = j.employer_id
    WHERE sj.worker_id = ?
    ORDER BY sj.saved_at DESC
  `).all(workerId).map(parseJob);
}
