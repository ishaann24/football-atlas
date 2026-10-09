import { createClient } from '@supabase/supabase-js';
import { fetchAllNews, NewsArticle } from './news';

let supabaseClient: any = null;
function getSupabase() {
  if (!supabaseClient) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
    const key = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || '';
    // Use fallback empty strings to prevent createClient from throwing at build-time
    supabaseClient = createClient(url, key);
  }
  return supabaseClient;
}

// Get news — try cache first, refresh if stale
export async function getNews(
  limit: number = 20
): Promise<NewsArticle[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
  const key = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || '';
  
  // Check if env keys are present
  if (!url || !key) {
    console.warn('Supabase credentials missing — falling back to live fetch');
    return (await fetchAllNews()).slice(0, limit);
  }

  const supabase = getSupabase();

  try {
    // Check cache age
    const { data: latest } = await supabase
      .from('news_cache')
      .select('fetched_at')
      .order('fetched_at', { ascending: false })
      .limit(1)
      .single();

    const cacheAge = latest 
      ? Date.now() - new Date(latest.fetched_at).getTime()
      : Infinity;

    const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

    // If cache is fresh, return from cache
    if (cacheAge < CACHE_TTL) {
      const { data } = await supabase
        .from('news_cache')
        .select('*')
        .order('published_at', { ascending: false })
        .limit(limit);

      if (data && data.length > 0) {
        console.log(`Serving ${data.length} articles from cache`);
        return data.map(rowToArticle);
      }
    }

    // Cache stale or empty — fetch fresh
    console.log('Cache stale, fetching fresh news...');
    const fresh = await fetchAllNews();

    if (fresh.length > 0) {
      // Upsert into cache (ignore duplicates by url)
      const rows = fresh.map(a => ({
        title: a.title,
        description: a.description,
        url: a.url,
        image: a.image,
        source_name: a.source.name,
        published_at: a.publishedAt,
      }));

      await supabase
        .from('news_cache')
        .upsert(rows, { onConflict: 'url', ignoreDuplicates: true });

      // Cleanup old entries
      await supabase.rpc('cleanup_old_news');

      return fresh.slice(0, limit);
    }
  } catch (e) {
    console.error('Supabase news cache error:', e);
  }

  // Fresh fetch also failed — return stale cache as last resort
  try {
    const { data: stale } = await supabase
      .from('news_cache')
      .select('*')
      .order('published_at', { ascending: false })
      .limit(limit);

    console.log(`Fresh fetch failed, returning ${stale?.length || 0} stale cached articles`);
    return (stale || []).map(rowToArticle);
  } catch (err) {
    console.error('Failed to read fallback stale cache:', err);
    return [];
  }
}

function rowToArticle(row: any): NewsArticle {
  return {
    title: row.title,
    description: row.description,
    url: row.url,
    image: row.image,
    publishedAt: row.published_at,
    source: { name: row.source_name, url: '#' }
  };
}

export function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}
