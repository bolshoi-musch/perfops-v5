import { createFileRoute } from "@tanstack/react-router";
import { AppShellV4 } from "@/components/perfops-v4/AppShellV4";
import { PageHeaderV4 } from "@/components/perfops-v4/PageHeaderV4";
import { HelpCard } from "@/components/perfops-v4/HelpCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Download } from "lucide-react";

export const Route = createFileRoute("/v4/components")({
  head: () => ({ meta: [{ title: "UI-компоненты — PerfOps V4" }] }),
  component: ComponentsPage,
});

function ComponentsPage() {
  return (
    <AppShellV4>
      <PageHeaderV4
        eyebrow="Внутренний справочник"
        title="UI-компоненты"
        subtitle="Базовые элементы интерфейса PerfOps V4 — единый словарь для всех продуктов."
      />

      <div className="space-y-6">
        <Section title="Buttons — иерархия">
          <div className="flex flex-wrap items-center gap-2">
            <Button>Создать проект</Button>
            <Button variant="outline">Открыть библиотеку</Button>
            <Button variant="ghost">
              Подробнее <ArrowRight className="h-3.5 w-3.5" />
            </Button>
            <Button variant="destructive">Удалить</Button>
          </div>
        </Section>

        <Section title="Inputs">
          <div className="grid max-w-md gap-3">
            <div>
              <Label htmlFor="demo-name" className="text-xs font-medium">Название проекта</Label>
              <Input id="demo-name" placeholder="Например: Кросс-минус — апрель" className="mt-1 h-9" />
            </div>
          </div>
        </Section>

        <Section title="Badges & tone chips">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="border-info/30 bg-info-soft text-info">Источник</Badge>
            <Badge variant="outline" className="border-success/30 bg-success-soft text-success">Результат</Badge>
            <Badge variant="outline">Excel-файл</Badge>
            <Badge variant="outline">Ссылка на дашборд</Badge>
            <Badge variant="outline">Аналитический отчёт</Badge>
          </div>
        </Section>

        <Section title="HelpCard — правая панель «Что можно использовать»">
          <div className="max-w-sm">
            <HelpCard
              items={[
                "Поддерживаются: .xlsx, .csv",
                "Можно выбрать подключение",
                "Можно выбрать источник из Библиотеки",
              ]}
            />
          </div>
        </Section>

        <Section title="Action buttons с иконкой">
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
    </AppShellV4>
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
