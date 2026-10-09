import { fetchAllNews } from '@/lib/news';
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

let supabaseClient: any = null;
function getSupabase() {
  if (!supabaseClient) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
    const key = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || '';
    supabaseClient = createClient(url, key);
  }
  return supabaseClient;
}

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret');
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json(
      { error: 'Unauthorized' }, { status: 401 }
    );
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
  const key = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || '';

  // Check if env keys are present
  if (!url || !key) {
    return NextResponse.json(
      { error: 'Supabase credentials missing' }, { status: 500 }
    );
  }

  const supabase = getSupabase();
  const fresh = await fetchAllNews();

  if (fresh.length > 0) {
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

    await supabase.rpc('cleanup_old_news');
  }

  return NextResponse.json({ 
    message: `Refreshed ${fresh.length} articles` 
  });
}
