import { createFileRoute } from "@tanstack/react-router";
import { AppShellV3 } from "@/components/perfops-v3/AppShellV3";
import { PageHeaderV3 } from "@/components/perfops-v3/PageHeaderV3";
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

export const Route = createFileRoute("/v3/flow-states")({
  head: () => ({ meta: [{ title: "Справочник состояний — PerfOps V3" }] }),
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
    label: "Нейтральное",
  },
  info: {
    dot: "bg-info",
    chip: "bg-info-soft text-info border-info/30",
    label: "Информационное",
  },
  success: {
    dot: "bg-success",
    chip: "bg-success-soft text-success border-success/30",
    label: "Успешное",
  },
  warning: {
    dot: "bg-warning",
    chip: "bg-warning-soft text-warning-foreground border-warning/30",
    label: "Предупреждение",
  },
  blocked: {
    dot: "bg-destructive",
    chip: "bg-destructive-soft text-destructive border-destructive/30",
    label: "Блокирующее",
  },
  processing: {
    dot: "bg-primary",
    chip: "bg-accent text-accent-foreground border-primary/30",
    label: "В процессе",
  },
};

const states: StateDef[] = [
  {
    id: "idle-upload",
    name: "Загрузка — ожидание",
    tone: "neutral",
    description: "Источник ещё не выбран. Пользователь может загрузить файл или подключить аккаунт.",
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
    description: "Файл передаётся на сервер. Прогресс виден пользователю.",
    example: (
      <div className="flex items-center gap-3 rounded-md border bg-surface px-3 py-2 text-sm">
        <Loader2 className="h-4 w-4 animate-spin text-primary" />
        <span className="flex-1 text-foreground">campaign_export.xlsx</span>
        <span className="text-xs text-muted-foreground">68%</span>
      </div>
    ),
  },
  {
    id: "validating",
    name: "Проверка",
    tone: "info",
    description: "Платформа проверяет структуру и содержимое источника.",
    example: (
      <div className="flex items-center gap-2 rounded-md border bg-info-soft px-3 py-2 text-sm text-info">
        <Loader2 className="h-4 w-4 animate-spin" /> Проверяем структуру файла…
      </div>
    ),
  },
  {
    id: "invalid-file",
    name: "Файл невалиден",
    tone: "blocked",
    description: "Источник не соответствует требованиям и не может быть использован.",
    example: (
      <div className="rounded-md border border-destructive/30 bg-destructive-soft px-3 py-2 text-sm">
        <p className="flex items-center gap-2 font-medium text-destructive">
          <XCircle className="h-4 w-4" /> В файле не хватает обязательной колонки «Кампания»
        </p>
        <Button size="sm" variant="outline" className="mt-2">
          Загрузить другой файл
        </Button>
      </div>
    ),
  },
  {
    id: "accepted-file",
    name: "Файл принят",
    tone: "success",
    description: "Источник прошёл валидацию и готов к запуску.",
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
    description: "Источник можно использовать, но есть риски, о которых стоит предупредить.",
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
    description: "Запуск невозможен из-за внешней причины: подключение, лимит, недоступность сервиса.",
    example: (
      <div className="rounded-md border border-destructive/30 bg-destructive-soft px-3 py-2 text-sm">
        <p className="flex items-center gap-2 font-medium text-destructive">
          <CircleSlash className="h-4 w-4" /> Подключение Яндекс Директ требует переподключения
        </p>
        <Button size="sm" variant="outline" className="mt-2">
          Перейти к подключениям
        </Button>
      </div>
    ),
  },
  {
    id: "processing",
    name: "Идёт обработка",
    tone: "processing",
    description: "Запуск выполняется. Пользователь может вернуться позже.",
    example: (
      <div className="flex items-center gap-3 rounded-md border bg-accent px-3 py-2 text-sm">
        <Loader2 className="h-4 w-4 animate-spin text-primary" />
        <span className="text-foreground">Кросс-минусовка — апрель: формирование файла…</span>
      </div>
    ),
  },
  {
    id: "local-result",
    name: "Локальный результат готов",
    tone: "info",
    description: "Файл рассчитан, но ещё не зарегистрирован в Библиотеке.",
    example: (
      <div className="flex items-center gap-3 rounded-md border bg-surface px-3 py-2 text-sm">
        <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
        <span className="flex-1 text-foreground">Кросс-минус — апрель.xlsx</span>
        <Button size="sm" variant="outline">
          <Download className="h-3 w-3" /> Скачать локальный результат
        </Button>
      </div>
    ),
  },
  {
    id: "result-saved",
    name: "Результат сохранён в Библиотеке",
    tone: "success",
    description: "Результат успешно зарегистрирован в проекте и доступен всей команде.",
    example: (
      <div className="rounded-md border border-success/30 bg-success-soft px-3 py-2 text-sm">
        <p className="flex items-center gap-2 font-medium text-success">
          <CheckCircle2 className="h-4 w-4" /> Результат сохранён в Библиотеке проекта
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          <Button size="sm">
            <ExternalLink className="h-3 w-3" /> Открыть результат
          </Button>
          <Button size="sm" variant="outline">
            Открыть библиотеку
          </Button>
        </div>
      </div>
    ),
  },
  {
    id: "registration-degraded",
    name: "Регистрация результата деградирована",
    tone: "warning",
    description: "Локальный результат есть, но не сохранён в Библиотеке. Можно скачать вручную или повторить регистрацию.",
    example: (
      <div className="rounded-md border border-warning/30 bg-warning-soft px-3 py-2 text-sm">
        <p className="flex items-center gap-2 font-medium text-warning-foreground">
          <Info className="h-4 w-4" /> Результат пока не сохранён в Библиотеке
        </p>
        <p className="mt-1 text-xs text-warning-foreground/80">
          Файл готов локально — можно скачать или повторить регистрацию.
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          <Button size="sm">
            <RotateCcw className="h-3 w-3" /> Повторить регистрацию
          </Button>
          <Button size="sm" variant="outline">
            <Download className="h-3 w-3" /> Скачать локальный результат
          </Button>
        </div>
      </div>
    ),
  },
  {
    id: "registration-retry",
    name: "Регистрация результата — повторная попытка",
    tone: "processing",
    description: "Платформа пытается заново зарегистрировать готовый результат в Библиотеке.",
    example: (
      <div className="flex items-center gap-2 rounded-md border bg-accent px-3 py-2 text-sm">
        <Loader2 className="h-4 w-4 animate-spin text-primary" />
        <span className="text-foreground">Повторная регистрация результата… (попытка 2 из 3)</span>
      </div>
    ),
  },
  {
    id: "registration-failed",
    name: "Регистрация результата не удалась",
    tone: "blocked",
    description: "Терминальная ошибка регистрации. Локальный результат можно скачать, далее — в поддержку.",
    example: (
      <div className="rounded-md border border-destructive/30 bg-destructive-soft px-3 py-2 text-sm">
        <p className="flex items-center gap-2 font-medium text-destructive">
          <XCircle className="h-4 w-4" /> Не удалось зарегистрировать результат в Библиотеке
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          <Button size="sm" variant="outline">
            <Download className="h-3 w-3" /> Скачать локальный результат
          </Button>
          <Button size="sm" variant="ghost">
            <LifeBuoy className="h-3 w-3" /> Связаться с поддержкой
          </Button>
        </div>
      </div>
    ),
  },
];

function FlowStatesPage() {
  return (
    <AppShellV3>
      <PageHeaderV3
        eyebrow="Справочник"
        title="Справочник состояний"
        subtitle="Все состояния продуктовых сценариев — от ожидания загрузки до регистрации результата."
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
                  <span
                    className={cn(
                      "inline-flex shrink-0 items-center rounded-md border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide",
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
    </AppShellV3>
  );
}
