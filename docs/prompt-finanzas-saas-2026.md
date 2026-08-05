# PROMPT — APLICACIÓN PREMIUM DE FINANZAS PERSONALES (SaaS-Ready)
### Stack 2026 · Nivel Comercial · Arquitectura Escalable

---

## ROL

Actúa como un **Staff Software Engineer**, **Senior UI/UX Designer**, **Product Designer** y **Software Architect** con más de 15 años de experiencia construyendo aplicaciones SaaS de nivel comercial.

Tu objetivo es diseñar y desarrollar una aplicación web **moderna, escalable y extremadamente estética** para la gestión de finanzas personales, siguiendo las mejores prácticas de arquitectura, experiencia de usuario, rendimiento, accesibilidad y código limpio.

No quiero una aplicación común de gastos.

Quiero un producto con **calidad comercial**, listo para convertirse en un SaaS en el futuro.

Toda decisión de diseño debe estar orientada a **simplicidad, velocidad, elegancia y escalabilidad**.

---

## STACK TECNOLÓGICO — TOP 2026

### Runtime & Package Manager

| Herramienta | Versión | Decisión |
|---|---|---|
| **Bun** | v2.x | Runtime + package manager. Reemplaza Node + npm/pnpm. Instalaciones ~30x más rápidas. |
| **Node.js** | 22 LTS | Fallback de compatibilidad en Vercel |

> Usar `bun install`, `bun run dev`, `bun run build` en todos los scripts.

---

### Frontend Core

| Librería | Versión | Decisión |
|---|---|---|
| **Next.js** | 15.x (App Router) | Framework principal. Turbopack activado por defecto en dev. Server Components por defecto. |
| **React** | 19.x | React Compiler activado — elimina la necesidad de `useMemo`/`useCallback` manuales. |
| **TypeScript** | 5.8+ | Strict mode. Sin `any`. |
| **Tailwind CSS** | v4.x | CSS-first config (`@import "tailwindcss"`). Sin `tailwind.config.js`. Variables CSS nativas. |

> **React Compiler**: Con Next.js 15 + React 19, activar `experimental.reactCompiler: true` en `next.config.ts`. El compilador optimiza re-renders automáticamente.

---

### UI & Componentes

| Librería | Versión | Decisión |
|---|---|---|
| **shadcn/ui** | Latest | Sistema de componentes con el nuevo registry. Instalación por componente, no como dependencia. |
| **Radix UI Primitives** | Latest | Base accesible de todos los componentes shadcn. |
| **Lucide React** | Latest | Iconografía. Consistente, tree-shakeable. |
| **cmdk** | v1.x | Command Palette (`Ctrl+K`). El estándar de la industria. |
| **vaul** | v1.x | Drawer mobile-first. Reemplaza los Sheet de shadcn para mobile. |
| **nuqs** | v2.x | State en URL (search params). Sincronización de filtros con la URL sin boilerplate. |

---

### Animaciones & Microinteracciones

| Librería | Versión | Decisión |
|---|---|---|
| **motion/react** | v12.x | Ex-Framer Motion. Import: `import { motion, AnimatePresence } from "motion/react"`. API idéntica, mejor performance. |

> **Principio de animación**: Cada animación debe tener propósito. `spring` para elementos físicos, `ease` para transiciones de UI. Respetar `prefers-reduced-motion`.

---

### Formularios & Validación

| Librería | Versión | Decisión |
|---|---|---|
| **React Hook Form** | v7.x | Performance insuperable. Zero re-renders innecesarios. |
| **Zod** | v4.x | Re-escrito desde cero. 10x más rápido. API idéntica pero mejor inferencia de tipos. Import: `import { z } from "zod/v4"`. |

> **Zod v4 highlights**: `z.email()` mejorado, `z.transform()` más potente, mensajes de error más claros, validación asíncrona nativa.

---

### Estado

| Librería | Versión | Decisión |
|---|---|---|
| **Zustand** | v5.x | Estado global del cliente. API simplificada. Compatible con React Compiler. |
| **TanStack Query** | v5.x | Server state. Caché, sincronización, optimistic updates. |
| **nuqs** | v2.x | Estado de URL (filtros, tabs, búsqueda). |

> **Regla**: Zustand solo para UI state verdaderamente global (tema, modal abierto, user preferences). TanStack Query para todo lo que venga del servidor. nuqs para estado shareable via URL.

---

### Gráficos & Visualización

| Librería | Versión | Decisión |
|---|---|---|
| **Recharts** | v2.x | Gráficos principales. Compatible con shadcn/charts. |
| **shadcn/charts** | Latest | Wrapper sobre Recharts con tokens de diseño del sistema. |
| **TanStack Virtual** | v3.x | Virtualización de listas largas (historial de gastos). Sin jank en listas de miles de items. |

---

### Fechas & Calendario

| Librería | Versión | Decisión |
|---|---|---|
| **date-fns** | v4.x | Manipulación de fechas. Tree-shakeable. |
| **React Day Picker** | v9.x | Picker de fechas nativo con soporte para React 19. |

---

### UX & Notificaciones

| Librería | Versión | Decisión |
|---|---|---|
| **Sonner** | v2.x | Toast system. Integración nativa con shadcn. |
| **next-themes** | Latest | Dark/Light mode. Sin flash en SSR. |

---

### Autenticación & Backend

| Servicio | Versión | Decisión |
|---|---|---|
| **Auth.js (NextAuth)** | v5.x | Auth moderna para Next.js 15 App Router. Edge-compatible. O usar Firebase Auth si se prefiere ecosistema Firebase. |
| **Firebase** | v10.x SDK | Firestore + Storage + Security Rules. |
| **Firebase Admin SDK** | Latest | Operaciones server-side en Route Handlers / Server Actions. |

> **Patrón**: Autenticación con Auth.js v5 usando Google Provider + Firestore como adapter. Correos autorizados mediante un `AUTHORIZED_EMAILS` env array o colección `authorized_users` en Firestore.
>
> **Alternativa full-Firebase**: Firebase Auth + Firestore nativo. La decisión depende de si se quiere mantener todo en el ecosistema Firebase.

---

### AI & LLM (Arquitectura Preparada)

| Librería | Versión | Decisión |
|---|---|---|
| **Vercel AI SDK** | v4.x | Layer de abstracción para IA. Soporta OpenAI, Anthropic, Google. Streaming nativo. Server Actions integration. |

> **Preparación**: Crear `src/features/ai/` con interfaces vacías pero tipadas. Usar `useChat()` y `useCompletion()` hooks de AI SDK para futuras integraciones. El switch entre modelos (GPT-4o, Claude 3.7, Gemini 2.0) se hace cambiando el provider, sin tocar la UI.

```typescript
// src/features/ai/actions/analyze-spending.ts — STUB PREPARADO
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function analyzeSpending(data: SpendingData) {
  // Listo para activar cuando se conecte el API key
  const { text } = await generateText({
    model: openai("gpt-4o"),
    prompt: buildSpendingPrompt(data),
  });
  return text;
}
```

---

### Performance & Optimización

| Herramienta | Decisión |
|---|---|
| **Turbopack** | Activado por defecto en Next.js 15. Dev builds ~700% más rápidos que Webpack. |
| **React Compiler** | Auto-memoización. Activa con `experimental.reactCompiler: true`. |
| **next/image** | Optimización automática de imágenes. |
| **next/font** | Fonts con zero layout shift. Usar `Geist` (sans) + `Geist Mono`. |
| **Bundle Analyzer** | `@next/bundle-analyzer` para auditar el tamaño del bundle. |

---

### Calidad de Código

| Herramienta | Versión | Decisión |
|---|---|---|
| **Biome** | v2.x | Reemplaza ESLint + Prettier en un solo binario. **50x más rápido**. Escrito en Rust. Linting + formatting unificados. |
| **Lefthook** | Latest | Reemplaza Husky + lint-staged. Git hooks más rápidos y con mejor DX. Configuración en `lefthook.yml`. |
| **TypeScript** | Strict mode | `noUncheckedIndexedAccess: true`, `exactOptionalPropertyTypes: true` |

> **Configuración Biome** (`biome.json`):
> ```json
> {
>   "linter": { "enabled": true, "rules": { "recommended": true } },
>   "formatter": { "enabled": true, "indentStyle": "space", "indentWidth": 2 },
>   "javascript": { "formatter": { "quoteStyle": "double" } }
> }
> ```

---

### Testing

| Herramienta | Versión | Decisión |
|---|---|---|
| **Vitest** | v3.x | Unit + integration tests. Compatible con Bun. Sintaxis Jest-compatible. |
| **React Testing Library** | Latest | Testing de componentes orientado al usuario. |
| **Playwright** | v1.50+ | E2E testing. Graba flujos automáticamente. |
| **MSW (Mock Service Worker)** | v2.x | Mocking de Firestore y APIs externas en tests. |

> **Cobertura mínima**: 80% en features críticos (auth, transactions, savings goals).

---

### Observabilidad & Analytics

| Herramienta | Decisión |
|---|---|
| **Sentry** | Error monitoring + performance tracing. Integración nativa con Next.js 15. |
| **Vercel Analytics** | Web Vitals y métricas de performance en producción. |
| **Vercel Speed Insights** | Core Web Vitals en tiempo real por ruta. |
| **PostHog** | Product analytics self-hosteable. Feature flags para rollouts progresivos. |

---

### Infraestructura & Deployment

| Herramienta | Decisión |
|---|---|
| **Vercel** | Hosting. Edge Network. Serverless Functions. Cron Jobs para recurrentes. |
| **Upstash Redis** | Rate limiting en Edge. Caché de queries costosas. |
| **GitHub Actions** | CI/CD: lint → test → build → deploy. |

---

## ESTRUCTURA DE CARPETAS — FEATURE-BASED CLEAN ARCHITECTURE

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/
│   │   └── login/
│   │       └── page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx            # Shell con Sidebar
│   │   ├── page.tsx              # Dashboard
│   │   ├── expenses/
│   │   ├── income/
│   │   ├── savings/
│   │   ├── calendar/
│   │   ├── analytics/
│   │   └── settings/
│   ├── api/
│   │   ├── auth/[...nextauth]/   # Auth.js handler
│   │   └── ai/
│   │       └── analyze/
│   ├── layout.tsx                # Root layout
│   ├── globals.css               # Tailwind v4 + tokens
│   └── not-found.tsx
│
├── features/                     # Módulos de negocio
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── actions/
│   ├── expenses/
│   │   ├── components/
│   │   │   ├── ExpenseCard.tsx
│   │   │   ├── ExpenseForm.tsx
│   │   │   ├── ExpenseList.tsx
│   │   │   └── QuickAddModal.tsx
│   │   ├── hooks/
│   │   │   ├── useExpenses.ts
│   │   │   └── useExpenseForm.ts
│   │   ├── actions/              # Server Actions
│   │   │   ├── create-expense.ts
│   │   │   ├── update-expense.ts
│   │   │   └── delete-expense.ts
│   │   ├── schemas/
│   │   │   └── expense.schema.ts # Zod v4 schemas
│   │   └── types/
│   │       └── expense.types.ts
│   ├── income/
│   ├── savings/
│   ├── recurring/
│   ├── fixed-expenses/
│   ├── analytics/
│   ├── calendar/
│   ├── ai/                       # Preparado, sin activar
│   └── alerts/
│
├── components/                   # Componentes compartidos
│   ├── ui/                       # shadcn/ui (no editar directamente)
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   └── CommandPalette.tsx
│   ├── shared/
│   │   ├── FinancialCard.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── EmptyState.tsx
│   │   ├── SkeletonCard.tsx
│   │   ├── HealthIndicator.tsx
│   │   └── UndoToast.tsx
│   └── charts/
│       ├── SpendingChart.tsx
│       ├── CategoryPie.tsx
│       └── TrendLine.tsx
│
├── lib/                          # Utilities
│   ├── firebase/
│   │   ├── client.ts
│   │   ├── admin.ts
│   │   └── converters/
│   ├── auth/
│   │   └── config.ts             # Auth.js config
│   ├── utils.ts                  # cn(), formatCurrency(), etc.
│   ├── constants.ts              # AUTHORIZED_EMAILS, CATEGORIES, etc.
│   └── validations/
│
├── store/                        # Zustand stores
│   ├── ui.store.ts               # modal, sidebar, theme
│   └── user.store.ts
│
├── hooks/                        # Hooks globales
│   ├── useKeyboardShortcuts.ts
│   ├── useUndoDelete.ts
│   └── useFinancialSummary.ts
│
├── types/                        # Tipos globales
│   └── index.ts
│
└── config/
    ├── site.ts
    └── navigation.ts
```

---

## DESIGN TOKENS — TAILWIND CSS v4

```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  /* Tipografía — Geist de Vercel */
  --font-sans: "Geist", system-ui, sans-serif;
  --font-mono: "Geist Mono", monospace;

  /* Espaciado base */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  --spacing-2xl: 3rem;

  /* Radios */
  --radius-sm: 0.375rem;
  --radius-md: 0.75rem;
  --radius-lg: 1rem;
  --radius-xl: 1.5rem;
  --radius-full: 9999px;

  /* Colores — Light Mode */
  --color-background: oklch(99% 0 0);
  --color-surface: oklch(97% 0 0);
  --color-surface-elevated: oklch(100% 0 0);
  --color-border: oklch(92% 0 0);
  --color-text: oklch(10% 0 0);
  --color-text-secondary: oklch(50% 0 0);
  --color-text-tertiary: oklch(70% 0 0);

  /* Acento financiero */
  --color-primary: oklch(55% 0.2 250);       /* Azul sobrio */
  --color-success: oklch(60% 0.18 160);      /* Verde ingresos */
  --color-danger: oklch(58% 0.22 20);        /* Rojo gastos */
  --color-warning: oklch(72% 0.18 80);       /* Amarillo alertas */

  /* Dark Mode */
  --color-background-dark: oklch(8% 0 0);
  --color-surface-dark: oklch(12% 0 0);
  --color-surface-elevated-dark: oklch(16% 0 0);
  --color-border-dark: oklch(22% 0 0);
}
```

> **Decisión de tipografía**: `Geist Sans` + `Geist Mono` de Vercel. Cargadas con `next/font/local`. Zero layout shift. Perfectas para dashboards financieros — legibles, modernas, sin personalidad excesiva.

---

## AUTENTICACIÓN — ARQUITECTURA

```typescript
// lib/constants.ts
export const AUTHORIZED_EMAILS = process.env.AUTHORIZED_EMAILS?.split(",") ?? [
  "steven@example.com",
];

// lib/auth/config.ts — Auth.js v5
import { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import { AUTHORIZED_EMAILS } from "@/lib/constants";

export const authConfig: NextAuthConfig = {
  providers: [Google],
  callbacks: {
    authorized({ auth, request }) {
      const email = auth?.user?.email;
      if (!email || !AUTHORIZED_EMAILS.includes(email)) return false;
      return true;
    },
    async signIn({ user }) {
      return AUTHORIZED_EMAILS.includes(user.email ?? "");
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
};
```

---

## SERVER ACTIONS — PATRÓN

```typescript
// features/expenses/actions/create-expense.ts
"use server";

import { auth } from "@/lib/auth";
import { expenseSchema } from "@/features/expenses/schemas/expense.schema";
import { db } from "@/lib/firebase/admin";
import { revalidatePath } from "next/cache";

export async function createExpense(data: unknown) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const parsed = expenseSchema.safeParse(data);
  if (!parsed.success) throw new Error(parsed.error.message);

  const ref = db
    .collection("users")
    .doc(session.user.id)
    .collection("expenses");

  await ref.add({
    ...parsed.data,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  revalidatePath("/expenses");
  revalidatePath("/");
}
```

---

## SCHEMAS ZOD v4

```typescript
// features/expenses/schemas/expense.schema.ts
import { z } from "zod/v4";

export const expenseSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").max(100),
  amount: z.number().positive("El valor debe ser positivo"),
  category: z.string().min(1),
  date: z.coerce.date(),
  description: z.string().max(500).optional(),
  tags: z.array(z.string()).max(10).default([]),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  type: z.enum(["variable", "fixed", "recurring"]).default("variable"),
});

export type ExpenseFormValues = z.infer<typeof expenseSchema>;
```

---

## COMMAND PALETTE — cmdk

```typescript
// components/layout/CommandPalette.tsx
"use client";

import { Command } from "cmdk";
import { motion, AnimatePresence } from "motion/react";
import { useRouter } from "next/navigation";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useKeyboardShortcuts({ "ctrl+k": () => setOpen(true) });

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.12, ease: [0.16, 1, 0.3, 1] }}
        >
          <Command.Dialog open={open} onOpenChange={setOpen}>
            <Command.Input placeholder="Buscar o ejecutar un comando..." />
            <Command.List>
              <Command.Group heading="Acciones rápidas">
                <Command.Item onSelect={() => {/* open quick add */}}>
                  Agregar gasto
                </Command.Item>
                <Command.Item onSelect={() => {/* open income modal */}}>
                  Registrar ingreso
                </Command.Item>
              </Command.Group>
              <Command.Group heading="Navegación">
                <Command.Item onSelect={() => router.push("/")}>Dashboard</Command.Item>
                <Command.Item onSelect={() => router.push("/analytics")}>Estadísticas</Command.Item>
              </Command.Group>
            </Command.List>
          </Command.Dialog>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

---

## UNDO DELETE — PATRÓN (5 segundos)

```typescript
// hooks/useUndoDelete.ts
import { toast } from "sonner";

export function useUndoDelete() {
  const deleteWithUndo = async (
    deleteFn: () => Promise<void>,
    undoFn: () => Promise<void>,
    label: string
  ) => {
    let undone = false;

    const toastId = toast(
      `"${label}" eliminado`,
      {
        action: {
          label: "Deshacer",
          onClick: async () => {
            undone = true;
            await undoFn();
            toast.success("Acción deshecha");
          },
        },
        duration: 5000,
        onAutoClose: async () => {
          if (!undone) await deleteFn();
        },
      }
    );
  };

  return { deleteWithUndo };
}
```

---

## VERCEL AI SDK — STUB PREPARADO

```typescript
// features/ai/actions/financial-advice.ts
"use server";

import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { createStreamableValue } from "ai/rsc";
import type { SpendingData } from "@/types";

// STUB — Activar cuando se configure OPENAI_API_KEY
export async function getFinancialAdvice(data: SpendingData) {
  const stream = createStreamableValue("");

  (async () => {
    const { textStream } = await streamText({
      model: openai("gpt-4o"),
      system: `Eres un asesor financiero personal. Analizas los patrones de gasto 
               del usuario y das consejos concretos, empáticos y accionables en español.`,
      prompt: `Analiza estos datos financieros: ${JSON.stringify(data)}`,
    });

    for await (const text of textStream) {
      stream.update(text);
    }

    stream.done();
  })();

  return { output: stream.value };
}
```

---

## FIRESTORE SECURITY RULES

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Usuarios solo acceden a sus propios datos
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null
        && request.auth.uid == userId
        && request.auth.token.email in get(/databases/$(database)/documents/config/authorized_emails).data.list;
    }

    // Configuración global — solo lectura pública
    match /config/{document} {
      allow read: if request.auth != null;
      allow write: if false;
    }
  }
}
```

---

## CONFIGURACIÓN DE PROYECTO

### `next.config.ts`

```typescript
import type { NextConfig } from "next";

const config: NextConfig = {
  experimental: {
    reactCompiler: true,      // React 19 Compiler — auto-memoización
    ppr: true,                // Partial Prerendering
    typedRoutes: true,        // Links tipados
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { hostname: "lh3.googleusercontent.com" }, // Google avatars
    ],
  },
  logging: {
    fetches: { fullUrl: true },
  },
};

export default config;
```

### `lefthook.yml`

```yaml
pre-commit:
  parallel: true
  commands:
    biome:
      glob: "*.{ts,tsx,js}"
      run: bunx biome check --apply {staged_files}
    typecheck:
      run: bun run type-check
```

### `package.json` (scripts)

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "type-check": "tsc --noEmit",
    "lint": "biome check .",
    "lint:fix": "biome check --apply .",
    "format": "biome format --write .",
    "test": "vitest",
    "test:e2e": "playwright test",
    "test:coverage": "vitest --coverage",
    "analyze": "ANALYZE=true next build"
  }
}
```

---

## ESTILO VISUAL

Inspirado en:

- **Apple** — espacio en blanco, tipografía, sensación premium
- **Linear** — dashboards, animaciones de datos, keyboard-first
- **Raycast** — command palette, microinteracciones
- **Vercel Dashboard** — métricas, gráficos, dark mode impecable
- **Arc Browser** — colores, fluidez, identidad

### Principios visuales

- Minimalismo extremo — cada pixel tiene un porqué
- Espacio en blanco generoso
- Bordes redondeados (`radius-lg`, `radius-xl`)
- Glassmorphism muy ligero (`backdrop-blur-sm`, `bg-white/60`)
- Sombras suaves (`shadow-sm`, `shadow-md`)
- Gradientes en tarjetas financieras
- Animaciones `spring` en elementos físicos (cards, modales)
- `ease: [0.16, 1, 0.3, 1]` para entradas premium
- Dark mode perfecto con variables `oklch`
- Tipografía `Geist` — legible, moderna, sin ruido visual

> **No debe parecer**: Excel, Bootstrap, un dashboard de WordPress, o una app de los años 2010.

---

## FUNCIONALIDADES PRINCIPALES

### Dashboard

**Métricas visibles al cargar:**
- Dinero disponible (prominente, hero)
- Salario actual
- Gastado hoy / esta semana / este mes
- Disponible para la quincena / para el mes
- Total ahorrado
- Próximo gasto y próximo pago

**Componentes:**
- Barra de progreso de gasto mensual (animada con motion)
- Indicador de salud financiera (score visual)
- Tarjetas animadas al hover y al cargar
- Resumen de las últimas transacciones

---

### Gastos Fijos (por quincena)

| Campo | Tipo |
|---|---|
| Nombre | string |
| Valor | number |
| Quincena | `"15" \| "30"` |
| Categoría | string |
| Activo | boolean |

**Quincena 15**: Moto, Transporte, Ahorro
**Quincena 30**: Internet, Celular, Ahorro

Acciones: Editar · Eliminar · Duplicar · Activar/Desactivar · Ordenar

Descontado automáticamente del balance disponible.

---

### Gastos Variables

| Campo | Tipo |
|---|---|
| Nombre | string |
| Categoría | enum personalizable |
| Valor | number |
| Fecha | date |
| Descripción | string (opcional) |
| Etiquetas | string[] |
| Prioridad | `"low" \| "medium" \| "high"` |

Categorías: Alimentación, Transporte, Entretenimiento, Salud, Educación, Ropa, Hogar, Tecnología, etc. (personalizables desde Settings).

---

### Gastos Recurrentes

Frecuencias: `daily | weekly | biweekly | monthly | yearly`

Sistema genera automáticamente las próximas N ocurrencias.
Regla: si cae en fin de semana, mover al siguiente día hábil (configurable).

---

### Ingresos

Tipos: Salario, Freelance, Bonificación, Arriendo, Dividendos, Otros.

Cada ingreso afecta el balance global en tiempo real (optimistic update).

---

### Objetivos de Ahorro

```typescript
interface SavingsGoal {
  id: string;
  name: string;           // "Moto", "Viaje a Japón"
  targetAmount: number;
  currentAmount: number;
  targetDate?: Date;
  color: string;          // Para la barra animada
  emoji?: string;
  status: "active" | "completed" | "paused";
}
```

Barra de progreso animada con `motion`. Confetti al completar un objetivo.

---

### Estadísticas & Analytics

Generados automáticamente con Recharts + shadcn/charts:

- Gastos por categoría (donut chart animado)
- Comparación mensual (bar chart)
- Comparación entre quincenas
- Tendencia de gastos (área chart)
- Promedio diario
- Top 5 gastos
- Días donde más gasto (heatmap)
- Proyección de gasto al finalizar el mes

---

### Calendario

Vista mensual con:
- Gastos marcados (rojo)
- Ingresos marcados (verde)
- Gastos fijos marcados (azul)
- Recordatorios (amarillo)

Click en día → drawer con el detalle de ese día.

---

### Alertas Inteligentes

```typescript
const ALERT_RULES = [
  { trigger: "budget_80", message: "Ya gastaste el 80% del presupuesto mensual." },
  { trigger: "expense_due_tomorrow", message: "Mañana vence {expense_name}." },
  { trigger: "month_over_last", message: "Este mes llevas más gastado que el anterior." },
  { trigger: "projection_high", message: "Si continúas así, terminarás gastando {projected}." },
  { trigger: "goal_milestone", message: "¡Llevas el 50% de tu meta {goal_name}!" },
];
```

Mostradas como banners dismissibles en el Dashboard.

---

### AI — Arquitectura Preparada (Activar con API Key)

- `/features/ai/actions/` — Server Actions para OpenAI/Anthropic
- `useChat()` de Vercel AI SDK para UI de streaming
- Modelos soportados: `gpt-4o`, `claude-3-7-sonnet`, `gemini-2-flash`
- Pantalla `/ai` en el sidebar (visible, pero con estado "Próximamente" hasta activar)

---

## PERFORMANCE — OBJETIVOS

| Métrica | Objetivo |
|---|---|
| LCP | < 1.2s |
| FID/INP | < 100ms |
| CLS | < 0.05 |
| Lighthouse Performance | ≥ 95 |
| Lighthouse Accessibility | 100 |
| Lighthouse Best Practices | 100 |
| Lighthouse SEO | ≥ 90 |
| Bundle size (initial JS) | < 120KB gzipped |

**Técnicas:**
- Server Components por defecto — zero JS al cliente
- Dynamic imports para modales, charts, calendar
- Skeleton loaders en toda carga asíncrona
- TanStack Virtual para listas > 50 items
- Firestore queries con límite y paginación
- ISR (Incremental Static Regeneration) donde aplique
- Partial Prerendering activado (PPR experimental)

---

## ESCALABILIDAD — PREPARACIÓN SAAS

Aunque inicialmente sea monousuario, la arquitectura debe soportar:

| Feature | Estado | Preparación |
|---|---|---|
| Multiusuario | ✅ Base hecha | Firestore `users/{uid}/...` |
| Equipos | 🔜 | `teams/{teamId}/members[]` |
| Suscripciones | 🔜 | Stripe Checkout + Webhooks |
| Exportar PDF | 🔜 | `@react-pdf/renderer` |
| Exportar Excel | 🔜 | `xlsx` library |
| PWA | 🔜 | `next-pwa` |
| Offline | 🔜 | Firestore offline persistence |
| Push Notifications | 🔜 | Firebase Cloud Messaging |
| App Móvil | 🔜 | React Native + Expo (shared logic) |
| i18n | 🔜 | `next-intl` |

---

## VARIABLES DE ENTORNO

```env
# Auth.js
AUTH_SECRET=
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=

# Firebase Client
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase Admin
FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=

# AI (dejar vacío hasta activar)
OPENAI_API_KEY=
ANTHROPIC_API_KEY=

# Authorized users
AUTHORIZED_EMAILS=email1@gmail.com,email2@gmail.com

# Observabilidad
SENTRY_DSN=
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# Upstash (rate limiting)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

---

## RESULTADO ESPERADO

Un producto que se sienta **inevitable**.

Cada pantalla debe poder competir con las mejores aplicaciones de finanzas del mercado.

Cada componente debe ser reutilizable, tipado, y documentado.

Cada animación debe tener propósito — no decoración.

Cada decisión debe priorizar **simplicidad, velocidad y elegancia**.

> "Perfection is achieved, not when there is nothing more to add, but when there is nothing left to take away." — Antoine de Saint-Exupéry

---

*Generado para Steven — SincronIA · Stack 2026*
