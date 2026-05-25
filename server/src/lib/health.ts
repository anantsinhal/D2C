import { randomUUID } from 'crypto';

export type ActivityLevel = 'Sedentary' | 'Light' | 'Active' | 'Highly Active';
export type PrimaryGoal = 'Better Sleep' | 'More Energy' | 'Stress Reduction' | 'Recovery' | 'Longevity' | 'Better Performance';

export interface ProfileRow {
  id: string;
  age: number;
  sleep_hours: number;
  sleep_quality: number;
  stress_level: number;
  activity_level: ActivityLevel;
  primary_goal: PrimaryGoal;
  created_at?: string;
}

export interface DailyActionItem {
  _id: string;
  text: string;
  completed: boolean;
}

export interface DailyActionRow {
  id: string;
  user_id: string;
  date: string;
  actions: DailyActionItem[];
  created_at?: string;
}

export interface WeeklyAuditRow {
  id: string;
  user_id: string;
  overall_wellness_score: number;
  sleep_audit: {
    averageHours: number;
    averageQuality: number;
    trend: string;
  };
  stress_audit: {
    level: number;
    description: string;
  };
  activity_audit: {
    status: string;
  };
  energy_audit: {
    status: string;
  };
  biggest_win: string;
  biggest_opportunity: string;
  focus_for_next_week: string[];
  progress_timeline: { week: string; score: number }[];
  created_at?: string;
}

export const analyzeMetrics = (
  sleepHours: number,
  sleepQuality: number,
  stressLevel: number,
  activityLevel: ActivityLevel,
  primaryGoal: PrimaryGoal
) => {
  let energyStatus = 'Medium ⚡';
  if (sleepHours >= 7.5 && sleepQuality >= 8 && stressLevel <= 4) {
    energyStatus = 'High ⚡';
  } else if (sleepHours < 6 || sleepQuality < 5 || stressLevel > 7) {
    energyStatus = 'Low ⚡';
  }

  let sleepStatus = 'Good 😴';
  if (sleepHours >= 7.5 && sleepQuality >= 7) {
    sleepStatus = 'Optimal 😴';
  } else if (sleepHours < 6.5 || sleepQuality < 6) {
    sleepStatus = 'Needs Improvement 😴';
  }

  let stressStatus = 'Moderate 🟡';
  if (stressLevel <= 3) {
    stressStatus = 'Low 🟢';
  } else if (stressLevel > 7) {
    stressStatus = 'High ⚠️';
  }

  let activityStatus = 'Good ✅';
  if (activityLevel === 'Sedentary') {
    activityStatus = 'Needs Attention ⚠️';
  } else if (activityLevel === 'Light') {
    activityStatus = 'Moderate 🟡';
  }

  let primaryFocus = 'Optimize daily circadian rhythm alignment.';
  if (primaryGoal === 'Better Sleep' || sleepHours < 6.5) {
    primaryFocus = 'Improve sleep consistency and sleep window.';
  } else if (primaryGoal === 'Stress Reduction' || stressLevel > 7) {
    primaryFocus = 'Regulate sympathetic nervous system and reduce active stressors.';
  } else if (primaryGoal === 'More Energy') {
    primaryFocus = 'Optimize mitochondrial energy output and hydration timing.';
  } else if (primaryGoal === 'Better Performance' || activityLevel === 'Sedentary') {
    primaryFocus = 'Incorporate zone-2 cardiovascular training and structured movement.';
  } else if (primaryGoal === 'Recovery') {
    primaryFocus = 'Enhance parasympathetic recovery and nutrient timing.';
  }

  const actionsList = [
    { _id: randomUUID(), text: 'Walk 20 minutes daily', completed: false },
    { _id: randomUUID(), text: 'Improve hydration (drink 3L water)', completed: false }
  ];

  if (sleepHours < 7.5 || primaryGoal === 'Better Sleep') {
    actionsList.unshift({ _id: randomUUID(), text: 'Sleep 30 min earlier', completed: false });
  } else {
    actionsList.unshift({ _id: randomUUID(), text: 'Maintain consistent wake window', completed: false });
  }

  if (stressLevel > 5) {
    actionsList.push({ _id: randomUUID(), text: 'Complete a 5-minute breathing session', completed: false });
  }

  if (activityLevel === 'Sedentary') {
    actionsList.push({ _id: randomUUID(), text: 'Perform 10 minutes of mobility stretches', completed: false });
  } else if (primaryGoal === 'Better Performance') {
    actionsList.push({ _id: randomUUID(), text: 'Perform 30 minutes of zone-2 training', completed: false });
  }

  actionsList.push({ _id: randomUUID(), text: 'Reduce screen exposure 1 hr before bed', completed: false });

  const sleepPoints = Math.min(40, (sleepHours / 8.5) * 30 + (sleepQuality / 10) * 10);
  const stressPoints = Math.max(10, (11 - stressLevel) * 3.5);
  const activityPoints = activityLevel === 'Highly Active' ? 25 : activityLevel === 'Active' ? 20 : activityLevel === 'Light' ? 12 : 6;
  const calculatedScore = Math.min(99, Math.round(sleepPoints + stressPoints + activityPoints));
  const overallWellnessScore = Math.max(40, calculatedScore);

  const sleepAuditText = sleepHours >= 7 ? 'Improving' : 'Needs attention';
  const stressAuditText = stressLevel <= 4 ? 'Low' : stressLevel <= 7 ? 'Moderate' : 'High';
  const activityAuditText = activityLevel === 'Sedentary' ? 'Needs active improvement' : 'Good consistency';
  const energyAuditText = energyStatus.split(' ')[0];

  const biggestWin = primaryGoal === 'Better Sleep' && sleepQuality > 5
    ? 'Consistent sleep efficiency markers'
    : 'Initiated longevity biohacking dashboard';

  const biggestOpportunity = stressLevel > 6
    ? 'Buffer evening stress levels'
    : 'Enhance deep sleep phase percentages';

  const focusForNextWeek = [
    primaryGoal === 'Better Sleep' ? 'Consistent sleep schedule' : 'Hydration optimization',
    stressLevel > 5 ? 'Mindfulness breathing routines' : 'Zone-2 cardiovascular intervals',
    'Limit late afternoon caffeine'
  ];

  const progressTimeline = [
    { week: 'Week 1', score: Math.max(45, overallWellnessScore - 12) },
    { week: 'Week 2', score: Math.max(45, overallWellnessScore - 8) },
    { week: 'Week 3', score: Math.max(45, overallWellnessScore - 3) },
    { week: 'Week 4', score: overallWellnessScore }
  ];

  return {
    energyStatus,
    sleepStatus,
    stressStatus,
    activityStatus,
    primaryFocus,
    actionsList,
    overallWellnessScore,
    sleepAudit: {
      averageHours: sleepHours,
      averageQuality: sleepQuality,
      trend: sleepAuditText
    },
    stressAudit: {
      level: stressLevel,
      description: stressAuditText
    },
    activityAudit: { status: activityAuditText },
    energyAudit: { status: energyAuditText },
    biggestWin,
    biggestOpportunity,
    focusForNextWeek,
    progressTimeline
  };
};

export const mapProfileToAssessment = (profile: ProfileRow) => ({
  _id: profile.id,
  age: profile.age,
  sleepHours: profile.sleep_hours,
  sleepQuality: profile.sleep_quality,
  stressLevel: profile.stress_level,
  activityLevel: profile.activity_level,
  primaryGoal: profile.primary_goal
});

export const mapDailyActionRow = (row: DailyActionRow) => ({
  _id: row.id,
  date: row.date,
  actions: row.actions.map((action) => ({
    _id: action._id,
    text: action.text,
    completed: action.completed
  }))
});

export const mapWeeklyAuditRow = (row: WeeklyAuditRow) => ({
  _id: row.id,
  overallWellnessScore: row.overall_wellness_score,
  sleepAudit: row.sleep_audit,
  stressAudit: row.stress_audit,
  activityAudit: row.activity_audit,
  energyAudit: row.energy_audit,
  biggestWin: row.biggest_win,
  biggestOpportunity: row.biggest_opportunity,
  focusForNextWeek: row.focus_for_next_week,
  progressTimeline: row.progress_timeline
});

export const buildWeeklyAuditPayload = (
  userId: string,
  analysis: ReturnType<typeof analyzeMetrics>
) => ({
  user_id: userId,
  overall_wellness_score: analysis.overallWellnessScore,
  sleep_audit: analysis.sleepAudit,
  stress_audit: analysis.stressAudit,
  activity_audit: analysis.activityAudit,
  energy_audit: analysis.energyAudit,
  biggest_win: analysis.biggestWin,
  biggest_opportunity: analysis.biggestOpportunity,
  focus_for_next_week: analysis.focusForNextWeek,
  progress_timeline: analysis.progressTimeline
});

export const createToday = () => new Date().toISOString().split('T')[0];