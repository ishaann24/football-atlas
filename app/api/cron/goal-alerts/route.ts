import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import rawMatches from '@/data/matches.json';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || 'placeholder-key';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export const dynamic = 'force-dynamic';

async function sendEmailAlert(params: {
  fanName: string;
  fanEmail: string;
  scorerName: string;
  teamName: string;
  minute: number;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
}) {
  const BREVO_API_KEY = process.env.BREVO_API_KEY;
  if (!BREVO_API_KEY) {
    console.warn('No BREVO_API_KEY, skipping email');
    return;
  }

  try {
    await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': BREVO_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sender: { 
          name: 'WC26 Goal Alerts', 
          email: process.env.BREVO_SENDER_EMAIL || 'alerts@worldcup26.com' 
        },
        to: [{ email: params.fanEmail, name: params.fanName }],
        subject: `⚽ GOAL! ${params.scorerName} scores for ${params.teamName}!`,
        htmlContent: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0a0a0a;color:#fff;padding:32px;border-radius:12px">
            <div style="text-align:center;margin-bottom:24px">
              <div style="font-size:48px">⚽</div>
              <h1 style="color:#3CAC3B;font-size:28px;margin:8px 0">GOAL!</h1>
            </div>
            <div style="background:#111;border:1px solid rgba(60,172,59,0.3);border-radius:8px;padding:20px;margin-bottom:20px;text-align:center">
              <div style="font-size:32px;font-weight:bold;color:#fff;margin-bottom:4px">
                ${params.homeTeam} ${params.homeScore} - ${params.awayScore} ${params.awayTeam}
              </div>
              <div style="color:#3CAC3B;font-size:14px">${params.scorerName} ⚽ ${params.minute}'</div>
            </div>
            <p style="color:rgba(255,255,255,0.6);font-size:14px;text-align:center">
              Hi ${params.fanName}! ${params.scorerName} just scored for ${params.teamName} in the ${params.minute}th minute!
            </p>
            <div style="text-align:center;margin-top:24px">
              <a href="https://world-cup-fan-site.vercel.app" 
                style="background:#3CAC3B;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:bold">
                View Live Score →
              </a>
            </div>
            <p style="color:rgba(255,255,255,0.3);font-size:11px;text-align:center;margin-top:24px">
              FIFA World Cup 2026 Fan Hub · Not affiliated with FIFA
            </p>
          </div>
        `
      })
    });
    console.log(`Email sent to ${params.fanEmail}`);
  } catch (err) {
    console.error('Email send failed:', err);
  }
}

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret');
  const authHeader = req.headers.get('Authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (
    cronSecret &&
    secret !== cronSecret &&
    authHeader !== `Bearer ${cronSecret}`
  ) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // READ FROM SUPABASE CACHE — no direct API call
    const { data: liveScores, error: scoresError } = await supabase
      .from('live_scores')
      .select('*');

    if (scoresError) {
      console.error('Failed to read live_scores:', scoresError);
      return NextResponse.json({ error: 'DB error' }, { status: 500 });
    }

    console.log(`[Goal Alerts] Running at ${new Date().toISOString()}`);
    console.log(`[Goal Alerts] Found ${liveScores?.length || 0} matches in cache`);
    console.log(`[Goal Alerts] Active matches:`, 
      liveScores?.filter(s => 
        s.status === 'IN_PLAY' || 
        s.status === 'FINISHED' ||
        s.status === 'in_play' ||
        s.status === 'finished'
      ).map(s => `${s.api_id}: ${s.status} ${s.home_score}-${s.away_score}`)
    );

    if (!liveScores || liveScores.length === 0) {
      return NextResponse.json({ 
        message: 'No live scores in cache yet' 
      });
    }

    // Find matches that just finished or have goals
    const finishedInCache = liveScores.filter(
      s => s.status === 'FINISHED' || s.status === 'IN_PLAY' || s.status === 'finished' || s.status === 'in_play'
    );

    console.log(`Found ${finishedInCache.length} active/finished matches in cache`);

    let alertsSent = 0;

    for (const liveMatch of finishedInCache) {
      // Find our match by apiId
      const ourMatch = (rawMatches as any[]).find(
        m => m.apiId === liveMatch.api_id
      );
      if (!ourMatch) continue;

      // CRITICAL: Never send alerts for 0-0 or when no goals have been scored
      if (liveMatch.home_score === null || 
          liveMatch.away_score === null ||
          (liveMatch.home_score === 0 && 
           liveMatch.away_score === 0)) {
        console.log(`Skipping match ${liveMatch.api_id} — no goals yet (${liveMatch.home_score}-${liveMatch.away_score})`);
        continue;
      }

      // Also skip if match hasn't started or is in a pre-match state
      if (liveMatch.status === 'TIMED' || 
          liveMatch.status === 'SCHEDULED' ||
          liveMatch.status === 'timed' ||
          liveMatch.status === 'scheduled') {
        continue;
      }

      const totalGoals = (liveMatch.home_score || 0) + (liveMatch.away_score || 0);
      if (totalGoals === 0) continue;

      // Create one event per unique score state
      const eventId = `match_${liveMatch.api_id}_score_${liveMatch.home_score}_${liveMatch.away_score}`;

      // Check if already processed globally
      const { data: existing, error: checkError } = await supabase
        .from('processed_events')
        .select('id')
        .eq('event_id', eventId)
        .maybeSingle();

      if (checkError) {
        console.error('Dedup check error:', checkError);
        // If we can't check, skip to be safe (better to miss an alert than spam)
        continue;
      }

      if (existing) {
        console.log(`Already processed: ${eventId}`);
        continue;
      }

      // Get fans supporting either team
      const { data: fans } = await supabase
        .from('fans')
        .select('name, email, whatsapp, favourite_team')
        .or(
          `favourite_team.ilike.%${ourMatch.homeTeam.split(' ')[0]}%,` +
          `favourite_team.ilike.%${ourMatch.awayTeam.split(' ')[0]}%`
        );

      if (fans && fans.length > 0) {
        for (const fan of fans) {
          // Check if this specific fan was already alerted for this match score state
          const fanEventId = `${eventId}_fan_${fan.email}`;

          const { data: fanExisting, error: fanCheckError } = await supabase
            .from('processed_events')
            .select('id')
            .eq('event_id', fanEventId)
            .maybeSingle();

          if (fanCheckError) {
            console.error(`Error checking rate limit for ${fan.email}:`, fanCheckError);
            continue;
          }

          if (fanExisting) {
            console.log(`Already alerted ${fan.email} for ${eventId}`);
            continue;
          }

          // Determine if this fan's team scored
          const fanSupportsHome = fan.favourite_team
            ?.toLowerCase()
            .includes(ourMatch.homeTeam.split(' ')[0].toLowerCase());
          
          const scoringTeam = fanSupportsHome 
            ? ourMatch.homeTeam 
            : ourMatch.awayTeam;

          await sendEmailAlert({
            fanName: fan.name,
            fanEmail: fan.email,
            scorerName: 'Your team',
            teamName: scoringTeam,
            minute: 0,
            homeTeam: ourMatch.homeTeam,
            awayTeam: ourMatch.awayTeam,
            homeScore: liveMatch.home_score,
            awayScore: liveMatch.away_score,
          });
          alertsSent++;

          // Mark this fan+event as processed
          const { error: fanInsertError } = await supabase
            .from('processed_events')
            .insert({ id: fanEventId, event_id: fanEventId });

          if (fanInsertError) {
            console.error(`Failed to mark processed for fan ${fan.email}:`, fanInsertError);
          }
        }
      }

      // Mark global match score state as processed
      const { error: insertError } = await supabase
        .from('processed_events')
        .insert({ id: eventId, event_id: eventId });

      if (insertError) {
        console.error('Failed to mark processed:', insertError);
      }
    }

    return NextResponse.json({
      message: `Processed ${finishedInCache.length} matches, sent ${alertsSent} alerts`,
      matches: finishedInCache.length,
      alertsSent
    });

  } catch (err: any) {
    console.error('[Goal Alerts] Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
