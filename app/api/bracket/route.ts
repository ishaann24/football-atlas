import rawMatches from '@/data/matches.json';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const knockouts = (rawMatches as any[])
    .filter(m => m.stage !== 'Group Stage')
    .map(m => ({
      id: m.id,
      stage: m.stage,
      status: m.status,
      utcDate: m.date,
      homeTeam: { name: m.homeTeam },
      awayTeam: { name: m.awayTeam },
      score: { fullTime: { home: m.homeScore, away: m.awayScore } },
      winner: m.winner,
      penalties: m.penalties,
      note: m.note
    }));

  return NextResponse.json(knockouts, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600',
    }
  });
}
