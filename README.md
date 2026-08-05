# Finanzas

Aplicación premium de finanzas personales — Next.js 16, React 19, Tailwind v4,
shadcn/ui, Firebase, Auth.js. Nivel comercial, arquitectura SaaS-ready,
100% en capas gratuitas.

## Quick start

```bash
bun install
bun dev
```

Abre http://localhost:3000 — arranca directo en **Modo demo** (datos de
ejemplo, sin login) para que puedas ver toda la interfaz de inmediato.

Para activar login real, Firestore y el asesor IA: ver **[SETUP.md](./SETUP.md)**.

## Stack

Ver **[docs/prompt-finanzas-saas-2026.md](./docs/prompt-finanzas-saas-2026.md)**
para la especificación completa de producto y arquitectura.

| Capa | Tecnología |
|---|---|
| Runtime | Bun 1.3.x |
| Framework | Next.js 16 (App Router, Turbopack, React Compiler) |
| UI | shadcn/ui (Radix), Tailwind CSS v4, Lucide, motion/react |
| Estado | Zustand (UI), TanStack Query (servidor), nuqs (URL) |
| Formularios | React Hook Form + Zod v4 |
| Gráficos | Recharts + shadcn/charts |
| Auth | Auth.js v5 (Google) |
| Datos | Firestore + Firebase Admin SDK, vía Server Actions |
| IA | Vercel AI SDK + Gemini 2.0 Flash (capa gratuita) — preparado, inactivo |
| Calidad | Biome, Lefthook, TypeScript strict |
| Testing | Vitest, Playwright, MSW |

## Scripts

```bash
bun dev              # servidor de desarrollo
bun run build         # build de producción
bun run type-check    # TypeScript
bun run lint          # Biome
bun run lint:fix       # Biome --write
bun run test           # Vitest
bun run test:e2e       # Playwright
```

## Estructura

Arquitectura feature-based — ver `src/features/*` para cada dominio
(expenses, income, savings, recurring, fixed-expenses, analytics, calendar,
alerts, ai) con sus `components/`, `hooks/`, `actions/` y `schemas/` propios.
`src/components/{ui,layout,shared,charts}` para lo compartido.
