import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

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

    // 2. Database Action with Graceful Local Demo Fallback
    const isMock = !process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_URL === 'mock';

    if (isMock) {
      console.log('--- OFFLINE MOCK REGISTRATION RECEIVED ---');
      console.log(`Name: ${name}`);
      console.log(`Email: ${email}`);
      console.log(`WhatsApp: ${whatsapp}`);
      console.log(`Favourite Team: ${favouriteTeam}`);
      console.log('-----------------------------------------');

      return NextResponse.json({
        success: true,
        message: 'Successfully registered in local demo mode!',
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

    return NextResponse.json({
      success: true,
      message: 'Successfully registered!',
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
