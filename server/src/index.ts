import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from the server/.env explicitly
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

import apiRoutes from './routes/api';

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'http://127.0.0.1:5175',
].filter(Boolean) as string[];

// Middlewares
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. curl, server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true
}));
app.use(express.json());

// API Routes
app.use('/api', apiRoutes);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`[AETHERIS SERVER] running on port ${PORT}`);
});

export default app;
