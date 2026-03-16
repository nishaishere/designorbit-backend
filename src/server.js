import 'dotenv/config';
import express  from 'express';
import cors     from 'cors';
import helmet   from 'helmet';
import morgan   from 'morgan';

import connectDB               from './config/db.js';
import { apiLimiter }          from './middleware/rateLimiter.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

import authRoutes       from './routes/auth.js';
import contactRoutes    from './routes/contact.js';
import subscribeRoutes  from './routes/subscribe.js';
import projectRoutes    from './routes/projects.js';

// ── Connect to MongoDB ───────────────────────────────────
await connectDB();

const app = express();

// ── Security & Logging ───────────────────────────────────
app.use(helmet());
app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));

// ── CORS ─────────────────────────────────────────────────
app.use(
  cors({
    origin:      [process.env.CLIENT_URL, 'http://localhost:5173'],
    credentials: true,
    methods:     ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  })
);

// ── Body Parsing ─────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// ── Global Rate Limiter ──────────────────────────────────
app.use('/api', apiLimiter);

// ── Health Check ─────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: '🚀 DesignOrbit API is running',
    env:     process.env.NODE_ENV,
    time:    new Date().toISOString(),
  });
});

// ── API Routes ───────────────────────────────────────────
app.use('/api/auth',      authRoutes);
app.use('/api/contact',   contactRoutes);
app.use('/api/subscribe', subscribeRoutes);
app.use('/api/projects',  projectRoutes);

// ── 404 & Error Handlers ─────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ── Start Server ─────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('\n──────────────────────────────────────');
  console.log(`🚀  DesignOrbit API`);
  console.log(`📡  http://localhost:${PORT}/api`);
  console.log(`🌱  ENV: ${process.env.NODE_ENV}`);
  console.log('──────────────────────────────────────\n');
});
