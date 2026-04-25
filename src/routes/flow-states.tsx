import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/perfops/AppShell";
import { PageHeader } from "@/components/perfops/PageHeader";
import { StateMessage, type StateSeverity } from "@/components/perfops/StateMessage";
import { UploadPanel, type UploadState } from "@/components/perfops/UploadPanel";
import { ProcessingPanel } from "@/components/perfops/ProcessingPanel";
import { ResultHandoff } from "@/components/perfops/ResultHandoff";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/flow-states")({
  head: () => ({
    meta: [
      { title: "Справочник состояний — PerfOps" },
      {
        name: "description",
        content:
          "Визуальный контракт для каждого состояния сценария инструмента в PerfOps.",
      },
    ],
  }),
  component: FlowStatesPage,
});

interface StateRow {
  name: string;
  message: string;
  severity: StateSeverity | "info-soft";
  primaryCta: string;
  secondaryCta: string;
  savedInLibrary: "yes" | "no" | "n/a" | "pending";
  preview: React.ReactNode;
}

const states: StateRow[] = [
  {
    name: "Загрузка — ожидание",
    message: "Перетащите файл или нажмите, чтобы загрузить.",
    severity: "info-soft",
    primaryCta: "Выбрать файл",
    secondaryCta: "—",
    savedInLibrary: "n/a",
    preview: <UploadPanel state={"idle" as UploadState} />,
  },
  {
    name: "Идёт загрузка",
    message: "Загружаем исходный файл…",
    severity: "info",
    primaryCta: "—",
    secondaryCta: "Отменить",
    savedInLibrary: "pending",
    preview: <UploadPanel state={"uploading" as UploadState} />,
  },
  {
    name: "Проверка",
    message: "Проверяем колонки и типы данных.",
    severity: "info",
    primaryCta: "—",
    secondaryCta: "—",
    savedInLibrary: "pending",
    preview: <UploadPanel state={"validating" as UploadState} />,
  },
  {
    name: "Файл невалиден",
    message: "Не хватает обязательной колонки — файл отклонён.",
    severity: "blocked",
    primaryCta: "Заменить файл",
    secondaryCta: "Посмотреть требования",
    savedInLibrary: "no",
    preview: <UploadPanel state={"invalid" as UploadState} />,
  },
  {
    name: "Файл принят",
    message: "Файл принят — можно продолжать.",
    severity: "success",
    primaryCta: "Продолжить",
    secondaryCta: "Заменить файл",
    savedInLibrary: "yes",
    preview: <UploadPanel state={"accepted" as UploadState} />,
  },
  {
    name: "Предупреждение",
    message: "Запуск возможен, но есть замечания.",
    severity: "warning",
    primaryCta: "Всё равно продолжить",
    secondaryCta: "Заменить файл",
    savedInLibrary: "n/a",
    preview: (
      <StateMessage
        severity="warning"
        title="В 12 строках отсутствует валюта"
        message="Эти строки будут пропущены при обработке."
        primaryCta={<Button size="sm">Всё равно продолжить</Button>}
        secondaryCta={
          <Button size="sm" variant="outline">
            Заменить файл
          </Button>
        }
      />
    ),
  },
  {
    name: "Блокировка",
    message: "Запуск невозможен — не хватает обязательных входных данных.",
    severity: "blocked",
    primaryCta: "Заменить файл",
    secondaryCta: "Посмотреть требования",
    savedInLibrary: "n/a",
    preview: (
      <StateMessage
        severity="blocked"
        title="Не хватает обязательной колонки: campaign_id"
        message="Замените файл версией, в которой есть колонка campaign_id."
        primaryCta={<Button size="sm">Заменить файл</Button>}
        secondaryCta={
          <Button size="sm" variant="ghost">
            Посмотреть требования
          </Button>
        }
      />
    ),
  },
  {
    name: "Идёт обработка",
    message: "Запуск выполняется.",
    severity: "info",
    primaryCta: "—",
    secondaryCta: "Покинуть страницу",
    savedInLibrary: "pending",
    preview: (
      <ProcessingPanel
        title="Готовим ваш отчёт-дашборд"
        status="Читаем campaign_export.xlsx…"
        destination="Библиотека PerfOps · Весенняя оптимизация кампаний"
      />
    ),
  },
  {
    name: "Локальный результат готов",
    message: "Результат построен, но пока не зарегистрирован.",
    severity: "warning",
    primaryCta: "Зарегистрировать в Библиотеке",
    secondaryCta: "Скачать локальную копию",
    savedInLibrary: "no",
    preview: (
      <ResultHandoff
        variant="degraded"
        title="Локальный результат готов"
        resultName="Отчёт-дашборд · апрель"
        description="Сгенерирован локально — пока не зарегистрирован в Библиотеке PerfOps."
        primaryCta={<Button size="sm">Зарегистрировать в Библиотеке</Button>}
        secondaryCta={
          <Button size="sm" variant="outline">
            Скачать локальную копию
          </Button>
        }
      />
    ),
  },
  {
    name: "Результат сохранён в Библиотеке PerfOps",
    message: "Результат зарегистрирован, им можно делиться.",
    severity: "success",
    primaryCta: "Открыть результат",
    secondaryCta: "Открыть Библиотеку",
    savedInLibrary: "yes",
    preview: (
      <ResultHandoff
        variant="success"
        title="Результат готов"
        resultName="Отчёт-дашборд · апрель"
        description="Сохранён в Библиотеке PerfOps и привязан к «Весенней оптимизации кампаний»."
        primaryCta={<Button size="sm">Открыть результат</Button>}
        secondaryCta={
          <Button size="sm" variant="outline">
            Открыть Библиотеку
          </Button>
        }
      />
    ),
  },
  {
    name: "Регистрация результата деградирована",
    message: "Результат построен — регистрация не подтверждена.",
    severity: "warning",
    primaryCta: "Повторить регистрацию",
    secondaryCta: "Скачать локальный результат",
    savedInLibrary: "no",
    preview: (
      <ResultHandoff
        variant="degraded"
        title="Регистрация деградирована"
        resultName="Отчёт-дашборд · апрель"
        description="Связь с Библиотекой была прервана во время регистрации."
        primaryCta={<Button size="sm">Повторить регистрацию</Button>}
        secondaryCta={
          <Button size="sm" variant="outline">
            Скачать локальный результат
          </Button>
        }
      />
    ),
  },
  {
    name: "Регистрация результата — повторная попытка",
    message: "Повторяем регистрацию в Библиотеке…",
    severity: "info",
    primaryCta: "—",
    secondaryCta: "Отменить повтор",
    savedInLibrary: "pending",
    preview: (
      <StateMessage
        severity="info"
        title="Повторяем регистрацию"
        message="Попытка 2 из 5 — будем пробовать ещё несколько минут."
        secondaryCta={
          <Button size="sm" variant="outline">
            Отменить повтор
          </Button>
        }
      />
    ),
  },
  {
    name: "Регистрация результата провалена (терминально)",
    message: "Зарегистрировать не удалось — нужно вмешательство вручную.",
    severity: "error",
    primaryCta: "Скачать локальный результат",
    secondaryCta: "Связаться с поддержкой",
    savedInLibrary: "no",
    preview: (
      <StateMessage
        severity="error"
        title="Регистрация не удалась"
        message="Мы повторили 5 раз, но не смогли зарегистрировать результат. Скачайте локальную копию, чтобы сохранить его."
        primaryCta={<Button size="sm">Скачать локальный результат</Button>}
        secondaryCta={
          <Button size="sm" variant="ghost">
            Связаться с поддержкой
          </Button>
        }
      />
    ),
  },
];

const savedLabel: Record<StateRow["savedInLibrary"], string> = {
  yes: "Да",
  no: "Нет",
  pending: "Ожидание",
  "n/a": "—",
};

const severityLabel: Record<StateRow["severity"], string> = {
  info: "Инфо",
  "info-soft": "Нейтральная",
  success: "Успех",
  warning: "Предупреждение",
  blocked: "Блокировка",
  error: "Ошибка",
};

function FlowStatesPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Справочник"
        title="Справочник состояний"
        subtitle="Состояния сценариев, которым следует каждый инструмент PerfOps. Используется при ревью или сборке потоков."
        actions={
          <Button variant="outline" asChild>
            <Link to="/components">UI-компоненты</Link>
          </Button>
        }
      />

      <div className="space-y-6">
        {states.map((state) => (
          <Card key={state.name} className="border bg-card shadow-none">
            <CardContent className="p-5">
              <div className="grid gap-5 lg:grid-cols-3">
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Состояние
                  </p>
                  <h3 className="mt-1 text-base font-semibold text-foreground">
                    {state.name}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {state.message}
                  </p>
                  <dl className="mt-4 space-y-1.5 text-xs">
                    <div className="flex justify-between gap-4">
                      <dt className="text-muted-foreground">Степень</dt>
                      <dd className="text-foreground">
                        {severityLabel[state.severity]}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-muted-foreground">Основная CTA</dt>
                      <dd className="text-foreground">{state.primaryCta}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-muted-foreground">Вторичная CTA</dt>
                      <dd className="text-foreground">{state.secondaryCta}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-muted-foreground">Сохранено в Библиотеке</dt>
                      <dd className="text-foreground">
                        {savedLabel[state.savedInLibrary]}
                      </dd>
                    </div>
                  </dl>
                </div>
                <div className="lg:col-span-2">{state.preview}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
