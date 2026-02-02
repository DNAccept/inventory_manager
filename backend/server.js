import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/database.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import itemRoutes from './routes/itemRoutes.js';
import logRoutes from './routes/logRoutes.js';

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Connect to database
import User from './models/User.js';

// Connect to database
await connectDB();

// Auto-seed for development/in-memory usage
const seedIfEmpty = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('Database is empty. Seeding default admin user...');
      await User.create({
        username: 'admin',
        password: 'admin123',
        fullName: 'System Administrator',
        role: 'site_admin',
        isFirstLogin: false
      });
      console.log('Default admin created: admin / admin123');
    }
  } catch (error) {
    console.error('Auto-seed failed:', error);
  }
};
// seedIfEmpty();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware (development)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// Health check route
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/logs', logRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Inventory Management System API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      items: '/api/items',
      logs: '/api/logs'
    }
  });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   🚀 Inventory Management System API                      ║
║                                                            ║
║   Server running in ${process.env.NODE_ENV || 'development'} mode                        ║
║   Port: ${PORT}                                             ║
║   Database: MongoDB                                        ║
║                                                            ║
║   Endpoints:                                               ║
║   • Health Check: http://localhost:${PORT}/health           ║
║   • Auth: http://localhost:${PORT}/api/auth                 ║
║   • Users: http://localhost:${PORT}/api/users               ║
║   • Items: http://localhost:${PORT}/api/items               ║
║   • Logs: http://localhost:${PORT}/api/logs                 ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

export default app;
