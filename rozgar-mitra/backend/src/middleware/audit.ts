import { Request, Response, NextFunction } from 'express';
import { getDb } from '../db/connection';

export function auditLog(action: string, entityType?: string) {
  return (req: Request & { user?: { sub: number; role: string } }, res: Response, next: NextFunction): void => {
    const originalJson = res.json.bind(res);
    res.json = (body) => {
      if (res.statusCode < 400) {
        try {
          const db = getDb();
          db.prepare(`
            INSERT INTO audit_logs (actor_id, actor_role, action, entity_type, ip_address, details)
            VALUES (?, ?, ?, ?, ?, ?)
          `).run(
            req.user?.sub ?? null,
            req.user?.role ?? 'anonymous',
            action,
            entityType ?? null,
            req.ip ?? null,
            JSON.stringify({ method: req.method, path: req.path })
          );
        } catch {
          // Non-fatal audit failure — do not break response
        }
      }
      return originalJson(body);
    };
    next();
  };
}
