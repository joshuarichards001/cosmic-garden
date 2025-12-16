# Cosmic Garden

A monorepo for the Cosmic Garden project, built with [Turborepo](https://turbo.build/repo) and [pnpm](https://pnpm.io/).

## Getting Started

### Prerequisites

- Node.js >= 18
- pnpm 10.19.0+

### Installation

```sh
pnpm install
```

### Development

```sh
pnpm dev
```

### Build

```sh
pnpm build
```

### Lint & Format

```sh
pnpm lint
pnpm format
```

## Project Structure

### Apps

- **`web`** – An [Astro](https://astro.build/) app with React integration and Tailwind CSS
- **`write`** – A [Vite](https://vite.dev/) + React app (using [Rolldown](https://rolldown.rs/) via rolldown-vite)

### Packages

- **`@repo/ui`** – Shared React component library with Tailwind CSS
- **`@repo/eslint-config`** – Shared ESLint configurations (base, vite-react, react-internal)
- **`@repo/typescript-config`** – Shared TypeScript configurations
- **`@repo/tailwind-config`** – Shared Tailwind CSS and PostCSS configuration

## Tech Stack

- **Monorepo** – [Turborepo](https://turbo.build/repo) for task orchestration
- **Package Manager** – [pnpm](https://pnpm.io/) workspaces
- **Styling** – [Tailwind CSS v4](https://tailwindcss.com/)
- **Type Checking** – [TypeScript](https://www.typescriptlang.org/)
- **Linting** – [ESLint](https://eslint.org/)
- **Formatting** – [Prettier](https://prettier.io) with Tailwind plugin
