# FIFA World Cup 2026 Fan Hub ⚽🏆

A premium, mobile-first, dark-themed Next.js 14 web application designed for football fans around the world to track all **104 FIFA World Cup 2026 fixtures** in their local timezone. Features include:
- **Local Timezone Converter**: Auto-detects client timezone (or defaults to IST, UTC+5:30) with manual toggle overrides.
- **Add to Calendar**: Generates offline `.ics` files client-side.
- **WhatsApp Share**: Dynamic match metadata pre-populated in sharing links.
- **Watch Live Routing**: Automatically detects user's country via IP geolocation (`ip-api.com`) to route them to the correct regional broadcaster (Disney+ Hotstar for India, Peacock/Fubo for USA, BBC iPlayer for UK, and FIFA+ for rest of the world).
- **Fan Goal Alerts**: Automated WhatsApp (`Meta WhatsApp Cloud API`) & Email (`Brevo`) alert notifications sent whenever their favourite team scores.
- **Vercel Cron Live Polling**: A secure cron job that polls `football-data.org` every 30 seconds for live events and triggers alerts, avoiding duplicate notifications using a Supabase Postgres event log.
- **Claude-Powered Chatbot Skeleton**: WhatsApp webhook routing user replies directly to Claude AI for friendly World Cup answers.

---

## 🚀 Quick Start (Local Demo Mode)

The website is engineered to run out-of-the-box **without any API keys** configured! If environment variables are missing, the app operates in **Offline Demo Mode**:
- Fixtures are seeded from `/data/matches.json` (all 104 matches!).
- Geolocation falls back gracefully.
- Fan registration runs locally and saves to simulated states.
- The Cron endpoint (`/api/cron`) simulates a live goal event (e.g., USA vs Colombia) and logs mock WhatsApp and email dispatch reports.

### Local Development Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. Open **[http://localhost:3000](http://localhost:3000)** in your browser to view the premium layout.
4. **Trigger a mock goal alert**: Open **[http://localhost:3000/api/cron](http://localhost:3000/api/cron)**. If the current local minute is odd, it will instantly simulate a live goal, lookup mock fans, and output a full alert dispatch report.

---

## ⚙️ Environment Variables Setup

For full production integration, create a `.env.local` file in the root directory and add the following keys:

```env
# Live Football Data API (Free Tier)
# Get a key at: https://www.football-data.org/
FOOTBALL_DATA_API_KEY=your_football_data_key

# Supabase (Postgres Free Tier)
# Create a free DB at: https://supabase.com/
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_jwt_key

# Meta WhatsApp Cloud API
# Set up a WhatsApp Business App at: https://developers.facebook.com/
WHATSAPP_TOKEN=your_meta_permanent_access_token
WHATSAPP_PHONE_ID=your_whatsapp_business_phone_number_id
WHATSAPP_VERIFY_TOKEN=fifa2026_webhook_verify # Match this in Meta Developer Portal webhook setup

# Brevo (Free Email API)
# Get a free account and key at: https://brevo.com/
BREVO_API_KEY=your_brevo_smtp_api_key

# Anthropic Claude API (Chatbot)
# Get a key at: https://console.anthropic.com/
ANTHROPIC_API_KEY=your_anthropic_api_key

# Vercel Cron Security Key
# Any random string of your choice to protect the polling endpoint
CRON_SECRET=your_vercel_cron_secret_string
```

---

## 🗄️ Supabase Postgres Schema Setup

If connecting to a live Supabase database, run the following queries in the **Supabase SQL Editor** to create the required tables:

### 1. Fans Registration Table
```sql
CREATE TABLE fans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  whatsapp VARCHAR(50) NOT NULL,
  favourite_team VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 2. Processed Events Log (Avoids duplicate goal alerts)
```sql
CREATE TABLE processed_events (
  id VARCHAR(255) PRIMARY KEY,
  processed_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## ⚡ Webhook & Cron Scheduling on Vercel

### 1. Vercel Cron Configuration (`vercel.json`)
Create a `vercel.json` file in your root folder to direct Vercel to trigger the live score poller every 1 minute during active match windows:
```json
{
  "crons": [
    {
      "path": "/api/cron",
      "schedule": "*/1 * * * *"
    }
  ]
}
```
*Note: In your Vercel deployment settings, add the `CRON_SECRET` environment variable. Vercel automatically forwards a `Authorization: Bearer <CRON_SECRET>` header to secure the endpoint.*

### 2. WhatsApp Webhook Configuration
To configure the AI chatbot:
1. In the **Meta App Dashboard**, go to **WhatsApp > Configuration**.
2. Under **Webhook**, click **Edit**.
3. Set the **Callback URL** to: `https://yoursite.vercel.app/api/whatsapp`.
4. Set the **Verify Token** to your `WHATSAPP_VERIFY_TOKEN` (default: `fifa2026_webhook_verify`).
5. Click **Verify and Save**.
6. Subscribe to **messages** webhook fields under webhook event tables.

---

## 🏆 Project Folder Structure
```
/app
  /api
    /cron
      route.ts       <- Goal poller cron job
    /register
      route.ts       <- Fan signup handler
    /whatsapp
      route.ts       <- Meta incoming webhook (GET/POST)
  layout.tsx         <- SEO metadata & main font wrappers
  page.tsx           <- Landing page with filters, search, & grids
/components
  MatchCard.tsx      <- Game fixture display, ICS generator, share features
  RegisterForm.tsx   <- Confetti-integrated fan registration form
  TimezoneSelector.tsx <- Hydration-safe client-side timezone switcher
/data
  matches.json       <- Seeded schedules of all 104 matches
/lib
  supabase.ts        <- Supabase connection interface
  whatsapp.ts        <- Meta WhatsApp message dispatcher
  football-api.ts    <- football-data.org connector + Brevo mail sender
  claude.ts          <- Anthropic messages client helper
```
