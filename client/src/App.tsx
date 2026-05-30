import React, { useState, useEffect } from 'react';
import Lenis from 'lenis';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Cpu, Database, Eye } from 'lucide-react';
import type { Session } from '@supabase/supabase-js';
import Navbar from './components/Navbar';
import AuthPage from './components/AuthPage';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import { supabase } from './lib/supabase';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true';

/** Returns the current session access token, or null if not signed in. */
const getAccessToken = async (): Promise<string | null> => {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
};

/** Builds Authorization headers for protected API calls. */
const authHeaders = async (): Promise<Record<string, string>> => {
  const token = await getAccessToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapMockToDashboard = (payload: any, formData: any) => {
  const profile = payload.profile ?? {};
  const dailyAction = payload.dailyAction ?? { actions: [] };
  const weeklyAudit = payload.weeklyAudit ?? {};

  return {
    assessment: {
      _id: payload.assessmentId,
      age: Number(profile.age ?? formData.age ?? 0),
      primaryGoal: String(profile.primary_goal ?? formData.primaryGoal ?? ''),
      activityLevel: String(profile.activity_level ?? formData.activityLevel ?? '')
    },
    healthSummary: payload.healthSummary,
    dailyAction: {
      _id: String(dailyAction.id ?? `${payload.assessmentId}-daily`),
      actions: Array.isArray(dailyAction.actions) ? dailyAction.actions : []
    },
    weeklyAudit: {
      overallWellnessScore: Number(weeklyAudit.overall_wellness_score ?? 0),
      sleepAudit: weeklyAudit.sleep_audit ?? { averageHours: 0, averageQuality: 0, trend: 'N/A' },
      stressAudit: weeklyAudit.stress_audit ?? { level: 0, description: 'N/A' },
      activityAudit: weeklyAudit.activity_audit ?? { status: 'N/A' },
      energyAudit: weeklyAudit.energy_audit ?? { status: 'N/A' },
      biggestWin: String(weeklyAudit.biggest_win ?? ''),
      biggestOpportunity: String(weeklyAudit.biggest_opportunity ?? ''),
      focusForNextWeek: Array.isArray(weeklyAudit.focus_for_next_week) ? weeklyAudit.focus_for_next_week : [],
      progressTimeline: Array.isArray(weeklyAudit.progress_timeline) ? weeklyAudit.progress_timeline : []
    },
    chartData: [
      { day: 'Mon', sleep: Math.max(4, Number(formData.sleepHours) - 1.2), stress: Math.min(10, Number(formData.stressLevel) + 1), quality: Math.max(1, Number(formData.sleepQuality) - 2) },
      { day: 'Tue', sleep: Math.max(4, Number(formData.sleepHours) - 0.5), stress: Math.min(10, Number(formData.stressLevel) + 0.5), quality: Math.max(1, Number(formData.sleepQuality) - 1) },
      { day: 'Wed', sleep: Math.max(4, Number(formData.sleepHours) + 0.8), stress: Math.max(1, Number(formData.stressLevel) - 1), quality: Math.min(10, Number(formData.sleepQuality) + 1.5) },
      { day: 'Thu', sleep: Number(formData.sleepHours), stress: Number(formData.stressLevel), quality: Number(formData.sleepQuality) },
      { day: 'Fri', sleep: Math.max(4, Number(formData.sleepHours) - 0.2), stress: Math.min(10, Number(formData.stressLevel) + 0.2), quality: Number(formData.sleepQuality) },
      { day: 'Sat', sleep: Math.max(4, Number(formData.sleepHours) + 1.5), stress: Math.max(1, Number(formData.stressLevel) - 2), quality: Math.min(10, Number(formData.sleepQuality) + 2) },
      { day: 'Sun', sleep: Math.max(4, Number(formData.sleepHours) + 0.5), stress: Math.max(1, Number(formData.stressLevel) - 1.5), quality: Math.min(10, Number(formData.sleepQuality) + 1) }
    ]
  };
};

export const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [assessmentId, setAssessmentId] = useState<string | null>(
    localStorage.getItem('aetheris_assessment_id')
  );
  const [showOnboarding, setShowOnboarding] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [dashboardData, setDashboardData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!supabase) {
      // eslint-disable-next-line
      setAuthLoading(false);
      return;
    }

    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      setAuthLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setAuthLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Initialize Lenis Smooth Scroll
  useEffect(() => {
    const lenis = new Lenis();
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  const handleReset = async () => {
    await supabase?.auth.signOut();
    localStorage.removeItem('aetheris_assessment_id');
    setAssessmentId(null);
    setDashboardData(null);
    setShowOnboarding(false);
  };

  // Fetch Dashboard Data if assessmentId exists
  const fetchDashboard = async (id: string) => {
    setIsLoading(true);
    try {
      const headers = await authHeaders();
      const res = await fetch(`${API_BASE}/api/dashboard/${id}`, { headers });
      if (!res.ok) {
        throw new Error('Failed to load session');
      }
      const data = await res.json();
      setDashboardData(data);
    } catch (err) {
      console.error(err);
      // Clear invalid session
      handleReset();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (assessmentId && !DEMO_MODE) {
      // eslint-disable-next-line
      fetchDashboard(assessmentId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assessmentId]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleOnboardingComplete = async (formData: any) => {
    setIsLoading(true);
    try {
      const endpoint = DEMO_MODE ? `${API_BASE}/api/test/assessment-mock` : `${API_BASE}/api/assessment`;
      const headers = await authHeaders();
      const res = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error('Submission failed');
      const data = await res.json();
      
      localStorage.setItem('aetheris_assessment_id', data.assessmentId);
      setAssessmentId(data.assessmentId);
      setDashboardData(DEMO_MODE ? mapMockToDashboard(data, formData) : {
        assessment: formData,
        healthSummary: data.healthSummary,
        dailyAction: data.dailyAction,
        weeklyAudit: data.weeklyAudit,
        chartData: [
          { day: 'Mon', sleep: Math.max(4, formData.sleepHours - 1.2), stress: Math.min(10, formData.stressLevel + 1), quality: Math.max(1, formData.sleepQuality - 2) },
          { day: 'Tue', sleep: Math.max(4, formData.sleepHours - 0.5), stress: Math.min(10, formData.stressLevel + 0.5), quality: Math.max(1, formData.sleepQuality - 1) },
          { day: 'Wed', sleep: Math.max(4, formData.sleepHours + 0.8), stress: Math.max(1, formData.stressLevel - 1), quality: Math.min(10, formData.sleepQuality + 1.5) },
          { day: 'Thu', sleep: formData.sleepHours, stress: formData.stressLevel, quality: formData.sleepQuality },
          { day: 'Fri', sleep: Math.max(4, formData.sleepHours - 0.2), stress: Math.min(10, formData.stressLevel + 0.2), quality: formData.sleepQuality },
          { day: 'Sat', sleep: Math.max(4, formData.sleepHours + 1.5), stress: Math.max(1, formData.stressLevel - 2), quality: Math.min(10, formData.sleepQuality + 2) },
          { day: 'Sun', sleep: Math.max(4, formData.sleepHours + 0.5), stress: Math.max(1, formData.stressLevel - 1.5), quality: Math.min(10, formData.sleepQuality + 1) }
        ]
      });
      setShowOnboarding(false);
    } catch (err) {
      console.error(err);
      alert('Error connecting to Server API. Please verify the backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleAction = async (actionId: string) => {
    if (!assessmentId || !dashboardData) return;
    if (DEMO_MODE) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setDashboardData((prev: any) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const nextActions = (prev?.dailyAction?.actions || []).map((a: any) =>
          String(a._id) === String(actionId) ? { ...a, completed: !a.completed } : a
        );
        return {
          ...prev,
          dailyAction: {
            ...prev.dailyAction,
            actions: nextActions
          }
        };
      });
      return;
    }
    try {
      const headers = await authHeaders();
      const res = await fetch(`${API_BASE}/api/daily-action/${assessmentId}/toggle`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ actionId })
      });
      if (res.ok) {
        const data = await res.json();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setDashboardData((prev: any) => ({
          ...prev,
          dailyAction: data.dailyAction
        }));
      }
    } catch (err) {
      console.error('Error toggling task:', err);
    }
  };

  const handleSendMessage = async (message: string): Promise<string> => {
    if (DEMO_MODE) {
      return `Demo coach response: prioritize sleep consistency and hydration today. You said: ${message}`;
    }
    if (!assessmentId) return '';
    const headers = await authHeaders();
    const res = await fetch(`${API_BASE}/api/coaching/${assessmentId}`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ message })
    });
    if (!res.ok) throw new Error('Chat link failed');
    const data = await res.json();
    return data.reply;
  };

  if (authLoading) {
    return (
      <div className="min-h-[100svh] flex items-center justify-center bg-matte-black text-brand-green font-mono text-xs tracking-widest uppercase animate-pulse px-6 text-center">
        Loading secure sign in...
      </div>
    );
  }

  if (!session && !DEMO_MODE) {
    return <AuthPage />;
  }

  return (
    <div className="flex-1 flex flex-col bg-matte-black text-titanium-silver">
      <Navbar onReset={handleReset} showReset={!!assessmentId} />

      <main className="flex-1 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {!assessmentId && !showOnboarding ? (
            /* Cinematic Hero landing view */
            <motion.div
              key="hero"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative w-full overflow-hidden flex flex-col justify-center py-20 px-6 min-h-[85vh]"
            >
              {/* Background ambient circular glow */}
              <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 rounded-full bg-[rgba(13,242,125,0.02)] blur-[120px] pointer-events-none" />

              <div className="max-w-4xl mx-auto text-center z-10 flex flex-col items-center gap-6">
                <div className="flex items-center gap-2 text-xs font-mono text-brand-green bg-[rgba(13,242,125,0.06)] border border-glowing-green px-4 py-1.5 rounded-full tracking-widest uppercase mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  PRECISION HEALTH OPERATING SYSTEM
                </div>
                
                <h1 className="text-4xl md:text-7xl font-display font-bold leading-tight tracking-tight text-white max-w-3xl">
                  Health made simple, <span className="text-gradient-green">for real life.</span>
                </h1>
                
                <p className="text-sm md:text-lg text-gray-400 font-sans max-w-2xl leading-relaxed">
                  Track sleep, stress, activity, and recovery in one place. AETHERIS turns your answers into a clear daily plan and a weekly check-in.
                </p>

                {/* Animated CTA */}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowOnboarding(true)}
                  className="flex items-center gap-2.5 bg-brand-green text-black font-mono font-bold text-xs tracking-widest px-8 py-4 rounded-full mt-4 cursor-pointer hover:bg-brand-green-hover hover:shadow-[0_0_25px_rgba(13,242,125,0.5)] transition-all duration-300"
                >
                  START YOUR HEALTH CHECK
                  <ArrowRight className="w-4 h-4" />
                </motion.button>

                {/* Lead Campaign Product Image Showcase */}
                <div className="w-full max-w-2xl mt-16 relative group">
                  <div className="absolute inset-0 rounded-2xl bg-linear-to-t from-matte-black via-transparent to-transparent z-10" />
                  {/* Subtle outer green glowing border */}
                  <div className="absolute -inset-0.5 bg-linear-to-r from-[rgba(13,242,125,0.1)] to-transparent rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
                  <div className="relative glass-panel overflow-hidden rounded-2xl aspect-video flex items-center justify-center">
                    <img
                      src="/luxury_ring_campaign.png"
                      alt="Aetheris Longevity Ecosystem"
                      className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-102"
                    />
                  </div>
                </div>

                {/* Highlights grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl mt-16 pt-8 border-t border-border-subtle text-left">
                  <div className="flex gap-3">
                    <Cpu className="w-5 h-5 text-brand-green shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-mono text-white uppercase tracking-widest mb-1">
                        Clear, private tracking
                      </h4>
                      <p className="text-xs text-gray-500 font-sans leading-relaxed">
                        A clean dashboard that keeps your health notes easy to understand.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Database className="w-5 h-5 text-brand-green shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-mono text-white uppercase tracking-widest mb-1">
                        Secure data storage
                      </h4>
                      <p className="text-xs text-gray-500 font-sans leading-relaxed">
                        Your data is stored securely and can be moved to Supabase with row-level security.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Eye className="w-5 h-5 text-brand-green shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-mono text-white uppercase tracking-widest mb-1">
                        Weekly check-ins
                      </h4>
                      <p className="text-xs text-gray-500 font-sans leading-relaxed">
                        Pulls together sleep, stress, and activity into one simple summary.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : showOnboarding ? (
            /* Onboarding Flow state */
            <motion.div key="onboarding" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Onboarding onComplete={handleOnboardingComplete} isLoading={isLoading} />
            </motion.div>
          ) : dashboardData ? (
            /* Dashboard Loaded state */
            <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Dashboard 
                data={dashboardData} 
                onToggleAction={handleToggleAction} 
                onSendMessage={handleSendMessage}
              />
            </motion.div>
          ) : (
            /* Fallback loading state */
            <div className="flex flex-col items-center justify-center min-h-[60vh] font-mono text-xs tracking-widest text-[#0df27d] animate-pulse">
              SYNCING TELEMETRY PROFILE...
            </div>
          )}
        </AnimatePresence>
      </main>

      <footer className="py-6 border-t border-border-subtle text-center text-[10px] font-mono text-gray-600 tracking-widest uppercase px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <span>AETHERIS BIOTECH © 2026</span>
          <div className="flex items-center gap-4 text-gray-500">
            <a href="#dashboard" className="hover:text-white transition-colors">Dashboard</a>
            <a href="#audit" className="hover:text-white transition-colors">Audit</a>
            <a href="#coach" className="hover:text-white transition-colors">Coach</a>
            <a href="#knowledge" className="hover:text-white transition-colors">Learn</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
