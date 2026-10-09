import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || 'placeholder-service-key';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

function generateToken(): string {
  return randomBytes(32).toString('hex');
}

// POST /api/user — handles both register and login
export async function POST(req: NextRequest) {
  try {
    const { action, username, displayName, 
            password, favouriteTeam } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password required' },
        { status: 400 }
      );
    }

    const cleanUsername = username.toLowerCase().trim();

    // ── REGISTER ──────────────────────────────────────
    if (action === 'register') {
      // Check username taken
      const { data: existing } = await supabase
        .from('predictor_users')
        .select('id')
        .eq('username', cleanUsername)
        .maybeSingle();

      if (existing) {
        return NextResponse.json(
          { error: 'Username already taken' },
          { status: 409 }
        );
      }

      // Validate
      if (cleanUsername.length < 3) {
        return NextResponse.json(
          { error: 'Username must be at least 3 characters' },
          { status: 400 }
        );
      }
      if (password.length < 6) {
        return NextResponse.json(
          { error: 'Password must be at least 6 characters' },
          { status: 400 }
        );
      }
      if (!/^[a-z0-9_]+$/.test(cleanUsername)) {
        return NextResponse.json(
          { error: 'Username can only contain letters, numbers, underscores' },
          { status: 400 }
        );
      }

      const password_hash = await bcrypt.hash(password, 12);

      const { data: newUser, error } = await supabase
        .from('predictor_users')
        .insert({
          username: cleanUsername,
          display_name: displayName || username,
          favourite_team: favouriteTeam || null,
          password_hash,
        })
        .select('id, username, display_name, favourite_team, total_points, exact_scores, total_predictions')
        .single();

      if (error) {
        return NextResponse.json(
          { error: error.message }, { status: 500 }
        );
      }

      // Create session
      const token = generateToken();
      const { error: sessionError } = await supabase.from('user_sessions').insert({
        user_id: newUser.id,
        session_token: token,
      });

      if (sessionError) {
        console.error('Session creation failed:', sessionError);
      }

      return NextResponse.json({ 
        user: newUser, 
        token,
        message: 'Account created successfully!'
      });
    }

    // ── LOGIN ──────────────────────────────────────────
    if (action === 'login') {
      const { data: user } = await supabase
        .from('predictor_users')
        .select('*')
        .eq('username', cleanUsername)
        .maybeSingle();

      if (!user) {
        return NextResponse.json(
          { error: 'Username not found' },
          { status: 404 }
        );
      }

      if (!user.password_hash) {
        return NextResponse.json(
          { error: 'Account needs password setup. Please re-register.' },
          { status: 400 }
        );
      }

      const valid = await bcrypt.compare(password, user.password_hash);
      if (!valid) {
        return NextResponse.json(
          { error: 'Incorrect password' },
          { status: 401 }
        );
      }

      // Create new session
      const token = generateToken();
      const { error: sessionError } = await supabase.from('user_sessions').insert({
        user_id: user.id,
        session_token: token,
      });

      if (sessionError) {
        console.error('Session creation failed:', sessionError);
      }

      // Don't send password hash to client
      const { password_hash, ...safeUser } = user;

      return NextResponse.json({ 
        user: safeUser, 
        token,
        message: 'Welcome back!'
      });
    }

    return NextResponse.json(
      { error: 'Invalid action' }, { status: 400 }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// GET /api/user?token=xxx — verify session
export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get('token');
    if (!token) return NextResponse.json(
      { error: 'No token' }, { status: 401 }
    );

    const { data: session } = await supabase
      .from('user_sessions')
      .select('*, predictor_users(*)')
      .eq('session_token', token)
      .gt('expires_at', new Date().toISOString())
      .maybeSingle();

    if (!session || !session.predictor_users) return NextResponse.json(
      { error: 'Invalid or expired session' }, 
      { status: 401 }
    );

    const { password_hash, ...safeUser } = session.predictor_users;
    return NextResponse.json({ user: safeUser });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
