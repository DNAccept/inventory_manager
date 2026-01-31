import express from 'express';
import { 
  getItems, 
  getItem, 
  createItem, 
  updateItem, 
  deleteItem,
  getStats 
} from '../controllers/itemController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Stats route (all users can view)
router.get('/stats', getStats);

// Get all items and create (create requires editor/admin)
router.route('/')
  .get(getItems)
  .post(authorize('editor', 'site_admin'), createItem);

// Single item routes
router.route('/:id')
  .get(getItem)
  .put(authorize('editor', 'site_admin'), updateItem)
  .delete(authorize('editor', 'site_admin'), deleteItem);

export default router;
