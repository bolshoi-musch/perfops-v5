import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/perfops/AppShell";
import { ProjectContextBar } from "@/components/perfops/ProjectContextBar";
import { FlowStepper, defaultFlowSteps } from "@/components/perfops/FlowStepper";
import { FlowPageLayout } from "@/components/perfops/FlowPageLayout";
import { CTAButtonGroup } from "@/components/perfops/CTAButtonGroup";
import { SourcePicker } from "@/components/perfops/SourcePicker";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getTool, projects } from "@/lib/perfops-data";

export const Route = createFileRoute("/tools/$toolId/source")({
  head: () => ({ meta: [{ title: "Выбор источника — PerfOps" }] }),
  component: SourceSelectionPage,
});

function SourceSelectionPage() {
  const { toolId } = Route.useParams();
  const tool = getTool(toolId);
  const project = projects[0];
  return (
    <AppShell>
      <ProjectContextBar
        projectName={project.name}
        client={project.client}
        toolName={tool.name}
        step="Источник"
      />
      <FlowStepper steps={defaultFlowSteps} current={0} />
      <FlowPageLayout
        title="Выберите источник"
        description="Укажите, откуда поступит входной файл для запуска. Источник можно сменить позже."
        side={
          <Card className="border bg-card shadow-none">
            <CardContent className="p-5">
              <h3 className="text-sm font-semibold text-foreground">Совет</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Повторное использование файла из Библиотеки сохраняет аудит-след
                проекта чище и ускоряет последующие запуски.
              </p>
            </CardContent>
          </Card>
        }
        footer={
          <CTAButtonGroup
            left={
              <Button variant="ghost" asChild>
                <Link to="/tools/$toolId" params={{ toolId: tool.id }}>
                  Назад
                </Link>
              </Button>
            }
            right={
              <Button asChild>
                <Link to="/tools/$toolId/review" params={{ toolId: tool.id }}>
                  Продолжить
                </Link>
              </Button>
            }
          />
        }
      >
        <SourcePicker />
      </FlowPageLayout>
    </AppShell>
  );
}
