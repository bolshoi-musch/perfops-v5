import { createFileRoute } from "@tanstack/react-router";
import { AppShellV3 } from "@/components/perfops-v3/AppShellV3";
import { PageHeaderV3 } from "@/components/perfops-v3/PageHeaderV3";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Download } from "lucide-react";

export const Route = createFileRoute("/v3/components")({
  head: () => ({ meta: [{ title: "UI-компоненты — PerfOps V3" }] }),
  component: ComponentsPage,
});

function ComponentsPage() {
  return (
    <AppShellV3>
      <PageHeaderV3
        eyebrow="Внутренний справочник"
        title="UI-компоненты"
        subtitle="Базовые элементы интерфейса PerfOps. Названия компонентов в English, примеры — в русской копии."
      />

      <div className="space-y-6">
        {/* Buttons — hierarchy */}
        <Section title="Buttons — иерархия">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex flex-col items-start gap-1">
              <Button>Создать проект</Button>
              <span className="text-[11px] text-muted-foreground">Основная</span>
            </div>
            <div className="flex flex-col items-start gap-1">
              <Button variant="outline">Открыть библиотеку</Button>
              <span className="text-[11px] text-muted-foreground">Вторичная</span>
            </div>
            <div className="flex flex-col items-start gap-1">
              <Button variant="ghost">
                Подробнее <ArrowRight className="h-3.5 w-3.5" />
              </Button>
              <span className="text-[11px] text-muted-foreground">Текстовая</span>
            </div>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Используйте только одну основную кнопку на экране. Иерархия не зависит от
            размера.
          </p>
        </Section>

        {/* Buttons — sizes */}
        <Section title="Buttons — размеры">
          <div className="flex flex-wrap items-end gap-2">
            <div className="flex flex-col items-start gap-1">
              <Button size="sm">Создать проект</Button>
              <span className="text-[11px] text-muted-foreground">Маленькая</span>
            </div>
            <div className="flex flex-col items-start gap-1">
              <Button>Создать проект</Button>
              <span className="text-[11px] text-muted-foreground">Средняя</span>
            </div>
            <div className="flex flex-col items-start gap-1">
              <Button size="lg">Создать проект</Button>
              <span className="text-[11px] text-muted-foreground">Большая</span>
            </div>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Размер выбирается по контексту: компактные таблицы — маленькая, основной
            экран — средняя, посадочные действия — большая.
          </p>
        </Section>

        {/* Buttons — destructive */}
        <Section title="Buttons — деструктивные">
          <div className="flex flex-wrap items-end gap-2">
            <Button variant="destructive">Удалить подключение</Button>
            <Button variant="ghost" className="text-destructive hover:bg-destructive-soft">
              Удалить
            </Button>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Деструктивные действия должны быть явными и подтверждаться отдельно.
          </p>
        </Section>

        {/* Inputs */}
        <Section title="Inputs">
          <div className="grid max-w-md gap-3">
            <div>
              <Label htmlFor="demo-name" className="text-xs font-medium">
                Название проекта
              </Label>
              <Input id="demo-name" placeholder="Например: Кросс-минус — апрель" className="mt-1 h-9" />
            </div>
            <div>
              <Label htmlFor="demo-disabled" className="text-xs font-medium">
                Заполнено системой
              </Label>
              <Input id="demo-disabled" value="Кросс-минусовка" disabled className="mt-1 h-9" />
            </div>
          </div>
        </Section>

        {/* Badges */}
        <Section title="Badges — типы записей">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="border-info/30 bg-info-soft text-info">
              Источник
            </Badge>
            <Badge variant="outline" className="border-success/30 bg-success-soft text-success">
              Результат
            </Badge>
            <Badge variant="outline">Excel-файл</Badge>
            <Badge variant="outline">Ссылка на дашборд</Badge>
            <Badge variant="outline">Аналитический отчёт</Badge>
          </div>
        </Section>

        {/* Tone chips */}
        <Section title="Tone chips — состояния">
          <div className="flex flex-wrap gap-2 text-[11px]">
            <span className="inline-flex items-center rounded-md border bg-muted px-1.5 py-0.5 text-muted-foreground">
              Нейтральное
            </span>
            <span className="inline-flex items-center rounded-md border border-info/30 bg-info-soft px-1.5 py-0.5 text-info">
              Информационное
            </span>
            <span className="inline-flex items-center rounded-md border border-success/30 bg-success-soft px-1.5 py-0.5 text-success">
              Успешное
            </span>
            <span className="inline-flex items-center rounded-md border border-warning/30 bg-warning-soft px-1.5 py-0.5 text-warning-foreground">
              Предупреждение
            </span>
            <span className="inline-flex items-center rounded-md border border-destructive/30 bg-destructive-soft px-1.5 py-0.5 text-destructive">
              Блокирующее
            </span>
            <span className="inline-flex items-center rounded-md border border-primary/30 bg-accent px-1.5 py-0.5 text-accent-foreground">
              В процессе
            </span>
          </div>
        </Section>

        {/* Cards */}
        <Section title="Cards — поверхности">
          <div className="grid gap-3 md:grid-cols-2">
            <Card className="border bg-card shadow-none">
              <CardContent className="p-5">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Карточка-сводка
                </p>
                <p className="mt-1 text-sm text-foreground">
                  Используется для коротких справочных блоков рядом с основным контентом.
                </p>
              </CardContent>
            </Card>
            <Card className="border bg-surface shadow-none">
              <CardContent className="p-5">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Карточка-фон
                </p>
                <p className="mt-1 text-sm text-foreground">
                  Подложка под нейтральные блоки внутри основной карточки.
                </p>
              </CardContent>
            </Card>
          </div>
        </Section>

        {/* Action button with icon */}
        <Section title="Buttons — с иконкой">
          <div className="flex flex-wrap gap-2">
            <Button>
              <Download className="h-3.5 w-3.5" /> Скачать Excel-файл
            </Button>
            <Button variant="outline">
              Открыть библиотеку <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </Section>
      </div>
    </AppShellV3>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-2 text-sm font-semibold text-foreground">{title}</h2>
      <div className="rounded-lg border bg-card p-4">{children}</div>
    </section>
  );
}
