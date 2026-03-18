import dotenv from "dotenv";
dotenv.config();

import express  from 'express';
import cors     from 'cors';
import helmet   from 'helmet';
import morgan   from 'morgan';

import connectDB from './config/db.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

import authRoutes       from './routes/auth.js';
import contactRoutes    from './routes/contact.js';
import subscribeRoutes  from './routes/subscribe.js';
import projectRoutes    from './routes/projects.js';

// ✅ app create first
const app = express();

// ── Middleware ───────────────────────────────────────────
app.use(helmet());
app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));

app.use(
  cors({
    origin: [process.env.CLIENT_URL, 'http://localhost:5173'],
    credentials: true,
  })
);

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api', apiLimiter);

// ── Routes ───────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: '🚀 DesignOrbit API is running',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/subscribe', subscribeRoutes);
app.use('/api/projects', projectRoutes);

// ── Error Handlers ───────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ✅ Start server AFTER DB connect
const startServer = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error("❌ Server start error:", err);
    process.exit(1);
  }
};

startServer();
