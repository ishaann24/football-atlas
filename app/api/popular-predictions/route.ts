import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;

const isMockDB = !supabaseUrl || !supabaseServiceKey || supabaseUrl === 'mock';

// Initialize Supabase only if not in mock mode
const supabase = !isMockDB 
  ? createClient(supabaseUrl!, supabaseServiceKey!)
  : null;

export async function GET(req: NextRequest) {
  const matchId = req.nextUrl.searchParams.get('matchId');
  if (!matchId) return NextResponse.json([]);

  if (isMockDB || !supabase) {
    // Mock database mode: Return realistic popular predictions based on matchId
    const idNum = parseInt(matchId) || 1;
    // Generate different realistic scores based on odd/even match IDs
    const mockPopular = idNum % 2 === 0 ? [
      { predicted_home: 1, predicted_away: 1, count: 18, percentage: 36 },
      { predicted_home: 2, predicted_away: 1, count: 12, percentage: 24 },
      { predicted_home: 0, predicted_away: 1, count: 9, percentage: 18 },
      { predicted_home: 1, predicted_away: 2, count: 7, percentage: 14 },
      { predicted_home: 2, predicted_away: 2, count: 4, percentage: 8 }
    ] : [
      { predicted_home: 2, predicted_away: 1, count: 22, percentage: 40 },
      { predicted_home: 1, predicted_away: 0, count: 14, percentage: 25 },
      { predicted_home: 1, predicted_away: 1, count: 11, percentage: 20 },
      { predicted_home: 3, predicted_away: 1, count: 5, percentage: 9 },
      { predicted_home: 0, predicted_away: 2, count: 3, percentage: 6 }
    ];
    return NextResponse.json(mockPopular);
  }

  try {
    const { data, error } = await supabase
      .from('predictions')
      .select('predicted_home, predicted_away')
      .eq('match_id', parseInt(matchId));

    if (error) {
      console.error('[Popular Predictions API] Error fetching predictions:', error);
      return NextResponse.json([]);
    }

    if (!data || data.length === 0) 
      return NextResponse.json([]);

    // Count each score combination
    const counts: Record<string, {
      predicted_home: number;
      predicted_away: number;
      count: number;
    }> = {};

    data.forEach(p => {
      const key = `${p.predicted_home}-${p.predicted_away}`;
      if (!counts[key]) counts[key] = {
        predicted_home: p.predicted_home,
        predicted_away: p.predicted_away,
        count: 0
      };
      counts[key].count++;
    });

    const total = data.length;
    const sorted = Object.values(counts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
      .map(p => ({
        ...p,
        percentage: Math.round((p.count / total) * 100)
      }));

    return NextResponse.json(sorted);
  } catch (err) {
    console.error('[Popular Predictions API] Crashed:', err);
    return NextResponse.json([]);
  }
}
