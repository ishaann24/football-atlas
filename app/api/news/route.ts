import { getNews } from '@/lib/news-cache';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const limit = parseInt(
    req.nextUrl.searchParams.get('limit') || '10'
  );

  try {
    const articles = await getNews(Math.min(limit, 30));
    return NextResponse.json(articles, {
      headers: {
        'Cache-Control': 
          'public, s-maxage=1800, stale-while-revalidate=3600',
      }
    });
  } catch (err) {
    console.error('News API error:', err);
    return NextResponse.json([], { status: 200 });
  }
}
