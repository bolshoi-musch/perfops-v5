import {
  LayoutDashboard,
  BarChart3,
  Minus,
  Sparkles,
  Type,
  type LucideIcon,
} from "lucide-react";

// ============================================================
// PerfOps V4 — unified product-flow framework data layer
// ============================================================
// Every product is a project type. Each product defines its own
// ordered list of steps drawn from a shared step vocabulary.
// All flows share the same shell, stepper, source selector,
// validation summary, processing panel and result handoff.
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

// ---------- Source selector ----------

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
  library: "Файл, ранее сохранённый в проекте",
  topic: "Короткое описание темы или направления",
  url: "Адрес страницы или книги",
};

// ---------- Flow step vocabulary ----------

export type StepId =
  | "mode"
  | "source"
  | "merge"
  | "params"
  | "metrics-focus"
  | "check"
  | "run"
  | "result";

export const stepLabel: Record<StepId, string> = {
  mode: "Режим",
  source: "Источник",
  merge: "Объединение",
  params: "Параметры",
  "metrics-focus": "Метрики и фокус",
  check: "Проверка",
  run: "Запуск",
  result: "Результат",
};

// ---------- Products ----------

export type ProductId =
  | "dashboard-builder"
  | "campaign-analysis"
  | "cross-minus"
  | "bd-optimization"
  | "semantics-generator";

export interface ProductPageContent {
  /** «Что делает продукт» */
  whatItDoes: string;
  /** «Что вы получите» */
  whatYouGet: string;
  /** «Поддерживаемые источники» — короткие подписи под иконками. */
  supportedSources: string[];
  /** «Предпочтительные источники» */
  preferredSources: string[];
  /** «Советы и рекомендации» */
  tips: string[];
  /** «Ограничения» */
  limitations: string[];
  /** «Где сохраняется результат» */
  resultDestination: string;
}

export interface Product {
  id: ProductId;
  name: string;
  shortDescription: string;
  icon: LucideIcon;
  resultFormat: ResultFormat;
  resultName: string;
  /** Перечень шагов в порядке отображения. */
  steps: StepId[];
  /** Какие типы источников разрешены продуктом. */
  allowedSources: SourceKind[];
  /** Какие подключения может использовать продукт. */
  supportedConnections: ConnectionTypeId[];
  /** Поддерживаемые форматы файлов при ручной загрузке. */
  acceptedFileTypes: string[];
  /** Подсказки на правом «Что можно использовать» — список строк. */
  sourceHelp: string[];
  page: ProductPageContent;
  /** Имя примера результата — то, что увидит пользователь в Библиотеке. */
  exampleResultName: string;
  exampleResultSummary: string;
}

export const products: Product[] = [
  {
    id: "dashboard-builder",
    name: "Конструктор дашбордов",
    shortDescription:
      "Сводный дашборд по выгрузкам кампаний с разбивкой по периодам.",
    icon: LayoutDashboard,
    resultFormat: "dashboard-link",
    resultName: "Ссылка на дашборд",
    steps: ["source", "merge", "check", "run", "result"],
    allowedSources: ["upload", "connection", "library"],
    supportedConnections: ["yandex-direct", "google-ads", "google-sheets"],
    acceptedFileTypes: [".xlsx", ".csv"],
    sourceHelp: [
      "Поддерживаются: .xlsx, .csv",
      "Можно выбрать подключение: Яндекс Директ, Google Ads, Google Sheets",
      "Можно выбрать источник из Библиотеки",
      "Можно добавить второй источник для объединения",
    ],
    page: {
      whatItDoes:
        "Конструктор дашбордов собирает структурированный дашборд по кампаниям из одной или нескольких выгрузок: разбивка по периодам, ключевые метрики и сегменты в одном окне.",
      whatYouGet:
        "Готовый дашборд по ссылке — открывается прямо из Библиотеки проекта, доступен команде и обновляется при перезапуске продукта.",
      supportedSources: [
        ".xlsx, .csv — ручная загрузка",
        "Подключения: Яндекс Директ, Google Ads, Google Sheets",
        "Источник из Библиотеки проекта",
        "Можно объединить два источника",
      ],
      preferredSources: [
        "Свежая выгрузка по кампаниям с разбивкой по дням",
        "Подключение к рекламному кабинету — данные актуализируются автоматически",
      ],
      tips: [
        "Для сравнения периодов добавьте два источника — за прошлый и текущий период.",
        "Если в выгрузке есть колонка с UTM-меткой, дашборд автоматически сгруппирует кампании по источнику.",
      ],
      limitations: [
        "Поддерживается до 100 000 строк на источник.",
        "Источники должны содержать колонку «Кампания» и числовые метрики.",
      ],
      resultDestination: "Библиотека проекта · ссылка на дашборд",
    },
    exampleResultName: "Дашборд кампаний — апрель",
    exampleResultSummary:
      "18 кампаний, разбивка по неделям, метрики CPA / CR / расход.",
  },
  {
    id: "campaign-analysis",
    name: "Анализ кампаний",
    shortDescription:
      "Аналитический отчёт с изменениями, аномалиями и сегментами внимания.",
    icon: BarChart3,
    resultFormat: "analytics-report",
    resultName: "Аналитический отчёт",
    steps: ["source", "metrics-focus", "check", "run", "result"],
    allowedSources: ["upload", "connection", "library"],
    supportedConnections: ["yandex-direct", "google-ads"],
    acceptedFileTypes: [".xlsx", ".csv"],
    sourceHelp: [
      "Поддерживаются: .xlsx, .csv",
      "Можно выбрать подключение или источник из Библиотеки",
      "Фокус анализа можно указать на следующем шаге",
    ],
    page: {
      whatItDoes:
        "Анализ кампаний разбирает выгрузку и формирует аналитический отчёт: изменения за период, аномалии, сегменты с просадкой и точки роста.",
      whatYouGet:
        "Аналитический отчёт, который открывается прямо в платформе. Дополнительно — секция дашборда по тем же данным.",
      supportedSources: [
        ".xlsx, .csv — ручная загрузка",
        "Подключения: Яндекс Директ, Google Ads",
        "Источник из Библиотеки проекта",
      ],
      preferredSources: [
        "Выгрузка с разбивкой по дням за 14–30 дней",
        "Подключение к рекламному кабинету для регулярного анализа",
      ],
      tips: [
        "Используйте поле «Фокус анализа», чтобы указать конкретный сегмент или гипотезу.",
        "Выберите 4–6 ключевых метрик — отчёт получится более сфокусированным.",
      ],
      limitations: [
        "Анализируется не более 60 дней истории за один запуск.",
        "Если в выгрузке нет дат, отчёт строится только по агрегированным значениям.",
      ],
      resultDestination: "Библиотека проекта · аналитический отчёт",
    },
    exampleResultName: "Анализ кампаний — апрель",
    exampleResultSummary:
      "7 аномалий, 3 сегмента с просадкой CR, рекомендации по перераспределению бюджета.",
  },
  {
    id: "semantics-generator",
    name: "Сбор и обработка семантики",
    shortDescription:
      "Excel-файл с дедуплицированным семантическим ядром и кластерами.",
    icon: Type,
    resultFormat: "excel",
    resultName: "Excel-файл с семантикой",
    steps: ["mode", "source", "params", "check", "run", "result"],
    allowedSources: ["topic", "url", "upload", "library"],
    supportedConnections: [],
    acceptedFileTypes: [".xlsx", ".csv", ".txt"],
    sourceHelp: [
      "Можно ввести тему",
      "Можно указать ссылку",
      "Можно загрузить файл",
      "Можно выбрать источник из Библиотеки",
    ],
    page: {
      whatItDoes:
        "Собирает и обрабатывает семантическое ядро: расширяет сид-список, дедуплицирует, кластеризует и применяет минус-фильтры в зависимости от выбранного режима.",
      whatYouGet:
        "Excel-файл с готовым семантическим ядром: фразы, частотности, кластеры, пометки по брендам и исключениям.",
      supportedSources: [
        "Текстовая тема или короткий бриф",
        "Ссылка на страницу-донор",
        ".xlsx, .csv, .txt — ручная загрузка сид-ключей",
        "Источник из Библиотеки проекта",
      ],
      preferredSources: [
        "Список из 10–50 сид-ключей в файле или текстом",
        "Ссылка на посадочную страницу для расширения по контенту",
      ],
      tips: [
        "Для нового направления начните с режима «Охватный», для чистки — с «Консервативный».",
        "Загрузите файл с минус-словами на шаге «Параметры», чтобы сразу отфильтровать ненужное.",
      ],
      limitations: [
        "За один запуск выгружается не более 20 000 фраз.",
        "Кластеризация работает на русском и английском языках.",
      ],
      resultDestination: "Библиотека проекта · Excel-файл",
    },
    exampleResultName: "Семантическое ядро — апрель.xlsx",
    exampleResultSummary:
      "4 218 ключей, 36 кластеров, средняя частотность по кластеру.",
  },
  {
    id: "cross-minus",
    name: "Кросс-минусовка",
    shortDescription:
      "Excel-файл с готовыми списками кросс-минус-слов по группам объявлений.",
    icon: Minus,
    resultFormat: "excel",
    resultName: "Excel-файл с минус-словами",
    steps: ["source", "check", "run", "result"],
    allowedSources: ["upload", "library"],
    supportedConnections: [],
    acceptedFileTypes: [".xlsx", ".csv"],
    sourceHelp: [
      "Поддерживаются: .xlsx, .csv",
      "Нужна выгрузка с кампаниями, ключевыми фразами и показами",
    ],
    page: {
      whatItDoes:
        "Строит Excel-файл с кросс-минусами по группам объявлений на основе семантического ядра — готовый для загрузки в рекламную сеть.",
      whatYouGet:
        "Excel-файл со списками минус-слов, разложенный по кампаниям и группам.",
      supportedSources: [
        ".xlsx, .csv — ручная загрузка",
        "Источник из Библиотеки проекта",
      ],
      preferredSources: [
        "Семантическое ядро с колонками «Кампания», «Группа», «Ключ», «Показы»",
      ],
      tips: [
        "Чем чище ядро, тем компактнее результат — пройдитесь минус-фильтрами заранее.",
        "Если выгрузка большая, загрузите её один раз в Библиотеку и переиспользуйте между запусками.",
      ],
      limitations: [
        "Поддерживается до 200 000 фраз на источник.",
        "Файл должен содержать одну строку на пару «Группа — Ключ».",
      ],
      resultDestination: "Библиотека проекта · Excel-файл",
    },
    exampleResultName: "Кросс-минус — апрель.xlsx",
    exampleResultSummary:
      "Кросс-минусы для 24 групп объявлений, 1 412 уникальных минус-слов.",
  },
  {
    id: "bd-optimization",
    name: "Оптимизация ставок и бюджетов",
    shortDescription:
      "Excel-файл с рекомендациями по ставкам и распределению бюджета.",
    icon: Sparkles,
    resultFormat: "excel",
    resultName: "Excel-файл с рекомендациями",
    steps: ["source", "params", "check", "run", "result"],
    allowedSources: ["upload", "connection", "library"],
    supportedConnections: ["yandex-direct", "google-ads"],
    acceptedFileTypes: [".xlsx", ".csv"],
    sourceHelp: [
      "Поддерживаются: .xlsx, .csv",
      "Можно выбрать подключение или источник из Библиотеки",
    ],
    page: {
      whatItDoes:
        "Считает рекомендации по ставкам и распределению бюджета на основе свежих данных по кампаниям.",
      whatYouGet:
        "Excel-файл с рекомендациями по каждой кампании: новая ставка, изменение бюджета и причина.",
      supportedSources: [
        ".xlsx, .csv — ручная загрузка",
        "Подключения: Яндекс Директ, Google Ads",
        "Источник из Библиотеки проекта",
      ],
      preferredSources: [
        "Подключение к рекламному кабинету — рекомендации обновляются на свежих данных",
        "Выгрузка статистики за 14–28 дней",
      ],
      tips: [
        "Перед запуском уточните цели — целевой CPA, ROAS или ограничение по бюджету.",
        "Если кампаний много, ограничьте набор фильтром по статусу или меткам.",
      ],
      limitations: [
        "Расчёт рассчитан на кампании с понятной целевой метрикой.",
        "Для новых кампаний без накопленной статистики рекомендации будут консервативными.",
      ],
      resultDestination: "Библиотека проекта · Excel-файл",
    },
    exampleResultName: "Рекомендации по ставкам — апрель.xlsx",
    exampleResultSummary:
      "32 кампании: 11 повышений ставок, 6 снижений, перераспределение бюджета на 18%.",
  },
];

export const getProduct = (id: string | undefined): Product =>
  products.find((p) => p.id === id) ?? products[0];

// ---------- Modes (only for semantics generator) ----------

export type SemanticsMode =
  | "conservative"
  | "balanced"
  | "broad"
  | "topic-list"
  | "expand"
  | "cluster";

export interface SemanticsModeDef {
  id: SemanticsMode;
  name: string;
  description: string;
}

export const semanticsModes: SemanticsModeDef[] = [
  {
    id: "conservative",
    name: "Консервативный",
    description: "Минимум расширений, упор на чистоту и точность ядра.",
  },
  {
    id: "balanced",
    name: "Сбалансированный",
    description: "Баланс охвата и чистоты — режим по умолчанию.",
  },
  {
    id: "broad",
    name: "Охватный",
    description: "Максимальное расширение, подходит для новых направлений.",
  },
  {
    id: "topic-list",
    name: "Список по теме",
    description: "Сбор фраз вокруг одной темы или сид-ключа.",
  },
  {
    id: "expand",
    name: "Расширение списка",
    description: "Дополняет уже готовый список синонимами и вариантами.",
  },
  {
    id: "cluster",
    name: "Кластеризация",
    description:
      "Не расширяет фразы, а группирует уже собранное ядро по кластерам.",
  },
];

// ---------- Metrics catalog (for campaign-analysis) ----------

export interface MetricDef {
  id: string;
  name: string;
  hint: string;
}

export const metricsCatalog: MetricDef[] = [
  { id: "impressions", name: "Показы", hint: "impressions" },
  { id: "clicks", name: "Клики", hint: "clicks" },
  { id: "cost", name: "Расход", hint: "cost" },
  { id: "conversions", name: "Конверсии", hint: "conversions" },
  { id: "ctr", name: "CTR", hint: "Кликабельность" },
  { id: "cpc", name: "CPC", hint: "Цена клика" },
  { id: "cr", name: "CR", hint: "Конверсия в действие" },
  { id: "cpa", name: "CPA", hint: "Цена действия" },
];

// ---------- Projects ----------

export interface Project {
  id: string;
  name: string;
  description?: string;
  productId: ProductId;
  updated: string;
  updatedAt: string;
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
    format: "xlsx",
    projectId: "spring-dashboard",
    projectName: "Весенний дашборд кампаний",
    updated: "2 часа назад",
    updatedAt: "2025-04-25T07:50:00",
    size: "412 КБ",
  },
  {
    id: "src-yd-spring",
    name: "Яндекс Директ — Весенние кампании",
    kind: "source",
    format: "yandex-direct",
    projectId: "spring-dashboard",
    projectName: "Весенний дашборд кампаний",
    updated: "сегодня",
    updatedAt: "2025-04-25T09:00:00",
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
    format: "xlsx",
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
    format: "csv",
    projectId: "weekly-campaign-analysis",
    projectName: "Еженедельный анализ кампаний",
    updated: "3 дня назад",
    updatedAt: "2025-04-22T10:30:00",
    size: "88 КБ",
  },
  {
    id: "src-google-ads-main",
    name: "Google Ads — Основной MCC",
    kind: "source",
    format: "google-ads",
    projectId: "weekly-campaign-analysis",
    projectName: "Еженедельный анализ кампаний",
    updated: "3 дня назад",
    updatedAt: "2025-04-22T10:00:00",
  },
  {
    id: "lib-bd-optim-apr",
    name: "Рекомендации по ставкам — апрель.xlsx",
    kind: "result",
    format: "excel",
    productId: "bd-optimization",
    projectId: "bd-optimization-april",
    projectName: "Оптимизация ставок — апрель",
    updated: "4 дня назад",
    updatedAt: "2025-04-21T16:30:00",
    size: "210 КБ",
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
  {
    id: "src-gs-ops",
    name: "Google Sheets — Operations",
    kind: "source",
    format: "google-sheets",
    projectId: "semantics-launch",
    projectName: "Семантика для нового направления",
    updated: "неделю назад",
    updatedAt: "2025-04-18T09:00:00",
  },
];

export const formatLabel = (format: LibraryEntry["format"]): string => {
  if (format === "excel" || format === "dashboard-link" || format === "analytics-report") {
    return resultFormatLabel[format];
  }
  return sourceFormatLabel[format];
};

// ---------- Result actions (per project) ----------

export interface ProjectResultAction {
  label: string;
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
