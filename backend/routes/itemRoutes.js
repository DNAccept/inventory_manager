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

/**
 * @swagger
 * tags:
 *   name: Items
 *   description: Inventory item management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Item:
 *       type: object
 *       required:
 *         - name
 *         - category
 *         - quantity
 *         - price
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated ID
 *         name:
 *           type: string
 *         category:
 *           type: string
 *         quantity:
 *           type: number
 *         price:
 *           type: number
 *         description:
 *           type: string
 *         lowStockThreshold:
 *           type: number
 */

/**
 * @swagger
 * /api/items:
 *   get:
 *     summary: Returns all items
 *     tags: [Items]
 *     responses:
 *       200:
 *         description: List of items
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Item'
 *   post:
 *     summary: Create a new item
 *     tags: [Items]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Item'
 *     responses:
 *       201:
 *         description: Item created
 *       400:
 *         description: Bad request
 */

// Protected routes require authentication
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
