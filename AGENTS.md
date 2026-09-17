# Repository Guidelines

## Project Overview

Global minimum-wage purchasing-power visualization website. Displays 13 countries' minimum wages converted to CNY-equivalent hourly rates. Built from `@trapar-waves/react-tailwind` template.

- **Package**: `@trapar-waves/react-tailwind` v2.0.0
- **License**: MIT (Trapar waves, 2025)

## Architecture & Data Flow

Single-page React app with client-side routing and static data.

```
src/index.tsx  →  src/app.tsx  →  <RouterProvider router={router} />
                                        │
                                  src/router.tsx (TanStack Router)
                                        │
                              src/routes/__root.tsx  →  <Layout>
                                        │
                         ┌──────────────┼──────────────┐
                    index.tsx      explore.tsx      about.tsx
                         │              │              │
                    pages/home     pages/explore   pages/about
                         │              │              │
                   ┌─────┴─────┐   ┌────┴────┐    (static)
              WageBarChart  Cards  Table  WageBarChart
                   │                    │
              data/wages.ts  ◄──────────┘
              (13 WageEntry records, sortedByWage, regions)
```

**Router**: TanStack Router (`@tanstack/react-router`) — NOT react-router-dom. Routes defined as `createRoute()` objects in `src/routes/*.tsx`, assembled into a tree in `src/router.tsx`.

**Data**: `src/data/wages.ts` is the single source of truth. All pages import directly from it. No API calls, no server state.

## Key Directories

```
src/
├── components/         # Shared UI
│   ├── ui/             # shadcn/ui primitives (button, card, table, tabs, select, badge, separator)
│   ├── layout.tsx      # App shell: header + nav + footer
│   ├── wage-bar-chart.tsx  # Recharts wrapper (horizontal/vertical BarChart)
│   └── wage-tooltip.tsx    # Custom Recharts tooltip
├── data/
│   └── wages.ts        # WageEntry interface + 13 records + sortedByWage + regions
├── lib/
│   └── utilities.ts    # cn() re-export from "cn" package
├── pages/              # Route page components
│   ├── home.tsx        # Hero chart + insight cards + CTA
│   ├── explore.tsx     # Filterable/sortable table + chart view (TanStack Table)
│   └── about.tsx       # Data sources + methodology
├── routes/             # TanStack Router route definitions
│   ├── __root.tsx      # Root route (Layout wrapper)
│   ├── index.tsx       # /
│   ├── explore.tsx     # /explore
│   └── about.tsx       # /about
├── app.tsx             # Entry: <RouterProvider>
├── app.css             # Tailwind v4 theme (CSS @theme, oklch colors, shadcn vars)
├── index.tsx           # React 19 createRoot mount
└── environment.d.ts    # Rsbuild type reference
```

## Development Commands

| Command | Action |
|---|---|
| `pnpm dev` | Dev server with hot reload (opens browser) |
| `pnpm build` | Production build |
| `pnpm build:rsdoctor` | Build with Rsdoctor bundle analysis |
| `pnpm preview` | Preview production build |
| `pnpm lint` | ESLint (flat config, `--max-warnings=0`) |

**No test scripts.** Zero test infrastructure — no vitest, jest, or testing-library installed.

## Code Conventions & Common Patterns

### Exports
- **Named exports everywhere** except `src/app.tsx` (default export for Rsbuild entry).
- Components: `export function ComponentName() { ... }`
- Route modules: `export const indexRoute = createRoute(...)` (named, not default)

### Imports
- Path alias `@/` → `src/` (configured in both `tsconfig.json` and `rsbuild.config.ts`).
- Always use `@/` alias for cross-directory imports: `import { cn } from "@/lib/utilities"`.
- React imported as namespace: `import * as React from "react"` (when needed for types).
- Types use `import type`: `import type { WageEntry } from "@/data/wages"`.

### shadcn/ui Components
Manually created in `src/components/ui/` following shadcn/ui conventions:
- Use `cva` (class-variance-authority) for variant definitions.
- Use `cn()` utility for className merging.
- Export both component and variants: `export { Button, buttonVariants }`.
- Interfaces extend HTML attributes + `VariantProps<typeof variants>`.
- Components are in `src/components/ui/` — do NOT install via shadcn CLI.

### TanStack Table (Explore Page)
Uses `@tanstack/react-table` v9 with:
- `coreFeatures` + `stockFeatures` feature flags
- `createSortedRowModel`, `createExpandedRowModel`
- `flexRender` for cell rendering
- `useTable` hook (v9 API, not `useReactTable`)

### Styling
- Tailwind CSS v4 with CSS-based theme (no `tailwind.config.*` file).
- Theme variables defined in `src/app.css` using `@theme { ... }` block.
- shadcn CSS variables: `--background`, `--foreground`, `--primary`, etc. in oklch.
- Dark mode: `@media (prefers-color-scheme: dark)` in `app.css`.
- Responsive: Tailwind breakpoints (`sm:640px`, `md:768px`, `lg:1024px`, `xl:1280px`).
- Icons: Lucide React (`lucide-react`) for UI icons, `@iconify/tailwind4` for broader icon sets.

### TypeScript
- Target: ES2020, Module: ESNext, Resolution: Bundler.
- Strict mode with `noUnusedLocals` and `noUnusedParameters`.
- `isolatedModules: true` (Rsbuild requirement).

### UI Language
All user-facing text is in **Chinese (Simplified)**. Country names, labels, placeholders, and navigation are Chinese.

## Important Files

| File | Purpose |
|---|---|
| `src/data/wages.ts` | Single data source: `WageEntry` interface, 13 records, `sortedByWage`, `regions` |
| `src/router.tsx` | TanStack Router setup, route tree assembly, type augmentation |
| `src/app.css` | Tailwind v4 theme, shadcn CSS variables, fonts (Instrument Serif + Outfit) |
| `src/lib/utilities.ts` | `cn()` utility (re-exports from `cn` package, NOT tailwind-merge+clsx) |
| `src/components/layout.tsx` | App shell with responsive nav, skip-to-content a11y link |
| `rsbuild.config.ts` | Build config: `@` alias, PostCSS (inline), Rsdoctor (conditional), TurboConsole (dev) |
| `eslint.config.js` | Flat config: `@renton/eslint-config-react` + `@shadcn/lint` registered (no rules) |
| `lint-staged.config.js` | Pre-commit: `eslint --cache --max-warnings=0 --no-warn-ignored` |
| `docs/薪资.md` | Source data (gitignored): 13-country minimum wage table with sources |

## Runtime/Tooling Preferences

| Aspect | Choice |
|---|---|
| Package manager | pnpm 12.4.2 (enforced via `packageManager` field) |
| Build tool | Rsbuild 2.x (rspack-based, NOT Vite/webpack) |
| Bundler | rspack (via Rsbuild) |
| CSS framework | Tailwind CSS 4.3 (v4 CSS-based config, `@tailwindcss/postcss`) |
| Routing | @tanstack/react-router (NOT react-router-dom) |
| Charts | Recharts 3.x |
| Tables | @tanstack/react-table v9 |
| UI components | shadcn/ui pattern (CVA + cn, manual files) |
| Linting | ESLint 10 flat config, `@renton/eslint-config-react` |
| Git hooks | Husky 9 + lint-staged (ESLint only on commit) |
| TypeScript | 6.0.3 |
| Node | No specific constraint; pnpm handles runtime |

### Rsbuild-Specific Notes
- PostCSS configured **inline** in `rsbuild.config.ts` (no separate `postcss.config.*`).
- No `vite.config.*` or `webpack.config.*` — Rsbuild uses its own rspack bundler.
- `RSDOCTOR=true` env enables Rsdoctor bundle analyzer.
- TurboConsole plugin active in dev mode only.

## Testing & QA

**No test infrastructure exists.** Zero test files, frameworks, configs, or scripts.

The ESLint config transitively pulls `@vitest/eslint-plugin` (from `@renton/eslint-config-react`), but vitest itself is not installed. To add testing:
1. Install vitest + @testing-library/react
2. Create vitest.config.ts
3. Add `test` script to package.json
4. Add test file patterns to tsconfig.json `include`

**Pre-commit quality gate**: Husky runs `pnpm lint-staged` which executes ESLint on staged `*.{ts,tsx,js,css}` files with zero-warning tolerance.

## Conventions for AI Assistants

1. **Read before edit**: Always read a file before modifying it.
2. **Named exports**: Use `export function` / `export const`, not default exports (except `app.tsx`).
3. **Import paths**: Use `@/` alias. Never use relative paths like `../../`.
4. **shadcn components**: Edit existing files in `src/components/ui/`. Do not use shadcn CLI.
5. **Data changes**: Edit `src/data/wages.ts`. The `WageEntry` interface is the contract.
6. **Router**: Use TanStack Router APIs (`createRoute`, `Link`, `useLocation`). Do not install react-router-dom.
7. **Table API**: Use `useTable` (v9), not `useReactTable` (v8).
8. **Styles**: Use Tailwind classes + shadcn CSS variables. No inline styles.
9. **Chinese UI**: All user-facing strings in Chinese.
10. **No tests**: Do not write tests unless explicitly asked — there's no test infrastructure.
11. **Lint on save**: `pnpm lint` must pass. `--max-warnings=0` means zero warnings tolerated.
