import express from 'express';
import { login, getMe, updateProfile, logout, checkInit, registerFirstUser } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/init', checkInit);
router.post('/init', registerFirstUser);
router.post('/login', login);

// Protected routes
router.get('/me', authenticate, getMe);
router.put('/profile', authenticate, updateProfile);
router.post('/logout', authenticate, logout);

export default router;
