import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendEmailAlert } from '@/lib/football-api';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, whatsapp, favouriteTeam } = body;

    // 1. Input Validation
    if (!name || !email || !whatsapp || !favouriteTeam) {
      return NextResponse.json(
        { error: 'All fields (name, email, whatsapp, favouriteTeam) are required.' },
        { status: 400 }
      );
    }

    const welcomeSubject = `⚽ Subscription Confirmed: ${favouriteTeam} Goal Alerts Activated!`;
    const welcomeText = `Hey ${name}, welcome to the FIFA World Cup 2026 Fan Hub! You have successfully subscribed to live goal alerts for ${favouriteTeam}.`;
    const welcomeHtml = `
      <div style="font-family: sans-serif; background-color: #0f172a; color: #f8fafc; padding: 24px; border-radius: 16px; border: 1px solid #1e293b; max-width: 600px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 20px;">
          <span style="font-size: 40px;">🏆</span>
        </div>
        <h2 style="color: #10b981; margin-top: 0; text-align: center;">Subscription Confirmed!</h2>
        <p style="font-size: 16px; line-height: 1.6; text-align: center;">
          Hey <strong>${name}</strong>, you have successfully subscribed to live goal alerts for <strong>${favouriteTeam}</strong>.
        </p>
        <p style="font-size: 14px; line-height: 1.5; color: #94a3b8; text-align: center;">
          The second <strong>${favouriteTeam}</strong> scores a goal during the FIFA World Cup 2026, we will send an alert directly to your inbox and WhatsApp number!
        </p>
        <div style="text-align: center; margin-top: 24px;">
          <a href="https://world-cup-fan-site.vercel.app" style="display: inline-block; background-color: #10b981; color: #020617; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold;">
            Visit World Cup Dashboard
          </a>
        </div>
      </div>
    `;

    // 2. Database Action with Graceful Local Demo Fallback
    const isMock = !process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_URL === 'mock';

    if (isMock) {
      console.log('--- OFFLINE MOCK REGISTRATION RECEIVED ---');
      console.log(`Name: ${name}`);
      console.log(`Email: ${email}`);
      console.log(`WhatsApp: ${whatsapp}`);
      console.log(`Favourite Team: ${favouriteTeam}`);
      console.log('-----------------------------------------');

      // Attempt to send mock confirmation email if key is configured locally
      await sendEmailAlert(email, name, welcomeSubject, welcomeText, welcomeHtml);

      return NextResponse.json({
        success: true,
        message: 'Successfully registered in local demo mode! Check your inbox for confirmation.',
        fan: { id: 'mock-uuid-12345', name, email, whatsapp, favourite_team: favouriteTeam },
      });
    }

    // Insert into Supabase
    const { data, error } = await supabase
      .from('fans')
      .insert([
        {
          name,
          email,
          whatsapp,
          favourite_team: favouriteTeam,
        },
      ])
      .select();

    if (error) {
      console.error('Supabase registration error:', error);
      // Graceful handling of duplicate emails (Postgres Unique constraint)
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'This email is already registered!' },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: error.message || 'Database error during registration.' },
        { status: 500 }
      );
    }

    // Send confirmation email upon successful DB insertion
    await sendEmailAlert(email, name, welcomeSubject, welcomeText, welcomeHtml);

    return NextResponse.json({
      success: true,
      message: 'Successfully registered! Welcome email has been sent.',
      fan: data?.[0],
    });
  } catch (error: any) {
    console.error('Registration route error:', error);
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
