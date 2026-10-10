import { createClient } from '@supabase/supabase-js';
import rawMatches from '@/data/matches.json';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || 'placeholder-key';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET() {
  // ALWAYS compute from cache — NEVER call 
  // football-data.org directly from this route
  try {
    const { data: liveScores } = await supabase
      .from('live_scores')
      .select('*')
      .in('status', ['FINISHED', 'finished', 'COMPLETED', 'completed']);

    if (!liveScores || liveScores.length === 0) {
      return NextResponse.json([]);
    }

    const teamStats: Record<string, any> = {};

    for (const score of liveScores) {
      const match = (rawMatches as any[]).find(m => m.apiId === score.api_id);
      if (!match || match.stage !== 'Group Stage') continue;
      if (score.home_score === null) continue;

      const { homeTeam, awayTeam, group } = match;
      const hs = score.home_score;
      const as_ = score.away_score;

      if (!teamStats[homeTeam]) {
        teamStats[homeTeam] = { team: homeTeam, played:0, won:0, draw:0, lost:0, gf:0, ga:0, points:0, group };
      }
      if (!teamStats[awayTeam]) {
        teamStats[awayTeam] = { team: awayTeam, played:0, won:0, draw:0, lost:0, gf:0, ga:0, points:0, group };
      }

      teamStats[homeTeam].played++;
      teamStats[homeTeam].gf += hs;
      teamStats[homeTeam].ga += as_;
      if (hs > as_) { teamStats[homeTeam].won++; teamStats[homeTeam].points += 3; }
      else if (hs === as_) { teamStats[homeTeam].draw++; teamStats[homeTeam].points += 1; }
      else { teamStats[homeTeam].lost++; }

      teamStats[awayTeam].played++;
      teamStats[awayTeam].gf += as_;
      teamStats[awayTeam].ga += hs;
      if (as_ > hs) { teamStats[awayTeam].won++; teamStats[awayTeam].points += 3; }
      else if (as_ === hs) { teamStats[awayTeam].draw++; teamStats[awayTeam].points += 1; }
      else { teamStats[awayTeam].lost++; }
    }

    const groups: Record<string, any[]> = {};
    Object.values(teamStats).forEach((t: any) => {
      if (!groups[t.group]) groups[t.group] = [];
      groups[t.group].push({
        position: 0,
        team: { name: t.team, shortName: t.team },
        playedGames: t.played, won: t.won, draw: t.draw, lost: t.lost,
        goalsFor: t.gf, goalsAgainst: t.ga,
        goalDifference: t.gf - t.ga, points: t.points,
      });
    });

    const result = Object.entries(groups).map(([groupLetter, teams]) => ({
      stage: 'GROUP_STAGE', type: 'TOTAL', group: `GROUP_${groupLetter}`,
      table: teams
        .sort((a: any, b: any) => b.points - a.points || b.goalDifference - a.goalDifference || b.goalsFor - a.goalsFor)
        .map((t: any, i: number) => ({ ...t, position: i + 1 }))
    }));

    return NextResponse.json(result, {
      headers: { 'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=300' }
    });
  } catch (err) {
    console.error('Standings computation error:', err);
    return NextResponse.json([]);
  }
}
