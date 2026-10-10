# ⚽ Football Atlas — FIFA World Cup 2026 Fan Hub

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-emerald?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?style=for-the-badge&logo=vercel)](https://vercel.com/)

**Football Atlas** is a full-stack, real-time football fan platform built during the live **FIFA World Cup 2026** tournament. It served as a complete fan hub covering all 104 matches across the USA, Canada and Mexico — from opening day (June 11) through to Spain's final victory over Argentina on July 19, 2026.

🔗 **Live Site:** [world-cup-fan-site.vercel.app](https://world-cup-fan-site.vercel.app)

---

## 🏆 Tournament Result

**Spain 🇪🇸 are FIFA World Cup 2026 Champions**
Spain 1–0 Argentina (AET) · MetLife Stadium · July 19, 2026

**Golden Boot:** Kylian Mbappé 🇫🇷 — 10 goals
(First player ever to win consecutive World Cup Golden Boots)

---

## ✨ Features

### 📅 Complete Match Archive
- All 104 fixtures with final scores, venues, dates and stages
- Group stage, Round of 32, Round of 16, Quarter Finals, Semi Finals and Final
- Results updated statically post-tournament for permanent accuracy
- Timezone-aware kickoff times (auto-detects local timezone)
- Add to Calendar (.ics) export for any fixture

### 📊 Final Group Standings
- Complete final tables for all 12 groups (A through L)
- P / W / D / L / GD / PTS for every team
- Country flags via FlagCDN
- Green highlight for qualified teams

### 🏆 Interactive Knockout Bracket
- Full visual converging tree from Round of 32 to the Final
- Penalty shootout results displayed
- AET (after extra time) indicators
- Spain highlighted as World Champions 2026
- Horizontally scrollable on mobile

### 🎯 Score Predictor & Leaderboard
- Fans predicted scores before each match kicked off
- Points system: 3pts for exact score, 1pt for correct result
- Global leaderboard with rankings
- Full auth system (bcrypt passwords, session tokens)
- Auto-scored against real results via cron job

### 🔔 Live Goal Alerts
- Email notifications via Brevo SMTP
- WhatsApp alerts via Meta WhatsApp Cloud API
- Fans register with name, email, WhatsApp and favourite team
- Deduplication system prevents duplicate alerts per goal event
- Ran live during the tournament — alerts fired within minutes of goals

### 🗞️ Live News Feed
- Multi-source RSS aggregation (Google News, BBC Sport, ESPN, Guardian, Al Jazeera)
- Supabase caching layer (30-minute refresh cycle)
- Topic filters: Match Reports, Squads & Transfers, Injuries, Players, Analysis
- og:image scraping for articles missing RSS thumbnails
- Still active post-tournament for ongoing football news

### 🗳️ Fan Poll
- "Who Lifts the Trophy?" poll ran during tournament
- Real vote counts stored in Supabase
- IP-based deduplication (one vote per user)
- Top 4 teams displayed as animated fill bars
- 239 fans voted during the tournament

### ⭐ Match Ratings
- Fans rate finished matches 1–5 stars
- Live average score displayed per match
- "CLASSIC" badge for matches rated 4.5+
- One rating per IP per match

### 💪 Player Hype
- Fans hype their favourite Golden Boot contender
- Real-time counts from Supabase
- One hype per user total

### 📜 Legal
- Privacy Policy, Terms of Use, Disclaimer
- Contact email for data deletion requests
- Fan creation disclaimer (not affiliated with FIFA)

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Inline CSS-in-JS (no Tailwind in production) |
| Database | Supabase (PostgreSQL) |
| Auth | Custom bcrypt + session tokens |
| Email | Brevo SMTP API |
| WhatsApp | Meta WhatsApp Cloud API |
| Match Data | football-data.org API (cached) |
| News | Multi-source RSS + Supabase cache |
| Flags | FlagCDN (free, no API key) |
| Fonts | Bebas Neue + Inter (Google Fonts) |
| Hosting | Vercel (Hobby plan) |
| Cron Jobs | cron-job.org (external, free) |

---

## 🏗️ Architecture Decisions

### Cached Data Layer
football-data.org's free tier allows only 10 requests/minute. Rather than calling it directly from every page load, a dedicated `/api/cron/refresh-scores` endpoint fetches all 104 match states every 5 minutes and writes them to a `live_scores` Supabase table. All other features read from this cache — meaning the API is called once per 5 minutes regardless of site traffic.

This was built after the API key was banned twice for rate limit abuse caused by direct calls from page components and cron jobs.

### Static-First with Live Overlay
`matches.json` is the static backbone — it contains all 104 matches with venues, groups, stages and team names. The live cache overlays scores and status on top. Post-tournament, scores are hardcoded directly into matches.json for permanent correctness with zero API dependency.

### External Crons on Vercel Hobby
Vercel's Hobby plan doesn't support frequent cron jobs. Four external crons on cron-job.org handle: live score refresh (every 5 min), goal alert dispatch (every 3 min), prediction scoring (every 15 min), and news cache refresh (every 30 min).

### News Without Rate Limits
GNews API's free tier has a 100 requests/day limit and 12-hour news delay. Replaced with direct RSS parsing from Google News, BBC Sport, ESPN and Guardian — unlimited, free, and near real-time. Results cached in Supabase for 30 minutes.

---

## 📂 Project Structure

├── app/
│ ├── page.tsx # Homepage (hero, standings, poll, news, features)
│ ├── schedule/page.tsx # 104-match schedule with bracket tab
│ ├── bracket/page.tsx # Visual knockout bracket tree
│ ├── predict/page.tsx # Score predictor with stadium hero
│ ├── leaderboard/page.tsx # Global prediction rankings
│ ├── news/page.tsx # News hub with topic filters
│ ├── about/page.tsx # Records, Golden Boot, tournament facts
│ ├── alerts/page.tsx # Goal alert registration
│ ├── legal/page.tsx # Privacy, Terms, Disclaimer
│ ├── match/[id]/page.tsx # Individual match stats (104 dynamic pages)
│ └── api/
│ ├── matches/ # Merged static + live data endpoint
│ ├── standings/ # Computed from live_scores cache
│ ├── bracket/ # Knockout bracket from cache
│ ├── news/ # News articles from cache
│ ├── poll/ # Fan poll votes
│ ├── hype/ # Player hype counts
│ ├── rate-match/ # Match ratings
│ ├── predict/ # Prediction CRUD
│ ├── leaderboard/ # Rankings endpoint
│ ├── user/ # Auth (login/register)
│ └── cron/
│ ├── refresh-scores/ # Live score cache warmer
│ ├── refresh-news/ # News cache warmer
│ ├── goal-alerts/ # Alert dispatcher
│ └── score-predictions/ # Auto-scorer
├── components/
│ ├── MatchCard.tsx # Match card with score, flags, actions
│ ├── FanPoll.tsx # Voting widget
│ ├── MatchRating.tsx # Star rating widget
│ ├── NewsStrip.tsx # Homepage news ticker
│ └── RegisterForm.tsx # Alert signup form
├── lib/
│ ├── live-scores.ts # Cache refresh logic
│ ├── static-standings.ts # Final group standings data
│ ├── team-codes.ts # Country → flag code mapping
│ ├── news.ts # RSS parsing
│ ├── news-cache.ts # Supabase news cache layer
│ └── supabase.ts # DB client
└── data/
└── matches.json # All 104 matches with final scores


---

## 🗄️ Database Tables

| Table | Purpose |
|---|---|
| `fans` | Alert registrations (name, email, WhatsApp, team) |
| `predictor_users` | Prediction game accounts |
| `predictions` | All submitted score predictions |
| `user_sessions` | Auth session tokens |
| `live_scores` | Cached match scores (refreshed every 5 min) |
| `news_cache` | Cached news articles (refreshed every 30 min) |
| `fan_poll_votes` | Who Lifts the Trophy poll votes |
| `match_ratings` | 1-5 star match ratings |
| `player_hype` | Golden Boot player hype counts |
| `processed_events` | Deduplication log for goal alerts |
| `bracket_matches` | Knockout bracket cache |
| `top_scorers` | Golden Boot standings cache |

All tables have Row Level Security enabled.

---

## ⚙️ Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_KEY=

# football-data.org
FOOTBALL_DATA_API_KEY=

# Brevo (email)
BREVO_API_KEY=
BREVO_SENDER_EMAIL=

# Meta WhatsApp
WHATSAPP_TOKEN=
WHATSAPP_PHONE_ID=

# News
GNEWS_API_KEY=

# Cron security
CRON_SECRET=
```

---

## 🚀 Local Setup

```bash
git clone https://github.com/ishaann24/football-atlas.git
cd football-atlas
npm install
# Create .env.local with variables above
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🔧 Real Problems Solved

**Rate limit bans** — football-data.org banned the API key twice. Root cause: Next.js was pre-rendering all 104 match pages at build time (208 simultaneous API calls), plus multiple cron jobs calling the API directly. Fixed by adding `export const dynamic = 'force-dynamic'` to match pages and routing all data through a single cached layer.

**Goal alert spam** — 350+ duplicate emails sent to registered fans. Caused by missing `event_id` column on `processed_events` table (Supabase GRANT issue, not RLS) combined with 0-0 match states triggering alerts. Fixed with proper deduplication and a "skip if no goals scored" check.

**Fake goal scorers** — "Raphinha" and "Mbappé" appeared as scorers on every single match. A `mockGoals` placeholder array from early development was never removed. Fixed by deleting the array and using real API data with an honest fallback.

**Cron silent failures** — cron-job.org showed green status while database wasn't updating. The refresh endpoint returned HTTP 200 even when 0 matches were refreshed. Fixed by returning HTTP 503 when refresh count is 0, so cron-job.org logs a visible failure.

**Build-time API storms** — `generateStaticParams()` in the match page caused Next.js to pre-render all 104 pages at build time, triggering 208 API calls in seconds. Removed and replaced with `force-dynamic`.

---

## 📜 Disclaimer

Independent fan project. Not affiliated with, endorsed by, or sponsored by FIFA or any football federation. All match data sourced from public APIs and verified against official results post-tournament.

---

## 📄 License

MIT — free to use and adapt for fan platforms.

---

*Built by [Ishan Shrivastava](https://github.com/ishaann24) · Student at VIT · June–July 2026*
