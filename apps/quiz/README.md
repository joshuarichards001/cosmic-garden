# Daily Quiz App

A daily trivia quiz application where users answer 10 questions per day, track their scores, and view historical performance.

## Tech Stack

- **Framework**: Astro 5 with `@astrojs/react` integration
- **Backend**: Supabase (Database, Auth, Edge Functions)
- **Styling**: Tailwind CSS v4 via `@repo/tailwind-config`
- **Deployment**: Cloudflare Workers

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 10+
- Supabase CLI (for local development)

### Environment Variables

Copy `.env.example` to `.env` and fill in your Supabase credentials:

```bash
cp .env.example .env
```

Required variables:
- `PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key (server-side only)
- `PUBLIC_APP_URL` - Your app's public URL

### Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)

2. Run the database migration:
   ```bash
   # Using Supabase CLI
   supabase db push
   
   # Or manually run the SQL in supabase/migrations/001_initial_schema.sql
   ```

3. Enable Google OAuth in Supabase Dashboard:
   - Go to Authentication > Providers > Google
   - Add your Google OAuth credentials
   - Set redirect URL to `https://your-project.supabase.co/auth/v1/callback`

4. Deploy the edge function:
   ```bash
   supabase functions deploy fetch-daily-quiz
   ```

5. Set up the cron job for daily quiz generation:
   - In Supabase Dashboard, go to Database > Extensions and enable `pg_cron`
   - Create a cron job to call the edge function daily at midnight UTC

### Development

```bash
# From the monorepo root
pnpm install
pnpm dev --filter quiz

# Or from this directory
pnpm dev
```

The app will be available at `http://localhost:4321`

### Building

```bash
pnpm build
```

### Deployment

The app is configured for Cloudflare Workers deployment:

```bash
pnpm deploy
```

## Features

- **Daily Quiz**: 10 questions per day (3 easy, 4 medium, 3 hard)
- **Anonymous Play**: Play without signing in
- **Score Tracking**: Sign in with Google to save scores
- **Quiz History**: Browse and play past quizzes
- **Share Results**: Share your score with emoji representation
- **Mobile-First**: Optimized for mobile with dark theme

## Project Structure

```
apps/quiz/
├── src/
│   ├── components/     # React and Astro components
│   ├── layouts/        # Page layouts
│   ├── lib/            # Utilities and Supabase client
│   ├── pages/          # Astro pages and routes
│   └── styles/         # Global styles
├── supabase/
│   ├── functions/      # Edge functions
│   └── migrations/     # Database migrations
└── public/             # Static assets
```

## API

The app uses [The Trivia API](https://the-trivia-api.com/) for quiz questions.
