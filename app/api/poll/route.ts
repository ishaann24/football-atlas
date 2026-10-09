import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || 'placeholder-service-key';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// GET — get poll results (top teams + total)
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('fan_poll_votes')
      .select('team');

    if (error) {
      console.error('Error fetching poll votes:', error);
      return NextResponse.json({ 
        teams: [], total: 0, topTeams: [] 
      });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ 
        teams: [], total: 0, topTeams: [] 
      });
    }

    // Count votes per team
    const counts: Record<string, number> = {};
    data.forEach(v => {
      counts[v.team] = (counts[v.team] || 0) + 1;
    });

    const total = data.length;
    const sorted = Object.entries(counts)
      .sort(([,a],[,b]) => b - a)
      .map(([team, votes]) => ({
        team,
        votes,
        percentage: Math.round((votes / total) * 100)
      }));

    return NextResponse.json({
      topTeams: sorted.slice(0, 4),
      total,
      allTeams: sorted
    });
  } catch (err) {
    console.error('Error in GET /api/poll:', err);
    return NextResponse.json({ 
      teams: [], total: 0, topTeams: [] 
    });
  }
}

// POST — cast a vote
export async function POST(req: NextRequest) {
  try {
    const { team } = await req.json();
    
    if (!team) return NextResponse.json(
      { error: 'Team required' }, { status: 400 }
    );

    // Get IP for basic dedup (one vote per IP)
    const ip = req.headers.get('x-forwarded-for') 
      || req.headers.get('x-real-ip') 
      || 'unknown';

    // Check if this IP already voted
    const { data: existing, error: findError } = await supabase
      .from('fan_poll_votes')
      .select('id')
      .eq('voter_ip', ip)
      .maybeSingle();

    if (existing) {
      // Already voted — just return current results
      return NextResponse.json({ 
        alreadyVoted: true,
        message: 'You have already voted!'
      });
    }

    const { error: insertError } = await supabase
      .from('fan_poll_votes')
      .insert({
        team,
        voter_ip: ip
      });

    if (insertError) {
      console.error('Error inserting vote:', insertError);
      return NextResponse.json({ error: 'Failed to cast vote' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error in POST /api/poll:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
