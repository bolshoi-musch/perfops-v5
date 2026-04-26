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
        subtitle="Базовые элементы интерфейса PerfOps — единый словарь для всех продуктов."
      />

      <div className="space-y-6">
        <Section
          title="Buttons — иерархия"
          description="Primary → Secondary → Text/Link → Destructive. На одном экране не больше одной primary-кнопки."
        >
          <div className="space-y-3">
            <Row label="Primary">
              <Button>Создать проект</Button>
              <Button>
                <Download className="h-3.5 w-3.5" /> Скачать Excel-файл
              </Button>
            </Row>
            <Row label="Secondary">
              <Button variant="outline">Открыть Библиотеку</Button>
              <Button variant="outline">
                Открыть продукт <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Row>
            <Row label="Text / link">
              <Button variant="ghost">Подробнее</Button>
              <Button variant="ghost">
                Назад <ArrowRight className="h-3.5 w-3.5 rotate-180" />
              </Button>
            </Row>
            <Row label="Destructive">
              <Button variant="destructive">Удалить</Button>
            </Row>
          </div>
        </Section>

        <Section title="Inputs">
          <div className="grid max-w-md gap-3">
            <div>
              <Label htmlFor="demo-name" className="text-xs font-medium">Название проекта</Label>
              <Input
                id="demo-name"
                placeholder="Например: Кросс-минусовка — 26.04.2026"
                className="mt-1 h-9"
              />
            </div>
          </div>
        </Section>

        <Section title="Badges & tone chips">
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

        <Section title="HelpCard — правая панель «Что можно использовать»">
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
      <div className="rounded-lg border bg-card p-4">{children}</div>
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
