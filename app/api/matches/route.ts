import rawMatches from '@/data/matches.json';
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(rawMatches, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600',
    }
  });
}
