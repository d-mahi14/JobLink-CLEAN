import express from 'express';
import {
  applyForJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
  getApplication,
  withdrawApplication
} from '../controllers/application.controller.js';
import { protectRoute, requireUserType } from '../middleware/auth.middleware.js';

const router = express.Router();

// Candidate routes
router.post('/', protectRoute, requireUserType(['candidate']), applyForJob);
router.get('/my-applications', protectRoute, requireUserType(['candidate']), getMyApplications);
router.delete('/:applicationId', protectRoute, requireUserType(['candidate']), withdrawApplication);

// Company routes
router.get('/job/:jobId', protectRoute, requireUserType(['company']), getJobApplications);
router.put('/:applicationId/status', protectRoute, requireUserType(['company']), updateApplicationStatus);

// Shared routes (both candidate and company can access)
router.get('/:applicationId', protectRoute, getApplication);

export default router;