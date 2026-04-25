import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/perfops/AppShell";
import { ProjectContextBar } from "@/components/perfops/ProjectContextBar";
import { FlowStepper, defaultFlowSteps } from "@/components/perfops/FlowStepper";
import { FlowPageLayout } from "@/components/perfops/FlowPageLayout";
import { ResultHandoff } from "@/components/perfops/ResultHandoff";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getTool, projects } from "@/lib/perfops-data";

export const Route = createFileRoute("/tools/$toolId/degraded")({
  head: () => ({ meta: [{ title: "Результат не зарегистрирован — PerfOps" }] }),
  component: DegradedPage,
});

function DegradedPage() {
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
        title="Результат построен — регистрация деградирована"
        description="Инструмент создал результат, но PerfOps пока не смог зарегистрировать его в Библиотеке. Можно повторить попытку или скачать локальную копию."
        side={
          <Card className="border bg-card shadow-none">
            <CardContent className="p-5">
              <h3 className="text-sm font-semibold text-foreground">Почему деградация?</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Результат существует, но он ещё не часть вашей Библиотеки. Считайте
                его предварительным — не делитесь им как финальной сохранённой версией.
              </p>
            </CardContent>
          </Card>
        }
      >
        <ResultHandoff
          variant="degraded"
          title="Результат построен, но пока не сохранён в Библиотеке PerfOps"
          resultName={`${tool.name} · апрель`}
          description="Соединение с Библиотекой PerfOps было прервано во время регистрации. Повторите попытку, чтобы сохранить."
          primaryCta={<Button>Повторить регистрацию</Button>}
          secondaryCta={
            <Button variant="outline">Скачать локальный результат</Button>
          }
          tertiaryCta={
            <Button variant="ghost" asChild>
              <Link to="/projects/$projectId" params={{ projectId: project.id }}>
                Вернуться к проекту (с предупреждением)
              </Link>
            </Button>
          }
        />
      </FlowPageLayout>
    </AppShell>
  );
}
