import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShellV3 } from "@/components/perfops-v3/AppShellV3";
import { PageHeaderV3 } from "@/components/perfops-v3/PageHeaderV3";
import { ProjectContextBarV3 } from "@/components/perfops-v3/ProjectContextBarV3";
import { FlowStepperV3 } from "@/components/perfops-v3/FlowStepperV3";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getProduct, projects, resultFormatLabel } from "@/lib/perfops-v3-data";
import { ArrowRight, Check, FileSpreadsheet } from "lucide-react";

export const Route = createFileRoute("/v3/tools/$productId/review")({
  head: () => ({ meta: [{ title: "Проверка — PerfOps V3" }] }),
  component: ReviewStepPage,
});

function ReviewStepPage() {
  const { productId } = Route.useParams();
  const product = getProduct(productId);
  const project = projects.find((p) => p.productId === productId) ?? projects[0];

  return (
    <AppShellV3>
      <ProjectContextBarV3
        projectName={project.name}
        projectId={project.id}
        productName={product.name}
        step="Проверка"
      />
      <PageHeaderV3
        eyebrow="Шаг 2 из 4"
        title="Проверка источника"
        subtitle="Файл прошёл валидацию. Проверьте параметры запуска."
      />
      <FlowStepperV3 current={1} />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="border bg-card shadow-none lg:col-span-2">
          <CardContent className="space-y-4 p-5">
            <div className="flex items-center gap-3 rounded-md border bg-success-soft px-3 py-2 text-sm text-success">
              <Check className="h-4 w-4" />
              Источник принят, структура соответствует ожиданиям.
            </div>

            <div className="rounded-md border bg-surface px-4 py-3">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-medium text-foreground">
                  campaign_export.xlsx
                </p>
                <span className="text-xs text-muted-foreground">· 412 КБ</span>
              </div>
              <dl className="mt-3 grid grid-cols-2 gap-y-1 text-xs">
                <dt className="text-muted-foreground">Строк</dt>
                <dd className="text-foreground">2 184</dd>
                <dt className="text-muted-foreground">Колонок</dt>
                <dd className="text-foreground">17</dd>
                <dt className="text-muted-foreground">Период</dt>
                <dd className="text-foreground">01.04.2025 — 24.04.2025</dd>
                <dt className="text-muted-foreground">Кампаний</dt>
                <dd className="text-foreground">18</dd>
              </dl>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-semibold text-foreground">Параметры запуска</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>· Продукт: {product.name}</li>
                <li>· Формат результата: {resultFormatLabel[product.resultFormat]}</li>
                <li>· Куда сохранится: {product.resultDestination}</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="border bg-card shadow-none h-fit">
          <CardContent className="p-5">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Что произойдёт дальше
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              После запуска {product.executionNote.toLowerCase()}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-5 flex items-center justify-between border-t pt-4">
        <Button variant="ghost" asChild>
          <Link to="/v3/tools/$productId/source" params={{ productId: product.id }}>
            Назад
          </Link>
        </Button>
        <Button asChild>
          <Link to="/v3/tools/$productId/processing" params={{ productId: product.id }}>
            Запустить <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>
    </AppShellV3>
  );
}
