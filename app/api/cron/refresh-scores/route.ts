import { NextRequest, NextResponse } from 'next/server';
import { refreshLiveScoresCache, refreshBracketMatchesCache, refreshTopScorersCache } from '@/lib/live-scores';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret');
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log(`[Heartbeat] refresh-scores triggered at ${new Date().toISOString()}`);
    
    // Refresh live scores, bracket matches, and top scorers
    const count = await refreshLiveScoresCache();
    const bracketCount = await refreshBracketMatchesCache();
    const scorersCount = await refreshTopScorersCache();

    if (count === 0) {
      console.error('[refresh-scores] CRITICAL: 0 matches refreshed — API likely down or key disabled');
      return NextResponse.json({
        success: false,
        refreshedCount: 0,
        warning: 'No matches refreshed — check FOOTBALL_DATA_API_KEY validity',
      }, { status: 503 }); // 503 = Service Unavailable
    }

    return NextResponse.json({
      success: true,
      refreshedCount: count,
      bracketRefreshedCount: bracketCount,
      scorersRefreshedCount: scorersCount,
    });
  } catch (err: any) {
    console.error('[Refresh Scores Cron] failed:', err);
    return NextResponse.json({ 
      error: err.message || 'Execution failed',
      success: false 
    }, { status: 500 });
  }
}
