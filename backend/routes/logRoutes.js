import express from 'express';
import { 
  getLogs, 
  getRecentActivity, 
  getLogsByAction, 
  getUserLogs 
} from '../controllers/logController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get all logs (paginated)
router.get('/', getLogs);

// Get recent activity
router.get('/recent', getRecentActivity);

// Get logs by action type
router.get('/action/:action', getLogsByAction);

// Get user's logs (admin or own)
router.get('/user/:userId', getUserLogs);

export default router;
