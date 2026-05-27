import { Request, Response } from 'express';
import { analyzeMetrics, buildWeeklyAuditPayload, createToday } from '../lib/health';

const mockProfiles: Record<string, any> = {};
const mockDailyActions: Record<string, any> = {};
const mockWeeklyAudits: Record<string, any> = {};

export const createAssessmentMock = async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId || '00000000-0000-4000-8000-000000000001';
    const { age, sleepHours, sleepQuality, stressLevel, activityLevel, primaryGoal } = req.body;
    if ([age, sleepHours, sleepQuality, stressLevel, activityLevel, primaryGoal].some((v) => v === undefined)) {
      return res.status(400).json({ error: 'All onboarding inputs are required for mock.' });
    }

    mockProfiles[userId] = {
      id: userId,
      age: Number(age),
      sleep_hours: Number(sleepHours),
      sleep_quality: Number(sleepQuality),
      stress_level: Number(stressLevel),
      activity_level: activityLevel,
      primary_goal: primaryGoal,
      created_at: new Date().toISOString()
    };

    const analysis = analyzeMetrics(Number(sleepHours), Number(sleepQuality), Number(stressLevel), activityLevel, primaryGoal);

    const today = createToday();
    const daKey = `${userId}:${today}`;
    if (!mockDailyActions[daKey]) {
      mockDailyActions[daKey] = { id: `${userId}-daily-${today}`, user_id: userId, date: today, actions: analysis.actionsList };
    }

    mockWeeklyAudits[userId] = { id: `${userId}-weekly`, ...buildWeeklyAuditPayload(userId, analysis), created_at: new Date().toISOString() };

    return res.status(201).json({
      success: true,
      assessmentId: userId,
      profile: mockProfiles[userId],
      dailyAction: mockDailyActions[daKey],
      weeklyAudit: mockWeeklyAudits[userId],
      healthSummary: {
        energyStatus: analysis.energyStatus,
        sleepStatus: analysis.sleepStatus,
        stressStatus: analysis.stressStatus,
        activityStatus: analysis.activityStatus,
        primaryFocus: analysis.primaryFocus
      }
    });
  } catch (error) {
    console.error('createAssessmentMock error:', error);
    return res.status(500).json({ error: 'Mock failed.' });
  }
};

export default { createAssessmentMock };
