import { Request, Response } from 'express';
import { getSupabaseContext } from '../lib/supabase';
import { analyzeMetrics, buildWeeklyAuditPayload, createToday } from '../lib/health';

export const createAssessment = async (req: Request, res: Response) => {
  try {
    const ctx = await getSupabaseContext(req);
    if (ctx.error || !ctx.user || !ctx.supabase) return res.status(401).json({ error: ctx.error || 'Unauthorized' });

    const userId = ctx.user.id;
    const { age, sleepHours, sleepQuality, stressLevel, activityLevel, primaryGoal } = req.body;
    if ([age, sleepHours, sleepQuality, stressLevel, activityLevel, primaryGoal].some((v) => v === undefined)) {
      return res.status(400).json({ error: 'All onboarding inputs are required.' });
    }

    // Upsert profile row
    const profilePayload = {
      id: userId,
      age: Number(age),
      sleep_hours: Number(sleepHours),
      sleep_quality: Number(sleepQuality),
      stress_level: Number(stressLevel),
      activity_level: activityLevel,
      primary_goal: primaryGoal
    };

    const { error: upsertErr } = await ctx.supabase.from('profiles').upsert(profilePayload);
    if (upsertErr) {
      console.error('Profile upsert error:', upsertErr);
      return res.status(500).json({ error: 'Failed to save profile.' });
    }

    const analysis = analyzeMetrics(Number(sleepHours), Number(sleepQuality), Number(stressLevel), activityLevel, primaryGoal);

    // Ensure today's daily actions exist
    const today = createToday();
    const { data: existingDaily } = await ctx.supabase.from('daily_actions').select('*').match({ user_id: userId, date: today }).maybeSingle();
    if (!existingDaily) {
      const { error: daErr } = await ctx.supabase.from('daily_actions').insert([{ user_id: userId, date: today, actions: analysis.actionsList }]);
      if (daErr) console.error('Daily actions insert error:', daErr);
    }

    // Upsert weekly audit
    const weeklyPayload = buildWeeklyAuditPayload(userId, analysis);
    const { error: waErr } = await ctx.supabase.from('weekly_audits').upsert(weeklyPayload, { onConflict: 'user_id' });
    if (waErr) console.error('Weekly audit upsert error:', waErr);

    return res.status(201).json({ success: true, assessmentId: userId, healthSummary: { energyStatus: analysis.energyStatus, sleepStatus: analysis.sleepStatus, stressStatus: analysis.stressStatus, activityStatus: analysis.activityStatus, primaryFocus: analysis.primaryFocus } });
  } catch (error) {
    console.error('createAssessment error:', error);
    return res.status(500).json({ error: 'Failed to create assessment.' });
  }
};

export const getDashboardData = async (req: Request, res: Response) => {
  try {
    const ctx = await getSupabaseContext(req);
    if (ctx.error || !ctx.user || !ctx.supabase) return res.status(401).json({ error: ctx.error || 'Unauthorized' });

    const userId = ctx.user.id;
    const { id } = req.params;
    if (id !== userId) return res.status(403).json({ error: 'Forbidden' });

    const { data: profile } = await ctx.supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
    if (!profile) return res.status(404).json({ error: 'Profile not found. Please complete onboarding.' });

    const analysis = analyzeMetrics(profile.sleep_hours, profile.sleep_quality, profile.stress_level, profile.activity_level, profile.primary_goal);

    const today = createToday();
    let { data: dailyAction } = await ctx.supabase.from('daily_actions').select('*').match({ user_id: userId, date: today }).maybeSingle();
    if (!dailyAction) {
      const { data: inserted } = await ctx.supabase.from('daily_actions').insert([{ user_id: userId, date: today, actions: analysis.actionsList }]).select().single();
      dailyAction = inserted;
    }

    let { data: weeklyAudit } = await ctx.supabase.from('weekly_audits').select('*').eq('user_id', userId).maybeSingle();
    if (!weeklyAudit) {
      const payload = buildWeeklyAuditPayload(userId, analysis);
      const { data: inserted } = await ctx.supabase.from('weekly_audits').insert([payload]).select().single();
      weeklyAudit = inserted;
    }

    const chartData = [
      { day: 'Mon', sleep: Math.max(4, profile.sleep_hours - 1.2), stress: Math.min(10, profile.stress_level + 1), quality: Math.max(1, profile.sleep_quality - 2) },
      { day: 'Tue', sleep: Math.max(4, profile.sleep_hours - 0.5), stress: Math.min(10, profile.stress_level + 0.5), quality: Math.max(1, profile.sleep_quality - 1) },
      { day: 'Wed', sleep: Math.max(4, profile.sleep_hours + 0.8), stress: Math.max(1, profile.stress_level - 1), quality: Math.min(10, profile.sleep_quality + 1.5) },
      { day: 'Thu', sleep: profile.sleep_hours, stress: profile.stress_level, quality: profile.sleep_quality },
      { day: 'Fri', sleep: Math.max(4, profile.sleep_hours - 0.2), stress: Math.min(10, profile.stress_level + 0.2), quality: profile.sleep_quality },
      { day: 'Sat', sleep: Math.max(4, profile.sleep_hours + 1.5), stress: Math.max(1, profile.stress_level - 2), quality: Math.min(10, profile.sleep_quality + 2) },
      { day: 'Sun', sleep: Math.max(4, profile.sleep_hours + 0.5), stress: Math.max(1, profile.stress_level - 1.5), quality: Math.min(10, profile.sleep_quality + 1) }
    ];

    return res.status(200).json({ assessment: profile, dailyAction, weeklyAudit, chartData, healthSummary: { energyStatus: analysis.energyStatus, sleepStatus: analysis.sleepStatus, stressStatus: analysis.stressStatus, activityStatus: analysis.activityStatus, primaryFocus: analysis.primaryFocus } });
  } catch (error) {
    console.error('getDashboardData error:', error);
    return res.status(500).json({ error: 'Failed to fetch dashboard data.' });
  }
};

export const toggleDailyAction = async (req: Request, res: Response) => {
  try {
    const ctx = await getSupabaseContext(req);
    if (ctx.error || !ctx.user || !ctx.supabase) return res.status(401).json({ error: ctx.error || 'Unauthorized' });

    const userId = ctx.user.id;
    const { id } = req.params; // user id param, must match
    if (id !== userId) return res.status(403).json({ error: 'Forbidden' });

    const { actionId } = req.body;
    if (!actionId) return res.status(400).json({ error: 'actionId is required' });

    const today = createToday();
    const { data: dailyAction, error } = await ctx.supabase.from('daily_actions').select('*').match({ user_id: userId, date: today }).maybeSingle();
    if (error) {
      console.error('daily action fetch error:', error);
      return res.status(500).json({ error: 'Failed to fetch actions' });
    }

    if (!dailyAction) return res.status(404).json({ error: 'Daily action plan not found.' });

    const actions = dailyAction.actions || [];
    const idx = actions.findIndex((a: any) => String(a._id) === String(actionId) || String(a.id) === String(actionId));
    if (idx === -1) return res.status(404).json({ error: 'Action item not found' });

    actions[idx].completed = !actions[idx].completed;

    const { error: updErr } = await ctx.supabase.from('daily_actions').update({ actions }).eq('id', dailyAction.id);
    if (updErr) {
      console.error('daily action update error:', updErr);
      return res.status(500).json({ error: 'Failed to update action' });
    }

    return res.status(200).json({ success: true, dailyAction: { ...dailyAction, actions } });
  } catch (error) {
    console.error('toggleDailyAction error:', error);
    return res.status(500).json({ error: 'Failed to toggle action' });
  }
};

export default { createAssessment, getDashboardData, toggleDailyAction };
