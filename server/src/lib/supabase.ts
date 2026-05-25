import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Request } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import WebSocket from 'ws';

// Ensure server/.env is loaded even if process.cwd() differs
dotenv.config({ path: path.resolve(__dirname, '..', '..', '.env') });

const globalWithWebSocket = globalThis as any;

if (!globalWithWebSocket.WebSocket) {
  globalWithWebSocket.WebSocket = WebSocket;
}

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Warning: SUPABASE_URL or SUPABASE_ANON_KEY is missing; Supabase features will be disabled until these are set.');
}

const baseSupabase = (supabaseUrl && supabaseAnonKey) ? createClient(supabaseUrl, supabaseAnonKey) : null;

export const getBaseSupabase = () => baseSupabase;

const parseBearerToken = (authorizationHeader?: string) => {
  if (!authorizationHeader?.startsWith('Bearer ')) {
    return null;
  }

  const token = authorizationHeader.slice('Bearer '.length).trim();
  return token.length > 0 ? token : null;
};

export const getSupabaseContext = async (req: Request) => {
  if (!baseSupabase) {
    return { supabase: null, user: null, error: 'Supabase not configured on server.' };
  }

  const accessToken = parseBearerToken(req.headers.authorization);

  if (!accessToken) {
    return { supabase: null, user: null, error: 'Missing authorization token.' };
  }

  const { data, error } = await baseSupabase.auth.getUser(accessToken);

  if (error || !data.user) {
    return { supabase: null, user: null, error: error?.message || 'Invalid session token.' };
  }

  const supabase = createClient(supabaseUrl as string, supabaseAnonKey as string, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  });

  return {
    supabase: supabase as SupabaseClient,
    user: data.user,
    error: null
  };
};