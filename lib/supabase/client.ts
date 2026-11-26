import { createBrowserClient } from '@supabase/ssr';

const PLACEHOLDER_URL = 'https://placeholder.supabase.co';
const PLACEHOLDER_KEY = 'placeholder-anon-key';

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(
    url &&
      key &&
      url !== PLACEHOLDER_URL &&
      key !== PLACEHOLDER_KEY &&
      url.startsWith('https://'),
  );
}

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || PLACEHOLDER_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || PLACEHOLDER_KEY;

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
