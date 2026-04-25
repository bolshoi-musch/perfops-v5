import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/perfops/AppShell";
import { PageHeader } from "@/components/perfops/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ToolCard } from "@/components/perfops/ToolCard";
import { ProjectCard } from "@/components/perfops/ProjectCard";
import { LibraryEntryCard } from "@/components/perfops/LibraryEntryCard";
import { StateMessage } from "@/components/perfops/StateMessage";
import { ProcessingPanel } from "@/components/perfops/ProcessingPanel";
import { UploadPanel } from "@/components/perfops/UploadPanel";
import { FlowStepper, defaultFlowSteps } from "@/components/perfops/FlowStepper";
import { ReviewSummary } from "@/components/perfops/ReviewSummary";
import { ResultHandoff } from "@/components/perfops/ResultHandoff";
import { CTAButtonGroup } from "@/components/perfops/CTAButtonGroup";
import { EmptyState } from "@/components/perfops/EmptyState";
import { tools, projects, libraryEntries } from "@/lib/perfops-data";
import { Folder } from "lucide-react";

export const Route = createFileRoute("/components")({
  head: () => ({
    meta: [
      { title: "Компоненты — PerfOps" },
      {
        name: "description",
        content: "Переиспользуемая лексика компонентов PerfOps и токены дизайна.",
      },
    ],
  }),
  component: ComponentsPage,
});

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-b py-8 first:pt-0 last:border-b-0">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
    </section>
  );
}

function ComponentsPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Справочник"
        title="Библиотека компонентов"
        subtitle="Каждая страница в PerfOps собрана из этой лексики."
        actions={
          <Button variant="outline" asChild>
            <Link to="/flow-states">Состояния потока</Link>
          </Button>
        }
      />

      <Section title="Кнопки" description="Primary, outline, ghost — иерархия CTA.">
        <div className="flex flex-wrap items-center gap-2">
          <Button>Основная</Button>
          <Button variant="outline">Контурная</Button>
          <Button variant="ghost">Текстовая</Button>
          <Button variant="secondary">Вторичная</Button>
          <Button size="sm">Маленькая</Button>
        </div>
      </Section>

      <Section title="Поля и бейджи">
        <div className="flex flex-wrap items-center gap-3">
          <Input placeholder="Поиск…" className="h-9 max-w-xs" />
          <Badge>По умолчанию</Badge>
          <Badge variant="secondary">Вторичный</Badge>
          <Badge variant="outline">Контурный</Badge>
        </div>
      </Section>

      <Section title="ToolCard">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {tools.slice(0, 3).map((t) => (
            <ToolCard key={t.id} tool={t} />
          ))}
        </div>
      </Section>

      <Section title="ProjectCard">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {projects.slice(0, 3).map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      </Section>

      <Section title="LibraryEntryCard">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {libraryEntries.slice(0, 3).map((e) => (
            <LibraryEntryCard key={e.id} entry={e} />
          ))}
        </div>
      </Section>

      <Section title="Карточка типа подключения">
        <p className="text-xs text-muted-foreground">
          Карточки типов подключений живут на странице{" "}
          <code>/connections</code> и ведут к детальной странице с конкретными
          аккаунтами.
        </p>
      </Section>

      <Section title="FlowStepper">
        <FlowStepper steps={defaultFlowSteps} current={1} />
      </Section>

      <Section title="UploadPanel — принят">
        <UploadPanel state="accepted" />
      </Section>

      <Section title="ReviewSummary">
        <ReviewSummary
          items={[
            { label: "Инструмент", value: "Конструктор дашбордов" },
            { label: "Проект", value: "Весенняя оптимизация кампаний" },
            { label: "Источник", value: "campaign_export.xlsx" },
            { label: "Куда сохранится", value: "Библиотека PerfOps" },
          ]}
        />
      </Section>

      <Section title="ProcessingPanel">
        <ProcessingPanel
          title="Готовим ваш отчёт-дашборд"
          status="Читаем campaign_export.xlsx…"
          destination="Библиотека PerfOps · Весенняя оптимизация кампаний"
        />
      </Section>

      <Section title="StateMessage — все степени">
        <div className="grid gap-3">
          <StateMessage
            severity="info"
            title="К сведению"
            message="Нейтральное информационное сообщение."
          />
          <StateMessage
            severity="success"
            title="Сохранено в Библиотеку"
            message="Результат успешно зарегистрирован."
          />
          <StateMessage
            severity="warning"
            title="Продолжайте с осторожностью"
            message="Не блокирует — можно продолжить."
          />
          <StateMessage
            severity="blocked"
            title="Продолжить нельзя"
            message="Не хватает обязательного входа. Кнопки «продолжить» нет."
          />
          <StateMessage
            severity="error"
            title="Регистрация не удалась"
            message="Терминальный сбой — нужно вмешательство вручную."
          />
        </div>
      </Section>

      <Section title="ResultHandoff">
        <div className="grid gap-4 lg:grid-cols-2">
          <ResultHandoff
            variant="success"
            title="Результат готов"
            resultName="Отчёт-дашборд · апрель"
            description="Сохранён в Библиотеке PerfOps."
            primaryCta={<Button size="sm">Открыть результат</Button>}
            secondaryCta={
              <Button size="sm" variant="outline">
                Открыть Библиотеку
              </Button>
            }
          />
          <ResultHandoff
            variant="degraded"
            title="Результат построен — пока не сохранён"
            resultName="Отчёт-дашборд · апрель"
            description="Регистрация деградирована. Повторите, чтобы сохранить."
            primaryCta={<Button size="sm">Повторить регистрацию</Button>}
            secondaryCta={
              <Button size="sm" variant="outline">
                Скачать локальный результат
              </Button>
            }
          />
        </div>
      </Section>

      <Section title="CTAButtonGroup">
        <CTAButtonGroup
          left={<Button variant="ghost">Назад</Button>}
          right={
            <>
              <Button variant="outline">Сохранить как черновик</Button>
              <Button>Продолжить</Button>
            </>
          }
        />
      </Section>

      <Section title="EmptyState">
        <EmptyState
          icon={Folder}
          title="Проектов пока нет"
          message="Создайте первый проект, чтобы начать запускать инструменты."
          action={<Button size="sm">Новый проект</Button>}
        />
      </Section>

      <Section
        title="Токены дизайна и заметки по реализации"
        description="Значения и правила, которые применяются при сборке прототипа в продакшен на React + Tailwind + shadcn/ui."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="border bg-card shadow-none">
            <CardContent className="space-y-4 p-5 text-sm">
              <TokenRow
                label="Акцентный цвет"
                swatch="bg-primary"
                value="oklch(0.48 0.14 265) — спокойный индиго, используется сдержанно — для основных CTA и активной навигации."
              />
              <TokenRow
                label="Фон"
                swatch="bg-background border"
                value="oklch(0.985 0.002 247) — очень мягкий близкий к белому."
              />
              <TokenRow
                label="Поверхность"
                swatch="bg-surface border"
                value="oklch(0.975 0.003 247) — вторичные поверхности, прилипающие панели, ненавязчивые блоки."
              />
              <TokenRow
                label="Карточка"
                swatch="bg-card border"
                value="Чистый белый. Тонкая граница 1px. Без тяжёлых теней."
              />
              <TokenRow
                label="Граница"
                swatch="border-2 border-border bg-card"
                value="oklch(0.92 0.006 255) по умолчанию · border-strong для акцента."
              />
              <TokenRow
                label="Скругление"
                swatch="bg-card border rounded-lg"
                value="--radius: 0.625rem (10px). Шкала sm/md/lg/xl выводится из неё."
              />
            </CardContent>
          </Card>

          <Card className="border bg-card shadow-none">
            <CardContent className="space-y-4 p-5 text-sm">
              <TokenRow
                label="Успех"
                swatch="bg-success"
                value="Сохранено в Библиотеку · положительное завершение."
              />
              <TokenRow
                label="Предупреждение"
                swatch="bg-warning"
                value="Не блокирующее замечание. Пользователь может продолжить."
              />
              <TokenRow
                label="Блокировка"
                swatch="bg-destructive"
                value="Продолжить нельзя. Без основной CTA «продолжить»."
              />
              <TokenRow
                label="Инфо"
                swatch="bg-info"
                value="Обработка, повторная попытка, нейтральный статус."
              />
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Ритм отступов
                </p>
                <p className="mt-1 text-foreground">4 · 8 · 12 · 16 · 24 · 32 · 48 px</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Иерархия CTA
                </p>
                <p className="mt-1 text-foreground">
                  Основная = заливка акцентом · Вторичная = контурная · Третичная =
                  ghost-ссылка. Не более одной основной CTA на поверхности.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-4 border bg-card shadow-none">
          <CardContent className="p-5 text-sm">
            <h3 className="text-sm font-semibold text-foreground">
              Заметки по реализации
            </h3>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-muted-foreground">
              <li>
                Использовать примитивы shadcn/ui (Button, Card, Input, Badge).
                Не вводить вторую UI-библиотеку.
              </li>
              <li>
                Все цвета — из семантических токенов в <code>src/styles.css</code>.
                Никогда не зашивайте hex-значения в компоненты.
              </li>
              <li>
                Каждая страница потока использует <code>AppShell + ProjectContextBar +
                FlowStepper + FlowPageLayout</code> и завершается{" "}
                <code>CTAButtonGroup</code>.
              </li>
              <li>
                Страницы передачи результата всегда явно сообщают, сохранён ли
                результат в Библиотеке PerfOps.
              </li>
              <li>
                Предупреждение ≠ Блокировка ≠ Ошибка. Используйте соответствующую
                степень <code>StateMessage</code> и соблюдайте контракт CTA из{" "}
                <Link to="/flow-states" className="text-primary hover:underline">
                  Состояний потока
                </Link>
                .
              </li>
              <li>
                Без градиентов, неоновых акцентов, декоративных hero-иллюстраций,
                фейковых KPI-плиток и перегруженных графиками дашбордов.
              </li>
            </ul>
          </CardContent>
        </Card>
      </Section>
    </AppShell>
  );
}

function TokenRow({
  label,
  swatch,
  value,
}: {
  label: string;
  swatch: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div
        className={`h-8 w-8 shrink-0 rounded-md ${swatch}`}
        aria-hidden="true"
      />
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className="mt-0.5 text-foreground">{value}</p>
      </div>
    </div>
  );
}
