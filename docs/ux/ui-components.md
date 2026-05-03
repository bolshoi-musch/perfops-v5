# UI-компоненты

Живой набор: [`/v4/components`](http://localhost:3000/v4/components) → [`src/routes/v4.components.tsx`](../../src/routes/v4.components.tsx). На странице показаны компоненты в их реальном использовании, а не абстрактный design system.

## Каркас V5 (V4 namespace)

Все экраны собраны из компонентов в [`src/components/perfops-v4/`](../../src/components/perfops-v4/):

| Компонент | Файл | Что делает |
| --- | --- | --- |
| `AppShellV4` | `AppShellV4.tsx` | Левое меню (Главная, Продукты с раскрываемым списком, Проекты, Библиотека, Подключения), верхняя навигация. |
| `PageHeaderV4` | `PageHeaderV4.tsx` | Заголовок страницы, без «eyebrow»-надстрочников. |
| `BreadcrumbsV4` | `BreadcrumbsV4.tsx` | Хлебные крошки. |
| `ProjectContextBarV4` | `ProjectContextBarV4.tsx` | Контекст проекта над flow. |
| `FlowStepperV4` | `FlowStepperV4.tsx` | Stepper с динамическим списком шагов и сохранением `search`-параметров. |
| `FlowActionBar` | `FlowActionBar.tsx` | Нижняя панель с «Назад» / «Далее» и слотами. |
| `ProductCardV4` | `ProductCardV4.tsx` | Карточка продукта на главной и в каталоге. |
| `HelpCard` | `HelpCard.tsx` | Подсказка / помощь по контексту. |

## UI-примитивы

[`src/components/ui/*`](../../src/components/ui/) — shadcn/ui (Button, Card, Input, Select, Dialog, Tabs, Table, Badge, Alert, Skeleton, …). Кастомизация через дизайн-токены в `src/styles.css`.

## Дизайн-токены

Цвета и поверхности — `oklch`-токены в [`src/styles.css`](../../src/styles.css). Никаких хардкоженных `text-white` / `bg-black` в компонентах. Используются семантические токены: `--background`, `--foreground`, `--primary`, `--muted`, `--accent`, `--info`, `--info-soft`, `--success`, `--success-soft`, `--warning`, `--warning-soft`, `--destructive`, `--destructive-soft`.

## Состояния, которые есть на странице UI-компонентов

- Состояния кнопок: default, loading, disabled.
- Состояния полей формы: default, error, disabled.
- Группы действий результата (`ResultAction`).
- `EmptyState` для пустых разделов.
- Состояния таблиц: loading, error, empty.

## Что НЕ показываем в UI-ките

- Изолированные «design system»-демо без контекста.
- Технические подписи тональностей (`info`, `warning`, …) — это внутренний справочник в `/v4/flow-states`.
