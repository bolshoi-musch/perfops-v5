import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/perfops/AppShell";
import { PageHeader } from "@/components/perfops/PageHeader";
import { ProjectContextBar } from "@/components/perfops/ProjectContextBar";
import { Breadcrumbs } from "@/components/perfops/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getTool, projects } from "@/lib/perfops-data";
import { ArrowRight, Check } from "lucide-react";

export const Route = createFileRoute("/tools/$toolId")({
  head: () => ({ meta: [{ title: "Запуск инструмента — PerfOps" }] }),
  component: ToolLaunchPage,
});

function ToolLaunchPage() {
  const { toolId } = Route.useParams();
  const tool = getTool(toolId);
  const project = projects[0];
  const Icon = tool.icon;

  return (
    <AppShell>
      <ProjectContextBar
        projectName={project.name}
        client={project.client}
        toolName={tool.name}
      />
      <Breadcrumbs
        items={[
          { label: project.name, to: "/projects/$projectId" },
          { label: tool.name },
        ]}
      />
      <PageHeader
        eyebrow="Создание проекта"
        title={tool.name}
        subtitle={tool.shortDescription}
        actions={
          <Button variant="outline" size="sm" asChild>
            <Link to="/tools/$toolId/about" params={{ toolId: tool.id }}>
              О продукте
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="border bg-card shadow-none lg:col-span-2">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md border bg-surface text-foreground">
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-base font-semibold text-foreground">
                  Что понадобится
                </h2>
                <ul className="mt-2 space-y-2">
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

                <div className="mt-5 rounded-md border bg-surface px-4 py-3 text-sm text-muted-foreground">
                  Результат будет сохранён в Библиотеку PerfOps в рамках проекта{" "}
                  <span className="font-medium text-foreground">{project.name}</span>.
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-2 border-t pt-4">
              <Button asChild>
                <Link to="/tools/$toolId/source" params={{ toolId: tool.id }}>
                  Начать <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link to="/projects/$projectId" params={{ projectId: project.id }}>
                  Отмена
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <Card className="border bg-card shadow-none">
            <CardContent className="p-5">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Проект
              </p>
              <p className="mt-1 text-sm font-medium text-foreground">
                {project.name}
              </p>
              <p className="text-xs text-muted-foreground">{project.client}</p>
            </CardContent>
          </Card>
          <Card className="border bg-card shadow-none">
            <CardContent className="p-5">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Тип результата
              </p>
              <p className="mt-1 text-sm text-foreground">{tool.resultType}</p>
            </CardContent>
          </Card>
          <Card className="border bg-card shadow-none">
            <CardContent className="p-5">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Поддерживаемые форматы
              </p>
              <p className="mt-1 text-sm text-foreground">
                {tool.acceptedTypes.join(", ")}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">До 25 МБ на файл.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
