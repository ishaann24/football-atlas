import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { getCachedLiveScores } from '@/lib/live-scores';
import rawMatches from '@/data/matches.json';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || 'placeholder-service-key';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

function calculatePoints(ph: number, pa: number, ah: number, aa: number) {
  if (ph === ah && pa === aa) return 3;
  const predResult = Math.sign(ph - pa);
  const actualResult = Math.sign(ah - aa);
  if (predResult === actualResult) return 1;
  return 0;
}

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret');
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const liveScoreMap = await getCachedLiveScores();
  const liveScores = Array.from(liveScoreMap.values());
  const finished = liveScores.filter(s => 
    s.status === 'FINISHED' || 
    s.status === 'finished' ||
    s.status === 'COMPLETED' ||
    s.status === 'completed'
  );
  
  console.log(`Found ${finished.length} finished matches`);

  let scoredCount = 0;

  for (const live of finished) {
    if (live.homeScore === null || live.awayScore === null) continue;

    const ourMatch = (rawMatches as any[]).find(m => m.apiId === live.apiId);
    if (!ourMatch) {
      console.log(`No match found for apiId ${live.apiId}`);
      continue;
    }

    const { data: preds, error } = await supabase
      .from('predictions')
      .select('*')
      .eq('match_id', ourMatch.id)
      .eq('is_scored', false);

    if (error) {
      console.error('Error fetching predictions:', error);
      continue;
    }

    if (!preds || preds.length === 0) continue;

    console.log(`Scoring ${preds.length} predictions for match ${ourMatch.id} (${ourMatch.homeTeam} vs ${ourMatch.awayTeam})`);

    for (const pred of preds) {
      const points = calculatePoints(
        pred.predicted_home, pred.predicted_away,
        live.homeScore, live.awayScore
      );

      await supabase
        .from('predictions')
        .update({
          actual_home: live.homeScore,
          actual_away: live.awayScore,
          points_earned: points,
          is_scored: true,
        })
        .eq('id', pred.id);

      // Get current user totals
      const { data: user } = await supabase
        .from('predictor_users')
        .select('total_points, total_predictions, exact_scores')
        .eq('id', pred.user_id)
        .single();

      if (user) {
        await supabase
          .from('predictor_users')
          .update({
            total_points: (user.total_points || 0) + points,
            total_predictions: (user.total_predictions || 0) + 1,
            exact_scores: points === 3 
              ? (user.exact_scores || 0) + 1 
              : (user.exact_scores || 0),
          })
          .eq('id', pred.user_id);
      }

      scoredCount++;
      console.log(`  Predicted ${pred.predicted_home}-${pred.predicted_away}, actual ${live.homeScore}-${live.awayScore}, +${points} pts`);
    }
  }

  return NextResponse.json({ 
    message: `Scored ${scoredCount} predictions across ${finished.length} finished matches` 
  });
}
