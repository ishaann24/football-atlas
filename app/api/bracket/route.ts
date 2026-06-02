export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const isPlaceholder = (team: string | null | undefined): boolean => {
  if (!team) return true;
  const t = team.toLowerCase();
  return (
    t.includes('winner') ||
    t.includes('runner-up') ||
    t.includes('loser') ||
    t.includes('group') ||
    t.includes('match') ||
    t === 'tbd'
  );
};

export async function GET() {
  try {
    const apiKey = process.env.FOOTBALL_DATA_API_KEY;
    let matches: any[] = [];

    // 1. Try to fetch from football-data.org API if key is present
    if (apiKey && apiKey !== 'mock') {
      try {
        const res = await fetch('https://api.football-data.org/v4/competitions/WC/matches', {
          headers: { 'X-Auth-Token': apiKey },
          next: { revalidate: 60 },
        });

        if (res.ok) {
          const data = await res.json();
          const apiMatches = data.matches || [];
          
          matches = apiMatches.map((m: any) => {
            const home = m.homeTeam?.name;
            const away = m.awayTeam?.name;
            return {
              id: String(m.id || m.matchNumber),
              matchNumber: m.matchNumber || m.id,
              homeTeam: isPlaceholder(home) ? null : home,
              awayTeam: isPlaceholder(away) ? null : away,
              stage: m.stage, // We will map stages below
              score: m.score?.fullTime ? `${m.score.fullTime.home}-${m.score.fullTime.away}` : null,
              winner: m.score?.winner ? (m.score.winner === 'HOME' ? home : away) : null,
            };
          });
        }
      } catch (err) {
        console.error('[Bracket API] Failed to fetch from football-data.org:', err);
      }
    }

    // 2. Fall back to local matches.json fixture if API fetch failed or was skipped
    if (matches.length === 0) {
      const filePath = path.join(process.cwd(), 'data', 'matches.json');
      const fileData = fs.readFileSync(filePath, 'utf8');
      const rawMatches = JSON.parse(fileData);

      matches = rawMatches.map((m: any) => {
        return {
          id: String(m.id),
          matchNumber: m.matchNumber || m.id,
          homeTeam: isPlaceholder(m.homeTeam) ? null : m.homeTeam,
          awayTeam: isPlaceholder(m.awayTeam) ? null : m.awayTeam,
          stage: m.stage,
          score: m.score,
          winner: null, // Local mock scheduled matches don't have winners
        };
      });
    }

    // 3. Filter matches for the knockout rounds only
    const r32 = matches.filter((m) => m.stage === 'Round of 32').sort((a, b) => a.matchNumber - b.matchNumber);
    const r16 = matches.filter((m) => m.stage === 'Round of 16').sort((a, b) => a.matchNumber - b.matchNumber);
    const qf = matches.filter((m) => m.stage === 'Quarter-Final' || m.stage === 'Quarter-Finals').sort((a, b) => a.matchNumber - b.matchNumber);
    const sf = matches.filter((m) => m.stage === 'Semi-Final' || m.stage === 'Semi-Finals').sort((a, b) => a.matchNumber - b.matchNumber);
    const final = matches.filter((m) => m.stage === 'Final').sort((a, b) => a.matchNumber - b.matchNumber);

    return NextResponse.json({
      success: true,
      stages: {
        r32,
        r16,
        qf,
        sf,
        final,
      },
    });
  } catch (error: any) {
    console.error('[Bracket API] Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch bracket data' }, { status: 500 });
  }
}
