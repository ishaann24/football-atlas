import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || 'placeholder-service-key';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// GET — get rating for a match
export async function GET(req: NextRequest) {
  try {
    const matchId = req.nextUrl.searchParams.get('matchId');
    if (!matchId) return NextResponse.json(
      { average: 0, count: 0 }
    );

    const { data, error } = await supabase
      .from('match_ratings')
      .select('rating')
      .eq('match_id', parseInt(matchId));

    if (error) {
      console.error('Error fetching match ratings:', error);
      return NextResponse.json({ average: 0, count: 0 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ average: 0, count: 0 });
    }

    const avg = data.reduce(
      (s, r) => s + r.rating, 0
    ) / data.length;

    return NextResponse.json({
      average: Math.round(avg * 10) / 10,
      count: data.length
    });
  } catch (err) {
    console.error('Error in GET /api/rate-match:', err);
    return NextResponse.json({ average: 0, count: 0 });
  }
}

// POST — submit a rating
export async function POST(req: NextRequest) {
  try {
    const { matchId, rating } = await req.json();

    if (!matchId || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Invalid rating' }, { status: 400 }
      );
    }

    const ip = req.headers.get('x-forwarded-for')
      || req.headers.get('x-real-ip')
      || 'unknown';

    // One rating per IP per match
    const { data: existing, error: findError } = await supabase
      .from('match_ratings')
      .select('id')
      .eq('match_id', matchId)
      .eq('voter_ip', ip)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({
        alreadyRated: true,
        message: 'Already rated this match'
      });
    }

    const { error: insertError } = await supabase.from('match_ratings').insert({
      match_id: matchId,
      rating,
      voter_ip: ip
    });

    if (insertError) {
      console.error('Error saving rating:', insertError);
      return NextResponse.json({ error: 'Failed to save rating' }, { status: 500 });
    }

    // Get updated average
    const { data: all, error: allFetchError } = await supabase
      .from('match_ratings')
      .select('rating')
      .eq('match_id', matchId);

    const avg = all && all.length > 0
      ? all.reduce((s,r) => s + r.rating, 0) / all.length
      : rating;

    return NextResponse.json({
      success: true,
      average: Math.round(avg * 10) / 10,
      count: all?.length || 1
    });
  } catch (err) {
    console.error('Error in POST /api/rate-match:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
