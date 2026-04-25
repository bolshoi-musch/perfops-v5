import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/perfops/AppShell";
import { ProjectContextBar } from "@/components/perfops/ProjectContextBar";
import { FlowStepper, defaultFlowSteps } from "@/components/perfops/FlowStepper";
import { FlowPageLayout } from "@/components/perfops/FlowPageLayout";
import { CTAButtonGroup } from "@/components/perfops/CTAButtonGroup";
import { ReviewSummary } from "@/components/perfops/ReviewSummary";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getTool, projects } from "@/lib/perfops-data";
import { FileSpreadsheet } from "lucide-react";

export const Route = createFileRoute("/tools/$toolId/review")({
  head: () => ({ meta: [{ title: "Проверка — PerfOps" }] }),
  component: ReviewPage,
});

function ReviewPage() {
  const { toolId } = Route.useParams();
  const tool = getTool(toolId);
  const project = projects[0];
  return (
    <AppShell>
      <ProjectContextBar
        projectName={project.name}
        client={project.client}
        toolName={tool.name}
        step="Проверка"
      />
      <FlowStepper steps={defaultFlowSteps} current={1} />
      <FlowPageLayout
        title="Проверьте перед запуском"
        description="Подтвердите, что именно будет запущено. Пока ничего не обработано."
        side={
          <Card className="border bg-card shadow-none">
            <CardContent className="p-5">
              <h3 className="text-sm font-semibold text-foreground">Назначение</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Результат будет сохранён в Библиотеку PerfOps в рамках текущего проекта.
              </p>
            </CardContent>
          </Card>
        }
        footer={
          <CTAButtonGroup
            left={
              <Button variant="ghost" asChild>
                <Link to="/tools/$toolId/source" params={{ toolId: tool.id }}>
                  Назад
                </Link>
              </Button>
            }
            right={
              <Button asChild>
                <Link to="/tools/$toolId/processing" params={{ toolId: tool.id }}>
                  Запустить
                </Link>
              </Button>
            }
          />
        }
      >
        <ReviewSummary
          items={[
            { label: "Инструмент", value: tool.name },
            { label: "Проект", value: `${project.name} · ${project.client}` },
            {
              label: "Источник",
              value: (
                <span className="inline-flex items-center gap-2">
                  <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
                  campaign_export.xlsx
                </span>
              ),
            },
            { label: "Куда сохранится результат", value: "Библиотека PerfOps" },
            { label: "Режим обработки", value: "Стандартный" },
          ]}
        />
      </FlowPageLayout>
    </AppShell>
  );
}
