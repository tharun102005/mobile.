import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import adminRoutes from './routes/adminRoutes';

export const app = express();

// Security Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting for auth and sensitive admin endpoints
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: { error: 'Too many requests from this IP. Please try again later.' },
});

app.use('/api', apiLimiter);

// Mount Admin Routes
app.use('/api/admin', adminRoutes);

// Health Check Endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    app: 'OmniSense Admin Backend',
    timestamp: new Date().toISOString(),
  });
});

export default app;
