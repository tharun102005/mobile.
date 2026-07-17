import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { connectDB } from './config/db';
import adminRoutes from './routes/adminRoutes';

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting for auth and sensitive admin endpoints
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // max 200 requests per IP per window
  message: { error: 'Too many requests from this IP. Please try again later.' },
});

app.use('/api', apiLimiter);

// Mount Admin Routes
app.use('/api/admin', adminRoutes);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'OmniSense Admin Backend',
    timestamp: new Date().toISOString(),
  });
});

async function startServer() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Admin REST API backend server listening at http://localhost:${PORT}`);
  });
}

startServer();
