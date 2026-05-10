import { createFileRoute } from "@tanstack/react-router";
import { AppShellV4 } from "@/components/perfops-v4/AppShellV4";
import { PageHeaderV4 } from "@/components/perfops-v4/PageHeaderV4";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  CheckCircle2,
  CircleSlash,
  Download,
  ExternalLink,
  FileSpreadsheet,
  Info,
  Loader2,
  RotateCcw,
  Upload,
  XCircle,
  LifeBuoy,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export const Route = createFileRoute("/v4/flow-states")({
  head: () => ({ meta: [{ title: "Справочник состояний — PerfOps" }] }),
  component: FlowStatesPage,
});

type Tone = "neutral" | "info" | "success" | "warning" | "blocked" | "processing";

interface StateDef {
  id: string;
  name: string;
  tone: Tone;
  description: string;
  example: ReactNode;
}

const toneStyles: Record<Tone, { dot: string; chip: string; label: string }> = {
  neutral: {
    dot: "bg-muted-foreground/40",
    chip: "bg-muted text-muted-foreground border-border",
    label: "neutral",
  },
  info: {
    dot: "bg-info",
    chip: "bg-info-soft text-info border-info/30",
    label: "info",
  },
  success: {
    dot: "bg-success",
    chip: "bg-success-soft text-success border-success/30",
    label: "success",
  },
  warning: {
    dot: "bg-warning",
    chip: "bg-warning-soft text-warning-foreground border-warning/30",
    label: "warning",
  },
  blocked: {
    dot: "bg-destructive",
    chip: "bg-destructive-soft text-destructive border-destructive/30",
    label: "blocked",
  },
  processing: {
    dot: "bg-primary",
    chip: "bg-accent text-accent-foreground border-primary/30",
    label: "processing",
  },
};

const states: StateDef[] = [
  {
    id: "source-empty",
    name: "Источник не выбран",
    tone: "neutral",
    description:
      "Пользователь может загрузить файл, выбрать подключённый аккаунт или источник из Библиотеки.",
    example: (
      <div className="rounded-md border border-dashed bg-surface px-4 py-6 text-center">
        <Upload className="mx-auto h-6 w-6 text-muted-foreground" />
        <p className="mt-2 text-sm font-medium text-foreground">Перетащите файл сюда</p>
        <p className="mt-1 text-xs text-muted-foreground">.xlsx или .csv, до 25 МБ</p>
      </div>
    ),
  },
  {
    id: "uploading",
    name: "Идёт загрузка",
    tone: "info",
    description: "Источник передаётся на сервер. Пользователь видит прогресс.",
    example: (
      <div className="flex items-center gap-3 rounded-md border bg-surface px-3 py-2 text-sm">
        <Loader2 className="h-4 w-4 animate-spin text-primary" />
        <span className="flex-1 text-foreground">campaign_export.xlsx</span>
        <span className="text-xs text-muted-foreground">68%</span>
      </div>
    ),
  },
  {
    id: "source-selected",
    name: "Источник выбран",
    tone: "info",
    description: "Источник добавлен и готов к проверке.",
    example: (
      <div className="flex items-center gap-2 rounded-md border bg-info-soft px-3 py-2 text-sm text-info">
        <FileSpreadsheet className="h-4 w-4" /> campaign_export.xlsx — готов к проверке
      </div>
    ),
  },
  {
    id: "validating",
    name: "Проверка",
    tone: "info",
    description: "Платформа проверяет источник, параметры и структуру данных.",
    example: (
      <div className="flex items-center gap-2 rounded-md border bg-info-soft px-3 py-2 text-sm text-info">
        <Loader2 className="h-4 w-4 animate-spin" /> Проверяем источник и параметры…
      </div>
    ),
  },
  {
    id: "source-accepted",
    name: "Источник принят",
    tone: "success",
    description:
      "Источник соответствует требованиям продукта. Можно запускать обработку.",
    example: (
      <div className="flex items-center gap-2 rounded-md border bg-success-soft px-3 py-2 text-sm text-success">
        <CheckCircle2 className="h-4 w-4" /> campaign_export.xlsx — 2 184 строки приняты
      </div>
    ),
  },
  {
    id: "warning",
    name: "Предупреждение",
    tone: "warning",
    description:
      "Есть замечания, но они не блокируют запуск. Пользователь может продолжить или вернуться и исправить источник.",
    example: (
      <div className="rounded-md border border-warning/30 bg-warning-soft px-3 py-2 text-sm">
        <p className="flex items-center gap-2 font-medium text-warning-foreground">
          <AlertTriangle className="h-4 w-4" /> В выгрузке есть дубли по 14 строкам
        </p>
        <p className="mt-1 text-xs text-warning-foreground/80">
          Можно продолжить — дубли будут схлопнуты автоматически.
        </p>
      </div>
    ),
  },
  {
    id: "blocked",
    name: "Блокировка",
    tone: "blocked",
    description:
      "Запуск невозможен: источник или параметры не соответствуют обязательным требованиям.",
    example: (
      <div className="rounded-md border border-destructive/30 bg-destructive-soft px-3 py-2 text-sm">
        <p className="flex items-center gap-2 font-medium text-destructive">
          <CircleSlash className="h-4 w-4" /> В файле не хватает обязательной колонки «Кампания»
        </p>
        <Button size="sm" variant="outline" className="mt-2">
          Загрузить другой файл
        </Button>
      </div>
    ),
  },
  {
    id: "processing",
    name: "Идёт обработка",
    tone: "processing",
    description:
      "Продукт выполняет обработку. Пользователь может вернуться позже.",
    example: (
      <div className="flex items-center gap-3 rounded-md border bg-accent px-3 py-2 text-sm">
        <Loader2 className="h-4 w-4 animate-spin text-primary" />
        <span className="text-foreground">Кросс-минусовка: формирование файла…</span>
      </div>
    ),
  },
  {
    id: "result-ready",
    name: "Результат готов",
    tone: "success",
    description: "Результат создан и сохранён в Библиотеке.",
    example: (
      <div className="rounded-md border border-success/30 bg-success-soft px-3 py-2 text-sm">
        <p className="flex items-center gap-2 font-medium text-success">
          <CheckCircle2 className="h-4 w-4" /> Результат сохранён в Библиотеке
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          <Button size="sm">
            <ExternalLink className="h-3 w-3" /> Открыть результат
          </Button>
          <Button size="sm" variant="outline">
            Открыть Библиотеку
          </Button>
        </div>
      </div>
    ),
  },
  {
    id: "result-not-saved",
    name: "Результат готов, но не сохранён в Библиотеке",
    tone: "warning",
    description:
      "Результат создан локально, но сохранить его в Библиотеке не удалось. Пользователь может повторить сохранение или скачать локальную копию.",
    example: (
      <div className="rounded-md border border-warning/30 bg-warning-soft px-3 py-2 text-sm">
        <p className="flex items-center gap-2 font-medium text-warning-foreground">
          <Info className="h-4 w-4" /> Результат готов, но не сохранён в Библиотеке.
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          <Button size="sm">
            <RotateCcw className="h-3 w-3" /> Повторить сохранение
          </Button>
          <Button size="sm" variant="outline">
            <Download className="h-3 w-3" /> Скачать локальную копию
          </Button>
        </div>
      </div>
    ),
  },
  {
    id: "save-retry",
    name: "Повторное сохранение",
    tone: "processing",
    description:
      "Платформа повторно пытается сохранить результат в Библиотеке.",
    example: (
      <div className="flex items-center gap-2 rounded-md border bg-accent px-3 py-2 text-sm">
        <Loader2 className="h-4 w-4 animate-spin text-primary" />
        <span className="text-foreground">
          Повторное сохранение результата… (попытка 2 из 3)
        </span>
      </div>
    ),
  },
  {
    id: "save-failed",
    name: "Сохранить результат не удалось",
    tone: "blocked",
    description:
      "Результат не удалось сохранить после повторных попыток. Пользователь может скачать локальную копию или обратиться в поддержку.",
    example: (
      <div className="rounded-md border border-destructive/30 bg-destructive-soft px-3 py-2 text-sm">
        <p className="flex items-center gap-2 font-medium text-destructive">
          <XCircle className="h-4 w-4" /> Не удалось сохранить результат в Библиотеке
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          <Button size="sm" variant="outline">
            <Download className="h-3 w-3" /> Скачать локальную копию
          </Button>
          <Button size="sm" variant="ghost">
            <LifeBuoy className="h-3 w-3" /> Связаться с поддержкой
          </Button>
        </div>
      </div>
    ),
  },
];

// --------------------- Example: Конструктор дашбордов ---------------------
// Не отдельный набор состояний, а примеры, как общие тональности
// применяются в продукте «Конструктор дашбордов» (процесс «Подготовка
// дашборда»). Используем те же компоненты, что и общие состояния.

interface DashbotExample {
  group: string;
  tone: Tone;
  title: string;
  example: ReactNode;
}

const dashbotExamples: DashbotExample[] = [
  {
    group: "Источник не выбран",
    tone: "neutral",
    title: "Первый источник пуст",
    example: (
      <div className="rounded-md border border-dashed bg-surface px-4 py-6 text-center">
        <Upload className="mx-auto h-6 w-6 text-muted-foreground" />
        <p className="mt-2 text-sm font-medium text-foreground">
          Добавьте первый источник
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Файл, подключённый аккаунт или источник из Библиотеки.
        </p>
      </div>
    ),
  },
  {
    group: "Источник выбран",
    tone: "info",
    title: "Второй источник равноправен",
    example: (
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 rounded-md border bg-info-soft px-3 py-2 text-xs text-info">
          <FileSpreadsheet className="h-3.5 w-3.5" /> Источник 1 — campaign_export.xlsx
        </div>
        <div className="flex items-center gap-2 rounded-md border bg-info-soft px-3 py-2 text-xs text-info">
          <FileSpreadsheet className="h-3.5 w-3.5" /> Источник 2 — Яндекс Директ · Основной кабинет
        </div>
      </div>
    ),
  },
  {
    group: "Проверка (clean)",
    tone: "success",
    title: "Проверка пройдена",
    example: (
      <div className="flex items-center gap-2 rounded-md border bg-success-soft px-3 py-2 text-sm text-success">
        <CheckCircle2 className="h-4 w-4" />
        План объединения подтверждён, всё готово к запуску.
      </div>
    ),
  },
  {
    group: "Предупреждение",
    tone: "warning",
    title: "Совпадение по второму источнику 87%",
    example: (
      <div className="rounded-md border border-warning/30 bg-warning-soft px-3 py-2 text-sm">
        <p className="flex items-center gap-2 font-medium text-warning-foreground">
          <AlertTriangle className="h-4 w-4" /> 142 строки только в источнике 1
        </p>
        <p className="mt-1 text-xs text-warning-foreground/80">
          Можно продолжить — они будут включены как есть.
        </p>
      </div>
    ),
  },
  {
    group: "Блокировка",
    tone: "blocked",
    title: "Не найдены ключи объединения",
    example: (
      <div className="rounded-md border border-destructive/30 bg-destructive-soft px-3 py-2 text-sm">
        <p className="flex items-center gap-2 font-medium text-destructive">
          <CircleSlash className="h-4 w-4" /> Не удалось сопоставить источники по ключам
        </p>
        <Button size="sm" variant="outline" className="mt-2">
          Настроить объединение
        </Button>
      </div>
    ),
  },
  {
    group: "Идёт обработка",
    tone: "processing",
    title: "Сборка дашборда",
    example: (
      <div className="flex items-center gap-3 rounded-md border bg-accent px-3 py-2 text-sm">
        <Loader2 className="h-4 w-4 animate-spin text-primary" />
        <span className="text-foreground">Подготовка дашборда…</span>
      </div>
    ),
  },
  {
    group: "Результат готов",
    tone: "success",
    title: "Дашборд готов",
    example: (
      <div className="rounded-md border border-success/30 bg-success-soft px-3 py-2 text-sm">
        <p className="flex items-center gap-2 font-medium text-success">
          <CheckCircle2 className="h-4 w-4" /> Дашборд готов и сохранён в Библиотеке
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          <Button size="sm">
            <ExternalLink className="h-3 w-3" /> Открыть дашборд
          </Button>
          <Button size="sm" variant="outline">
            Открыть Библиотеку
          </Button>
        </div>
      </div>
    ),
  },
  {
    group: "Результат готов, но не сохранён в Библиотеке",
    tone: "warning",
    title: "Дашборд собран, регистрация в Библиотеке не удалась",
    example: (
      <div className="rounded-md border border-warning/30 bg-warning-soft px-3 py-2 text-sm">
        <p className="flex items-center gap-2 font-medium text-warning-foreground">
          <Info className="h-4 w-4" /> Дашборд готов, но запись в Библиотеке не создана.
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          <Button size="sm">
            <RotateCcw className="h-3 w-3" /> Повторить сохранение
          </Button>
          <Button size="sm" variant="outline">
            <ExternalLink className="h-3 w-3" /> Открыть дашборд
          </Button>
        </div>
      </div>
    ),
  },
];

// --------------------- Example: Анализ кампаний ---------------------
// Те же общие тональности, применённые к процессу «Анализ рекламных кампаний».

interface CampaignAnalysisExample {
  group: string;
  tone: Tone;
  title: string;
  example: ReactNode;
}

const campaignAnalysisExamples: CampaignAnalysisExample[] = [
  {
    group: "Источник не выбран",
    tone: "neutral",
    title: "Файл со статистикой не загружен",
    example: (
      <div className="rounded-md border border-dashed bg-surface px-4 py-6 text-center">
        <Upload className="mx-auto h-6 w-6 text-muted-foreground" />
        <p className="mt-2 text-sm font-medium text-foreground">
          Загрузите выгрузку рекламной статистики
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          CSV или XLSX, до 5 МБ. Также можно выбрать подключение или источник из Библиотеки.
        </p>
      </div>
    ),
  },
  {
    group: "Метрики и фокус — нераспознанные колонки",
    tone: "warning",
    title: "Часть колонок не распознана",
    example: (
      <div className="rounded-md border border-warning/40 bg-warning-soft px-3 py-2 text-sm">
        <p className="flex items-center gap-2 font-medium text-warning-foreground">
          <AlertTriangle className="h-4 w-4" /> 3 колонки требуют уточнения типа
        </p>
        <p className="mt-1 text-xs text-warning-foreground/80">
          Укажите для каждой: абсолютная, относительная или пропустить.
        </p>
      </div>
    ),
  },
  {
    group: "Метрики — нет абсолютной",
    tone: "blocked",
    title: "Выбраны только относительные метрики",
    example: (
      <div className="rounded-md border border-destructive/30 bg-destructive-soft px-3 py-2 text-sm text-destructive">
        <p className="flex items-center gap-2 font-medium">
          <CircleSlash className="h-4 w-4" /> Хотя бы одна метрика должна быть абсолютной
        </p>
        <p className="mt-1 text-xs">
          Например: клики, конверсии или расход.
        </p>
      </div>
    ),
  },
  {
    group: "Проверка (clean)",
    tone: "success",
    title: "Источник принят, метрики выбраны",
    example: (
      <div className="flex items-center gap-2 rounded-md border bg-success-soft px-3 py-2 text-sm text-success">
        <CheckCircle2 className="h-4 w-4" />
        Структура выгрузки в порядке, можно запускать анализ.
      </div>
    ),
  },
  {
    group: "Проверка (warning)",
    tone: "warning",
    title: "Есть пустые значения",
    example: (
      <div className="rounded-md border border-warning/40 bg-warning-soft px-3 py-2 text-sm">
        <p className="flex items-center gap-2 font-medium text-warning-foreground">
          <AlertTriangle className="h-4 w-4" /> 14 строк с пустой валютой
        </p>
        <p className="mt-1 text-xs text-warning-foreground/80">
          Можно продолжить — такие строки будут пропущены.
        </p>
      </div>
    ),
  },
  {
    group: "Проверка (blocked)",
    tone: "blocked",
    title: "Не хватает обязательных колонок",
    example: (
      <div className="rounded-md border border-destructive/30 bg-destructive-soft px-3 py-2 text-sm text-destructive">
        <p className="flex items-center gap-2 font-medium">
          <CircleSlash className="h-4 w-4" /> Нет колонок campaign_id и date
        </p>
        <p className="mt-1 text-xs">
          Запуск невозможен. Загрузите выгрузку с этими колонками.
        </p>
      </div>
    ),
  },
  {
    group: "Идёт обработка",
    tone: "processing",
    title: "Анализ кампаний",
    example: (
      <div className="flex items-center gap-3 rounded-md border bg-accent px-3 py-2 text-sm">
        <Loader2 className="h-4 w-4 animate-spin text-primary" />
        <span className="text-foreground">Готовим аналитический отчёт…</span>
      </div>
    ),
  },
  {
    group: "Результат готов",
    tone: "success",
    title: "Аналитический отчёт готов",
    example: (
      <div className="rounded-md border border-success/30 bg-success-soft px-3 py-2 text-sm">
        <p className="flex items-center gap-2 font-medium text-success">
          <CheckCircle2 className="h-4 w-4" /> Отчёт готов и сохранён в Библиотеке
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          <Button size="sm">
            <ExternalLink className="h-3 w-3" /> Открыть отчёт
          </Button>
          <Button size="sm" variant="outline">
            <ExternalLink className="h-3 w-3" /> Открыть дашборд
          </Button>
        </div>
      </div>
    ),
  },
  {
    group: "Результат не готов",
    tone: "warning",
    title: "Отчёт ещё не готов",
    example: (
      <div className="rounded-md border border-warning/40 bg-warning-soft px-3 py-2 text-sm">
        <p className="flex items-center gap-2 font-medium text-warning-foreground">
          <Info className="h-4 w-4" /> Анализ ещё выполняется или произошла ошибка
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          <Button size="sm" variant="outline">
            <RotateCcw className="h-3 w-3" /> Обновить
          </Button>
        </div>
      </div>
    ),
  },
];

function FlowStatesPage() {
  return (
    <AppShellV4>
      <PageHeaderV4
        title="Справочник состояний"
        subtitle="Все состояния продуктовых сценариев — от выбора источника до сохранения результата. Технические тональности (info, warning и т. п.) показаны как внутренний справочник и не используются в пользовательском интерфейсе."
      />
      <div className="grid gap-3 lg:grid-cols-2">
        {states.map((s) => {
          const tone = toneStyles[s.tone];
          return (
            <Card key={s.id} id={s.id} className="border bg-card shadow-none">
              <CardContent className="space-y-3 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                      <span className={cn("h-1.5 w-1.5 rounded-full", tone.dot)} />
                      {s.name}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">{s.description}</p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-0.5">
                    <span className="text-[9px] uppercase tracking-wide text-muted-foreground">
                      tone
                    </span>
                    <span
                      className={cn(
                        "inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-mono lowercase",
                        tone.chip,
                      )}
                    >
                      {tone.label}
                    </span>
                  </div>
                </div>
                <div className="rounded-md border-t pt-3">{s.example}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Subsection: how the same tones look inside «Конструктор дашбордов».
          Это примеры внутри общего справочника, а не параллельная система. */}
      <section className="mt-10 border-t pt-6">
        <h2 className="text-base font-semibold text-foreground">
          Пример: Конструктор дашбордов
        </h2>
        <p className="mt-1 max-w-2xl text-xs text-muted-foreground">
          Те же общие тональности, но применённые к процессу «Подготовка
          дашборда». Сами тоны и компоненты не меняются.
        </p>
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {dashbotExamples.map((s, i) => {
            const tone = toneStyles[s.tone];
            return (
              <Card key={i} className="border bg-card shadow-none">
                <CardContent className="space-y-3 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                        {s.group}
                      </p>
                      <p className="mt-0.5 flex items-center gap-2 text-sm font-semibold text-foreground">
                        <span className={cn("h-1.5 w-1.5 rounded-full", tone.dot)} />
                        {s.title}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-mono lowercase",
                        tone.chip,
                      )}
                    >
                      {tone.label}
                    </span>
                  </div>
                  <div className="rounded-md border-t pt-3">{s.example}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Subsection: how the same tones look inside «Анализ кампаний». */}
      <section className="mt-10 border-t pt-6">
        <h2 className="text-base font-semibold text-foreground">
          Пример: Анализ кампаний
        </h2>
        <p className="mt-1 max-w-2xl text-xs text-muted-foreground">
          Те же общие тональности, применённые к процессу «Анализ рекламных
          кампаний». Тоны и компоненты не меняются.
        </p>
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {campaignAnalysisExamples.map((s, i) => {
            const tone = toneStyles[s.tone];
            return (
              <Card key={i} className="border bg-card shadow-none">
                <CardContent className="space-y-3 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                        {s.group}
                      </p>
                      <p className="mt-0.5 flex items-center gap-2 text-sm font-semibold text-foreground">
                        <span className={cn("h-1.5 w-1.5 rounded-full", tone.dot)} />
                        {s.title}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-mono lowercase",
                        tone.chip,
                      )}
                    >
                      {tone.label}
                    </span>
                  </div>
                  <div className="rounded-md border-t pt-3">{s.example}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </AppShellV4>
  );
}
