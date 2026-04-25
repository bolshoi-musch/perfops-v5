import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/perfops/AppShell";
import { ProjectContextBar } from "@/components/perfops/ProjectContextBar";
import { FlowStepper, defaultFlowSteps } from "@/components/perfops/FlowStepper";
import { FlowPageLayout } from "@/components/perfops/FlowPageLayout";
import { ResultHandoff } from "@/components/perfops/ResultHandoff";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getTool, projects } from "@/lib/perfops-data";

export const Route = createFileRoute("/tools/$toolId/success")({
  head: () => ({ meta: [{ title: "Результат готов — PerfOps" }] }),
  component: SuccessPage,
});

function SuccessPage() {
  const { toolId } = Route.useParams();
  const tool = getTool(toolId);
  const project = projects[0];
  return (
    <AppShell>
      <ProjectContextBar
        projectName={project.name}
        client={project.client}
        toolName={tool.name}
        step="Результат"
      />
      <FlowStepper steps={defaultFlowSteps} current={3} />
      <FlowPageLayout
        title="Результат готов"
        description="Запуск завершён, и результат зарегистрирован в вашей Библиотеке."
        side={
          <Card className="border bg-card shadow-none">
            <CardContent className="p-5">
              <h3 className="text-sm font-semibold text-foreground">Что дальше</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Откройте результат, перейдите в Библиотеку или вернитесь к проекту,
                чтобы запустить ещё один инструмент.
              </p>
            </CardContent>
          </Card>
        }
      >
        <ResultHandoff
          variant="success"
          title="Результат готов"
          resultName={`${tool.name} · апрель`}
          description="Сохранён в Библиотеке PerfOps и привязан к «Весенней оптимизации кампаний»."
          primaryCta={<Button>Открыть результат</Button>}
          secondaryCta={
            <Button variant="outline" asChild>
              <Link to="/library">Открыть Библиотеку</Link>
            </Button>
          }
          tertiaryCta={
            <Button variant="ghost" asChild>
              <Link to="/projects/$projectId" params={{ projectId: project.id }}>
                Вернуться к проекту
              </Link>
            </Button>
          }
        />
      </FlowPageLayout>
    </AppShell>
  );
}
