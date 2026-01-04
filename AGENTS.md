# AGENTS.md

Guidelines for AI agents working on the Cosmic Garden codebase.

## Project Overview

Cosmic Garden is a pnpm monorepo managed by Turborepo containing multiple apps and shared packages.

## Repository Structure

```
cosmic-garden/
├── apps/
│   ├── web/          # Astro + React website with Cosmic Garden content
│   └── write/        # Vite + React (rolldown-vite) writing app
├── packages/
│   ├── ui/           # Shared React component library (@repo/ui)
│   ├── eslint-config/    # Shared ESLint configs (@repo/eslint-config)
│   ├── typescript-config/ # Shared tsconfig (@repo/typescript-config)
│   └── tailwind-config/  # Shared Tailwind/PostCSS config (@repo/tailwind-config)
├── turbo.json        # Turborepo task configuration
├── pnpm-workspace.yaml
└── package.json
```

## Commands

Run all commands from the repository root:

- `pnpm install` – Install dependencies
- `pnpm dev` – Start all apps in development mode
- `pnpm build` – Build all apps and packages
- `pnpm lint` – Lint all packages
- `pnpm check-types` – Type-check all packages
- `pnpm format` – Format code with Prettier

## Key Technologies

- **Package Manager**: pnpm 10.19.0+ with workspaces
- **Build Orchestration**: Turborepo
- **Styling**: Tailwind CSS v4
- **Type System**: TypeScript 5.9+
- **Linting**: ESLint 9 (flat config)
- **Formatting**: Prettier with tailwindcss plugin

## App-Specific Notes

### `apps/web` (Astro)

- Uses Astro 5 with `@astrojs/react` integration
- Type checking via `astro check`
- Deployed to Cloudflare Workers
- Media files stored on Cloudflare R2
- **Content**: Personal feed with posts collection (`src/content/posts/`)
  - Post types: `note`, `photo`, `audio`, `video`
  - Schema: `type`, `date`, `title?`, `location?`, `media[]?`, `tags[]?`
- **Components**: `src/components/` — `Post.astro` (wrapper), `NotePost.astro`, `PhotoPost.astro`, `AudioPost.astro`, `VideoPost.astro`
- **Pages**: `/posts/` (feed index), `/posts/[slug]/` (individual post)
- **RSS**: `/posts.xml`

### `apps/write` (Vite + React)

- Uses `rolldown-vite` (Rolldown-powered Vite) for bundling
- React 19
- Standard Vite project structure
- Deployed to Vercel

## Package Guidelines

### `@repo/ui`

- Shared React components consumed by apps
- Exports compiled styles via `./styles.css`
- Components exported individually (e.g., `@repo/ui/card`)
- Uses `ui-` prefix for Tailwind classes to avoid conflicts

### `@repo/eslint-config`

Exports three configurations:
- `@repo/eslint-config/base` – Base TypeScript config
- `@repo/eslint-config/vite-react` – For Vite React apps
- `@repo/eslint-config/react-internal` – For internal React packages

### `@repo/tailwind-config`

- Exports shared styles via main entry
- PostCSS config available at `@repo/tailwind-config/postcss`

## Code Style

- All code is TypeScript
- Use ESLint and Prettier configurations from shared packages
- Follow existing patterns in each app/package
- Keep imports at the top of files
- Prefer workspace dependencies (`workspace:*`) for internal packages

## Adding Dependencies

- Add shared dev dependencies to root `package.json`
- Add app/package-specific dependencies to their respective `package.json`
- Use `pnpm add <package> --filter <app-or-package>` to add to specific workspace
