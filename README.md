# 🏆 FIFA World Cup 2026 Fan Hub

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind--CSS-3.4-blue?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-emerald?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployment-black?style=for-the-badge&logo=vercel)](https://vercel.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

An interactive, mobile-first, and highly optimized web platform designed for global football fans to track the **FIFA World Cup 2026**. Designed with dark theme aesthetics, glassmorphic UI elements, and micro-interactions.

---

## ⚡ Key Features

*   **📅 Match Schedule & Dynamic Filters**: Displays all 104 FIFA 2026 matches with date, time, group, stage, and stadium info. Supports real-time text searches and team/stage filters.
*   **🌐 Auto-Timezone Converter**: Automatically detects client timezone on load, offering a manual select dropdown (defaulting to IST, UTC+5:30) which immediately converts and shifts all match schedules.
*   **📥 Google & Apple Calendar Invites**: Zero-dependency, client-side `.ics` generator enabling fans to download and import schedules into their preferred calendar app instantly.
*   **📺 Geolocation-Smart Broadcast Routing**: Automatically determines the client's country using IP-based geolocation (`ipapi.co`) to display the correct regional streaming channel:
    *   **India**: Disney+ Hotstar
    *   **USA**: Peacock / Fubo
    *   **United Kingdom**: BBC iPlayer
    *   **Rest of World**: FIFA+
*   **🔔 Real-Time Goal Alerts**: Subscription engine allowing fans to register for immediate notifications via **Meta WhatsApp Cloud API** and **Brevo SMTP (Email)** whenever their favourite team scores.
*   **🤖 AI WhatsApp Chatbot**: Webhook integration with **Anthropic Claude 3.5 Sonnet** to answer fan questions about tournament standings, lineups, and live statistics.

---

## 🚀 Local Quick Start

This application runs out-of-the-box in **Offline Sandbox Mode** if no third-party keys are present. This allows developers and reviewers to test the entire workspace immediately.

1.  **Clone and install dependencies**:
    ```bash
    npm install
    ```
2.  **Start the local development server**:
    ```bash
    npm run dev
    ```
3.  Open **[http://localhost:3000](http://localhost:3000)** in your browser.
4.  **Simulate a Live Goal**: Navigate to **[http://localhost:3000/api/cron](http://localhost:3000/api/cron)** to trigger the background poller. It will simulate a live score event and print the WhatsApp and Email dispatch logs to the terminal.

---

## ⚙️ Configuration (.env.local)

To connect production accounts, create a `.env.local` file in your root folder:

```env
# Live Football Data API (football-data.org)
FOOTBALL_DATA_API_KEY=your_football_data_token

# Supabase Postgres Database
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key

# Meta WhatsApp Cloud API
WHATSAPP_TOKEN=your_meta_system_token
WHATSAPP_PHONE_ID=your_whatsapp_phone_number_id
WHATSAPP_VERIFY_TOKEN=fifa2026_webhook_verify

# Brevo (Sendinblue Email API)
BREVO_API_KEY=your_brevo_api_key
BREVO_SENDER_EMAIL=your_verified_sender_email@domain.com

# Anthropic Claude API
ANTHROPIC_API_KEY=your_claude_api_key

# Security key to authorize Vercel Cron requests
CRON_SECRET=your_vercel_cron_secret
```

---

## 🗄️ Database Setup

Create the following tables in the **Supabase SQL Editor**:

```sql
-- 1. Fans Subscription Database
CREATE TABLE fans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  whatsapp VARCHAR(50) NOT NULL,
  favourite_team VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Processed Events Log (prevents duplicate alerts)
CREATE TABLE processed_events (
  id VARCHAR(255) PRIMARY KEY,
  processed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Access Controls (Allows public registration requests)
GRANT ALL ON TABLE fans TO anon, authenticated, service_role;
GRANT ALL ON TABLE processed_events TO anon, authenticated, service_role;
ALTER TABLE fans DISABLE ROW LEVEL SECURITY;
ALTER TABLE processed_events DISABLE ROW LEVEL SECURITY;
```

---

## ⚡ Deployment & Hosting (Vercel)

1.  **Vercel Cron Polling (`vercel.json`)**:
    Create a `vercel.json` file in the root folder to schedule the Live Score Cron job:
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
2.  Push code to your **GitHub** repository.
3.  Import the repository into **Vercel** and add your environment variables under Project Settings.
4.  Configure the WhatsApp Webhook Callback URL in the Meta App Dashboard pointing to `https://your-site.vercel.app/api/whatsapp`.

---

## 📂 File Architecture

```
├── app/
│   ├── api/
│   │   ├── cron/         # Live score tracking background job
│   │   ├── register/     # User subscription database handler
│   │   └── whatsapp/     # WhatsApp Meta Webhook receiver
│   ├── globals.css       # Design tokens & Tailwind imports
│   ├── layout.tsx        # Shell & SEO tags
│   └── page.tsx          # Landing dashboard
├── components/
│   ├── MatchCard.tsx     # Card displays & ICS generator
│   ├── RegisterForm.tsx  # Confetti form
│   └── TimezoneSelector.tsx
├── data/
│   └── matches.json      # Fixtures list
├── lib/
│   ├── claude.ts         # Claude integration
│   ├── football-api.ts   # Score polling & Brevo email dispatch
│   ├── supabase.ts       # Database client
│   └── whatsapp.ts       # WhatsApp dispatch client
├── README.md             # Project Showcase
└── vercel.json           # Cron Scheduler Config
```
