import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShellV3 } from "@/components/perfops-v3/AppShellV3";
import { PageHeaderV3 } from "@/components/perfops-v3/PageHeaderV3";
import { ProjectContextBarV3 } from "@/components/perfops-v3/ProjectContextBarV3";
import { FlowStepperV3 } from "@/components/perfops-v3/FlowStepperV3";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { getProduct, projects } from "@/lib/perfops-v3-data";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/v3/tools/$productId/processing")({
  head: () => ({ meta: [{ title: "Обработка — PerfOps V3" }] }),
  component: ProcessingStepPage,
});

function ProcessingStepPage() {
  const { productId } = Route.useParams();
  const product = getProduct(productId);
  const project = projects.find((p) => p.productId === productId) ?? projects[0];

  return (
    <AppShellV3>
      <ProjectContextBarV3
        projectName={project.name}
        projectId={project.id}
        productName={product.name}
        step="Запуск"
      />
      <PageHeaderV3
        eyebrow="Шаг 3 из 4"
        title="Идёт обработка"
        subtitle="Можно безопасно вернуться позже — результат появится в Библиотеке проекта."
      />
      <FlowStepperV3 current={2} />

      <Card className="border bg-card shadow-none">
        <CardContent className="space-y-4 p-6">
          <div className="flex items-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <div>
              <p className="text-sm font-medium text-foreground">
                {product.name} — выполняется
              </p>
              <p className="text-xs text-muted-foreground">
                Шаг 2 из 3 · подготовка результата
              </p>
            </div>
          </div>
          <Progress value={62} className="h-1.5" />

          <ul className="space-y-1 text-xs text-muted-foreground">
            <li>· Чтение источника</li>
            <li>· Подготовка структуры результата</li>
            <li className="text-foreground">· Формирование итогового файла…</li>
            <li>· Регистрация в Библиотеке проекта</li>
          </ul>
        </CardContent>
      </Card>

      <div className="mt-5 flex items-center justify-between border-t pt-4">
        <Button variant="ghost" asChild>
          <Link to="/v3/projects/$projectId" params={{ projectId: project.id }}>
            Вернуться в проект
          </Link>
        </Button>
        <Button asChild>
          <Link to="/v3/tools/$productId/result" params={{ productId: product.id }}>
            Посмотреть результат (демо)
          </Link>
        </Button>
      </div>
    </AppShellV3>
  );
}
