import { Router, Response } from 'express';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import { workerProfileSchema } from '../middleware/schemas';
import * as userService from '../services/user.service';
import { getDb } from '../db/connection';

const router = Router();

// GET /api/users/me/worker-profile
router.get('/me/worker-profile', authenticate, authorize('worker'), (req: AuthRequest, res: Response) => {
  const profile = userService.getWorkerByUserId(req.user!.sub);
  if (!profile) return res.status(404).json({ error: 'NotFound', message: 'Worker profile not found' });
  res.json({ success: true, data: profile });
});

// PUT /api/users/me/worker-profile
router.put('/me/worker-profile', authenticate, authorize('worker'), validateBody(workerProfileSchema), (req: AuthRequest, res: Response) => {
  try {
    const updated = userService.updateWorkerProfile(req.user!.sub, req.body);
    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(500).json({ error: 'InternalError', message: err.message });
  }
});

// GET /api/users/me/employer-profile
router.get('/me/employer-profile', authenticate, authorize('employer'), (req: AuthRequest, res: Response) => {
  const profile = userService.getEmployerByUserId(req.user!.sub);
  if (!profile) return res.status(404).json({ error: 'NotFound', message: 'Employer profile not found' });
  res.json({ success: true, data: profile });
});

// DELETE /api/users/me (account deletion)
router.delete('/me', authenticate, (req: AuthRequest, res: Response) => {
  try {
    const db = getDb();
    db.prepare('UPDATE users SET is_active = 0 WHERE id = ?').run(req.user!.sub);
    res.json({ success: true, message: 'Account deactivated' });
  } catch (err: any) {
    res.status(500).json({ error: 'InternalError', message: err.message });
  }
});

export default router;
