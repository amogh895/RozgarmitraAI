import { getDb } from '../db/connection';
import type { WorkerProfile } from '@rozgar-mitra/shared';

function parseWorker(row: any): WorkerProfile {
  return {
    ...row,
    skills: JSON.parse(row.skills || '[]'),
    work_categories: JSON.parse(row.work_categories || '[]'),
    training_interests: JSON.parse(row.training_interests || '[]'),
  };
}

export function getWorkerByUserId(userId: number): WorkerProfile | null {
  const db = getDb();
  const row = db.prepare(`
    SELECT wp.*, u.full_name, u.preferred_language
    FROM worker_profiles wp
    JOIN users u ON u.id = wp.user_id
    WHERE wp.user_id = ?
  `).get(userId) as any;
  return row ? parseWorker(row) : null;
}

export function updateWorkerProfile(userId: number, data: Partial<WorkerProfile>): WorkerProfile {
  const db = getDb();
  const existing = db.prepare(`SELECT * FROM worker_profiles WHERE user_id = ?`).get(userId) as any;
  if (!existing) throw new Error('WORKER_NOT_FOUND');

  db.prepare(`
    UPDATE worker_profiles SET
      district = ?, state = ?, skills = ?, work_categories = ?,
      experience_years = ?, expected_wage = ?, wage_unit = ?,
      availability = ?, education_level = ?, training_interests = ?,
      onboarding_complete = 1,
      updated_at = datetime('now')
    WHERE user_id = ?
  `).run(
    data.district ?? existing.district,
    data.state ?? existing.state,
    JSON.stringify(data.skills ?? JSON.parse(existing.skills)),
    JSON.stringify(data.work_categories ?? JSON.parse(existing.work_categories)),
    data.experience_years ?? existing.experience_years,
    data.expected_wage ?? existing.expected_wage,
    data.wage_unit ?? existing.wage_unit,
    data.availability ?? existing.availability,
    data.education_level ?? existing.education_level,
    JSON.stringify(data.training_interests ?? JSON.parse(existing.training_interests)),
    userId
  );

  return getWorkerByUserId(userId)!;
}

export function getEmployerByUserId(userId: number) {
  const db = getDb();
  return db.prepare(`SELECT * FROM employer_profiles WHERE user_id = ?`).get(userId) as any;
}
