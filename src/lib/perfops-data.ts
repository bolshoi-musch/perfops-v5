import {
  LayoutDashboard,
  BarChart3,
  Minus,
  Sparkles,
  Type,
  type LucideIcon,
} from "lucide-react";

// ============================================================
// Tools (продукты в каталоге PerfOps)
// ============================================================

export type ToolId =
  | "dashboard-builder"
  | "campaign-analysis"
  | "cross-minus"
  | "bd-optimization"
  | "semantics-generator";

export interface Tool {
  id: ToolId;
  name: string;
  shortDescription: string;
  longDescription: string;
  icon: LucideIcon;
  /** Тип результата, кратко — для карточки в каталоге. */
  resultType: string;
  /** Что нужно на входе. */
  inputs: string[];
  /** Что пользователь получит на выходе. */
  outputs: string[];
  /** Поддерживаемые источники данных. */
  sources: string[];
  /** Куда сохраняется результат. */
  resultDestination: string;
  /** Когда уместно использовать инструмент. */
  whenToUse: string;
  /** Краткий пример результата. */
  exampleResult: string;
  /** Поддерживаемые типы файлов при ручной загрузке. */
  acceptedTypes: string[];
  /** Где исполняется: внутри платформы или во внешней среде. Используется только в детальной странице, без бейджа на карточке. */
  execution: "in-platform" | "external";
  /** id последнего результата в библиотеке, если есть. */
  lastResultLibraryId?: string;
}

export const tools: Tool[] = [
  {
    id: "dashboard-builder",
    name: "Конструктор дашбордов",
    shortDescription: "Сводный дашборд по выгрузкам кампаний",
    longDescription:
      "Собирает структурированный дашборд по кампаниям из одной или нескольких выгрузок и сохраняет результат в Библиотеку PerfOps.",
    icon: LayoutDashboard,
    resultType: "Дашборд",
    inputs: [
      "Выгрузка по кампаниям (.xlsx или .csv)",
      "Опционально: файл статистики за период",
    ],
    outputs: [
      "Сводный дашборд проекта",
      "Структурированная таблица показателей",
      "Версия с привязкой к проекту в Библиотеке",
    ],
    sources: ["Загрузка файла", "Google Sheets", "Google Ads"],
    resultDestination: "Библиотека PerfOps · в текущем проекте",
    whenToUse:
      "Когда нужно быстро собрать единый дашборд по кампаниям для регулярной отчётности или внутреннего ревью.",
    exampleResult:
      "Дашборд «Весна 2025»: 18 кампаний, разбивка по неделям, метрики CPA / CR / расход.",
    acceptedTypes: [".xlsx", ".csv"],
    execution: "in-platform",
    lastResultLibraryId: "dashboard_report_apr",
  },
  {
    id: "campaign-analysis",
    name: "Анализ кампаний",
    shortDescription: "Изменения, аномалии и сегменты внимания",
    longDescription:
      "Анализирует выгрузку по кампаниям и подсвечивает значимые изменения, аномалии и сегменты, на которые стоит обратить внимание.",
    icon: BarChart3,
    resultType: "Отчёт",
    inputs: ["Выгрузка по кампаниям с разбивкой по дням"],
    outputs: [
      "Перечень аномалий с пояснениями",
      "Сегменты, требующие внимания",
      "Сводный отчёт в Библиотеке",
    ],
    sources: ["Загрузка файла", "Google Ads", "Яндекс Директ"],
    resultDestination: "Библиотека PerfOps · в текущем проекте",
    whenToUse:
      "Перед еженедельным ревью кампаний или когда нужно понять, что именно изменилось за период.",
    exampleResult:
      "Отчёт за апрель: 7 аномалий, 3 сегмента с просадкой CR, рекомендации по перераспределению бюджета.",
    acceptedTypes: [".xlsx", ".csv"],
    execution: "in-platform",
  },
  {
    id: "cross-minus",
    name: "Кросс-минусовка",
    shortDescription: "Готовые списки кросс-минус-слов",
    longDescription:
      "Строит списки кросс-минус-слов на основе семантического ядра — готовые для загрузки в рекламную сеть.",
    icon: Minus,
    resultType: "Файл с минус-словами",
    inputs: ["Семантическое ядро (.xlsx)"],
    outputs: [
      "Файл со списками кросс-минусов по группам",
      "Версия в Библиотеке для последующей загрузки в Директ или Ads",
    ],
    sources: ["Загрузка файла", "Google Sheets"],
    resultDestination: "Библиотека PerfOps · в текущем проекте",
    whenToUse:
      "При запуске новых групп объявлений и при регулярной чистке пересечений между кампаниями.",
    exampleResult:
      "Кросс-минусы для 24 групп объявлений, 1 412 уникальных минус-слов.",
    acceptedTypes: [".xlsx"],
    execution: "in-platform",
    lastResultLibraryId: "cross_minus_apr",
  },
  {
    id: "bd-optimization",
    name: "Оптимизация ставок и бюджетов",
    shortDescription: "Рекомендации по ставкам и распределению бюджета",
    longDescription:
      "Рекомендует корректировки ставок и бюджетов на основе самых свежих данных по кампаниям.",
    icon: Sparkles,
    resultType: "Рекомендации",
    inputs: ["Свежая выгрузка статистики (.csv или .xlsx)"],
    outputs: [
      "Список рекомендаций по ставкам",
      "Распределение бюджета по кампаниям",
      "Версия в Библиотеке для согласования",
    ],
    sources: ["Загрузка файла", "Google Ads", "Яндекс Директ"],
    resultDestination: "Библиотека PerfOps · в текущем проекте",
    whenToUse:
      "Раз в неделю или после крупных изменений в кампаниях, чтобы скорректировать ставки и распределение бюджета.",
    exampleResult:
      "Рекомендации по 32 кампаниям: 11 повышений ставок, 6 снижений, перераспределение бюджета на 18%.",
    acceptedTypes: [".csv", ".xlsx"],
    execution: "external",
    lastResultLibraryId: "bd_optim_apr",
  },
  {
    id: "semantics-generator",
    name: "Генератор семантики",
    shortDescription: "Расширение сид-списка до семантического ядра",
    longDescription:
      "Генерирует дедуплицированное семантическое ядро из сид-списка и сохраняет его в Библиотеку PerfOps.",
    icon: Type,
    resultType: "Семантическое ядро",
    inputs: ["Сид-ключи (.xlsx) или короткий бриф"],
    outputs: [
      "Чистое дедуплицированное ядро",
      "Группировка по кластерам",
      "Версия в Библиотеке проекта",
    ],
    sources: ["Загрузка файла", "Google Sheets"],
    resultDestination: "Библиотека PerfOps · в текущем проекте",
    whenToUse:
      "На старте новых кампаний или при расширении охвата по уже работающим направлениям.",
    exampleResult:
      "Ядро на 4 218 ключей, 36 кластеров, средняя частотность по кластеру.",
    acceptedTypes: [".xlsx", ".csv"],
    execution: "in-platform",
    lastResultLibraryId: "semantics_apr",
  },
];

export const getTool = (id: string | undefined): Tool => {
  return tools.find((t) => t.id === id) ?? tools[0];
};

// ============================================================
// Projects
// ============================================================

export type ProjectStatus = "active" | "paused" | "archived";

export interface Project {
  id: string;
  name: string;
  client: string;
  status: ProjectStatus;
  /** Человекочитаемое относительное время. */
  updated: string;
  /** ISO-подобная дата для сортировки (новые — выше). */
  updatedAt: string;
  lastTool: ToolId;
  toolsUsed: number;
  results: number;
}

export const projects: Project[] = [
  {
    id: "spring-campaign-optimization",
    name: "Весенняя оптимизация кампаний",
    client: "Acme Retail",
    status: "active",
    updated: "2 часа назад",
    updatedAt: "2025-04-24T08:10:00",
    lastTool: "dashboard-builder",
    toolsUsed: 4,
    results: 7,
  },
  {
    id: "q2-brand-refresh",
    name: "Обновление бренда Q2",
    client: "Northwind Co.",
    status: "active",
    updated: "вчера",
    updatedAt: "2025-04-23T14:25:00",
    lastTool: "campaign-analysis",
    toolsUsed: 2,
    results: 3,
  },
  {
    id: "always-on-search",
    name: "Постоянный поиск",
    client: "Helios Labs",
    status: "paused",
    updated: "4 дня назад",
    updatedAt: "2025-04-20T11:00:00",
    lastTool: "semantics-generator",
    toolsUsed: 5,
    results: 12,
  },
  {
    id: "winter-clearance",
    name: "Зимняя распродажа",
    client: "Acme Retail",
    status: "archived",
    updated: "2 марта",
    updatedAt: "2025-03-02T10:00:00",
    lastTool: "cross-minus",
    toolsUsed: 3,
    results: 6,
  },
];

export const getProject = (id: string | undefined): Project => {
  return projects.find((p) => p.id === id) ?? projects[0];
};

export const projectStatusLabel: Record<ProjectStatus, string> = {
  active: "Активный",
  paused: "На паузе",
  archived: "В архиве",
};

// ============================================================
// Library
// ============================================================

export type LibraryEntryKind = "source" | "result";
/** Тип-бейдж записи внутри Библиотеки. */
export type LibraryEntryType =
  | "file"
  | "dataset"
  | "report"
  | "dashboard"
  | "export"
  | "link";
export type LibrarySaved = "saved" | "not-saved";

export interface LibraryEntry {
  id: string;
  name: string;
  kind: LibraryEntryKind;
  type: LibraryEntryType;
  tool?: ToolId;
  project: string;
  projectId: string;
  size: string;
  updated: string;
  updatedAt: string;
  saved: LibrarySaved;
  /** Можно ли скачать. */
  downloadable: boolean;
  /** Можно ли поделиться (применимо для дашбордов / ссылок). */
  shareable: boolean;
}

export const libraryEntries: LibraryEntry[] = [
  {
    id: "dashboard_report_apr",
    name: "Дашборд кампаний — апрель",
    kind: "result",
    type: "dashboard",
    tool: "dashboard-builder",
    project: "Весенняя оптимизация кампаний",
    projectId: "spring-campaign-optimization",
    size: "—",
    updated: "1 час назад",
    updatedAt: "2025-04-24T09:10:00",
    saved: "saved",
    downloadable: false,
    shareable: true,
  },
  {
    id: "campaign_export",
    name: "campaign_export.xlsx",
    kind: "source",
    type: "file",
    project: "Весенняя оптимизация кампаний",
    projectId: "spring-campaign-optimization",
    size: "412 КБ",
    updated: "2 часа назад",
    updatedAt: "2025-04-24T08:00:00",
    saved: "saved",
    downloadable: true,
    shareable: false,
  },
  {
    id: "cross_minus_apr",
    name: "Кросс-минус — апрель",
    kind: "result",
    type: "export",
    tool: "cross-minus",
    project: "Весенняя оптимизация кампаний",
    projectId: "spring-campaign-optimization",
    size: "84 КБ",
    updated: "вчера",
    updatedAt: "2025-04-23T16:40:00",
    saved: "saved",
    downloadable: true,
    shareable: false,
  },
  {
    id: "bd_optim_apr",
    name: "Рекомендации по ставкам и бюджетам",
    kind: "result",
    type: "report",
    tool: "bd-optimization",
    project: "Весенняя оптимизация кампаний",
    projectId: "spring-campaign-optimization",
    size: "—",
    updated: "вчера",
    updatedAt: "2025-04-23T11:20:00",
    saved: "not-saved",
    downloadable: true,
    shareable: false,
  },
  {
    id: "stats_april",
    name: "stats_april.csv",
    kind: "source",
    type: "dataset",
    project: "Весенняя оптимизация кампаний",
    projectId: "spring-campaign-optimization",
    size: "88 КБ",
    updated: "вчера",
    updatedAt: "2025-04-23T09:00:00",
    saved: "saved",
    downloadable: true,
    shareable: false,
  },
  {
    id: "semantics_apr",
    name: "Семантическое ядро — апрель",
    kind: "result",
    type: "dataset",
    tool: "semantics-generator",
    project: "Весенняя оптимизация кампаний",
    projectId: "spring-campaign-optimization",
    size: "1,4 МБ",
    updated: "3 дня назад",
    updatedAt: "2025-04-21T15:00:00",
    saved: "saved",
    downloadable: true,
    shareable: false,
  },
  {
    id: "semantic_core",
    name: "semantic_core.xlsx",
    kind: "source",
    type: "file",
    project: "Весенняя оптимизация кампаний",
    projectId: "spring-campaign-optimization",
    size: "1,2 МБ",
    updated: "28 марта",
    updatedAt: "2025-03-28T10:00:00",
    saved: "saved",
    downloadable: true,
    shareable: false,
  },
  {
    id: "shared_dashboard_q1",
    name: "Дашборд Q1 — внешняя ссылка",
    kind: "result",
    type: "link",
    tool: "dashboard-builder",
    project: "Обновление бренда Q2",
    projectId: "q2-brand-refresh",
    size: "—",
    updated: "5 апреля",
    updatedAt: "2025-04-05T12:00:00",
    saved: "saved",
    downloadable: false,
    shareable: true,
  },
];

export const libraryKindLabel: Record<LibraryEntryKind, string> = {
  source: "Источник",
  result: "Результат",
};

export const libraryTypeLabel: Record<LibraryEntryType, string> = {
  file: "файл",
  dataset: "датасет",
  report: "отчёт",
  dashboard: "дашборд",
  export: "экспорт",
  link: "ссылка",
};

// ============================================================
// Connections (типы интеграций + конкретные аккаунты)
// ============================================================

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
    description: "Чтение статистики и структуры кампаний.",
    accounts: [
      {
        id: "yd-acme",
        name: "Acme Retail — основной",
        identifier: "acme-retail@yandex.example",
        status: "action-required",
        lastSync: "вчера",
      },
      {
        id: "yd-helios",
        name: "Helios Labs",
        identifier: "helios@yandex.example",
        status: "connected",
        lastSync: "1 час назад",
      },
    ],
  },
  {
    id: "google-ads",
    name: "Google Ads",
    description: "Выгрузки по кампаниям и отправка минус-слов.",
    accounts: [
      {
        id: "ga-acme",
        name: "Acme Retail — Ads",
        identifier: "acme-retail@ads.example",
        status: "connected",
        lastSync: "30 мин назад",
      },
      {
        id: "ga-northwind",
        name: "Northwind Co.",
        identifier: "northwind@ads.example",
        status: "connected",
        lastSync: "2 часа назад",
      },
    ],
  },
  {
    id: "google-sheets",
    name: "Google Sheets",
    description: "Чтение исходных данных и запись результатов в книгу.",
    accounts: [
      {
        id: "gs-ops",
        name: "Ops — Acme Retail",
        identifier: "ops@acme-retail.example",
        status: "connected",
        lastSync: "сегодня",
      },
    ],
  },
  {
    id: "yandex-metrika",
    name: "Яндекс Метрика",
    description: "Поведенческие данные и сегменты для анализа.",
    accounts: [
      {
        id: "ym-acme",
        name: "Acme Retail",
        identifier: "счётчик 12345678",
        status: "connected",
        lastSync: "3 часа назад",
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

export const getConnectionType = (id: string | undefined): ConnectionType => {
  return connectionTypes.find((t) => t.id === id) ?? connectionTypes[0];
};

export const accountStatusLabel: Record<AccountStatus, string> = {
  connected: "Подключено",
  "action-required": "Требуется действие",
  disconnected: "Отключено",
};

// ============================================================
// Activity log
// ============================================================

export const recentActivity: { when: string; text: string }[] = [
  { when: "1 час назад", text: "Дашборд кампаний — апрель сохранён в Библиотеку" },
  { when: "2 часа назад", text: "campaign_export.xlsx загружен в проект" },
  { when: "вчера", text: "Запуск оптимизации ставок завершён (регистрация деградирована)" },
  { when: "вчера", text: "Кросс-минус — апрель сохранён в Библиотеку" },
  { when: "28 марта", text: "semantic_core.xlsx загружен в проект" },
];
