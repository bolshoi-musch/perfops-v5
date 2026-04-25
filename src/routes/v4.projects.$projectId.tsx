import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShellV4 } from "@/components/perfops-v4/AppShellV4";
import { PageHeaderV4 } from "@/components/perfops-v4/PageHeaderV4";
import { BreadcrumbsV4 } from "@/components/perfops-v4/BreadcrumbsV4";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  getProject,
  getProduct,
  libraryEntries,
  formatLabel,
  libraryKindLabel,
  resultFormatLabel,
} from "@/lib/perfops-v4-data";
import {
  ArrowRight,
  Download,
  ExternalLink,
  FileText,
  FileSpreadsheet,
  File as FileIcon,
} from "lucide-react";

export const Route = createFileRoute("/v4/projects/$projectId")({
  head: () => ({ meta: [{ title: "Проект — PerfOps V4" }] }),
  component: ProjectDetailPage,
});

function ProjectDetailPage() {
  const { projectId } = Route.useParams();
  const project = getProject(projectId);
  const product = getProduct(project.productId);
  const Icon = product.icon;

  const projectEntries = libraryEntries
    .filter((e) => e.projectId === project.id)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  const result = projectEntries.find((e) => e.kind === "result");

  return (
    <AppShellV4>
      <BreadcrumbsV4
        items={[
          { label: "Проекты", to: "/v4/projects" },
          { label: project.name },
        ]}
      />
      <PageHeaderV4
        eyebrow="Проект"
        title={project.name}
        subtitle={project.description}
        actions={
          <Button asChild size="sm" variant="outline">
            <Link
              to="/v4/run/$productId/$step"
              params={{ productId: product.id, step: product.steps[0] }}
            >
              Продолжить флоу <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="border bg-card shadow-none lg:col-span-2">
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-md border bg-surface">
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Продукт проекта
                </p>
                <Link
                  to="/v4/products/$productId"
                  params={{ productId: product.id }}
                  className="text-sm font-medium text-foreground hover:underline"
                >
                  {product.name}
                </Link>
                <p className="mt-1 text-xs text-muted-foreground">
                  Формат результата: {resultFormatLabel[product.resultFormat]}
                </p>
              </div>
            </div>

            <h2 className="mt-6 mb-2 text-sm font-semibold text-foreground">
              Библиотека проекта
            </h2>
            {projectEntries.length === 0 ? (
              <p className="rounded-md border bg-surface px-4 py-3 text-sm text-muted-foreground">
                В проекте пока нет источников и результатов.
              </p>
            ) : (
              <ul className="divide-y rounded-md border">
                {projectEntries.map((e) => {
                  const FormatIcon =
                    e.format === "excel"
                      ? FileSpreadsheet
                      : e.format === "dashboard-link"
                        ? ExternalLink
                        : e.format === "analytics-report"
                          ? FileText
                          : FileIcon;
                  return (
                    <li
                      key={e.id}
                      className="flex items-center justify-between gap-3 px-3 py-2 text-sm"
                    >
                      <div className="flex min-w-0 items-center gap-2">
                        <FormatIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
                        <span className="truncate text-foreground">{e.name}</span>
                        <span className="text-[11px] text-muted-foreground">
                          · {libraryKindLabel[e.kind]} · {formatLabel(e.format)}
                        </span>
                      </div>
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {e.updated}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>

        <div className="space-y-3">
          <Card className="border bg-card shadow-none">
            <CardContent className="p-5">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Обновлено
              </p>
              <p className="mt-1 text-sm text-foreground">{project.updated}</p>
            </CardContent>
          </Card>
          <Card className="border bg-card shadow-none">
            <CardContent className="p-5">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Результат
              </p>
              {result ? (
                <>
                  <p className="mt-1 text-sm text-foreground">{result.name}</p>
                  <Button size="sm" className="mt-3">
                    {product.resultFormat === "excel" && (
                      <>
                        <Download className="h-3.5 w-3.5" /> Скачать Excel-файл
                      </>
                    )}
                    {product.resultFormat === "dashboard-link" && (
                      <>
                        <ExternalLink className="h-3.5 w-3.5" /> Открыть дашборд
                      </>
                    )}
                    {product.resultFormat === "analytics-report" && (
                      <>
                        <FileText className="h-3.5 w-3.5" /> Открыть отчёт
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <p className="mt-1 text-sm text-muted-foreground">Нет результата</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShellV4>
  );
}
