import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || 'placeholder-key';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET() {
  try {
    const { data: scores, error: error1 } = await supabase.from('live_scores').select('*');
    const { data: bracket, error: error2 } = await supabase.from('bracket_matches').select('*');
    return NextResponse.json({ scores: scores || [], bracket: bracket || [], error1, error2 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message });
  }
}
