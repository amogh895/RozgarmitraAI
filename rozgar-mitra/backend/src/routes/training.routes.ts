import { Router, Request, Response } from 'express';
import { getDb } from '../db/connection';

const router = Router();

// GET /api/training — public
router.get('/', (req: Request, res: Response) => {
  const db = getDb();
  const { q, category, mode, page = 1, per_page = 20 } = req.query as any;
  const offset = (parseInt(page) - 1) * parseInt(per_page);
  const conditions = ["status != 'discontinued'"];
  const args: any[] = [];

  if (q) {
    conditions.push('(LOWER(title) LIKE ? OR LOWER(provider) LIKE ? OR LOWER(skills_taught) LIKE ?)');
    args.push(`%${q.toLowerCase()}%`, `%${q.toLowerCase()}%`, `%${q.toLowerCase()}%`);
  }
  if (category) { conditions.push('category = ?'); args.push(category); }
  if (mode) { conditions.push('mode = ?'); args.push(mode); }

  const where = conditions.join(' AND ');
  const total = (db.prepare(`SELECT COUNT(*) as cnt FROM training_courses WHERE ${where}`).get(...args) as any).cnt;
  const data = db.prepare(`SELECT * FROM training_courses WHERE ${where} ORDER BY title LIMIT ? OFFSET ?`)
    .all(...args, parseInt(per_page), offset)
    .map((c: any) => ({ ...c, skills_taught: JSON.parse(c.skills_taught || '[]') }));

  res.json({ success: true, data, total });
});

// GET /api/training/:id — public
router.get('/:id', (req: Request, res: Response) => {
  const db = getDb();
  const course = db.prepare('SELECT * FROM training_courses WHERE id = ?').get(req.params.id) as any;
  if (!course) return res.status(404).json({ error: 'NotFound', message: 'Course not found' });
  res.json({ success: true, data: { ...course, skills_taught: JSON.parse(course.skills_taught || '[]') } });
});

export default router;
