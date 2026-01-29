import express from 'express';
import {
  createJobPosting,
  getAllJobs,
  getMyJobPostings,
  getJobPosting,
  updateJobPosting,
  deleteJobPosting
} from '../controllers/job.controller.js';
import { protectRoute, requireUserType } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllJobs);


// Company-only routes
router.post('/', protectRoute, requireUserType(['company']), createJobPosting);
router.get('/company/my-jobs', protectRoute, requireUserType(['company']), getMyJobPostings);
router.get('/:jobId', getJobPosting);
router.put('/:jobId', protectRoute, requireUserType(['company']), updateJobPosting);
router.delete('/:jobId', protectRoute, requireUserType(['company']), deleteJobPosting);

export default router;