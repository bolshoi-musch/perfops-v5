import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShellV3 } from "@/components/perfops-v3/AppShellV3";
import { PageHeaderV3 } from "@/components/perfops-v3/PageHeaderV3";
import { ProjectContextBarV3 } from "@/components/perfops-v3/ProjectContextBarV3";
import { FlowStepperV3 } from "@/components/perfops-v3/FlowStepperV3";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  getProduct,
  projects,
  resultFormatLabel,
} from "@/lib/perfops-v3-data";
import {
  CheckCircle2,
  Download,
  ExternalLink,
  FileText,
  ArrowRight,
} from "lucide-react";

export const Route = createFileRoute("/v3/tools/$productId/result")({
  head: () => ({ meta: [{ title: "Результат — PerfOps V3" }] }),
  component: ResultStepPage,
});

function ResultStepPage() {
  const { productId } = Route.useParams();
  const product = getProduct(productId);
  const project = projects.find((p) => p.productId === productId) ?? projects[0];

  return (
    <AppShellV3>
      <ProjectContextBarV3
        projectName={project.name}
        projectId={project.id}
        productName={product.name}
        step="Результат"
      />
      <PageHeaderV3
        eyebrow="Шаг 4 из 4"
        title="Результат готов"
        subtitle="Сохранён в Библиотеке проекта и доступен для скачивания или открытия."
      />
      <FlowStepperV3 current={3} />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="border bg-card shadow-none lg:col-span-2">
          <CardContent className="space-y-4 p-6">
            <div className="flex items-center gap-3 rounded-md border bg-success-soft px-3 py-2 text-sm text-success">
              <CheckCircle2 className="h-4 w-4" />
              Результат сохранён в Библиотеке проекта.
            </div>

            <div className="rounded-md border bg-surface px-4 py-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Имя результата
              </p>
              <p className="mt-1 text-base font-semibold text-foreground">
                {product.exampleResultName}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {resultFormatLabel[product.resultFormat]} · {product.exampleResultSummary}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {product.resultFormat === "excel" && (
                <Button>
                  <Download className="h-3.5 w-3.5" /> Скачать Excel-файл
                </Button>
              )}
              {product.resultFormat === "dashboard-link" && (
                <Button>
                  <ExternalLink className="h-3.5 w-3.5" /> Открыть дашборд
                </Button>
              )}
              {product.resultFormat === "analytics-report" && (
                <Button>
                  <FileText className="h-3.5 w-3.5" /> Открыть отчёт
                </Button>
              )}
              <Button variant="outline" asChild>
                <Link to="/v3/library">Открыть библиотеку</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link to="/v3/projects/$projectId" params={{ projectId: project.id }}>
                  Вернуться в проект <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border bg-card shadow-none h-fit">
          <CardContent className="p-5">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Куда сохранён
            </p>
            <p className="mt-1 text-sm text-foreground">{product.resultDestination}</p>
            <p className="mt-3 text-xs text-muted-foreground">
              Все результаты по проекту собраны на странице проекта.
            </p>
          </CardContent>
        </Card>
      </div>
    </AppShellV3>
  );
}
