import { Router, Request, Response } from 'express';
import { validateBody } from '../middleware/validate';
import { registerSchema, loginSchema } from '../middleware/schemas';
import * as authService from '../services/auth.service';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// POST /api/auth/register
router.post('/register', validateBody(registerSchema), async (req: Request, res: Response) => {
  try {
    const result = await authService.registerUser(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (err: any) {
    if (err.message === 'EMAIL_EXISTS') {
      return res.status(409).json({ error: 'Conflict', message: 'Email already registered' });
    }
    console.error('Register error:', err);
    res.status(500).json({ error: 'InternalError', message: 'Registration failed' });
  }
});

// POST /api/auth/login
router.post('/login', validateBody(loginSchema), async (req: Request, res: Response) => {
  try {
    const result = await authService.loginUser(req.body);
    res.json({ success: true, data: result });
  } catch (err: any) {
    if (err.message === 'INVALID_CREDENTIALS') {
      return res.status(401).json({ error: 'Unauthorized', message: 'Invalid email or password' });
    }
    if (err.message === 'ACCOUNT_DISABLED') {
      return res.status(403).json({ error: 'Forbidden', message: 'Account is disabled' });
    }
    console.error('Login error:', err);
    res.status(500).json({ error: 'InternalError', message: 'Login failed' });
  }
});

// GET /api/auth/me
router.get('/me', authenticate, (req: AuthRequest, res: Response) => {
  res.json({ success: true, data: req.user });
});

export default router;
