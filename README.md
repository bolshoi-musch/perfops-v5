# PerfOps UI Contract (V5)

> **Репозиторий:** [`bolshoi-musch/perfops-v5`](https://github.com/bolshoi-musch/perfops-v5) — приватный UI-contract и Lovable-прототип PerfOps.
>
> **Это НЕ production-репозиторий PerfOps.** Здесь нет реального backend, API, бизнес-логики, секретов, ключей и env-файлов. Production-код живёт в отдельном репозитории и не зависит от этого.
>
> **Назначение:** единый источник истины по UI/UX-контракту — экраны, шаги flow, состояния, тексты продуктов, UI-компоненты и дизайн-токены. Весь актуальный код прототипа, документация (`docs/ux/`), UI-компоненты (`src/components/perfops-v4/`, `/v4/components`) и справочник состояний (`/v4/flow-states`) находятся в этом репозитории.
>
> **Для production-команд:** использовать этот репозиторий только как источник дизайна, структуры экранов, канонических текстов и UI-паттернов. Не копировать сюда production-код, секреты и реальные endpoints.

Lovable-прототип и UI-контракт продуктовой платформы **PerfOps**.

> Канонический набор экранов и состояний живёт в namespace `/v4/*` (исторически — там продолжает развиваться актуальная версия V5). Маршруты `/v5/*` — алиасы-редиректы на соответствующие `/v4/*`.

## Запуск

```bash
bun install
bun run dev
```

Откроется dev-сервер Vite + TanStack Start. Главная — `/`, актуальный прототип — `/v4` (или `/v5`).

Сборка production-бандла:

```bash
bun run build
```

## Стек

- **TanStack Start v1** (file-based routing, SSR-ready), Vite 7, React 19, TypeScript strict.
- **Tailwind CSS v4** через `src/styles.css` + `oklch`-токены.
- **shadcn/ui** компоненты в `src/components/ui/*`.
- Никакого backend / Lovable Cloud в этом репозитории — все данные mock.

## Структура

```
src/
├── routes/                    # File-based маршруты TanStack Start
│   ├── __root.tsx             # Корневой layout (html/head/body)
│   ├── index.tsx              # Редирект-лендинг на актуальную версию
│   ├── v4.index.tsx           # V5 — главная (каталог продуктов + недавние проекты)
│   ├── v4.products.index.tsx  # Каталог продуктов
│   ├── v4.products.$productId.tsx
│   ├── v4.projects.index.tsx
│   ├── v4.projects.$projectId.tsx
│   ├── v4.projects.new.tsx    # Создание проекта → /v4/run/$productId/source
│   ├── v4.run.$productId.$step.tsx  # Универсальный flow продукта
│   ├── v4.library.index.tsx
│   ├── v4.connections.index.tsx
│   ├── v4.connections.$typeId.tsx
│   ├── v4.flow-states.tsx     # Справочник состояний
│   ├── v4.components.tsx      # UI-кит / реальный набор компонентов
│   └── v5.tsx, v5.$.tsx       # Алиасы /v5/* → /v4/*
│
├── components/
│   ├── perfops-v4/            # Каркас актуальной версии (AppShell, PageHeader, Stepper, ActionBar, ...)
│   ├── perfops/               # Старые общие виджеты (часть переиспользуется)
│   └── ui/                    # shadcn/ui примитивы
│
├── lib/
│   └── perfops-v4-data.ts     # Канонические данные: продукты, шаги, источники, подключения, моки проектов и Библиотеки
│
└── styles.css                 # Дизайн-токены (oklch), темы, поверхности
```

> Версии V1–V3 (`src/routes/v3.*`, `src/routes/tools.*`, `src/components/perfops-v3/*`, `src/components/perfops/*`) сохранены как референс и не являются частью UI-контракта.

## Где что искать

| Что | Где |
| --- | --- |
| Канонические тексты продуктов | `src/lib/perfops-v4-data.ts` (`products[]`) |
| Шаги flow и их подписи | `src/lib/perfops-v4-data.ts` (`StepId`, `stepLabel`) |
| Состояния (источник, проверка, обработка, результат) | `/v4/flow-states` → `src/routes/v4.flow-states.tsx` |
| UI-компоненты в реальном использовании | `/v4/components` → `src/routes/v4.components.tsx` |
| Mock-данные проектов и Библиотеки | `src/lib/perfops-v4-data.ts` |
| Подключения и аккаунты (моки) | `src/lib/perfops-v4-data.ts` (`connectionTypes`) |

## Документация UX-контракта

В каталоге [`docs/ux/`](./docs/ux/):

- [`product-canon.md`](./docs/ux/product-canon.md) — канон продуктов, тексты страниц, форматы результата.
- [`flow-contract.md`](./docs/ux/flow-contract.md) — общий контракт продуктового flow.
- [`state-guide.md`](./docs/ux/state-guide.md) — справочник состояний (зеркало `/v4/flow-states`).
- [`ui-components.md`](./docs/ux/ui-components.md) — UI-компоненты (зеркало `/v4/components`).
- [`open-questions.md`](./docs/ux/open-questions.md) — вопросы, отложенные до следующих этапов.

## Что НЕ входит в этот репозиторий

- Реальный backend, БД, API.
- Production-секреты, ключи, env-файлы.
- Реальные данные клиентов или кампаний.
- Бизнес-логика обработки (всё, что относится к фактической работе продуктов).

Этот репозиторий — **только UI-контракт**. Production-код PerfOps живёт в отдельном репозитории.
