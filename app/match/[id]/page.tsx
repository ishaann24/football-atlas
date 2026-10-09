import type { Metadata } from 'next';
import rawMatches from '@/data/matches.json';
import MatchStatsClient from './MatchStatsClient';
import { getCachedLiveScores } from '@/lib/live-scores';

export const dynamic = 'force-dynamic';

interface Props {
  params: { id: string }
}

// Generate SEO metadata for each match
export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const match = (rawMatches as any[])
    .find(m => m.id === parseInt(params.id));
  if (!match) return { title: 'Match Not Found' };
  
  const home = match.homeTeam || 'TBD';
  const away = match.awayTeam || 'TBD';

  return {
    title: `${home} vs ${away} — FIFA World Cup 2026`,
    description: `${home} vs ${away} match stats, score, and highlights. ${match.venue || ''}. FIFA World Cup 2026.`,
    openGraph: {
      title: `${home} vs ${away}`,
      description: `FIFA World Cup 2026 · Group ${match.group} · ${match.venue}`,
    }
  };
}

export default async function MatchPage({ params }: Props) {
  const matchId = parseInt(params.id);
  const staticMatch = (rawMatches as any[])
    .find(m => m.id === matchId);
  
  if (!staticMatch) {
    return <div>Match not found</div>;
  }

  // ONLY read from Supabase cache — NEVER call 
  // football-data.org directly from this page
  const liveMap = await getCachedLiveScores();
  const cached = liveMap.get(staticMatch.apiId);

  const mergedMatch = {
    ...staticMatch,
    status: cached?.status?.toLowerCase() || staticMatch.status,
    homeScore: cached?.homeScore ?? staticMatch.homeScore,
    awayScore: cached?.awayScore ?? staticMatch.awayScore,
  };

  return (
    <MatchStatsClient 
      staticMatch={mergedMatch} 
      liveData={null}
      headToHead={[]}
    />
  );
}
