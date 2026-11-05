import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from './config';

import chatRoutes    from './routes/chat.routes';
import schemesRoutes from './routes/schemes.routes';
import trainingRoutes from './routes/training.routes';

const app = express();

app.use(helmet());
app.use(cors({ origin: config.corsOrigin }));
app.use(express.json({ limit: '1mb' }));

app.use('/api/chat',     rateLimit({ windowMs: 60_000, max: 15, standardHeaders: true, legacyHeaders: false }));
app.use('/api',          rateLimit({ windowMs: 60_000, max: 200, standardHeaders: true, legacyHeaders: false }));

app.use('/api/chat',     chatRoutes);
app.use('/api/schemes',  schemesRoutes);
app.use('/api/training', trainingRoutes);

app.get('/health', (_req, res) => res.json({ status: 'ok', version: '1.0.0', ts: new Date().toISOString() }));

app.use((_req, res) => res.status(404).json({ error: 'NotFound', message: 'Route not found' }));
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err.name);
  res.status(500).json({ error: 'InternalError', message: 'An unexpected error occurred' });
});

export default app;
