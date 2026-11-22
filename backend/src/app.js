import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import translationRoutes from './routes/translation.routes.js';
import { errorHandler } from './middleware/error-handler.js';

const app = express();
app.use(cors({ origin: env.clientOrigin }));
app.use(express.json({ limit: '1mb' }));
app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'voicebridge-api' }));
app.use('/api/translations', translationRoutes);
app.use(errorHandler);
export default app;
