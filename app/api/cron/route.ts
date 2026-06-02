export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getLiveMatchGoals, sendEmailAlert } from '@/lib/football-api';
import { sendWhatsAppMessage } from '@/lib/whatsapp';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const authHeader = req.headers.get('Authorization');
    const cronSecret = process.env.CRON_SECRET;

    // 1. Security Check (Secures endpoint in production)
    if (
      process.env.NODE_ENV === 'production' &&
      cronSecret &&
      authHeader !== `Bearer ${cronSecret}` &&
      searchParams.get('secret') !== cronSecret
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Poll live score events (real API or simulated in dev/demo mode)
    const newGoals = await getLiveMatchGoals();
    const reports: any[] = [];

    const isMockDB = !process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_URL === 'mock';

    // 3. Process each goal
    for (const goal of newGoals) {
      let isAlreadyProcessed = false;

      if (!isMockDB) {
        // Query Supabase to see if this goal was already processed
        const { data, error } = await supabase
          .from('processed_events')
          .select('id')
          .eq('id', goal.id)
          .single();

        if (data) {
          isAlreadyProcessed = true;
        }
      } else {
        // Mock DB: Simulate processing by randomly caching some events or just letting it pass
        // In local development, we want to always process the goal so the user sees the alert!
        console.log(`[Cron] Mock DB: Checking event ID ${goal.id}. Will process...`);
      }

      if (isAlreadyProcessed) {
        reports.push({ goalId: goal.id, status: 'SKIPPED_DUPLICATE' });
        continue;
      }

      // 4. Retrieve fans supporting the scoring team
      let fansToAlert: any[] = [];

      if (!isMockDB) {
        // Find fans of the scoring team
        const { data, error } = await supabase
          .from('fans')
          .select('*')
          .eq('favourite_team', goal.scoringTeam);

        if (data) {
          fansToAlert = data;
        } else if (error) {
          console.error('[Cron] Error fetching fans from Supabase:', error);
        }
      } else {
        // Mock DB: Provide a mock fan for testing
        fansToAlert = [
          {
            id: 'mock-fan-1',
            name: 'John Doe',
            email: 'john.doe@example.com',
            whatsapp: '+919876543210',
            favourite_team: goal.scoringTeam,
          },
        ];
      }

      const alertMessage = `⚽ GOAL! ${goal.scorer} scores for ${goal.scoringTeam} in ${goal.minute}' vs ${goal.opponentTeam}. Score: [${goal.score}]. Watch live: https://fifa-2026-fan-site.vercel.app`;
      const emailSubject = `GOAL ALERT! ${goal.scoringTeam} scores! [${goal.score}]`;

      const emailHtmlContent = `
        <div style="font-family: sans-serif; background-color: #0f172a; color: #f8fafc; padding: 24px; border-radius: 16px; border: 1px solid #1e293b; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #10b981; margin-top: 0;">⚽ GOOOAAALLL!!!</h2>
          <p style="font-size: 16px; line-height: 1.6;">
            <strong>${goal.scorer}</strong> has scored in the <strong>${goal.minute}'</strong> minute for <strong>${goal.scoringTeam}</strong>!
          </p>
          <div style="background-color: #020617; border: 1px solid #334155; padding: 16px; border-radius: 8px; font-size: 20px; font-weight: bold; text-align: center; letter-spacing: 4px; margin: 20px 0; color: #ffffff;">
            ${goal.homeTeam} ${goal.score.split('-')[0]} - ${goal.score.split('-')[1]} ${goal.awayTeam}
          </div>
          <p style="font-size: 14px; color: #94a3b8;">
            Match against ${goal.opponentTeam} is currently live.
          </p>
          <a href="https://fifa-2026-fan-site.vercel.app" style="display: inline-block; background-color: #10b981; color: #020617; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; margin-top: 10px;">
            Watch Live Stream
          </a>
        </div>
      `;

      const dispatchedAlerts: string[] = [];

      // 5. Dispatch WhatsApp & Email alerts to matches
      for (const fan of fansToAlert) {
        console.log(`[Cron] Dispatching goal alert to ${fan.name} (Team: ${fan.favourite_team})`);

        // Send WhatsApp
        const waSuccess = await sendWhatsAppMessage(fan.whatsapp, alertMessage);
        if (waSuccess) dispatchedAlerts.push(`whatsapp_${fan.id}`);

        // Send Email
        const emailSuccess = await sendEmailAlert(
          fan.email,
          fan.name,
          emailSubject,
          alertMessage,
          emailHtmlContent
        );
        if (emailSuccess) dispatchedAlerts.push(`email_${fan.id}`);
      }

      // 6. Save event ID to prevent duplicate alerts
      if (!isMockDB) {
        const { error: insertError } = await supabase
          .from('processed_events')
          .insert([{ id: goal.id }]);

        if (insertError) {
          console.error('[Cron] Error saving event ID to Supabase processed_events:', insertError);
        }
      } else {
        console.log(`[Cron] Mock DB: Event ID ${goal.id} marked as processed.`);
      }

      reports.push({
        goalId: goal.id,
        scoringTeam: goal.scoringTeam,
        scorer: goal.scorer,
        score: goal.score,
        alertsSentTo: fansToAlert.map((f) => ({ name: f.name, email: f.email })),
        dispatched: dispatchedAlerts,
        status: 'PROCESSED_SUCCESSFULLY',
      });
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      eventsPolled: newGoals.length,
      reports,
    });
  } catch (error: any) {
    console.error('[Cron] Job failed:', error);
    return NextResponse.json(
      { error: error.message || 'Cron execution failed.' },
      { status: 500 }
    );
  }
}
