import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/perfops/AppShell";
import { ProjectContextBar } from "@/components/perfops/ProjectContextBar";
import { FlowStepper, defaultFlowSteps } from "@/components/perfops/FlowStepper";
import { FlowPageLayout } from "@/components/perfops/FlowPageLayout";
import { CTAButtonGroup } from "@/components/perfops/CTAButtonGroup";
import { StateMessage } from "@/components/perfops/StateMessage";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getTool, projects } from "@/lib/perfops-data";

export const Route = createFileRoute("/tools/$toolId/warning")({
  head: () => ({ meta: [{ title: "Предупреждение — PerfOps" }] }),
  component: WarningPage,
});

function WarningPage() {
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
        title="Продолжайте с осторожностью"
        description="Запуск возможен, но есть момент, о котором стоит знать заранее."
        side={
          <Card className="border bg-card shadow-none">
            <CardContent className="p-5">
              <h3 className="text-sm font-semibold text-foreground">Предупреждение ≠ Блокировка</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Предупреждение не блокирует — можно продолжить, заменить файл или
                сначала исправить проблему. Блокировка означает, что продолжить нельзя.
              </p>
            </CardContent>
          </Card>
        }
        footer={
          <CTAButtonGroup
            left={
              <Button variant="ghost" asChild>
                <Link to="/tools/$toolId/review" params={{ toolId: tool.id }}>
                  Назад
                </Link>
              </Button>
            }
          />
        }
      >
        <StateMessage
          severity="warning"
          title="В 12 строках отсутствует валюта"
          message="Эти строки будут пропущены при обработке. Остальной файл используется как есть."
          details={
            <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              <li>Затронутые строки: 41–52 в campaign_export.xlsx</li>
              <li>Обязательно исправить: нет — эти строки будут пропущены</li>
            </ul>
          }
          primaryCta={
            <Button asChild>
              <Link to="/tools/$toolId/processing" params={{ toolId: tool.id }}>
                Всё равно продолжить
              </Link>
            </Button>
          }
          secondaryCta={
            <Button variant="outline" asChild>
              <Link to="/tools/$toolId/upload" params={{ toolId: tool.id }}>
                Заменить файл
              </Link>
            </Button>
          }
        />
      </FlowPageLayout>
    </AppShell>
  );
}
