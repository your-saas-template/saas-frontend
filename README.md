# Frontend (Next.js + TypeScript)

Проект — Next.js (App Router) приложение на TypeScript. Код организован так, чтобы:
- маршруты (`app/`) были тонкими и не содержали бизнес-логики;
- доменные модули были изолированы и переиспользуемы;
- UI-kit и утилиты не зависели от бизнес-кода;
- было понятно, куда класть новый код и как его импортировать.

## Быстрый старт

```bash
npm install
npm run dev
````

Открыть: [http://localhost:3000](http://localhost:3000)

## Архитектура и структура папок

Код делится на слои. Импортировать можно только “вниз” по слоям:

`app -> pages -> widgets -> features -> entities -> shared`

### `src/app/` — маршруты Next.js (тонкий слой)

Только `layout.tsx`, `page.tsx`, route groups и Next-специфика.

Правило: **никаких больших компонентов и бизнес-логики**.
Route должен просто подключать модуль страницы из `src/pages`.

Пример:

```tsx
import { DashboardEmailPage } from "@/pages/dashboard/email";

export default function Page() {
  return <DashboardEmailPage />;
}
```

### `src/pages/` — модули страниц

Собирают страницу из `widgets/features/entities`.

Использовать, когда UI/логика относится строго к конкретному route.

Пример:

* `pages/dashboard/email`
* `pages/dashboard/billing`
* `pages/dashboard/analytics`

### `src/widgets/` — крупные блоки страниц

Большие секции, которые можно переиспользовать на разных страницах:

* `widgets/app-shell` (Header/Sidebar)
* `widgets/billing/current-subscription`
* `widgets/analytics/overview`

Правило: widget может собирать несколько features/entities.

### `src/features/` — пользовательские действия (операции)

Изолированные “use-cases”: отправить email, отменить подписку, апгрейднуть план.

Содержит:

* `ui/` (формы/модалки/кнопки операции)
* `model/` (хуки useCase)
* `api/` (если API именно про действие)

Примеры:

* `features/email/send`
* `features/billing/cancel-subscription`
* `features/auth/sign-in`

### `src/entities/` — доменные сущности

Описывают данные и минимальный UI для их отображения.

Содержит:

* `model/` (types/state helpers)
* `api/` (запросы сущности)
* `ui/` (компоненты отображения сущности: card/badge/avatar)

Примеры:

* `entities/subscription`
* `entities/email-template`
* `entities/analytics`

### `src/shared/` — базовый слой (не знает о бизнесе)

Здесь лежит всё, что может переиспользоваться везде и не должно зависеть от доменов:

* `shared/ui` — UI-kit primitives (Button/Input/Modal/Charts primitives и т.д.)
* `shared/lib` — утилиты, форматтеры, общие хуки, http client
* `shared/config` — env, routes, constants
* `shared/styles` — глобальные стили
* `shared/types` — базовые типы

### `src/i18n/` — переводы

Хранение переводов по локалям и namespaces (например `common`, `email`, `billing`, `analytics`).

### `src/app-providers/` — провайдеры приложения

Единое место для подключения:

* темы
* i18n
* auth/session
* query state (если используется)

Подключается в корневом `app/layout.tsx`.

## Правила импортов (важно)

1. Импортируем модуль через публичный API (`index.ts`):

   * ✅ `import { SubscriptionBadge } from "@/entities/subscription";`
   * ❌ `import { SubscriptionBadge } from "@/entities/subscription/ui/SubscriptionBadge";`

2. Слои не должны импортировать “вверх”:

* `entities` не импортирует `features/widgets/pages/app`
* `shared` не импортирует ничего кроме `shared`

## Где создавать новый код

* Новый домен (например “notifications”) → `entities/notifications` + `features/notifications/*` + widgets/pages при необходимости.
* Новый экран в dashboard → `pages/dashboard/<screen>` + соответствующие widgets/features.
* Новый общий компонент кнопки/инпута → `shared/ui`.
* Новый форматтер/хелпер → `shared/lib`.

## Скрипты

* `npm run dev` — локальная разработка
* `npm run build` — production build
* `npm run start` — запуск production
* `npm run lint` — линтер
