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

export const Route = createFileRoute("/tools/$toolId/blocked")({
  head: () => ({ meta: [{ title: "Блокировка — PerfOps" }] }),
  component: BlockedPage,
});

function BlockedPage() {
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
        title="Пока продолжить нельзя"
        description="Не хватает обязательных входных данных. Запуск невозможен, пока проблема не решена."
        side={
          <Card className="border bg-card shadow-none">
            <CardContent className="p-5">
              <h3 className="text-sm font-semibold text-foreground">Почему блокировка?</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Состояние блокировки используется только для проблем, которые не
                позволяют инструменту получить осмысленный результат. Кнопки
                «Продолжить» здесь нет.
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
          />
        }
      >
        <StateMessage
          severity="blocked"
          title="Не хватает обязательной колонки: campaign_id"
          message="Этому инструменту нужна колонка campaign_id для сопоставления метрик. Замените файл версией, в которой она есть."
          details={
            <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              <li>Файл: campaign_export.xlsx</li>
              <li>Обязательная колонка: campaign_id</li>
              <li>Статус: обязательно исправить перед продолжением</li>
            </ul>
          }
          primaryCta={
            <Button asChild>
              <Link to="/tools/$toolId/upload" params={{ toolId: tool.id }}>
                Заменить файл
              </Link>
            </Button>
          }
          secondaryCta={
            <Button variant="ghost">Посмотреть требования</Button>
          }
        />
      </FlowPageLayout>
    </AppShell>
  );
}
