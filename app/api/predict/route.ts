import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || 'placeholder-service-key';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// POST — save a prediction
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, matchId, homeTeam, awayTeam,
            predictedHome, predictedAway } = body;

    if (predictedHome < 0 || predictedAway < 0 ||
        predictedHome > 20 || predictedAway > 20) {
      return NextResponse.json(
        { error: 'Invalid score' }, { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('predictions')
      .upsert({
        user_id: userId,
        match_id: matchId,
        home_team: homeTeam || 'TBD',
        away_team: awayTeam || 'TBD',
        predicted_home: predictedHome,
        predicted_away: predictedAway,
      }, { onConflict: 'user_id,match_id' })
      .select()
      .single();

    if (error) return NextResponse.json(
      { error: error.message }, { status: 500 }
    );
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// GET — get user's predictions
export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('userId');
    if (!userId) return NextResponse.json([]);

    const { data, error } = await supabase
      .from('predictions')
      .select('*')
      .eq('user_id', userId)
      .order('match_id', { ascending: true });

    if (error) {
      console.error('Error fetching predictions:', error);
      return NextResponse.json([]);
    }

    return NextResponse.json(data || []);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
