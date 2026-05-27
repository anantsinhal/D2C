import { Router } from 'express';
import { createAssessment, getDashboardData, toggleDailyAction } from '../controllers/assessmentController';
import { chatWithCoach } from '../controllers/coachingController';
import { login, resetPassword, signup } from '../controllers/authController';
import { createAssessmentMock } from '../controllers/testController';

const router = Router();

// Auth
router.post('/auth/login', login);
router.post('/auth/signup', signup);
router.post('/auth/reset-password', resetPassword);

// Assessment and Dashboard
router.post('/assessment', createAssessment);
// Local testing endpoint (mocked, does not use Supabase)
router.post('/test/assessment-mock', createAssessmentMock);
router.get('/dashboard/:id', getDashboardData);

// Daily actions checklist
router.put('/daily-action/:id/toggle', toggleDailyAction);

// Conversational AI Coach
router.post('/coaching/:id', chatWithCoach);

export default router;
