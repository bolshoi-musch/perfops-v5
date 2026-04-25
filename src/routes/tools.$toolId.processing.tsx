import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/perfops/AppShell";
import { ProjectContextBar } from "@/components/perfops/ProjectContextBar";
import { FlowStepper, defaultFlowSteps } from "@/components/perfops/FlowStepper";
import { FlowPageLayout } from "@/components/perfops/FlowPageLayout";
import { CTAButtonGroup } from "@/components/perfops/CTAButtonGroup";
import { ProcessingPanel } from "@/components/perfops/ProcessingPanel";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getTool, projects } from "@/lib/perfops-data";

export const Route = createFileRoute("/tools/$toolId/processing")({
  head: () => ({ meta: [{ title: "Обработка — PerfOps" }] }),
  component: ProcessingFlowPage,
});

function ProcessingFlowPage() {
  const { toolId } = Route.useParams();
  const tool = getTool(toolId);
  const project = projects[0];
  return (
    <AppShell>
      <ProjectContextBar
        projectName={project.name}
        client={project.client}
        toolName={tool.name}
        step="Запуск"
      />
      <FlowStepper steps={defaultFlowSteps} current={2} />
      <FlowPageLayout
        title="Идёт обработка"
        description="Запуск выполняется. Можно покинуть страницу и вернуться позже."
        side={
          <Card className="border bg-card shadow-none">
            <CardContent className="p-5">
              <h3 className="text-sm font-semibold text-foreground">Возможные следующие состояния</h3>
              <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                <li>· Успех — сохранено в Библиотеку</li>
                <li>· Предупреждение — завершено с замечаниями</li>
                <li>· Деградация — построено, но пока не зарегистрировано</li>
                <li>· Блокировка — продолжение невозможно</li>
              </ul>
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
            right={
              <>
                <Button variant="outline" asChild>
                  <Link to="/tools/$toolId/warning" params={{ toolId: tool.id }}>
                    Предпросмотр предупреждения
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/tools/$toolId/blocked" params={{ toolId: tool.id }}>
                    Предпросмотр блокировки
                  </Link>
                </Button>
                <Button asChild>
                  <Link to="/tools/$toolId/success" params={{ toolId: tool.id }}>
                    Симулировать завершение
                  </Link>
                </Button>
              </>
            }
          />
        }
      >
        <ProcessingPanel
          title={`Готовим результат: ${tool.name}`}
          status="Читаем campaign_export.xlsx…"
          destination="Библиотека PerfOps · Весенняя оптимизация кампаний"
        />
      </FlowPageLayout>
    </AppShell>
  );
}
