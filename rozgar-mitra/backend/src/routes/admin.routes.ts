import { Router, Response } from 'express';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';
import { getDb } from '../db/connection';

const router = Router();

// GET /api/admin/stats — aggregate metrics (no PII)
router.get('/stats', authenticate, authorize('admin'), (_req: AuthRequest, res: Response) => {
  const db = getDb();
  const stats = {
    total_users: (db.prepare(`SELECT COUNT(*) as c FROM users`).get() as any).c,
    total_workers: (db.prepare(`SELECT COUNT(*) as c FROM worker_profiles`).get() as any).c,
    total_employers: (db.prepare(`SELECT COUNT(*) as c FROM employer_profiles`).get() as any).c,
    total_jobs: (db.prepare(`SELECT COUNT(*) as c FROM jobs`).get() as any).c,
    active_jobs: (db.prepare(`SELECT COUNT(*) as c FROM jobs WHERE status = 'active'`).get() as any).c,
    pending_jobs: (db.prepare(`SELECT COUNT(*) as c FROM jobs WHERE status = 'pending'`).get() as any).c,
    total_applications: (db.prepare(`SELECT COUNT(*) as c FROM job_applications`).get() as any).c,
    total_chat_sessions: (db.prepare(`SELECT COUNT(*) as c FROM chat_sessions`).get() as any).c,
  };
  res.json({ success: true, data: stats });
});

// GET /api/admin/jobs/pending — moderation queue
router.get('/jobs/pending', authenticate, authorize('admin'), (_req: AuthRequest, res: Response) => {
  const db = getDb();
  const jobs = db.prepare(`
    SELECT j.id, j.title, j.category, j.location_state, j.status, j.created_at,
           ep.company_name, u.email as employer_email
    FROM jobs j
    JOIN employer_profiles ep ON ep.id = j.employer_id
    JOIN users u ON u.id = ep.user_id
    WHERE j.status = 'pending'
    ORDER BY j.created_at ASC
  `).all();
  res.json({ success: true, data: jobs });
});

// GET /api/admin/users — list users (minimal PII)
router.get('/users', authenticate, authorize('admin'), (_req: AuthRequest, res: Response) => {
  const db = getDb();
  const users = db.prepare(`
    SELECT id, email, role, full_name, is_active, created_at FROM users ORDER BY created_at DESC LIMIT 100
  `).all();
  res.json({ success: true, data: users });
});

// PATCH /api/admin/users/:id/status — enable/disable
router.patch('/users/:id/status', authenticate, authorize('admin'), (req: AuthRequest, res: Response) => {
  const db = getDb();
  const { is_active } = req.body;
  db.prepare(`UPDATE users SET is_active = ? WHERE id = ?`).run(is_active ? 1 : 0, req.params.id);
  res.json({ success: true });
});

// GET /api/admin/audit-logs
router.get('/audit-logs', authenticate, authorize('admin'), (_req: AuthRequest, res: Response) => {
  const db = getDb();
  const logs = db.prepare(`SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 200`).all();
  res.json({ success: true, data: logs });
});

export default router;
