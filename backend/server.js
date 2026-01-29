import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// Import routes
import authRoutes from './routes/auth.route.js';
import resumeRoutes from './routes/resume.route.js';
import jobRoutes from './routes/job.route.js';
import applicationRoutes from './routes/application.route.js';

// Import middleware
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { requestLogger } from './lib/logger.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Request logging
app.use(requestLogger);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'Resume Analyzer API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      resumes: '/api/resumes',
      jobs: '/api/jobs',
      applications: '/api/applications'
    }
  });
});

// 404 handler
app.use(notFound);

// Global error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════╗
║   Resume Analyzer API Server         ║
╠═══════════════════════════════════════╣
║   Port: ${PORT.toString().padEnd(28)} ║
║   Environment: ${(process.env.NODE_ENV || 'development').padEnd(21)} ║
║   Time: ${new Date().toLocaleTimeString().padEnd(26)} ║
╚═══════════════════════════════════════╝
  `);
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`💚 Health check: http://localhost:${PORT}/health`);
  console.log(`📚 API docs: http://localhost:${PORT}/`);
});