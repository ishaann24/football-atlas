import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || 'placeholder-key';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const API_KEY = process.env.FOOTBALL_DATA_API_KEY;
const BASE = 'https://api.football-data.org/v4';

export interface LiveScore {
  apiId: number;
  status: string;
  homeScore: number | null;
  awayScore: number | null;
  minute: number | null;
}

export async function fetchLiveScoresFromAPI(): Promise<LiveScore[]> {
  if (!API_KEY) {
    console.error('FOOTBALL_DATA_API_KEY missing');
    return [];
  }

  try {
    const res = await fetch(
      `${BASE}/competitions/WC/matches`,
      { 
        headers: { 'X-Auth-Token': API_KEY },
        cache: 'no-store'
      }
    );

    console.log('fetchLiveScoresFromAPI status:', res.status);

    if (!res.ok) {
      const errText = await res.text();
      console.error('Live scores API error:', res.status, errText);
      return [];
    }

    const data = await res.json();
    console.log(`API returned ${data.matches?.length || 0} total matches`);
    
    const finished = data.matches?.filter((m: any) => m.status === 'FINISHED') || [];
    console.log(`Of which ${finished.length} are FINISHED`);
    
    return (data.matches || []).map((m: any) => ({
      apiId: m.id,
      status: m.status,
      homeScore: m.score?.fullTime?.home ?? null,
      awayScore: m.score?.fullTime?.away ?? null,
      minute: m.minute || null,
    }));
  } catch (err) {
    console.error('fetchLiveScoresFromAPI exception:', err);
    return [];
  }
}

export async function refreshLiveScoresCache(): Promise<number> {
  const scores = await fetchLiveScoresFromAPI();
  
  if (scores.length === 0) {
    console.warn('No scores fetched, cache not updated');
    return 0;
  }

  const rows = scores.map(s => ({
    api_id: s.apiId,
    status: s.status,
    home_score: s.homeScore,
    away_score: s.awayScore,
    minute: s.minute,
    updated_at: new Date().toISOString(),
  }));

  const { error, count } = await supabase
    .from('live_scores')
    .upsert(rows, { onConflict: 'api_id', count: 'exact' });

  if (error) {
    console.error('Upsert error details:', JSON.stringify(error));
    return 0;
  }

  console.log(`Refreshed ${rows.length} live scores in Supabase (upserted: ${count})`);
  return rows.length;
}

export async function getCachedLiveScores(): Promise<Map<number, LiveScore>> {
  const { data, error } = await supabase
    .from('live_scores')
    .select('*');

  if (error) {
    console.error('getCachedLiveScores error:', error);
    return new Map();
  }

  const map = new Map<number, LiveScore>();
  (data || []).forEach((row: any) => {
    map.set(row.api_id, {
      apiId: row.api_id,
      status: row.status,
      homeScore: row.home_score,
      awayScore: row.away_score,
      minute: row.minute,
    });
  });

  console.log(`Loaded ${map.size} cached live scores`);
  return map;
}

export function mergeLiveData(staticMatches: any[], liveMap: Map<number, LiveScore>): any[] {
  let mergedCount = 0;
  const result = staticMatches.map(m => {
    const live = liveMap.get(m.apiId);
    if (!live) return m;
    mergedCount++;
    return {
      ...m,
      status: live.status.toLowerCase(),
      homeScore: live.homeScore,
      awayScore: live.awayScore,
      minute: live.minute,
      score: live.homeScore !== null && live.awayScore !== null
        ? `${live.homeScore}-${live.awayScore}`
        : null,
    };
  });
  console.log(`Merged live data into ${mergedCount}/${staticMatches.length} matches`);
  return result;
}

export async function refreshBracketMatchesCache(): Promise<number> {
  if (!API_KEY) {
    console.error('FOOTBALL_DATA_API_KEY missing');
    return 0;
  }

  try {
    const stages = [
      'LAST_32', 'LAST_16',
      'QUARTER_FINALS', 'SEMI_FINALS', 'FINAL'
    ];

    const results = await Promise.allSettled(
      stages.map(stage =>
        fetch(
          `${BASE}/competitions/WC/matches?stage=${stage}`,
          {
            headers: { 'X-Auth-Token': API_KEY },
            cache: 'no-store'
          }
        ).then(res => {
          if (!res.ok) {
            console.error(`Bracket fetch failed for stage ${stage}: ${res.status}`);
            return { matches: [] };
          }
          return res.json();
        })
      )
    );

    const allMatches = results.flatMap(r =>
      r.status === 'fulfilled' 
        ? (r.value.matches || []) 
        : []
    );

    if (allMatches.length === 0) {
      console.warn('No bracket matches fetched, cache not updated');
      return 0;
    }

    const rows = allMatches.map((m: any) => ({
      id: m.id,
      stage: m.stage,
      status: m.status,
      utcDate: m.utcDate,
      homeTeam: m.homeTeam,
      awayTeam: m.awayTeam,
      score: m.score,
      updated_at: new Date().toISOString(),
    }));

    const { error } = await supabase
      .from('bracket_matches')
      .upsert(rows, { onConflict: 'id' });

    if (error) {
      console.error('Bracket upsert error:', error);
      return 0;
    }

    console.log(`Refreshed ${rows.length} bracket matches in Supabase`);
    return rows.length;
  } catch (err) {
    console.error('refreshBracketMatchesCache exception:', err);
    return 0;
  }
}

export async function refreshTopScorersCache(): Promise<number> {
  if (!API_KEY) {
    console.error('FOOTBALL_DATA_API_KEY missing');
    return 0;
  }

  try {
    const res = await fetch(
      `${BASE}/competitions/WC/scorers?limit=10`,
      {
        headers: { 'X-Auth-Token': API_KEY },
        cache: 'no-store'
      }
    );

    if (!res.ok) {
      console.error(`Top scorers fetch failed: ${res.status}`);
      return 0;
    }

    const data = await res.json();
    const scorers = data.scorers || [];

    if (scorers.length === 0) {
      console.warn('No scorers fetched, cache not updated');
      return 0;
    }

    const rows = scorers.map((s: any) => ({
      id: s.player.id,
      player: s.player,
      team: s.team,
      numberOfGoals: s.numberOfGoals,
      updated_at: new Date().toISOString(),
    }));

    const { error } = await supabase
      .from('top_scorers')
      .upsert(rows, { onConflict: 'id' });

    if (error) {
      console.error('Top scorers upsert error:', error);
      return 0;
    }

    console.log(`Refreshed ${rows.length} top scorers in Supabase`);
    return rows.length;
  } catch (err) {
    console.error('refreshTopScorersCache exception:', err);
    return 0;
  }
}
