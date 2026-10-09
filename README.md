# 🏆 FIFA World Cup 2026 Fan Hub

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind--CSS-3.4-blue?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-emerald?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployment-black?style=for-the-badge&logo=vercel)](https://vercel.com/)

An interactive, high-performance, dark-themed fan web application for the **FIFA World Cup 2026**. Built with Next.js (App Router), TypeScript, and glassmorphic UI design, this platform provides complete coverage for all **104 tournament matches**, full group stage standings, an interactive knockout bracket, score prediction engine, fan polls, timezone converter, and broadcast links.

---

## ✨ Key Features

- **🏆 Complete Tournament & Knockout Bracket**: Visual converging tree displaying the entire Road to Glory from the Round of 32 down to the July 19 Final at MetLife Stadium, highlighting **Spain 🏆 as 2026 World Champions**.
- **📅 Full 104 Match Schedule**: Detailed schedule with scores, stage info, venues, search filters, and team selectors.
- **📊 Static Final Group Standings**: Complete final group tables for all 12 groups (Groups A through L) with country flags, P/W/D/L/GD/PTS metrics, and green qualification indicators.
- **🌐 Dynamic Timezone Converter**: Client-side timezone detector with manual timezone selector (defaulting to client timezone) that instantly adjusts all kickoff times.
- **📥 Client-Side Calendar Invites (.ics)**: Zero-dependency `.ics` file generator allowing fans to export fixture dates directly to Google Calendar, Apple Calendar, or Outlook.
- **🎯 Score Predictor & Leaderboard**: Community prediction system allowing fans to submit match predictions, accumulate points, and view global rankings.
- **🗳️ Interactive Fan Polls & ⭐ Match Ratings**: Live polling system for match predictions and 5-star match rating feedback for classic fixtures.
- **📺 Geolocation-Smart Streaming Links**: IP-based country detection (`ipapi.co`) automatically directing fans to their local broadcaster:
  - 🇮🇳 **India**: Disney+ Hotstar
  - 🇺🇸 **USA**: Peacock / Fubo
  - 🇬🇧 **United Kingdom**: BBC iPlayer
  - 🌐 **Rest of World**: FIFA+
- **🔔 WhatsApp & Email Alert System**: Subscription engine integrated with **Meta WhatsApp Cloud API** and **Brevo SMTP** for instant goal notification dispatching.
- **💬 AI WhatsApp Chatbot**: Automated assistant powered by **Anthropic Claude 3.5 Sonnet** for answering fan queries on stats and tournament info.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, Server Components & API Routes)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: Vanilla CSS + [Tailwind CSS](https://tailwindcss.com/) (Glassmorphism & Dark Mode)
- **State & UI Icons**: Lucide React, Custom SVG icons, FlagCDN integration
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **AI & Messaging**: Meta WhatsApp Cloud API, Brevo SMTP Email, Anthropic Claude API
- **Deployment**: [Vercel](https://vercel.com/)

---

## 📂 Project Architecture

```
PROJECT-1 AG/
├── app/
│   ├── page.tsx               # Homepage Dashboard (Hero, TodaysMatches, Standings, Features)
│   ├── schedule/
│   │   └── page.tsx           # Full 104 Fixtures Directory & Bracket Tab
│   ├── bracket/
│   │   └── page.tsx           # Interactive Converging Knockout Bracket Page
│   ├── predict/
│   │   └── page.tsx           # Match Score Predictor
│   ├── leaderboard/
│   │   └── page.tsx           # Global Predictions Leaderboard
│   ├── news/
│   │   └── page.tsx           # World Cup News Hub
│   ├── about/
│   │   └── page.tsx           # Tournament Facts & Golden Boot Contenders
│   ├── alerts/
│   │   └── page.tsx           # WhatsApp & Email Subscription Page
│   ├── legal/
│   │   └── page.tsx           # Privacy Policy & Terms
│   ├── match/[id]/
│   │   └── page.tsx           # Match Detail & Rating View
│   └── api/
│       ├── matches/           # Static matches API route
│       ├── standings/         # Group standings API route
│       ├── bracket/           # Knockout bracket API route
│       ├── register/          # User subscription endpoint
│       ├── whatsapp/          # Meta WhatsApp Webhook receiver
│       └── cron/              # Live score polling & notification cron job
├── components/
│   ├── MatchCard.tsx          # Card view with .ics calendar generator & streaming links
│   ├── RegisterForm.tsx       # User alert sign-up form with confetti animation
│   ├── FanPoll.tsx            # Community polling widget
│   ├── MatchRating.tsx        # Star-rating widget for finished matches
│   ├── TimezoneSelector.tsx   # Timezone selection dropdown
│   └── NewsStrip.tsx          # Tournament news ticker
├── data/
│   └── matches.json           # Master dataset for all 104 match results
├── lib/
│   ├── static-standings.ts    # Final group stage standings dataset (Groups A-L)
│   ├── team-codes.ts          # Country code mappings for flagcdn.com
│   ├── live-scores.ts         # Live data helper routines
│   ├── supabase.ts            # Supabase database client
│   ├── whatsapp.ts            # WhatsApp message dispatcher
│   └── claude.ts              # Anthropic Claude API client
├── scripts/
│   └── update-matches.js      # Match dataset processing script
├── README.md                  # Project Documentation
└── vercel.json                # Vercel Cron Configuration
```

---

## 🚀 Local Setup & Quick Start

### Prerequisites
- **Node.js** v18.0.0 or higher
- **npm** or **yarn**

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/fifa-world-cup-2026-fan-hub.git
   cd fifa-world-cup-2026-fan-hub
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. Open **[http://localhost:3000](http://localhost:3000)** in your browser.

5. **Build for Production**:
   ```bash
   npm run build
   ```

---

## ⚙️ Environment Configuration (`.env.local`)

To enable database storage, WhatsApp goal dispatches, or AI chatbot features, create a `.env.local` file in the root directory:

```env
# Football Data API Key (Optional for live updates)
FOOTBALL_DATA_API_KEY=your_football_data_api_key

# Supabase Connection
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_role_key

# Meta WhatsApp Cloud API Configuration
WHATSAPP_TOKEN=your_meta_system_access_token
WHATSAPP_PHONE_ID=your_whatsapp_phone_number_id
WHATSAPP_VERIFY_TOKEN=fifa2026_webhook_verify

# Brevo (Sendinblue) Email SMTP API
BREVO_API_KEY=your_brevo_api_key
BREVO_SENDER_EMAIL=your_verified_sender_email@domain.com

# Anthropic Claude API
ANTHROPIC_API_KEY=your_claude_api_key

# Cron Job Secret
CRON_SECRET=your_vercel_cron_secret
```

---

## 🗄️ Database Schema (Supabase SQL)

To configure the Postgres database in your Supabase SQL Editor:

```sql
-- 1. Fans Subscription Table
CREATE TABLE fans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  whatsapp VARCHAR(50) NOT NULL,
  favourite_team VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Processed Events Log (Prevents duplicate alert dispatches)
CREATE TABLE processed_events (
  id VARCHAR(255) PRIMARY KEY,
  processed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Live Scores Cache
CREATE TABLE live_scores (
  api_id INT PRIMARY KEY,
  status VARCHAR(50),
  home_score INT,
  away_score INT,
  minute INT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enable Public Access for Anon API Requests
GRANT ALL ON TABLE fans TO anon, authenticated, service_role;
GRANT ALL ON TABLE processed_events TO anon, authenticated, service_role;
GRANT ALL ON TABLE live_scores TO anon, authenticated, service_role;
ALTER TABLE fans DISABLE ROW LEVEL SECURITY;
ALTER TABLE processed_events DISABLE ROW LEVEL SECURITY;
ALTER TABLE live_scores DISABLE ROW LEVEL SECURITY;
```

---

## 🌐 Deployment (Vercel)

1. Push the code to your **GitHub** repository.
2. Connect the repository to **[Vercel](https://vercel.com)**.
3. Set your Environment Variables under **Project Settings → Environment Variables**.
4. Deploy! Next.js will automatically generate static routes and serverless API handlers.

---

## 📜 Disclaimer & License

- **Disclaimer**: This is an independent open-source fan creation for football enthusiasts. It is not affiliated with, endorsed by, or sponsored by FIFA.
- **License**: [MIT License](LICENSE) — feel free to use and customize for fan platforms!
