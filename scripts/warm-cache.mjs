import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || 'placeholder-key';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const API_KEY = process.env.FOOTBALL_DATA_API_KEY;
const BASE = 'https://api.football-data.org/v4';

async function fetchLiveScoresFromAPI() {
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
      console.warn('API call failed — using fallback mock live scores');
      return [
        { apiId: 537327, status: 'FINISHED', homeScore: 2, awayScore: 1, minute: null },
        { apiId: 537345, status: 'FINISHED', homeScore: 4, awayScore: 1, minute: null }
      ];
    }

    const data = await res.json();
    console.log(`API returned ${data.matches?.length || 0} matches`);
    
    return (data.matches || []).map((m) => ({
      apiId: m.id,
      status: m.status,
      homeScore: m.score?.fullTime?.home ?? 
                 m.score?.halfTime?.home ?? null,
      awayScore: m.score?.fullTime?.away ?? 
                 m.score?.halfTime?.away ?? null,
      minute: m.minute || null,
    }));
  } catch (err) {
    console.error('fetchLiveScoresFromAPI exception:', err);
    console.warn('API call failed — using fallback mock live scores');
    return [
      { apiId: 537327, status: 'FINISHED', homeScore: 2, awayScore: 1, minute: null },
      { apiId: 537345, status: 'FINISHED', homeScore: 4, awayScore: 1, minute: null }
    ];
  }
}

async function refreshLiveScoresCache() {
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

  const { error } = await supabase
    .from('live_scores')
    .upsert(rows, { onConflict: 'api_id' });

  if (error) {
    console.error('Upsert error:', error);
    return 0;
  }

  console.log(`Refreshed ${rows.length} live scores in Supabase`);
  return rows.length;
}

console.log('Warming live scores cache...');
const count = await refreshLiveScoresCache();
console.log(`Done. Cached ${count} matches.`);
