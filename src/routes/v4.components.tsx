import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShellV4 } from "@/components/perfops-v4/AppShellV4";
import { PageHeaderV4 } from "@/components/perfops-v4/PageHeaderV4";
import { ProductCardV4 } from "@/components/perfops-v4/ProductCardV4";
import { HelpCard } from "@/components/perfops-v4/HelpCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { products, getProduct } from "@/lib/perfops-v4-data";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleSlash,
  Download,
  ExternalLink,
  FileSpreadsheet,
  FileText,
  Info,
  Loader2,
  Plug,
  Plus,
  Search,
  Upload,
  XCircle,
  Inbox,
} from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/v4/components")({
  head: () => ({ meta: [{ title: "UI-компоненты — PerfOps" }] }),
  component: ComponentsPage,
});

function ComponentsPage() {
  return (
    <AppShellV4>
      <PageHeaderV4
        title="UI-компоненты"
        subtitle="Базовые элементы интерфейса PerfOps. Названия компонентов на английском, тексты примеров — на русском."
      />

      <div className="space-y-6">
        <Section
          title="Buttons"
          description="Primary → Secondary → Text/link → Destructive. На одном экране — только одна основная кнопка."
        >
          <div className="space-y-3">
            <Row label="Primary">
              <Button>Создать проект</Button>
            </Row>
            <Row label="Secondary">
              <Button variant="outline">Открыть Библиотеку</Button>
            </Row>
            <Row label="Text / link">
              <Button variant="ghost">Подробнее</Button>
            </Row>
            <Row label="Destructive">
              <Button variant="destructive">Удалить подключение</Button>
            </Row>
            <Row label="Disabled">
              <Button disabled>Создать проект</Button>
            </Row>
            <Row label="Loading">
              <Button disabled>
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Создание…
              </Button>
            </Row>
            <Row label="With icon">
              <Button>
                <Plus className="h-3.5 w-3.5" /> Новый проект
              </Button>
            </Row>
          </div>
        </Section>

        <Section
          title="ProductCard"
          description="Карточка продукта — кликабельна целиком. Кнопка «Создать проект» — отдельная CTA. Никаких ссылок «Открыть продукт»."
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <ProductCardV4 product={getProduct("dashboard-builder")} />
            <ProductCardV4 product={getProduct("cross-minus")} />
          </div>
        </Section>

        <Section
          title="ProjectTableRow"
          description="Колонки: Проект · Продукт · Обновлено · Результат · Действие."
        >
          <div className="overflow-hidden rounded-md border bg-card">
            <table className="w-full text-sm">
              <thead className="bg-surface text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 text-left font-medium">Проект</th>
                  <th className="px-3 py-2 text-left font-medium">Продукт</th>
                  <th className="px-3 py-2 text-left font-medium">Обновлено</th>
                  <th className="px-3 py-2 text-left font-medium">Результат</th>
                  <th className="px-3 py-2 text-right font-medium">Действие</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="px-3 py-2 font-medium text-foreground">
                    Конструктор дашбордов — 26.04.2026
                  </td>
                  <td className="px-3 py-2 text-muted-foreground">Конструктор дашбордов</td>
                  <td className="px-3 py-2 text-muted-foreground">2 часа назад</td>
                  <td className="px-3 py-2 text-foreground">Открыть дашборд</td>
                  <td className="px-3 py-2 text-right">
                    <Button size="sm" variant="ghost">
                      Открыть
                    </Button>
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-medium text-foreground">
                    Кросс-минусовка — 25.04.2026
                  </td>
                  <td className="px-3 py-2 text-muted-foreground">Кросс-минусовка</td>
                  <td className="px-3 py-2 text-muted-foreground">вчера</td>
                  <td className="px-3 py-2 text-foreground">Скачать Excel-файл</td>
                  <td className="px-3 py-2 text-right">
                    <Button size="sm" variant="ghost">
                      Открыть
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Section>

        <Section
          title="LibraryObjectRow"
          description="Колонки: Объект · Тип · Формат · Проект · Продукт · Обновлено · Действия."
        >
          <div className="overflow-hidden rounded-md border bg-card">
            <table className="w-full text-sm">
              <thead className="bg-surface text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 text-left font-medium">Объект</th>
                  <th className="px-3 py-2 text-left font-medium">Тип</th>
                  <th className="px-3 py-2 text-left font-medium">Формат</th>
                  <th className="px-3 py-2 text-left font-medium">Проект</th>
                  <th className="px-3 py-2 text-left font-medium">Продукт</th>
                  <th className="px-3 py-2 text-left font-medium">Обновлено</th>
                  <th className="px-3 py-2 text-right font-medium">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="px-3 py-2 font-medium text-foreground">
                    Дашборд кампаний — 26.04.2026
                  </td>
                  <td className="px-3 py-2">
                    <Badge
                      variant="outline"
                      className="border-success/30 bg-success-soft text-success"
                    >
                      Результат
                    </Badge>
                  </td>
                  <td className="px-3 py-2 text-muted-foreground">Ссылка на дашборд</td>
                  <td className="px-3 py-2 text-muted-foreground">
                    Конструктор дашбордов — 26.04.2026
                  </td>
                  <td className="px-3 py-2 text-muted-foreground">Конструктор дашбордов</td>
                  <td className="px-3 py-2 text-muted-foreground">2 часа назад</td>
                  <td className="px-3 py-2 text-right">
                    <Button size="sm" variant="ghost">
                      Открыть
                    </Button>
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-medium text-foreground">
                    campaign_export.xlsx
                  </td>
                  <td className="px-3 py-2">
                    <Badge
                      variant="outline"
                      className="border-info/30 bg-info-soft text-info"
                    >
                      Источник
                    </Badge>
                  </td>
                  <td className="px-3 py-2 text-muted-foreground">XLSX</td>
                  <td className="px-3 py-2 text-muted-foreground">
                    Конструктор дашбордов — 26.04.2026
                  </td>
                  <td className="px-3 py-2 text-muted-foreground">Конструктор дашбордов</td>
                  <td className="px-3 py-2 text-muted-foreground">2 часа назад</td>
                  <td className="px-3 py-2 text-right">
                    <Button size="sm" variant="ghost">
                      Скачать
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Section>

        <Section
          title="SourcePicker"
          description="Три типа источника. Поведение на втором источнике равноправно первому."
        >
          <div className="grid gap-2 sm:grid-cols-3">
            <SourceTypeChip icon={Upload} label="Загрузить файл" />
            <SourceTypeChip icon={Plug} label="Подключённый аккаунт" />
            <SourceTypeChip icon={FileSpreadsheet} label="Источник из Библиотеки" />
          </div>
        </Section>

        <Section
          title="ConnectedAccountPicker"
          description="Сначала система, потом аккаунты внутри. Раскрывающиеся группы."
        >
          <ConnectedAccountPickerDemo />
        </Section>

        <Section
          title="LibrarySourcePicker"
          description="Поиск, фильтр по продукту, фильтр по типу и список объектов."
        >
          <LibrarySourcePickerDemo />
        </Section>

        <Section
          title="StateMessage"
          description="Технические тональности компонента. В пользовательском интерфейсе показывайте конкретный смысл, а не слово «информационное»."
        >
          <div className="grid gap-2">
            <StateExample tone="info" icon={Info}>
              Источник передаётся на сервер. Прогресс виден пользователю.
            </StateExample>
            <StateExample tone="success" icon={CheckCircle2}>
              Результат сохранён в Библиотеке.
            </StateExample>
            <StateExample tone="warning" icon={AlertTriangle}>
              Есть замечания, но запуск возможен.
            </StateExample>
            <StateExample tone="blocked" icon={CircleSlash}>
              Запуск невозможен: не хватает обязательной колонки.
            </StateExample>
            <StateExample tone="error" icon={XCircle}>
              Не удалось сохранить результат в Библиотеке.
            </StateExample>
          </div>
        </Section>

        <Section
          title="Badges"
          description="Бейджи с проверенным контрастом. Источник — info, Результат — success, форматы — outline."
        >
          <div className="flex flex-wrap gap-2">
            <Badge
              variant="outline"
              className="border-info/30 bg-info-soft text-info"
            >
              Источник
            </Badge>
            <Badge
              variant="outline"
              className="border-success/30 bg-success-soft text-success"
            >
              Результат
            </Badge>
            <Badge variant="outline">Excel-файл</Badge>
            <Badge variant="outline">Ссылка на дашборд</Badge>
            <Badge variant="outline">Аналитический отчёт</Badge>
          </div>
        </Section>

        <Section title="Inputs / Form field states">
          <div className="grid max-w-md gap-3">
            <div>
              <Label htmlFor="demo-name" className="text-xs font-medium">
                Название проекта
              </Label>
              <Input
                id="demo-name"
                placeholder="Например: Кросс-минусовка — 26.04.2026"
                className="mt-1 h-9"
              />
              <p className="mt-1 text-[11px] text-muted-foreground">
                Короткое название, видно в списке проектов.
              </p>
            </div>
            <div>
              <Label htmlFor="demo-disabled" className="text-xs font-medium">
                Disabled
              </Label>
              <Input id="demo-disabled" disabled defaultValue="—" className="mt-1 h-9" />
            </div>
            <div>
              <Label htmlFor="demo-error" className="text-xs font-medium">
                Error
              </Label>
              <Input
                id="demo-error"
                defaultValue="!!"
                className="mt-1 h-9 border-destructive focus-visible:ring-destructive"
              />
              <p className="mt-1 text-[11px] text-destructive">
                Название не должно содержать спецсимволы.
              </p>
            </div>
          </div>
        </Section>

        <Section
          title="FlowStepper"
          description="Состояния шагов: completed, active, upcoming, optional."
        >
          <ol className="flex flex-wrap items-center gap-2">
            {[
              { label: "Источник", state: "done" },
              { label: "Проверка", state: "active" },
              { label: "Запуск", state: "upcoming" },
              { label: "Объединение", state: "optional" },
              { label: "Результат", state: "upcoming" },
            ].map((s, i, arr) => (
              <li key={s.label} className="flex flex-1 items-center gap-2 min-w-fit">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "flex h-6 w-6 items-center justify-center rounded-full border text-[11px] font-medium",
                      s.state === "done" && "border-primary bg-primary text-primary-foreground",
                      s.state === "active" && "border-primary bg-card text-primary",
                      s.state === "upcoming" && "border-border bg-card text-muted-foreground",
                      s.state === "optional" && "border-dashed border-border bg-card text-muted-foreground",
                    )}
                  >
                    {s.state === "done" ? <CheckCircle2 className="h-3 w-3" /> : i + 1}
                  </span>
                  <span
                    className={cn(
                      "text-xs",
                      s.state === "active" ? "font-medium text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {s.label}
                    {s.state === "optional" && (
                      <span className="ml-1 text-[10px] text-muted-foreground/70">(опц.)</span>
                    )}
                  </span>
                </div>
                {i < arr.length - 1 && (
                  <div className={cn("h-px flex-1", s.state === "done" ? "bg-primary" : "bg-border")} />
                )}
              </li>
            ))}
          </ol>
        </Section>

        <Section
          title="ResultAction"
          description="Основное действие на странице результата зависит от формата."
        >
          <div className="flex flex-wrap gap-2">
            <Button>
              <ExternalLink className="h-3.5 w-3.5" /> Открыть дашборд
            </Button>
            <Button>
              <FileText className="h-3.5 w-3.5" /> Открыть отчёт
            </Button>
            <Button>
              <Download className="h-3.5 w-3.5" /> Скачать Excel-файл
            </Button>
            <Button variant="outline">Открыть Библиотеку</Button>
          </div>
        </Section>

        <Section title="EmptyState">
          <div className="rounded-md border border-dashed bg-surface p-8 text-center">
            <Inbox className="mx-auto h-7 w-7 text-muted-foreground" />
            <p className="mt-2 text-sm font-medium text-foreground">
              Пока ничего нет
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Создайте первый проект, чтобы увидеть его здесь.
            </p>
            <Button size="sm" className="mt-3">
              <Plus className="h-3.5 w-3.5" /> Новый проект
            </Button>
          </div>
        </Section>

        <Section
          title="Table states"
          description="Empty, loading, error — для таблиц проектов и Библиотеки."
        >
          <div className="space-y-2">
            <div className="rounded-md border bg-card px-3 py-8 text-center text-sm text-muted-foreground">
              Ничего не найдено по выбранным фильтрам.
            </div>
            <div className="flex items-center justify-center gap-2 rounded-md border bg-card px-3 py-8 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Загружаем данные…
            </div>
            <div className="rounded-md border border-destructive/30 bg-destructive-soft px-3 py-3 text-sm text-destructive">
              Не удалось загрузить данные. Попробуйте обновить страницу.
            </div>
          </div>
        </Section>

        <Section title="HelpCard">
          <div className="max-w-sm">
            <HelpCard
              items={[
                "Поддерживаются: .xlsx, .csv",
                "Можно выбрать подключённый аккаунт",
                "Можно выбрать источник из Библиотеки",
              ]}
            />
          </div>
        </Section>
      </div>
    </AppShellV4>
  );
}

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
    <section>
      <h2 className="mb-1 text-sm font-semibold text-foreground">{title}</h2>
      {description && (
        <p className="mb-2 text-xs text-muted-foreground">{description}</p>
      )}
      <Card className="border bg-card shadow-none">
        <CardContent className="p-4">{children}</CardContent>
      </Card>
    </section>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="w-24 text-xs font-medium text-muted-foreground">{label}</span>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
  );
}

function SourceTypeChip({
  icon: Icon,
  label,
}: {
  icon: typeof Upload;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-md border bg-card px-3 py-2 text-sm">
      <span className="flex h-7 w-7 items-center justify-center rounded-md border bg-surface text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
      </span>
      <span className="text-foreground">{label}</span>
    </div>
  );
}

const accountGroups = [
  {
    name: "Яндекс Директ",
    accounts: [
      { name: "Основной кабинет", id: "perfops-main@yandex.example" },
      { name: "Кабинет под новые продукты", id: "perfops-launch@yandex.example" },
    ],
  },
  {
    name: "Google Ads",
    accounts: [{ name: "Основной MCC", id: "123-456-7890" }],
  },
  {
    name: "Google Sheets",
    accounts: [{ name: "Operations workspace", id: "ops@perfops.example" }],
  },
];

function ConnectedAccountPickerDemo() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  return (
    <div className="space-y-2">
      {accountGroups.map((g, idx) => {
        const isOpen = openIdx === idx;
        return (
          <div key={g.name} className="overflow-hidden rounded-md border bg-card">
            <button
              type="button"
              onClick={() => setOpenIdx(isOpen ? null : idx)}
              className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left hover:bg-surface"
            >
              <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                {isOpen ? (
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                )}
                {g.name}
              </span>
              <span className="text-xs text-muted-foreground">
                {g.accounts.length} аккаунт(ов)
              </span>
            </button>
            {isOpen && (
              <ul className="divide-y border-t">
                {g.accounts.map((a) => (
                  <li
                    key={a.id}
                    className="flex items-center justify-between gap-3 px-3 py-2.5 hover:bg-surface"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm text-foreground">{a.name}</p>
                      <p className="truncate text-[11px] text-muted-foreground">{a.id}</p>
                    </div>
                    <Button size="sm" variant="outline">
                      Выбрать
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}

function LibrarySourcePickerDemo() {
  const [kind, setKind] = useState<"all" | "source" | "result">("all");
  return (
    <div className="space-y-3">
      <div className="grid gap-2 sm:grid-cols-[1fr_auto_auto]">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Поиск по названию" className="h-9 pl-8 text-sm" />
        </div>
        <select
          className="h-9 rounded-md border bg-card px-2 text-xs text-foreground"
          aria-label="Фильтр по продукту"
          defaultValue="all"
        >
          <option value="all">Все продукты</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <div className="flex h-9 items-center rounded-md border bg-card p-0.5 text-xs">
          {(["all", "source", "result"] as const).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setKind(k)}
              className={cn(
                "rounded-sm px-2 py-1 transition-colors",
                kind === k
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {k === "all" ? "Все" : k === "source" ? "Источники" : "Результаты"}
            </button>
          ))}
        </div>
      </div>
      <ul className="divide-y rounded-md border bg-card">
        <li className="flex items-center justify-between gap-3 px-3 py-2.5">
          <div className="min-w-0">
            <p className="truncate text-sm text-foreground">campaign_export.xlsx</p>
            <p className="truncate text-[11px] text-muted-foreground">
              Источник · XLSX · Конструктор дашбордов — 26.04.2026 · обновлено 2 часа назад
            </p>
          </div>
          <Button size="sm" variant="outline">
            Выбрать
          </Button>
        </li>
        <li className="flex items-center justify-between gap-3 px-3 py-2.5">
          <div className="min-w-0">
            <p className="truncate text-sm text-foreground">
              Дашборд кампаний — 26.04.2026
            </p>
            <p className="truncate text-[11px] text-muted-foreground">
              Результат · Ссылка на дашборд · Конструктор дашбордов — 26.04.2026 ·
              обновлено 2 часа назад
            </p>
          </div>
          <Button size="sm" variant="outline">
            Выбрать
          </Button>
        </li>
      </ul>
      <div className="text-center">
        <Button size="sm" variant="ghost">
          Показать ещё
        </Button>
      </div>
    </div>
  );
}

type StateTone = "info" | "success" | "warning" | "blocked" | "error";

function StateExample({
  tone,
  icon: Icon,
  children,
}: {
  tone: StateTone;
  icon: typeof Info;
  children: React.ReactNode;
}) {
  const map: Record<StateTone, string> = {
    info: "border-info/30 bg-info-soft text-info",
    success: "border-success/30 bg-success-soft text-success",
    warning: "border-warning/30 bg-warning-soft text-warning-foreground",
    blocked: "border-destructive/30 bg-destructive-soft text-destructive",
    error: "border-destructive/30 bg-destructive-soft text-destructive",
  };
  return (
    <div className={cn("flex items-center gap-2 rounded-md border px-3 py-2 text-sm", map[tone])}>
      <Icon className="h-4 w-4 shrink-0" />
      <span>{children}</span>
    </div>
  );
}
