import {
  LayoutDashboard,
  BarChart3,
  Minus,
  Sparkles,
  Type,
  type LucideIcon,
} from "lucide-react";

// ============================================================
// PerfOps V5 (in V4 namespace) — unified product platform data
// ============================================================
// Core entity: Project. A project has a product, sources,
// parameters, current result and processing history.
// Re-processing updates the project's current result; to keep
// a snapshot, the user creates a new project.
// ============================================================

// ---------- Result formats (closed list of 3) ----------

export type ResultFormat = "excel" | "dashboard-link" | "analytics-report";

export const resultFormatLabel: Record<ResultFormat, string> = {
  excel: "Excel-файл",
  "dashboard-link": "Ссылка на дашборд",
  "analytics-report": "Аналитический отчёт",
};

// ---------- Connection types ----------

export type ConnectionTypeId =
  | "yandex-direct"
  | "google-ads"
  | "google-sheets"
  | "yandex-metrika"
  | "appmetrica";

export type AccountStatus = "connected" | "action-required" | "disconnected";

export interface ConnectionAccount {
  id: string;
  name: string;
  identifier: string;
  status: AccountStatus;
  lastSync: string;
}

export interface ConnectionType {
  id: ConnectionTypeId;
  name: string;
  description: string;
  accounts: ConnectionAccount[];
}

export const connectionTypes: ConnectionType[] = [
  {
    id: "yandex-direct",
    name: "Яндекс Директ",
    description: "Чтение статистики и структуры рекламных кампаний.",
    accounts: [
      {
        id: "yd-main",
        name: "Основной кабинет",
        identifier: "perfops-main@yandex.example",
        status: "connected",
        lastSync: "30 минут назад",
      },
      {
        id: "yd-secondary",
        name: "Кабинет под новые продукты",
        identifier: "perfops-launch@yandex.example",
        status: "action-required",
        lastSync: "вчера",
      },
    ],
  },
  {
    id: "google-ads",
    name: "Google Ads",
    description: "Выгрузки по кампаниям и работа с минус-словами.",
    accounts: [
      {
        id: "ga-main",
        name: "Основной MCC",
        identifier: "123-456-7890",
        status: "connected",
        lastSync: "1 час назад",
      },
    ],
  },
  {
    id: "google-sheets",
    name: "Google Sheets",
    description: "Чтение исходных данных и запись результатов в книги.",
    accounts: [
      {
        id: "gs-ops",
        name: "Operations workspace",
        identifier: "ops@perfops.example",
        status: "connected",
        lastSync: "сегодня",
      },
    ],
  },
  {
    id: "yandex-metrika",
    name: "Яндекс Метрика",
    description: "Поведенческие данные и пользовательские сегменты.",
    accounts: [
      {
        id: "ym-main",
        name: "Основной счётчик",
        identifier: "счётчик 87654321",
        status: "connected",
        lastSync: "2 часа назад",
      },
    ],
  },
  {
    id: "appmetrica",
    name: "AppMetrica",
    description: "Мобильная аналитика для проектов с приложениями.",
    accounts: [],
  },
];

export const accountStatusLabel: Record<AccountStatus, string> = {
  connected: "Подключено",
  "action-required": "Требуется действие",
  disconnected: "Отключено",
};

export const getConnectionType = (id: string | undefined): ConnectionType =>
  connectionTypes.find((t) => t.id === id) ?? connectionTypes[0];

// ---------- Source kinds ----------

export type SourceKind =
  | "upload"
  | "connection"
  | "library"
  | "topic"
  | "url";

export const sourceKindLabel: Record<SourceKind, string> = {
  upload: "Загрузить файл",
  connection: "Подключённый аккаунт",
  library: "Источник из Библиотеки",
  topic: "Текстовая тема",
  url: "Ссылка / URL",
};

export const sourceKindHint: Record<SourceKind, string> = {
  upload: "Файл с вашего компьютера",
  connection: "Данные напрямую из подключённого сервиса",
  library: "Источник, ранее сохранённый в Библиотеке",
  topic: "Короткое описание темы или направления",
  url: "Адрес страницы",
};

// ---------- Flow step vocabulary ----------

export type StepId =
  | "scenario"
  | "source"
  | "combining"
  | "metrics"
  | "params"
  | "check"
  | "run"
  | "result";

export const stepLabel: Record<StepId, string> = {
  scenario: "Сценарий",
  source: "Источник",
  combining: "Объединение",
  metrics: "Метрики и фокус",
  params: "Параметры",
  check: "Проверка",
  run: "Запуск",
  result: "Результат",
};

// ---------- Products ----------

export type ProductId =
  | "dashboard-builder"
  | "campaign-analysis"
  | "semantics-generator"
  | "cross-minus"
  | "bd-optimization";

export interface ProductSection {
  title: string;
  items: string[];
}

export interface ProductPageContent {
  /** Подзаголовок под названием продукта на странице продукта. */
  description: string;
  sections: ProductSection[];
}

export interface Product {
  id: ProductId;
  name: string;
  shortDescription: string;
  icon: LucideIcon;
  resultFormat: ResultFormat;
  /** Перечень шагов в порядке отображения. */
  steps: StepId[];
  /** Какие типы источников разрешены продуктом. */
  allowedSources: SourceKind[];
  /** Какие подключения может использовать продукт. */
  supportedConnections: ConnectionTypeId[];
  /** Поддерживаемые форматы файлов при ручной загрузке. */
  acceptedFileTypes: string[];
  /** Поддерживается ли второй источник. */
  supportsSecondSource: boolean;
  /** Поддерживается ли объединение двух источников. */
  supportsCombining: boolean;
  /** Есть ли публичная демо-версия результата. */
  hasDemoDashboard: boolean;
  page: ProductPageContent;
}

export const products: Product[] = [
  {
    id: "dashboard-builder",
    name: "Конструктор дашбордов",
    shortDescription:
      "Сводный дашборд по выгрузкам кампаний с разбивкой по периодам.",
    icon: LayoutDashboard,
    resultFormat: "dashboard-link",
    steps: ["source", "combining", "check", "run", "result"],
    allowedSources: ["upload", "connection", "library"],
    supportedConnections: ["yandex-direct", "google-ads", "google-sheets"],
    acceptedFileTypes: [".xlsx", ".csv"],
    supportsSecondSource: true,
    supportsCombining: true,
    hasDemoDashboard: true,
    page: {
      description:
        "Дашборд по маркетинговым данным из Яндекс Директ, Яндекс Метрика и AppMetrica.",
      sections: [
        {
          title: "Что умеет дашборд",
          items: [
            "Теги и комбинации: если в названиях есть -_-/ | — выделит теги и покажет статистику по ним",
            "Уровни данных: кампания / группа / ... (если есть в отчёте)",
            "Объединение 2 файлов: единый датасет для одного дашборда",
            "Добавление релевантных метрик: например, из кликов и конверсий рассчитает CR",
          ],
        },
        {
          title: "Что будет в дашборде",
          items: [
            "графики по объектам и периодам",
            "сравнение периодов и сегментов",
            "воронка, инсайты и прогноз по метрикам",
            "таблица по всем объектам",
          ],
        },
        {
          title: "Предпочтительные источники",
          items: ["Яндекс Директ, Яндекс Метрика, AppMetrica."],
        },
        {
          title: "Ограничения",
          items: [
            "CSV/XLSX · до 10 МБ · до 100 000 строк · до 30 столбцов · ссылка действует 30 дней",
          ],
        },
      ],
    },
  },
  {
    id: "campaign-analysis",
    name: "Анализ кампаний",
    shortDescription:
      "Аналитический отчёт с изменениями, аномалиями и сегментами внимания.",
    icon: BarChart3,
    resultFormat: "analytics-report",
    steps: ["source", "metrics", "check", "run", "result"],
    allowedSources: ["upload", "connection", "library"],
    supportedConnections: ["yandex-direct", "google-ads"],
    acceptedFileTypes: [".xlsx", ".csv"],
    supportsSecondSource: false,
    supportsCombining: false,
    hasDemoDashboard: false,
    page: {
      description:
        "Разбор рекламных кампаний, проблем и точек роста.",
      sections: [
        {
          title: "Что умеет инструмент",
          items: [
            "Итоги по ключевым метрикам (CPA, CTR, CR, ROAS и др.)",
            "Инсайты и закономерности в данных",
            "Рекомендации по оптимизации",
            "Потенциал роста",
          ],
        },
        {
          title: "Что будет в отчёте",
          items: [
            "аналитика по метрикам кампаний",
            "паттерны и аномалии по тегам (_, -, |)",
            "инсайты, выводы и рекомендации",
            "дашборд с интерактивными графиками",
          ],
        },
        {
          title: "Предпочтительные источники",
          items: ["Яндекс Директ, Яндекс Метрика, AppMetrica."],
        },
        {
          title: "Советы",
          items: [
            "Загружайте однотипные кампании — не смешивайте бренд с небрендом и поиск с РСЯ",
            "Загружайте данные по одному типу конверсий",
          ],
        },
        {
          title: "Ограничения",
          items: [
            "CSV/XLSX · до 5 МБ · до 50 000 строк · до 15 столбцов · отчёты хранятся 7 дней",
          ],
        },
      ],
    },
  },
  {
    id: "semantics-generator",
    name: "Сбор и обработка семантики",
    shortDescription:
      "Excel-файл с дедуплицированным семантическим ядром и кластерами.",
    icon: Type,
    resultFormat: "excel",
    steps: ["scenario", "source", "params", "check", "run", "result"],
    allowedSources: ["topic", "url", "upload", "library"],
    supportedConnections: [],
    acceptedFileTypes: [".xlsx", ".csv", ".txt"],
    supportsSecondSource: false,
    supportsCombining: false,
    hasDemoDashboard: false,
    page: {
      description:
        "Собирает ключевые фразы, помогает найти идеи по теме и формирует итоговый файл для работы.",
      sections: [
        {
          title: "Что умеет инструмент",
          items: [
            "Собирает ключевые фразы по теме в сценариях «Консервативный», «Сбалансированный» и «Охватный»",
            "Проводит исследование: список по теме и расширение seed-списка",
            "Кластеризует готовые списки фраз из TXT, CSV и XLSX",
          ],
        },
        {
          title: "Какие входы поддерживаются",
          items: [
            "Текст, URL и файл для сбора семантики",
            "Текст или seed-файл для исследования",
            "TXT, CSV и XLSX для кластеризации с автоопределением текстового столбца",
          ],
        },
        {
          title: "Что будет в результате",
          items: [
            "Excel-файл со списком фраз или расширениями",
            "Excel-файл с кластерами для сценария кластеризации",
            "Результат сохраняется в Библиотеке",
          ],
        },
      ],
    },
  },
  {
    id: "cross-minus",
    name: "Кросс-минусовка",
    shortDescription:
      "Excel-файл с готовыми списками кросс-минус-слов по группам объявлений.",
    icon: Minus,
    resultFormat: "excel",
    steps: ["source", "check", "run", "result"],
    allowedSources: ["upload", "connection", "library"],
    supportedConnections: ["yandex-direct"],
    acceptedFileTypes: [".xlsx", ".csv"],
    supportsSecondSource: false,
    supportsCombining: false,
    hasDemoDashboard: false,
    page: {
      description:
        "Находит пересечения между кампаниями Яндекс Директ и формирует списки минус-фраз.",
      sections: [
        {
          title: "Что умеет инструмент",
          items: [
            "На основе выгрузки «Ключевые фразы» со статистикой показов находит пересечения между кампаниями и собирает для каждой РК свой список минус-фраз.",
            "Минусует только тематические слова, не минусует служебные части речи и слишком общие слова, которые повторяются во многих кампаниях.",
            "Минусация каскадная, а не сплошная: вложенные запросы не должны полностью терять показы.",
            "Типичный кейс: в аккаунте есть брендовая и небрендовая РК, и автотаргетинг начинает подмешивать брендовые запросы туда, где они не нужны. Если кампаний много, собирать списки минус-слов вручную сложно.",
          ],
        },
        {
          title: "Что будет в результате",
          items: ["Готовый XLSX-файл со списками минус-фраз по кампаниям."],
        },
        {
          title: "Ограничения",
          items: ["XLSX/CSV · до 50 МБ"],
        },
      ],
    },
  },
  {
    id: "bd-optimization",
    name: "BD Optimization",
    shortDescription:
      "Excel-файл для снижения каннибализации и атрибуцированных потерь.",
    icon: Sparkles,
    resultFormat: "excel",
    steps: ["source", "params", "check", "run", "result"],
    allowedSources: ["upload", "connection", "library"],
    supportedConnections: ["yandex-direct", "google-ads"],
    acceptedFileTypes: [".xlsx", ".csv"],
    supportsSecondSource: false,
    supportsCombining: false,
    hasDemoDashboard: false,
    page: {
      description:
        "Сбор минус-фраз для снижения каннибализации и атрибуцированных потерь.",
      sections: [
        {
          title: "Что умеет инструмент",
          items: [
            "Разбивает каждый запрос на отдельные слова, пары (биграммы) и тройки слов (триграммы) с агрегированной статистикой как по исходным данным, так и с добавлением объёма конверсий по каждой фразе.",
            "В результате в списки минус-слов можно добавлять не исходные фразы, а более общие маски.",
          ],
        },
        {
          title: "Что будет в отчёте",
          items: [
            "Дополнительные полезные метрики, которые отражают уровень каннибализации и атрибуцированных потерь относительно собственных показателей фраз: расходов, кликов, конверсий.",
            "Для каннибализации: cannib_net, cannib_per_cost, cannib_per_conversion.",
            "Для атрибуцированных потерь: loss_per_our_click, loss_per_conversion.",
          ],
        },
        {
          title: "Ограничения",
          items: [
            "XLSX/CSV · до 100 МБ · доступ только для разрешённых доменов и пользователей",
          ],
        },
      ],
    },
  },
];

export const getProduct = (id: string | undefined): Product =>
  products.find((p) => p.id === id) ?? products[0];

// ---------- Scenarios (semantics product) ----------

export type SemanticsScenarioId =
  | "conservative"
  | "balanced"
  | "broad"
  | "topic-list"
  | "expand"
  | "cluster";

export type SemanticsScenarioGroup = "collection" | "research" | "processing";

export interface SemanticsScenario {
  id: SemanticsScenarioId;
  name: string;
  description: string;
  group: SemanticsScenarioGroup;
}

export const semanticsScenarioGroupLabel: Record<SemanticsScenarioGroup, string> = {
  collection: "Сбор семантики",
  research: "Исследование",
  processing: "Обработка",
};

export const semanticsScenarios: SemanticsScenario[] = [
  {
    id: "conservative",
    name: "Консервативный",
    description: "Собирает более точные и сдержанные варианты запросов.",
    group: "collection",
  },
  {
    id: "balanced",
    name: "Сбалансированный",
    description: "Оптимальный сценарий для большинства стандартных запусков.",
    group: "collection",
  },
  {
    id: "broad",
    name: "Охватный",
    description:
      "Даёт более широкий охват и больше идей по теме, но релевантность ниже.",
    group: "collection",
  },
  {
    id: "topic-list",
    name: "Список по теме",
    description:
      "Собирает список по теме. Например: «русские поэты» → пушкин, лермонтов, есенин.",
    group: "research",
  },
  {
    id: "expand",
    name: "Расширение списка",
    description:
      "Расширяет готовый список запросов. Например: «александр пушкин» → «стихи пушкина», «поэт пушкин».",
    group: "research",
  },
  {
    id: "cluster",
    name: "Кластеризация",
    description: "Группирует готовый список фраз по кластерам.",
    group: "processing",
  },
];

// ---------- Metrics catalog (campaign-analysis) ----------

export type MetricGroup = "absolute" | "relative";

export interface MetricDef {
  id: string;
  name: string;
  group: MetricGroup;
}

export const metricGroupLabel: Record<MetricGroup, string> = {
  absolute: "Абсолютные метрики",
  relative: "Относительные и стоимостные",
};

export const metricsCatalog: MetricDef[] = [
  { id: "impressions", name: "Показы", group: "absolute" },
  { id: "clicks", name: "Клики", group: "absolute" },
  { id: "cost", name: "Расход", group: "absolute" },
  { id: "conversions", name: "Конверсии", group: "absolute" },
  { id: "ctr", name: "CTR", group: "relative" },
  { id: "cpc", name: "CPC", group: "relative" },
  { id: "cr", name: "CR", group: "relative" },
  { id: "cpa", name: "CPA", group: "relative" },
];

// ---------- Projects ----------

export interface ProjectSourceRef {
  /** Имя для отображения. */
  name: string;
  /** Тип источника. */
  kind: SourceKind;
  /** Подпись формата / интеграции / размера. */
  meta?: string;
}

export interface ProcessingHistoryItem {
  id: string;
  startedAt: string;
  finishedAt?: string;
  status: "completed" | "failed" | "saved-locally";
  note?: string;
}

export interface CurrentResult {
  /** Имя результата (как сохранён в Библиотеке). */
  name: string;
  format: ResultFormat;
  /** Соответствующий идентификатор записи в Библиотеке. */
  libraryId: string;
  /** Если true — есть локальная копия, но в Библиотеке не сохранён. */
  notSavedToLibrary?: boolean;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  productId: ProductId;
  /** Человекочитаемый возраст обновления. */
  updated: string;
  /** ISO timestamp для сортировки. */
  updatedAt: string;
  sources: ProjectSourceRef[];
  parameters: { label: string; value: string }[];
  currentResult?: CurrentResult;
  history: ProcessingHistoryItem[];
}

export const projects: Project[] = [
  {
    id: "dashboards-26-04-2026",
    name: "Конструктор дашбордов — 26.04.2026",
    description: "Сводный дашборд по выгрузкам Яндекс Директ.",
    productId: "dashboard-builder",
    updated: "2 часа назад",
    updatedAt: "2026-04-26T08:00:00",
    sources: [
      {
        name: "campaign_export.xlsx",
        kind: "upload",
        meta: "XLSX · 412 КБ",
      },
      {
        name: "Яндекс Директ — Основной кабинет",
        kind: "connection",
        meta: "Яндекс Директ",
      },
    ],
    parameters: [
      { label: "Период", value: "1–25 апреля 2026" },
      { label: "Объединение", value: "По ключам date + campaign_id" },
    ],
    currentResult: {
      name: "Дашборд кампаний — 26.04.2026",
      format: "dashboard-link",
      libraryId: "lib-dashboard-26-04",
    },
    history: [
      {
        id: "h-1",
        startedAt: "26.04.2026, 10:55",
        finishedAt: "26.04.2026, 10:58",
        status: "completed",
      },
      {
        id: "h-2",
        startedAt: "25.04.2026, 18:20",
        finishedAt: "25.04.2026, 18:23",
        status: "completed",
        note: "Первая обработка после создания проекта",
      },
    ],
  },
  {
    id: "cross-minus-25-04-2026",
    name: "Кросс-минусовка — 25.04.2026",
    productId: "cross-minus",
    updated: "вчера",
    updatedAt: "2026-04-25T14:25:00",
    sources: [
      {
        name: "keywords_export.xlsx",
        kind: "upload",
        meta: "XLSX · 1,2 МБ",
      },
    ],
    parameters: [],
    currentResult: {
      name: "Кросс-минус — 25.04.2026.xlsx",
      format: "excel",
      libraryId: "lib-cross-minus-25-04",
    },
    history: [
      {
        id: "h-1",
        startedAt: "25.04.2026, 16:10",
        finishedAt: "25.04.2026, 16:12",
        status: "completed",
      },
    ],
  },
  {
    id: "campaign-analysis-23-04-2026",
    name: "Анализ кампаний — 23.04.2026",
    description: "Еженедельный разбор поисковых кампаний.",
    productId: "campaign-analysis",
    updated: "3 дня назад",
    updatedAt: "2026-04-23T11:00:00",
    sources: [
      {
        name: "stats_april.csv",
        kind: "upload",
        meta: "CSV · 88 КБ",
      },
    ],
    parameters: [
      { label: "Метрики", value: "CPA, Конверсии" },
      {
        label: "Фокус анализа",
        value: "Сделайте акцент на CPA и проблемных кампаниях",
      },
    ],
    currentResult: {
      name: "Анализ кампаний — 23.04.2026",
      format: "analytics-report",
      libraryId: "lib-campaign-analysis-23-04",
    },
    history: [
      {
        id: "h-1",
        startedAt: "23.04.2026, 11:30",
        finishedAt: "23.04.2026, 11:35",
        status: "completed",
      },
    ],
  },
  {
    id: "bd-optimization-22-04-2026",
    name: "BD Optimization — 22.04.2026",
    productId: "bd-optimization",
    updated: "4 дня назад",
    updatedAt: "2026-04-22T16:30:00",
    sources: [
      {
        name: "keywords_full.xlsx",
        kind: "upload",
        meta: "XLSX · 6,4 МБ",
      },
    ],
    parameters: [],
    currentResult: {
      name: "BD Optimization — 22.04.2026.xlsx",
      format: "excel",
      libraryId: "lib-bd-optim-22-04",
    },
    history: [
      {
        id: "h-1",
        startedAt: "22.04.2026, 17:00",
        finishedAt: "22.04.2026, 17:18",
        status: "completed",
      },
    ],
  },
  {
    id: "semantics-19-04-2026",
    name: "Сбор семантики — 19.04.2026",
    description: "Расширение ядра по новой продуктовой линейке.",
    productId: "semantics-generator",
    updated: "неделю назад",
    updatedAt: "2026-04-19T10:00:00",
    sources: [
      {
        name: "Тема: «беспроводные наушники»",
        kind: "topic",
      },
    ],
    parameters: [
      { label: "Сценарий", value: "Сбалансированный" },
      { label: "Минус-слова", value: "Не указаны" },
    ],
    currentResult: {
      name: "Семантическое ядро — 19.04.2026.xlsx",
      format: "excel",
      libraryId: "lib-semantics-19-04",
    },
    history: [
      {
        id: "h-1",
        startedAt: "19.04.2026, 10:05",
        finishedAt: "19.04.2026, 10:11",
        status: "completed",
      },
    ],
  },
  {
    id: "dashboards-02-04-2026",
    name: "Конструктор дашбордов — 02.04.2026",
    productId: "dashboard-builder",
    updated: "2 апреля",
    updatedAt: "2026-04-02T10:00:00",
    sources: [],
    parameters: [],
    history: [],
  },
];

export const getProject = (id: string | undefined): Project =>
  projects.find((p) => p.id === id) ?? projects[0];

// ---------- Library ----------

export type LibraryEntryKind = "source" | "result";

export const libraryKindLabel: Record<LibraryEntryKind, string> = {
  source: "Источник",
  result: "Результат",
};

/** Источники могут быть в разных форматах — храним строкой. */
export type SourceFormat =
  | "xlsx"
  | "csv"
  | "google-sheets"
  | "yandex-direct"
  | "google-ads";

export const sourceFormatLabel: Record<SourceFormat, string> = {
  xlsx: "XLSX",
  csv: "CSV",
  "google-sheets": "Google Sheets",
  "yandex-direct": "Яндекс Директ",
  "google-ads": "Google Ads",
};

export interface LibraryEntry {
  id: string;
  name: string;
  kind: LibraryEntryKind;
  /** Для результатов — закрытый список из 3 форматов. Для источников — формат файла/коннектора. */
  format: ResultFormat | SourceFormat;
  productId?: ProductId;
  projectId: string;
  projectName: string;
  updated: string;
  updatedAt: string;
  size?: string;
}

export const libraryEntries: LibraryEntry[] = [
  {
    id: "lib-dashboard-26-04",
    name: "Дашборд кампаний — 26.04.2026",
    kind: "result",
    format: "dashboard-link",
    productId: "dashboard-builder",
    projectId: "dashboards-26-04-2026",
    projectName: "Конструктор дашбордов — 26.04.2026",
    updated: "2 часа назад",
    updatedAt: "2026-04-26T08:00:00",
  },
  {
    id: "src-campaign-export",
    name: "campaign_export.xlsx",
    kind: "source",
    format: "xlsx",
    projectId: "dashboards-26-04-2026",
    projectName: "Конструктор дашбордов — 26.04.2026",
    updated: "2 часа назад",
    updatedAt: "2026-04-26T07:50:00",
    size: "412 КБ",
  },
  {
    id: "src-yd-main",
    name: "Яндекс Директ — Основной кабинет",
    kind: "source",
    format: "yandex-direct",
    projectId: "dashboards-26-04-2026",
    projectName: "Конструктор дашбордов — 26.04.2026",
    updated: "сегодня",
    updatedAt: "2026-04-26T09:00:00",
  },
  {
    id: "lib-cross-minus-25-04",
    name: "Кросс-минус — 25.04.2026.xlsx",
    kind: "result",
    format: "excel",
    productId: "cross-minus",
    projectId: "cross-minus-25-04-2026",
    projectName: "Кросс-минусовка — 25.04.2026",
    updated: "вчера",
    updatedAt: "2026-04-25T14:25:00",
    size: "84 КБ",
  },
  {
    id: "src-keywords-export",
    name: "keywords_export.xlsx",
    kind: "source",
    format: "xlsx",
    projectId: "cross-minus-25-04-2026",
    projectName: "Кросс-минусовка — 25.04.2026",
    updated: "вчера",
    updatedAt: "2026-04-25T13:00:00",
    size: "1,2 МБ",
  },
  {
    id: "lib-campaign-analysis-23-04",
    name: "Анализ кампаний — 23.04.2026",
    kind: "result",
    format: "analytics-report",
    productId: "campaign-analysis",
    projectId: "campaign-analysis-23-04-2026",
    projectName: "Анализ кампаний — 23.04.2026",
    updated: "3 дня назад",
    updatedAt: "2026-04-23T11:00:00",
  },
  {
    id: "src-stats-april",
    name: "stats_april.csv",
    kind: "source",
    format: "csv",
    projectId: "campaign-analysis-23-04-2026",
    projectName: "Анализ кампаний — 23.04.2026",
    updated: "3 дня назад",
    updatedAt: "2026-04-23T10:30:00",
    size: "88 КБ",
  },
  {
    id: "lib-bd-optim-22-04",
    name: "BD Optimization — 22.04.2026.xlsx",
    kind: "result",
    format: "excel",
    productId: "bd-optimization",
    projectId: "bd-optimization-22-04-2026",
    projectName: "BD Optimization — 22.04.2026",
    updated: "4 дня назад",
    updatedAt: "2026-04-22T16:30:00",
    size: "210 КБ",
  },
  {
    id: "src-keywords-full",
    name: "keywords_full.xlsx",
    kind: "source",
    format: "xlsx",
    projectId: "bd-optimization-22-04-2026",
    projectName: "BD Optimization — 22.04.2026",
    updated: "4 дня назад",
    updatedAt: "2026-04-22T15:50:00",
    size: "6,4 МБ",
  },
  {
    id: "lib-semantics-19-04",
    name: "Семантическое ядро — 19.04.2026.xlsx",
    kind: "result",
    format: "excel",
    productId: "semantics-generator",
    projectId: "semantics-19-04-2026",
    projectName: "Сбор семантики — 19.04.2026",
    updated: "неделю назад",
    updatedAt: "2026-04-19T10:00:00",
    size: "1,4 МБ",
  },
];

export const formatLabel = (format: LibraryEntry["format"]): string => {
  if (
    format === "excel" ||
    format === "dashboard-link" ||
    format === "analytics-report"
  ) {
    return resultFormatLabel[format];
  }
  return sourceFormatLabel[format];
};

// ---------- Result actions (per project) ----------

export type ResultActionVariant =
  | "open-dashboard"
  | "open-report"
  | "download-excel"
  | "none";

export interface ProjectResultAction {
  label: string;
  variant: ResultActionVariant;
}

export const getResultActionForFormat = (
  format: ResultFormat,
): ProjectResultAction => {
  switch (format) {
    case "dashboard-link":
      return { label: "Открыть дашборд", variant: "open-dashboard" };
    case "analytics-report":
      return { label: "Открыть отчёт", variant: "open-report" };
    case "excel":
      return { label: "Скачать Excel-файл", variant: "download-excel" };
  }
};

export const getProjectResultAction = (project: Project): ProjectResultAction => {
  if (!project.currentResult) {
    return { label: "Нет результата", variant: "none" };
  }
  return getResultActionForFormat(project.currentResult.format);
};

// ---------- Step navigation helpers ----------

export const getStepIndex = (product: Product, step: StepId): number =>
  product.steps.indexOf(step);

export const getNextStep = (
  product: Product,
  step: StepId,
): StepId | undefined => {
  const i = getStepIndex(product, step);
  if (i < 0 || i >= product.steps.length - 1) return undefined;
  return product.steps[i + 1];
};

export const getPrevStep = (
  product: Product,
  step: StepId,
): StepId | undefined => {
  const i = getStepIndex(product, step);
  if (i <= 0) return undefined;
  return product.steps[i - 1];
};
