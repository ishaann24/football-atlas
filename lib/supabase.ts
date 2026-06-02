import { createClient } from '@supabase/supabase-js';

// Use placeholder fallbacks to prevent createClient from throwing an error during production builds/static page generation if env vars are missing
const supabaseUrl = process.env.SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'placeholder-anon-key';

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
  console.warn(
    'Supabase environment variables are missing! Database operations will operate in offline mock mode.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export default supabase;
