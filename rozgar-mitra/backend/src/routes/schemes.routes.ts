import { Router, Request, Response } from 'express';
import { getDb } from '../db/connection';

const router = Router();

// GET /api/schemes — public
router.get('/', (req: Request, res: Response) => {
  const db = getDb();
  const { q, page = 1, per_page = 20 } = req.query as any;
  const offset = (parseInt(page) - 1) * parseInt(per_page);
  const conditions = ["status != 'discontinued'"];
  const args: any[] = [];

  if (q) {
    conditions.push('(LOWER(name) LIKE ? OR LOWER(summary) LIKE ? OR LOWER(eligibility_conditions) LIKE ?)');
    args.push(`%${q.toLowerCase()}%`, `%${q.toLowerCase()}%`, `%${q.toLowerCase()}%`);
  }

  const where = conditions.join(' AND ');
  const total = (db.prepare(`SELECT COUNT(*) as cnt FROM government_schemes WHERE ${where}`).get(...args) as any).cnt;
  const data = db.prepare(`SELECT * FROM government_schemes WHERE ${where} ORDER BY name LIMIT ? OFFSET ?`).all(...args, parseInt(per_page), offset);
  res.json({ success: true, data, total, page, per_page });
});

// GET /api/schemes/:id — public
router.get('/:id', (req: Request, res: Response) => {
  const db = getDb();
  const scheme = db.prepare('SELECT * FROM government_schemes WHERE id = ?').get(req.params.id);
  if (!scheme) return res.status(404).json({ error: 'NotFound', message: 'Scheme not found' });
  res.json({ success: true, data: scheme });
});

export default router;
