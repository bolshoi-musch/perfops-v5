import {
  LayoutDashboard,
  BarChart3,
  Minus,
  Sparkles,
  Type,
  type LucideIcon,
} from "lucide-react";

// ============================================================
// PerfOps V3 — strict product-logic data layer
// ============================================================
// Differences from V1/V2:
// - Closed taxonomy of result formats (3 only)
// - Projects belong to one product, no client/status/owner
// - Library entries reuse the same 3 formats
// - Connections are persistent integrations only (no file upload)
// ============================================================

// ---------- Result formats (closed list) ----------

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

// ---------- Products ----------

export type ProductId =
  | "dashboard-builder"
  | "campaign-analysis"
  | "cross-minus"
  | "bd-optimization"
  | "semantics-generator";

export interface Product {
  id: ProductId;
  name: string;
  shortDescription: string;
  longDescription: string;
  whenToUse: string;
  icon: LucideIcon;
  resultFormat: ResultFormat;
  /** Имя примера результата — то, что увидит пользователь в Библиотеке. */
  exampleResultName: string;
  /** Краткое описание примерного результата. */
  exampleResultSummary: string;
  inputs: string[];
  /** Какие подключения может использовать продукт. */
  supportedConnections: ConnectionTypeId[];
  /** Поддерживаемые форматы файлов при ручной загрузке. */
  acceptedFileTypes: string[];
  /** Куда сохраняется результат. */
  resultDestination: string;
  /** Где исполняется. Используется только в копиях, без бейджей на карточке. */
  execution: "in-platform" | "external";
  executionNote: string;
}

export const products: Product[] = [
  {
    id: "dashboard-builder",
    name: "Конструктор дашбордов",
    shortDescription:
      "Сводный дашборд по выгрузкам кампаний с разбивкой по периодам.",
    longDescription:
      "Конструктор дашбордов собирает структурированный дашборд по кампаниям из одной или нескольких выгрузок. Готовый дашборд сохраняется в Библиотеке проекта в виде ссылки.",
    whenToUse:
      "Когда нужно быстро собрать единый дашборд по кампаниям для регулярной отчётности или внутреннего ревью.",
    icon: LayoutDashboard,
    resultFormat: "dashboard-link",
    exampleResultName: "Дашборд кампаний — апрель",
    exampleResultSummary:
      "18 кампаний, разбивка по неделям, метрики CPA / CR / расход.",
    inputs: [
      "Выгрузка по кампаниям (.xlsx или .csv)",
      "Опционально: файл статистики за период",
    ],
    supportedConnections: ["google-ads", "google-sheets", "yandex-direct"],
    acceptedFileTypes: [".xlsx", ".csv"],
    resultDestination: "Библиотека проекта · ссылка на дашборд",
    execution: "in-platform",
    executionNote:
      "Запуск, обработка и просмотр дашборда происходят внутри PerfOps.",
  },
  {
    id: "campaign-analysis",
    name: "Анализ кампаний",
    shortDescription:
      "Аналитический отчёт с изменениями, аномалиями и сегментами внимания.",
    longDescription:
      "Анализ кампаний разбирает выгрузку и формирует аналитический отчёт: изменения за период, аномалии и сегменты, на которые стоит обратить внимание.",
    whenToUse:
      "Перед еженедельным ревью кампаний или когда нужно понять, что именно изменилось за период.",
    icon: BarChart3,
    resultFormat: "analytics-report",
    exampleResultName: "Анализ кампаний — апрель",
    exampleResultSummary:
      "7 аномалий, 3 сегмента с просадкой CR, рекомендации по перераспределению бюджета.",
    inputs: ["Выгрузка по кампаниям с разбивкой по дням"],
    supportedConnections: ["google-ads", "yandex-direct"],
    acceptedFileTypes: [".xlsx", ".csv"],
    resultDestination: "Библиотека проекта · аналитический отчёт",
    execution: "in-platform",
    executionNote:
      "Отчёт формируется внутри PerfOps и открывается прямо в платформе.",
  },
  {
    id: "cross-minus",
    name: "Кросс-минусовка",
    shortDescription:
      "Excel-файл с готовыми списками кросс-минус-слов по группам объявлений.",
    longDescription:
      "Кросс-минусовка строит Excel-файл со списками кросс-минусов на основе семантического ядра — готовый для загрузки в рекламную сеть.",
    whenToUse:
      "При запуске новых групп объявлений и при регулярной чистке пересечений между кампаниями.",
    icon: Minus,
    resultFormat: "excel",
    exampleResultName: "Кросс-минус — апрель.xlsx",
    exampleResultSummary:
      "Кросс-минусы для 24 групп объявлений, 1 412 уникальных минус-слов.",
    inputs: ["Семантическое ядро (.xlsx)"],
    supportedConnections: ["google-sheets"],
    acceptedFileTypes: [".xlsx"],
    resultDestination: "Библиотека проекта · Excel-файл",
    execution: "in-platform",
    executionNote: "Файл формируется внутри PerfOps и доступен для скачивания.",
  },
  {
    id: "bd-optimization",
    name: "Оптимизация ставок и бюджетов",
    shortDescription:
      "Аналитический отчёт с рекомендациями по ставкам и распределению бюджета.",
    longDescription:
      "Оптимизация ставок и бюджетов формирует аналитический отчёт с рекомендациями по корректировке ставок и распределению бюджета на основе свежих данных кампаний.",
    whenToUse:
      "Раз в неделю или после крупных изменений в кампаниях, чтобы скорректировать ставки и распределение бюджета.",
    icon: Sparkles,
    resultFormat: "analytics-report",
    exampleResultName: "Рекомендации по ставкам — апрель",
    exampleResultSummary:
      "32 кампании: 11 повышений ставок, 6 снижений, перераспределение бюджета на 18%.",
    inputs: ["Свежая выгрузка статистики (.csv или .xlsx)"],
    supportedConnections: ["google-ads", "yandex-direct"],
    acceptedFileTypes: [".csv", ".xlsx"],
    resultDestination: "Библиотека проекта · аналитический отчёт",
    execution: "external",
    executionNote:
      "Расчёт выполняется во внешней среде PerfOps Compute, готовый отчёт возвращается в платформу.",
  },
  {
    id: "semantics-generator",
    name: "Генератор семантики",
    shortDescription:
      "Excel-файл с дедуплицированным семантическим ядром и кластерами.",
    longDescription:
      "Генератор семантики расширяет сид-список до полного семантического ядра, дедуплицирует его и группирует по кластерам. Готовый Excel-файл сохраняется в Библиотеке проекта.",
    whenToUse:
      "На старте новых кампаний или при расширении охвата по уже работающим направлениям.",
    icon: Type,
    resultFormat: "excel",
    exampleResultName: "Семантическое ядро — апрель.xlsx",
    exampleResultSummary: "4 218 ключей, 36 кластеров, средняя частотность по кластеру.",
    inputs: ["Сид-ключи (.xlsx) или короткий бриф"],
    supportedConnections: ["google-sheets"],
    acceptedFileTypes: [".xlsx", ".csv"],
    resultDestination: "Библиотека проекта · Excel-файл",
    execution: "in-platform",
    executionNote: "Расчёт выполняется внутри PerfOps.",
  },
];

export const getProduct = (id: string | undefined): Product =>
  products.find((p) => p.id === id) ?? products[0];

// ---------- Projects ----------

export interface Project {
  id: string;
  name: string;
  description?: string;
  productId: ProductId;
  /** Человекочитаемое относительное время. */
  updated: string;
  /** ISO для сортировки. */
  updatedAt: string;
  /** Если результат уже сформирован — id записи в Библиотеке. */
  resultLibraryId?: string;
}

export const projects: Project[] = [
  {
    id: "spring-dashboard",
    name: "Весенний дашборд кампаний",
    description: "Сводный отчёт по апрельским кампаниям для еженедельного ревью.",
    productId: "dashboard-builder",
    updated: "2 часа назад",
    updatedAt: "2025-04-25T08:00:00",
    resultLibraryId: "lib-dashboard-apr",
  },
  {
    id: "april-cross-minus",
    name: "Кросс-минусовка — апрель",
    description: "Чистка пересечений по поисковым кампаниям.",
    productId: "cross-minus",
    updated: "вчера",
    updatedAt: "2025-04-24T14:25:00",
    resultLibraryId: "lib-cross-minus-apr",
  },
  {
    id: "weekly-campaign-analysis",
    name: "Еженедельный анализ кампаний",
    description: "Аномалии и просадки по основным направлениям.",
    productId: "campaign-analysis",
    updated: "3 дня назад",
    updatedAt: "2025-04-22T11:00:00",
    resultLibraryId: "lib-campaign-analysis-apr",
  },
  {
    id: "bd-optimization-april",
    name: "Оптимизация ставок — апрель",
    productId: "bd-optimization",
    updated: "4 дня назад",
    updatedAt: "2025-04-21T16:30:00",
    resultLibraryId: "lib-bd-optim-apr",
  },
  {
    id: "semantics-launch",
    name: "Семантика для нового направления",
    description: "Расширение охвата по продуктовой линейке.",
    productId: "semantics-generator",
    updated: "неделю назад",
    updatedAt: "2025-04-18T10:00:00",
    resultLibraryId: "lib-semantics-apr",
  },
  {
    id: "march-dashboard",
    name: "Мартовский дашборд",
    productId: "dashboard-builder",
    updated: "2 апреля",
    updatedAt: "2025-04-02T10:00:00",
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

export interface LibraryEntry {
  id: string;
  name: string;
  kind: LibraryEntryKind;
  /** Для источников — формат файла; для результатов — один из 3 закрытых форматов. */
  format: ResultFormat | "source-file";
  productId?: ProductId;
  projectId: string;
  projectName: string;
  updated: string;
  updatedAt: string;
  size?: string;
}

export const libraryEntries: LibraryEntry[] = [
  {
    id: "lib-dashboard-apr",
    name: "Дашборд кампаний — апрель",
    kind: "result",
    format: "dashboard-link",
    productId: "dashboard-builder",
    projectId: "spring-dashboard",
    projectName: "Весенний дашборд кампаний",
    updated: "2 часа назад",
    updatedAt: "2025-04-25T08:00:00",
  },
  {
    id: "src-campaign-export-apr",
    name: "campaign_export.xlsx",
    kind: "source",
    format: "source-file",
    projectId: "spring-dashboard",
    projectName: "Весенний дашборд кампаний",
    updated: "2 часа назад",
    updatedAt: "2025-04-25T07:50:00",
    size: "412 КБ",
  },
  {
    id: "lib-cross-minus-apr",
    name: "Кросс-минус — апрель.xlsx",
    kind: "result",
    format: "excel",
    productId: "cross-minus",
    projectId: "april-cross-minus",
    projectName: "Кросс-минусовка — апрель",
    updated: "вчера",
    updatedAt: "2025-04-24T14:25:00",
    size: "84 КБ",
  },
  {
    id: "src-semantic-core",
    name: "semantic_core.xlsx",
    kind: "source",
    format: "source-file",
    projectId: "april-cross-minus",
    projectName: "Кросс-минусовка — апрель",
    updated: "вчера",
    updatedAt: "2025-04-24T13:00:00",
    size: "1,2 МБ",
  },
  {
    id: "lib-campaign-analysis-apr",
    name: "Анализ кампаний — апрель",
    kind: "result",
    format: "analytics-report",
    productId: "campaign-analysis",
    projectId: "weekly-campaign-analysis",
    projectName: "Еженедельный анализ кампаний",
    updated: "3 дня назад",
    updatedAt: "2025-04-22T11:00:00",
  },
  {
    id: "src-stats-april",
    name: "stats_april.csv",
    kind: "source",
    format: "source-file",
    projectId: "weekly-campaign-analysis",
    projectName: "Еженедельный анализ кампаний",
    updated: "3 дня назад",
    updatedAt: "2025-04-22T10:30:00",
    size: "88 КБ",
  },
  {
    id: "lib-bd-optim-apr",
    name: "Рекомендации по ставкам — апрель",
    kind: "result",
    format: "analytics-report",
    productId: "bd-optimization",
    projectId: "bd-optimization-april",
    projectName: "Оптимизация ставок — апрель",
    updated: "4 дня назад",
    updatedAt: "2025-04-21T16:30:00",
  },
  {
    id: "lib-semantics-apr",
    name: "Семантическое ядро — апрель.xlsx",
    kind: "result",
    format: "excel",
    productId: "semantics-generator",
    projectId: "semantics-launch",
    projectName: "Семантика для нового направления",
    updated: "неделю назад",
    updatedAt: "2025-04-18T10:00:00",
    size: "1,4 МБ",
  },
];

export const formatLabel = (
  format: LibraryEntry["format"],
): string => {
  if (format === "source-file") return "Файл-источник";
  return resultFormatLabel[format];
};

// ---------- Result actions (per project) ----------

export interface ProjectResultAction {
  label: string;
  /** Видимая иконка действия в таблице проектов. */
  variant: "open-dashboard" | "open-report" | "download-excel" | "none";
}

export const getProjectResultAction = (project: Project): ProjectResultAction => {
  if (!project.resultLibraryId) {
    return { label: "Нет результата", variant: "none" };
  }
  const product = getProduct(project.productId);
  switch (product.resultFormat) {
    case "dashboard-link":
      return { label: "Открыть дашборд", variant: "open-dashboard" };
    case "analytics-report":
      return { label: "Открыть отчёт", variant: "open-report" };
    case "excel":
      return { label: "Скачать Excel-файл", variant: "download-excel" };
  }
};
