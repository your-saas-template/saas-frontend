# SaaS Frontend (Next.js + TypeScript)

Frontend template for SaaS / Dashboard applications built with:

**Next.js (App Router) + TypeScript + React 19**

Designed for:
- clear domain boundaries
- scalable modular architecture
- reusable UI-kit layer
- predictable import structure
- clean separation between route layer and business logic

Works together with the SaaS Backend API.

---

## 🌍 API Integration

Backend base URL is configured via environment variable:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5001
````

Production example:

```env
NEXT_PUBLIC_API_BASE_URL=https://backend-29gv.onrender.com
```

Google OAuth client (if used):

```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=
```

---

## 🚀 Getting Started

### Requirements

* Node.js 20+
* Backend API running

### Install

```bash
npm install
```

### Development

```bash
npm run dev
```

Runs:

* Next.js dev server
* TypeScript type-check in watch mode

Open:

```
http://localhost:3000
```

---

### Production Build

```bash
npm run build
npm run start
```

---

## 🧱 Architecture Overview

The project follows a layered architecture inspired by Feature-Sliced Design.

Layer rule:

```
app → pages → widgets → features → entities → shared
```

Imports are allowed only downward.

---

## 📂 Folder Structure

### `src/app/` — Route Layer (thin)

Contains:

* `layout.tsx`
* `page.tsx`
* route groups
* Next.js specific files

Rules:

* No heavy UI
* No business logic
* Only connects page modules from `src/pages`

Example:

```tsx
import { DashboardEmailPage } from "@/pages/dashboard/email";

export default function Page() {
  return <DashboardEmailPage />;
}
```

---

### `src/pages/` — Page Modules

Composes a full route from widgets/features/entities.

Examples:

* `pages/dashboard/email`
* `pages/dashboard/billing`
* `pages/dashboard/analytics`

---

### `src/widgets/` — Large UI Blocks

Reusable page sections:

* `widgets/app-shell`
* `widgets/billing/current-subscription`
* `widgets/analytics/overview`

Widgets can combine multiple features/entities.

---

### `src/features/` — Use Cases (User Actions)

Encapsulated operations:

* send email
* cancel subscription
* upgrade plan
* sign-in

Structure:

```
feature-name/
  ui/
  model/
  api/
```

Examples:

* `features/email/send`
* `features/billing/cancel-subscription`
* `features/auth/sign-in`

---

### `src/entities/` — Domain Entities

Represents core domain objects and minimal UI for them.

Contains:

* `model/`
* `api/`
* `ui/`

Examples:

* `entities/subscription`
* `entities/email-template`
* `entities/analytics`

---

### `src/shared/` — Base Layer (No Business Logic)

Reusable and independent utilities:

* `shared/ui` — UI-kit primitives
* `shared/lib` — helpers, formatters, HTTP client
* `shared/config` — env, constants, routes
* `shared/styles` — global styles
* `shared/types` — base types

This layer must not depend on higher layers.

---

### `src/i18n/`

Translation files grouped by namespace:

* `common`
* `email`
* `billing`
* `analytics`

Uses:

* `i18next`
* `react-i18next`

---

### `src/app-providers/`

Global providers:

* theme
* i18n
* auth/session
* React Query

Connected in:

```
src/app/layout.tsx
```

---

## 📦 Tech Stack

* Next.js 16 (App Router)
* React 19
* TypeScript
* TailwindCSS 4
* React Query (@tanstack/react-query)
* Axios
* Zod (validation)
* i18next
* Recharts
* React Aria
* Sonner (notifications)

---

## 📜 NPM Scripts

```bash
npm run dev        # Next.js + type-check watch
npm run build      # Production build
npm run start      # Production start
npm run lint       # ESLint
npm run typecheck  # TypeScript check
```

---

## 📐 Import Rules

1. Always import via public API (`index.ts`):

   ✅

   ```ts
   import { SubscriptionBadge } from "@/entities/subscription";
   ```

   ❌

   ```ts
   import { SubscriptionBadge } from "@/entities/subscription/ui/SubscriptionBadge";
   ```

2. No upward imports:

   * `entities` must not import `features/widgets/pages/app`
   * `shared` must not import anything except `shared`

---

## 🎯 Design Goals

* Scalable dashboard architecture
* Strict domain isolation
* Replaceable backend
* Clean API integration
* Production-ready auth + billing UI