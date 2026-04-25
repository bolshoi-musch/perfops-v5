import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/perfops/AppShell";
import { PageHeader } from "@/components/perfops/PageHeader";
import { Breadcrumbs } from "@/components/perfops/Breadcrumbs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getTool, libraryEntries } from "@/lib/perfops-data";
import {
  ArrowRight,
  Check,
  ExternalLink,
  FileBarChart,
  Database,
  MapPin,
  Lightbulb,
} from "lucide-react";

export const Route = createFileRoute("/tools/$toolId/about")({
  head: () => ({ meta: [{ title: "О продукте — PerfOps" }] }),
  component: ToolAboutPage,
});

function ToolAboutPage() {
  const { toolId } = Route.useParams();
  const tool = getTool(toolId);
  const Icon = tool.icon;
  const lastResult = tool.lastResultLibraryId
    ? libraryEntries.find((e) => e.id === tool.lastResultLibraryId)
    : undefined;

  return (
    <AppShell>
      <Breadcrumbs
        items={[
          { label: "Главная", to: "/" },
          { label: tool.name },
        ]}
      />
      <PageHeader
        eyebrow="Продукт"
        title={tool.name}
        subtitle={tool.longDescription}
        actions={
          <div className="flex gap-2">
            {lastResult && (
              <Button variant="outline" size="sm" asChild>
                <Link to="/library">Открыть последний результат</Link>
              </Button>
            )}
            <Button size="sm" asChild>
              <Link to="/tools/$toolId" params={{ toolId: tool.id }}>
                Создать проект <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="border bg-card shadow-none lg:col-span-2">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-md border bg-surface text-foreground">
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <SectionTitle icon={Lightbulb}>Что делает продукт</SectionTitle>
                <p className="text-sm text-muted-foreground">{tool.longDescription}</p>

                <SectionTitle icon={Database} className="mt-6">
                  Что нужно на входе
                </SectionTitle>
                <ul className="space-y-1.5">
                  {tool.inputs.map((req) => (
                    <li
                      key={req}
                      className="flex items-start gap-2 text-sm text-foreground"
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                      {req}
                    </li>
                  ))}
                </ul>

                <SectionTitle icon={FileBarChart} className="mt-6">
                  Что вы получите
                </SectionTitle>
                <ul className="space-y-1.5">
                  {tool.outputs.map((req) => (
                    <li
                      key={req}
                      className="flex items-start gap-2 text-sm text-foreground"
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                      {req}
                    </li>
                  ))}
                </ul>

                <SectionTitle icon={MapPin} className="mt-6">
                  Когда использовать
                </SectionTitle>
                <p className="text-sm text-muted-foreground">{tool.whenToUse}</p>

                <div className="mt-6 rounded-md border bg-surface px-4 py-3 text-sm">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Пример результата
                  </p>
                  <p className="mt-1 text-foreground">{tool.exampleResult}</p>
                </div>

                <div className="mt-5 rounded-md border bg-surface px-4 py-3 text-sm text-muted-foreground">
                  {tool.execution === "in-platform" ? (
                    <>
                      <span className="font-medium text-foreground">
                        Работает внутри PerfOps.
                      </span>{" "}
                      Шаги запуска и результат остаются в одном рабочем пространстве.
                    </>
                  ) : (
                    <>
                      <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
                        Запускается во внешней среде
                        <ExternalLink className="h-3.5 w-3.5" />
                      </span>{" "}
                      и возвращает результат в PerfOps по завершении.
                    </>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="border bg-card shadow-none">
            <CardContent className="p-5">
              <h3 className="text-xs uppercase tracking-wide text-muted-foreground">
                Источники данных
              </h3>
              <ul className="mt-2 space-y-1 text-sm text-foreground">
                {tool.sources.map((s) => (
                  <li key={s}>· {s}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card className="border bg-card shadow-none">
            <CardContent className="p-5">
              <h3 className="text-xs uppercase tracking-wide text-muted-foreground">
                Куда сохранится результат
              </h3>
              <p className="mt-1 text-sm text-foreground">{tool.resultDestination}</p>
            </CardContent>
          </Card>
          <Card className="border bg-card shadow-none">
            <CardContent className="p-5">
              <h3 className="text-xs uppercase tracking-wide text-muted-foreground">
                Тип результата
              </h3>
              <p className="mt-1 text-sm text-foreground">{tool.resultType}</p>
              <p className="mt-3 text-xs text-muted-foreground">
                Поддерживаемые форматы при загрузке: {tool.acceptedTypes.join(", ")}.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}

function SectionTitle({
  icon: Icon,
  className,
  children,
}: {
  icon: typeof Lightbulb;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <h2
      className={`mb-2 flex items-center gap-2 text-sm font-semibold text-foreground ${className ?? ""}`}
    >
      <Icon className="h-4 w-4 text-muted-foreground" />
      {children}
    </h2>
  );
}
