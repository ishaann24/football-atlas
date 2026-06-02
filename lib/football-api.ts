export interface GoalEvent {
  id: string; // Unique ID for this goal event to prevent duplicates
  matchId: number;
  homeTeam: string;
  awayTeam: string;
  scoringTeam: string;
  opponentTeam: string;
  scorer: string;
  minute: number;
  score: string;
}

// Fetch live match events from football-data.org (or mock simulation)
export async function getLiveMatchGoals(): Promise<GoalEvent[]> {
  const apiKey = process.env.FOOTBALL_DATA_API_KEY;

  // Mock Simulation if API key is not present or in local development
  if (!apiKey || apiKey === 'mock' || process.env.NODE_ENV === 'development') {
    // Return a mock live goal event for testing purposes
    // We will alternate goals between teams or use minutes to simulate progress
    const now = new Date();
    const currentMinute = now.getMinutes();

    const matchId = 101; // Mock Semifinal
    const homeTeam = 'USA';
    const awayTeam = 'Colombia';
    // Use seconds or timestamps to ensure unique goal ID for every hit
    const scoringTeam = currentMinute % 2 === 0 ? homeTeam : awayTeam;
    const opponentTeam = scoringTeam === homeTeam ? awayTeam : homeTeam;
    const scorer = scoringTeam === homeTeam ? 'Christian Pulisic' : 'Luis Díaz';
    const minute = 45 + (currentMinute % 45);
    const score = scoringTeam === homeTeam ? '1-0' : '1-1';
    const uniqueId = `mock_${matchId}_goal_${minute}_${Date.now()}`;

    return [
      {
        id: uniqueId,
        matchId,
        homeTeam,
        awayTeam,
        scoringTeam,
        opponentTeam,
        scorer,
        minute,
        score,
      },
    ];
  }

  try {
    const res = await fetch('https://api.football-data.org/v4/matches?status=LIVE', {
      headers: {
        'X-Auth-Token': apiKey,
      },
      next: { revalidate: 15 }, // Cache for 15 seconds
    });

    if (!res.ok) {
      console.error('football-data.org API error:', await res.text());
      return [];
    }

    const data = await res.json();
    const matches = data.matches || [];
    const goals: GoalEvent[] = [];

    matches.forEach((match: any) => {
      // football-data.org matches live scores structures
      const matchId = match.id;
      const homeTeam = match.homeTeam.name;
      const awayTeam = match.awayTeam.name;
      const currentScore = `${match.score?.fullTime?.home ?? 0}-${match.score?.fullTime?.away ?? 0}`;
      const minute = match.minute || 0;

      // Extract goals if provided by the api
      if (match.goals && Array.isArray(match.goals)) {
        match.goals.forEach((goal: any, index: number) => {
          const scoringTeam = goal.team?.name || '';
          const opponentTeam = scoringTeam === homeTeam ? awayTeam : homeTeam;
          const scorer = goal.scorer?.name || 'Unknown Player';
          const goalMinute = goal.minute || minute;
          const goalId = goal.id ? String(goal.id) : `${matchId}_goal_${goalMinute}_${index}`;

          goals.push({
            id: goalId,
            matchId,
            homeTeam,
            awayTeam,
            scoringTeam,
            opponentTeam,
            scorer,
            minute: goalMinute,
            score: currentScore,
          });
        });
      }
    });

    return goals;
  } catch (error) {
    console.error('Error fetching live matches from API:', error);
    return [];
  }
}

// Brevo Email Alert Utility
export async function sendEmailAlert(
  toEmail: string,
  toName: string,
  subject: string,
  textContent: string,
  htmlContent: string
): Promise<boolean> {
  const brevoKey = process.env.BREVO_API_KEY;

  if (!brevoKey) {
    console.warn('Brevo API key is missing! Cannot send email to', toEmail, 'content:', textContent);
    return true; // Simulate success in local dev
  }

  try {
    console.log(`[Brevo] Sending email to ${toEmail}...`);
    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': brevoKey,
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify({
        sender: {
          name: 'FIFA 2026 Fan Club',
          email: process.env.BREVO_SENDER_EMAIL || 'alerts@yoursite.vercel.app',
        },
        to: [{ email: toEmail, name: toName }],
        subject: subject,
        textContent: textContent,
        htmlContent: htmlContent,
      }),
    });

    const data = await res.json();
    console.log(`[Brevo] Response status: ${res.status}`, data);
    if (!res.ok) {
      console.error('Brevo API error:', data);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error sending Brevo email:', error);
    return false;
  }
}
