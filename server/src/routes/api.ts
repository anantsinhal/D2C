import { Router } from 'express';
import { createAssessment, getDashboardData, toggleDailyAction } from '../controllers/assessmentController';
import { chatWithCoach } from '../controllers/coachingController';
import { login, resetPassword, signup } from '../controllers/authController';

const router = Router();

// Auth
router.post('/auth/login', login);
router.post('/auth/signup', signup);
router.post('/auth/reset-password', resetPassword);

// Assessment and Dashboard
router.post('/assessment', createAssessment);
router.get('/dashboard/:id', getDashboardData);

// Daily actions checklist
router.put('/daily-action/:id/toggle', toggleDailyAction);

// Conversational AI Coach
router.post('/coaching/:id', chatWithCoach);

export default router;
