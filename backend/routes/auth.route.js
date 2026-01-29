import express from 'express';
import { 
  signup, 
  login, 
  logout, 
  updateProfile, 
  checkAuth,
  getProfile 
} from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

// Protected routes
router.get('/check', protectRoute, checkAuth);
router.put('/update-profile', protectRoute, updateProfile);
router.get('/profile/:userId', protectRoute, getProfile);

export default router;