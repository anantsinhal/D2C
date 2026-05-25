import { Request, Response } from 'express';
import { getSupabaseContext } from '../lib/supabase';
import { ProfileRow } from '../lib/health';

const generateCoachResponse = (message: string, profile: ProfileRow) => {
  const msg = message.toLowerCase();
  const sleep = profile.sleep_hours;
  const quality = profile.sleep_quality;
  const stress = profile.stress_level;
  const activity = profile.activity_level;
  const goal = profile.primary_goal;

  if (msg.includes('tired') || msg.includes('fatigue') || msg.includes('energy') || msg.includes('sleepy')) {
    if (sleep < 7) {
      return `You're averaging ${sleep} hours of sleep. Try shifting bedtime 20–30 minutes earlier and keep your bedroom cool and dark.`;
    }
    if (quality < 7) {
      return `Your sleep quality is ${quality}/10. Turn screens off an hour before bed and avoid late caffeine.`;
    }
    if (stress > 6) {
      return `Stress is ${stress}/10 — try two 3-minute breathing breaks today and a short walk.`;
    }
    return `Numbers look okay. Drink water, stand and move for 5 minutes, and check how you feel afterward.`;
  }

  if (msg.includes('stress') || msg.includes('anxious') || msg.includes('calm') || msg.includes('relax')) {
    if (stress > 6) return `Your stress is ${stress}/10. Do two short breathing sessions and reduce back-to-back meetings where possible.`;
    return `Stress seems manageable. Maintain short breaks, steady movement, and consistent meals.`;
  }

  if (msg.includes('sleep') || msg.includes('insomnia') || msg.includes('night') || msg.includes('bed')) {
    return `To improve sleep: get morning sunlight, keep a consistent sleep/wake time, and dim screens before bed.`;
  }

  if (msg.includes('workout') || msg.includes('exercise') || msg.includes('activity') || msg.includes('gym')) {
    if (activity === 'Sedentary') return `Start small: a 10–15 minute walk after your largest meal and two short mobility sets during the day.`;
    return `You're already active — try one longer easy cardio session this week or add structured intervals.`;
  }

  if (msg.includes('water') || msg.includes('hydration') || msg.includes('drink')) {
    return `A simple rule: sip regularly through the day and add a glass in the morning and one with each meal.`;
  }

  return `Your main goal is ${goal}. Today, focus on ${stress > 6 ? 'reducing stress with brief breathing breaks' : sleep < 7.5 ? 'getting a bit more sleep tonight' : 'staying hydrated and keeping routine consistent'}.`;
};

const callGemini = async (message: string, profile: ProfileRow) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || 'models/text-bison-001';
  if (!apiKey) throw new Error('Missing GEMINI_API_KEY');

  const url = `https://generativelanguage.googleapis.com/v1beta2/${model}:generate?key=${apiKey}`;

  const prompt = `You are a friendly health coach. User profile: age ${profile.age}, sleepHours ${profile.sleep_hours}, sleepQuality ${profile.sleep_quality}, stressLevel ${profile.stress_level}, activityLevel ${profile.activity_level}, primaryGoal ${profile.primary_goal}. User message: "${message}". Reply empathetically with up to 3 short actionable suggestions and one simple takeaway.`;

  const body = {
    prompt: { text: prompt },
    temperature: 0.2,
    maxOutputTokens: 256
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Gemini API error: ${res.status} ${txt}`);
  }

  const data = await res.json();

  // Try multiple common response shapes; fall back to serialized JSON if unknown.
  const text =
    data?.candidates?.[0]?.content ||
    data?.output?.[0]?.content?.map((c: any) => c?.text || c)?.join('\n') ||
    data?.outputs?.[0]?.content?.[0]?.text ||
    JSON.stringify(data);

  return String(text);
};

export const chatWithCoach = async (req: Request, res: Response) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Message content is required.' });

    const ctx = await getSupabaseContext(req);
    if (ctx.error || !ctx.user || !ctx.supabase) {
      return res.status(401).json({ error: ctx.error || 'Unauthorized' });
    }

    const userId = ctx.user.id;

    // Fetch profile row
    const { data: profile, error } = await ctx.supabase.from('profiles').select('*').eq('id', userId).maybeSingle();

    if (error) {
      console.error('Supabase profile fetch error:', error);
      return res.status(500).json({ error: 'Failed to read profile.' });
    }

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found. Please complete onboarding.' });
    }

    const profileRow = profile as ProfileRow;

    // Prefer Gemini if key is available, otherwise fallback to simple rule-based coach.
    if (process.env.GEMINI_API_KEY) {
      try {
        const reply = await callGemini(message, profileRow);
        return res.status(200).json({ reply, timestamp: new Date() });
      } catch (err) {
        console.error('Gemini call failed, falling back:', err);
        const fallback = generateCoachResponse(message, profileRow);
        return res.status(200).json({ reply: fallback, timestamp: new Date(), warning: 'Gemini fallback used' });
      }
    }

    const reply = generateCoachResponse(message, profileRow);
    return res.status(200).json({ reply, timestamp: new Date() });
  } catch (error) {
    console.error('Coaching controller error:', error);
    return res.status(500).json({ error: 'Failed to process message.' });
  }
};

export default chatWithCoach;
