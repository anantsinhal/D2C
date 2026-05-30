import React, { useState } from 'react';
import { ArrowRight, GitBranch, Lock, Mail, RefreshCcw, ShieldCheck, Sparkles } from 'lucide-react';
import GlassCard from './GlassCard';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

type AuthMode = 'login' | 'signup' | 'reset';

export const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setStatus = (value: string | null) => setMessage(value);

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  const syncSession = async (session: { access_token: string; refresh_token: string } | null) => {
    if (!supabase || !session?.access_token || !session?.refresh_token) return;
    await supabase.auth.setSession({
      access_token: session.access_token,
      refresh_token: session.refresh_token,
    });
  };

  const handlePasswordReset = async () => {
    if (!email.trim()) {
      setStatus('Add your email first so we can send the reset link.');
      return;
    }

    if (!supabase) {
      setStatus('Add your Supabase keys to use sign in and password reset.');
      return;
    }

    const res = await fetch(`${apiBaseUrl}/api/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim() }),
    });

    const data = await res.json();

    setStatus(res.ok ? 'Check your email for a password reset link.' : data.error || 'Failed to send reset link.');
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!isSupabaseConfigured) {
      setStatus('Add your Supabase keys in the client .env file before signing in.');
      return;
    }

    setIsSubmitting(true);
    setStatus(null);

    try {
      if (mode === 'reset') {
        await handlePasswordReset();
        return;
      }

      if (mode === 'signup') {
        const res = await fetch(`${apiBaseUrl}/api/auth/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email.trim(),
            password,
            fullName: fullName.trim(),
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          setStatus(data.error || 'Account creation failed.');
          return;
        }

        await syncSession(data.session);
        setStatus(
          data.session
            ? 'Account created! Signing you in...'
            : '✅ Account created! Please check your inbox and click the confirmation link. Once confirmed, come back and log in.'
        );
        return;
      }

      const res = await fetch(`${apiBaseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus(data.error || 'Sign in failed.');
        return;
      }

      await syncSession(data.session);
      setStatus('Signed in successfully. Loading your dashboard now.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOAuth = async (provider: 'google' | 'github') => {
    if (!isSupabaseConfigured) {
      setStatus('Add your Supabase keys in the client .env file before using social login.');
      return;
    }

    setIsSubmitting(true);
    setStatus(null);

    try {
      if (!supabase) {
        setStatus('Add your Supabase keys to use social login.');
        return;
      }

      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin,
        },
      });

      setStatus(error ? error.message : `Redirecting to ${provider} sign in...`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[100svh] px-4 py-6 flex items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(13,242,125,0.12),_transparent_35%),linear-gradient(180deg,#09090b_0%,#050506_100%)]">
      <div className="w-full max-w-6xl grid lg:grid-cols-[1.1fr_0.9fr] gap-6 items-stretch">
        <div className="hidden lg:flex flex-col justify-between rounded-[28px] border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] p-10 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(13,242,125,0.12),_transparent_30%)]" />
          <div className="relative z-10 flex items-center gap-2 text-xs font-mono tracking-[0.28em] text-[#0df27d] uppercase">
            <Sparkles className="w-4 h-4" />
            Secure access for your health data
          </div>

          <div className="relative z-10 max-w-xl">
            <h1 className="text-5xl xl:text-6xl font-display font-bold text-white leading-tight">
              Sign in once. Keep your health plan in one place.
            </h1>
            <p className="mt-5 text-base text-gray-300 leading-relaxed max-w-lg">
              Use email, Google, or GitHub to protect your account. Password resets and social login are built in, and Supabase row-level security keeps each person’s data separate.
            </p>
          </div>

          <div className="relative z-10 grid sm:grid-cols-3 gap-3 text-sm text-gray-300">
            <div className="rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] p-4">
              <ShieldCheck className="w-5 h-5 text-[#0df27d] mb-2" />
              Private by default with clean access rules.
            </div>
            <div className="rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] p-4">
              <Lock className="w-5 h-5 text-[#0df27d] mb-2" />
              Password reset links sent by email.
            </div>
            <div className="rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] p-4">
              <RefreshCcw className="w-5 h-5 text-[#0df27d] mb-2" />
              OAuth login for faster sign in.
            </div>
          </div>
        </div>

        <GlassCard className="p-6 sm:p-8 lg:p-10">
          <div className="flex items-center justify-between gap-4 mb-8">
            <div>
              <p className="text-xs font-mono tracking-[0.26em] text-[#0df27d] uppercase">AETHERIS ACCESS</p>
              <h2 className="text-2xl font-display font-bold text-white mt-2">
                {mode === 'login' ? 'Welcome back' : mode === 'signup' ? 'Create your account' : 'Reset your password'}
              </h2>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-gray-500 uppercase tracking-widest">
              <Mail className="w-4 h-4 text-[#0df27d]" />
              Secure sign in
            </div>
          </div>

          <div className="flex gap-2 mb-6 p-1 rounded-2xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)]">
            {(['login', 'signup', 'reset'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => {
                  setMode(tab);
                  setStatus(null);
                }}
                className={`flex-1 rounded-xl px-3 py-2 text-xs font-mono tracking-widest uppercase transition-all ${
                  mode === tab ? 'bg-[#0df27d] text-black' : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab === 'login' ? 'Log in' : tab === 'signup' ? 'Sign up' : 'Forgot password'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-mono tracking-widest uppercase text-gray-500 mb-2">
                  Your name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  placeholder="Jane Doe"
                  className="w-full rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-4 py-3 text-sm text-white outline-none focus:border-[#0df27d]"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-mono tracking-widest uppercase text-gray-500 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-4 py-3 text-sm text-white outline-none focus:border-[#0df27d]"
              />
            </div>

            {mode !== 'reset' && (
              <div>
                <label className="block text-xs font-mono tracking-widest uppercase text-gray-500 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-4 py-3 text-sm text-white outline-none focus:border-[#0df27d]"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#0df27d] px-4 py-3 text-sm font-mono font-bold tracking-widest uppercase text-black transition-all hover:bg-[#00e676] disabled:opacity-50"
            >
              {mode === 'login' ? 'Log in' : mode === 'signup' ? 'Create account' : 'Send reset link'}
              <ArrowRight className="w-4 h-4" />
            </button>

            {mode === 'reset' && (
              <button
                type="button"
                onClick={handlePasswordReset}
                disabled={isSubmitting}
                className="w-full rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] px-4 py-3 text-sm font-mono tracking-widest uppercase text-gray-200 transition-all hover:border-[#0df27d]"
              >
                Email me a reset link
              </button>
            )}
          </form>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleOAuth('google')}
              disabled={isSubmitting}
              className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-4 py-3 text-sm text-white hover:border-[#0df27d] transition-all disabled:opacity-50"
            >
              Continue with Google
            </button>
            <button
              type="button"
              onClick={() => handleOAuth('github')}
              disabled={isSubmitting}
              className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-4 py-3 text-sm text-white hover:border-[#0df27d] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <GitBranch className="w-4 h-4" />
              Continue with GitHub
            </button>
          </div>

          <div className="mt-6 min-h-6 text-sm text-gray-300">
            {message && <p>{message}</p>}
          </div>

          <p className="mt-4 text-xs text-gray-500 leading-relaxed">
            Add your Supabase keys in client/.env to turn on real sign in, sign up, and password reset.
          </p>
        </GlassCard>
      </div>
    </div>
  );
};

export default AuthPage;
