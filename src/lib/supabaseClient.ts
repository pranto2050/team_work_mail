import { createClient } from '@supabase/supabase-js';

const runtimeEnv = typeof process !== 'undefined' ? process.env : undefined;

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ??
  runtimeEnv?.VITE_SUPABASE_URL ??
  runtimeEnv?.SUPABASE_URL;

const supabasePublishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ??
  runtimeEnv?.VITE_SUPABASE_PUBLISHABLE_KEY ??
  runtimeEnv?.SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error(
    'Missing Supabase environment variable(s): SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY'
  );
}

export const supabase = createClient(supabaseUrl, supabasePublishableKey);