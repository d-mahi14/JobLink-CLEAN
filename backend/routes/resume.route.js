import express from 'express';
import {
  uploadResume,
  getMyResumes,
  getResume,
  updateResumeAnalysis,
  deleteResume
} from '../controllers/resume.controller.js';
import { protectRoute, requireUserType } from '../middleware/auth.middleware.js';

const router = express.Router();

// All resume routes require candidate user type
router.post('/', protectRoute, requireUserType(['candidate']), uploadResume);
router.get('/', protectRoute, requireUserType(['candidate']), getMyResumes);
router.get('/:resumeId', protectRoute, getResume);
router.put('/:resumeId/analysis', protectRoute, requireUserType(['candidate']), updateResumeAnalysis);
router.delete('/:resumeId', protectRoute, requireUserType(['candidate']), deleteResume);

export default router;