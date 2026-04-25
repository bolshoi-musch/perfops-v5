import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/perfops/AppShell";
import { ProjectContextBar } from "@/components/perfops/ProjectContextBar";
import { FlowStepper, defaultFlowSteps } from "@/components/perfops/FlowStepper";
import { FlowPageLayout } from "@/components/perfops/FlowPageLayout";
import { CTAButtonGroup } from "@/components/perfops/CTAButtonGroup";
import { UploadStateTabs } from "@/components/perfops/UploadPanel";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getTool, projects } from "@/lib/perfops-data";

export const Route = createFileRoute("/tools/$toolId/upload")({
  head: () => ({ meta: [{ title: "Загрузка — PerfOps" }] }),
  component: UploadFlowPage,
});

function UploadFlowPage() {
  const { toolId } = Route.useParams();
  const tool = getTool(toolId);
  const project = projects[0];

  return (
    <AppShell>
      <ProjectContextBar
        projectName={project.name}
        client={project.client}
        toolName={tool.name}
        step="Загрузка"
      />
      <FlowStepper steps={defaultFlowSteps} current={0} />
      <FlowPageLayout
        title="Загрузите исходный файл"
        description="Загрузите один файл, который будет использован как вход для инструмента. Переключайте вкладки состояний, чтобы просмотреть каждое состояние загрузки."
        side={
          <Card className="border bg-card shadow-none">
            <CardContent className="p-5">
              <h3 className="text-sm font-semibold text-foreground">Поддерживается</h3>
              <p className="mt-1 text-sm text-foreground">
                {tool.acceptedTypes.join(", ")}
              </p>
              <p className="mt-3 text-xs text-muted-foreground">
                Перед продолжением файл проверяется на наличие обязательных колонок.
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
              <>
                <Button variant="outline" asChild>
                  <Link to="/tools/$toolId/source" params={{ toolId: tool.id }}>
                    Сменить источник
                  </Link>
                </Button>
                <Button asChild>
                  <Link to="/tools/$toolId/review" params={{ toolId: tool.id }}>
                    Продолжить
                  </Link>
                </Button>
              </>
            }
          />
        }
      >
        <UploadStateTabs acceptedTypes={tool.acceptedTypes} />
      </FlowPageLayout>
    </AppShell>
  );
}
