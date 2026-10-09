import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || 'placeholder-anon-key';

const supabase = createClient(supabaseUrl, supabaseKey);

// GET — get all hype counts
export async function GET() {
  const { data } = await supabase
    .from('player_hype')
    .select('player_name, hype_count')
    .order('hype_count', { ascending: false });

  return NextResponse.json(data || []);
}

// POST — add hype for a player
export async function POST(req: NextRequest) {
  const { playerName } = await req.json();
  if (!playerName) return NextResponse.json(
    { error: 'Player required' }, { status: 400 }
  );

  // Increment hype count
  const { data, error } = await supabase.rpc(
    'increment_hype',
    { p_name: playerName }
  );

  if (error) {
    // Fallback if RPC doesn't exist yet
    const { data: current } = await supabase
      .from('player_hype')
      .select('hype_count')
      .eq('player_name', playerName)
      .single();

    await supabase
      .from('player_hype')
      .upsert({
        player_name: playerName,
        hype_count: (current?.hype_count || 0) + 1
      }, { onConflict: 'player_name' });
  }

  // Return updated count
  const { data: updated } = await supabase
    .from('player_hype')
    .select('hype_count')
    .eq('player_name', playerName)
    .single();

  return NextResponse.json({
    success: true,
    hype_count: updated?.hype_count || 1
  });
}
