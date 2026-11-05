import { Router, Response } from 'express';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';
import { validateBody, validateQuery } from '../middleware/validate';
import { jobCreateSchema, jobSearchSchema, applicationCreateSchema } from '../middleware/schemas';
import * as jobsService from '../services/jobs.service';
import * as userService from '../services/user.service';
import { getDb } from '../db/connection';

const router = Router();

// GET /api/jobs — public search
router.get('/', validateQuery(jobSearchSchema), (req: any, res: Response) => {
  const result = jobsService.searchJobs(req.query);
  res.json({ success: true, ...result });
});

// GET /api/jobs/categories — public
router.get('/categories', (_req, res: Response) => {
  const db = getDb();
  const cats = db.prepare(`SELECT DISTINCT category FROM jobs WHERE status = 'active' ORDER BY category`).all();
  res.json({ success: true, data: cats.map((c: any) => c.category) });
});

// GET /api/jobs/:id — public
router.get('/:id', (req, res: Response) => {
  const job = jobsService.getJobById(parseInt(req.params.id));
  if (!job) return res.status(404).json({ error: 'NotFound', message: 'Job not found' });
  res.json({ success: true, data: job });
});

// GET /api/jobs/:id/match — worker only
router.get('/:id/match', authenticate, authorize('worker'), (req: AuthRequest, res: Response) => {
  const job = jobsService.getJobById(parseInt(req.params.id));
  if (!job) return res.status(404).json({ error: 'NotFound', message: 'Job not found' });
  const profile = userService.getWorkerByUserId(req.user!.sub);
  if (!profile) return res.status(400).json({ error: 'BadRequest', message: 'Complete your profile first' });
  const score = jobsService.computeMatchScore(job, profile);
  res.json({ success: true, data: score });
});

// POST /api/jobs/:id/apply — worker only
router.post('/:id/apply', authenticate, authorize('worker'), validateBody(applicationCreateSchema), async (req: AuthRequest, res: Response) => {
  try {
    const db = getDb();
    const workerProfile = db.prepare(`SELECT id FROM worker_profiles WHERE user_id = ?`).get(req.user!.sub) as any;
    if (!workerProfile) return res.status(400).json({ error: 'BadRequest', message: 'Complete your profile first' });

    const app = jobsService.applyToJob(parseInt(req.params.id), workerProfile.id, req.body.cover_note);
    res.status(201).json({ success: true, data: app });
  } catch (err: any) {
    if (err.message === 'ALREADY_APPLIED') return res.status(409).json({ error: 'Conflict', message: 'Already applied' });
    res.status(500).json({ error: 'InternalError', message: err.message });
  }
});

// POST /api/jobs/:id/save — worker only
router.post('/:id/save', authenticate, authorize('worker'), (req: AuthRequest, res: Response) => {
  const db = getDb();
  const wp = db.prepare(`SELECT id FROM worker_profiles WHERE user_id = ?`).get(req.user!.sub) as any;
  if (!wp) return res.status(400).json({ error: 'BadRequest', message: 'Profile not found' });
  jobsService.saveJob(wp.id, parseInt(req.params.id));
  res.json({ success: true, message: 'Job saved' });
});

// DELETE /api/jobs/:id/save — worker only
router.delete('/:id/save', authenticate, authorize('worker'), (req: AuthRequest, res: Response) => {
  const db = getDb();
  const wp = db.prepare(`SELECT id FROM worker_profiles WHERE user_id = ?`).get(req.user!.sub) as any;
  if (!wp) return res.status(400).json({ error: 'BadRequest', message: 'Profile not found' });
  jobsService.unsaveJob(wp.id, parseInt(req.params.id));
  res.json({ success: true, message: 'Job unsaved' });
});

// GET /api/jobs/saved — worker only
router.get('/me/saved', authenticate, authorize('worker'), (req: AuthRequest, res: Response) => {
  const db = getDb();
  const wp = db.prepare(`SELECT id FROM worker_profiles WHERE user_id = ?`).get(req.user!.sub) as any;
  if (!wp) return res.status(400).json({ error: 'BadRequest', message: 'Profile not found' });
  res.json({ success: true, data: jobsService.getSavedJobs(wp.id) });
});

// GET /api/jobs/me/applications — worker only
router.get('/me/applications', authenticate, authorize('worker'), (req: AuthRequest, res: Response) => {
  const db = getDb();
  const wp = db.prepare(`SELECT id FROM worker_profiles WHERE user_id = ?`).get(req.user!.sub) as any;
  if (!wp) return res.status(400).json({ error: 'BadRequest', message: 'Profile not found' });
  res.json({ success: true, data: jobsService.getWorkerApplications(wp.id) });
});

// ── Employer routes ───────────────────────────────────────────────────────────

// GET /api/jobs/employer/my-jobs
router.get('/employer/my-jobs', authenticate, authorize('employer'), (req: AuthRequest, res: Response) => {
  const db = getDb();
  const ep = db.prepare(`SELECT id FROM employer_profiles WHERE user_id = ?`).get(req.user!.sub) as any;
  if (!ep) return res.status(400).json({ error: 'BadRequest', message: 'Employer profile not found' });
  res.json({ success: true, data: jobsService.getEmployerJobs(ep.id) });
});

// POST /api/jobs/employer/create
router.post('/employer/create', authenticate, authorize('employer'), validateBody(jobCreateSchema), (req: AuthRequest, res: Response) => {
  const db = getDb();
  const ep = db.prepare(`SELECT id FROM employer_profiles WHERE user_id = ?`).get(req.user!.sub) as any;
  if (!ep) return res.status(400).json({ error: 'BadRequest', message: 'Employer profile not found' });
  const job = jobsService.createJob(ep.id, req.body);
  res.status(201).json({ success: true, data: job, message: 'Job submitted for review' });
});

// PUT /api/jobs/employer/:id
router.put('/employer/:id', authenticate, authorize('employer'), validateBody(jobCreateSchema.partial()), (req: AuthRequest, res: Response) => {
  const db = getDb();
  const ep = db.prepare(`SELECT id FROM employer_profiles WHERE user_id = ?`).get(req.user!.sub) as any;
  try {
    const job = jobsService.updateJob(parseInt(req.params.id), ep.id, req.body);
    res.json({ success: true, data: job });
  } catch (err: any) {
    if (err.message === 'JOB_NOT_FOUND') return res.status(404).json({ error: 'NotFound', message: 'Job not found' });
    res.status(500).json({ error: 'InternalError', message: err.message });
  }
});

// POST /api/jobs/employer/:id/close
router.post('/employer/:id/close', authenticate, authorize('employer'), (req: AuthRequest, res: Response) => {
  const db = getDb();
  const ep = db.prepare(`SELECT id FROM employer_profiles WHERE user_id = ?`).get(req.user!.sub) as any;
  try {
    jobsService.closeJob(parseInt(req.params.id), ep.id);
    res.json({ success: true, message: 'Job closed' });
  } catch {
    res.status(404).json({ error: 'NotFound', message: 'Job not found' });
  }
});

// GET /api/jobs/employer/:id/applicants
router.get('/employer/:id/applicants', authenticate, authorize('employer'), (req: AuthRequest, res: Response) => {
  const db = getDb();
  const ep = db.prepare(`SELECT id FROM employer_profiles WHERE user_id = ?`).get(req.user!.sub) as any;
  try {
    const applicants = jobsService.getJobApplicants(parseInt(req.params.id), ep.id);
    res.json({ success: true, data: applicants });
  } catch {
    res.status(404).json({ error: 'NotFound', message: 'Job not found' });
  }
});

// PATCH /api/jobs/applications/:id/status — employer
router.patch('/applications/:id/status', authenticate, authorize('employer'), (req: AuthRequest, res: Response) => {
  const db = getDb();
  const ep = db.prepare(`SELECT id FROM employer_profiles WHERE user_id = ?`).get(req.user!.sub) as any;
  const { status } = req.body;
  const validStatuses = ['viewed', 'shortlisted', 'rejected', 'hired'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'BadRequest', message: 'Invalid status' });
  }
  try {
    jobsService.updateApplicationStatus(parseInt(req.params.id), ep.id, status);
    res.json({ success: true, message: 'Status updated' });
  } catch {
    res.status(404).json({ error: 'NotFound', message: 'Application not found' });
  }
});

// ── Admin moderation ──────────────────────────────────────────────────────────
router.patch('/admin/:id/status', authenticate, authorize('admin'), (req: AuthRequest, res: Response) => {
  const db = getDb();
  const { status } = req.body;
  const validStatuses = ['active', 'rejected', 'closed'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'BadRequest', message: 'Invalid status' });
  }
  db.prepare(`UPDATE jobs SET status = ?, updated_at = datetime('now') WHERE id = ?`).run(status, req.params.id);
  res.json({ success: true, message: `Job ${status}` });
});

export default router;
