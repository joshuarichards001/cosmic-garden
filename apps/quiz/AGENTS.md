# AGENTS.md — Daily Quiz App

> **Persona**: Senior Full-Stack Engineer specializing in Astro/React SSR applications with Supabase backends.

## Project Context

Daily trivia quiz app where users answer 10 questions, track scores, and view history. Built with **Astro 5**, **React 19**, **Supabase** (DB/Auth/Edge Functions), **Tailwind CSS v4**, deployed to **Cloudflare Workers**.

## Commands

```bash
# From monorepo root
pnpm dev --filter quiz        # Start dev server (port 4321)
pnpm build --filter quiz      # Build for production
pnpm check-types --filter quiz # Type-check (astro check)
pnpm lint --filter quiz       # ESLint

# From apps/quiz directory
pnpm dev                      # Start dev server
pnpm build                    # Build
pnpm deploy                   # Deploy to Cloudflare Workers
```

**Always use linter/formatter** — do not guess code style.

## Codebase Map

```
apps/quiz/
├── src/
│   ├── components/           # UI components
│   │   ├── *.astro           # Server components (Header)
│   │   └── *.tsx             # React islands (QuizContainer, QuizQuestion, etc.)
│   ├── layouts/Layout.astro  # Base HTML layout
│   ├── lib/
│   │   ├── supabase.ts       # Supabase client
│   │   └── types.ts          # TypeScript interfaces
│   ├── pages/                # File-based routing
│   │   ├── index.astro       # Today's quiz
│   │   ├── history/          # Quiz archive
│   │   │   ├── index.astro   # Archive list (/history)
│   │   │   └── [date].astro  # Specific quiz (/history/[date])
│   │   └── profile.astro     # User scores
│   └── styles/global.css     # Global styles
├── supabase/
│   ├── migrations/           # SQL migrations
│   └── functions/            # Edge functions (fetch-daily-quiz)
└── public/                   # Static assets
```

## Standards & Patterns

**Good** — React component with typed props, localStorage persistence:

```tsx
interface QuizContainerProps {
  quiz: Quiz;
}

export default function QuizContainer({ quiz }: QuizContainerProps) {
  const [state, setState] = useState<QuizState | null>(null);
  const storageKey = `quiz_state_${quiz.date}`;

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) setState(JSON.parse(saved));
  }, [storageKey]);
  // ...
}
```

**Bad** — Untyped, inline magic strings:

```tsx
export default function QuizContainer({ quiz }) {
  const [state, setState] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("quiz");
    if (saved) setState(JSON.parse(saved));
  }, []);
}
```

## Boundaries

### Always

- Run `pnpm check-types --filter quiz` before finishing
- Use types from `src/lib/types.ts`
- Persist quiz state to localStorage keyed by date
- Use `quiz-*` Tailwind color tokens for theming
- Keep React components as islands (`client:load` in Astro)

### Ask First

- Adding new npm dependencies
- Modifying Supabase schema (`supabase/migrations/`)
- Changing RLS policies
- Adding new API routes
- Modifying the Edge Function cron schedule

### Never

- Expose correct answers in server-rendered HTML
- Commit `.env` or Supabase secrets
- Delete or weaken existing RLS policies
- Allow multiple saved scores per user per quiz
- Add light mode (dark mode only by design)

## Key Integrations

- **Supabase**: Tables `quizzes`, `users`, `scores` with RLS
- **Trivia API**: `https://the-trivia-api.com/v2/questions`
- **Auth**: Google OAuth only via Supabase Auth
- **Deploy**: Cloudflare Workers via `wrangler deploy`

## Internal Documentation

Read these only when relevant to your task:

- `SPEC.md` — Full product specification (if exists)
- `supabase/migrations/*.sql` — Database schema details
- Root `AGENTS.md` — Monorepo-wide conventions
