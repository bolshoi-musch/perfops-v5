import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShellV4 } from "@/components/perfops-v4/AppShellV4";
import { PageHeaderV4 } from "@/components/perfops-v4/PageHeaderV4";
import { BreadcrumbsV4 } from "@/components/perfops-v4/BreadcrumbsV4";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  getProject,
  getProduct,
  resultFormatLabel,
  getResultActionForFormat,
  sourceKindLabel,
} from "@/lib/perfops-v4-data";
import {
  ArrowRight,
  Download,
  ExternalLink,
  FileText,
  RefreshCw,
  Library as LibraryIcon,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Upload,
  Plug,
  Database,
  Type as TypeIcon,
  Link as LinkIcon,
} from "lucide-react";

export const Route = createFileRoute("/v4/projects/$projectId")({
  head: () => ({ meta: [{ title: "Проект — PerfOps" }] }),
  component: ProjectDetailPage,
});

const sourceIcon = {
  upload: Upload,
  connection: Plug,
  library: Database,
  topic: TypeIcon,
  url: LinkIcon,
} as const;

function ProjectDetailPage() {
  const { projectId } = Route.useParams();
  const project = getProject(projectId);
  const product = getProduct(project.productId);
  const ProductIcon = product.icon;

  const result = project.currentResult;
  const resultAction = result ? getResultActionForFormat(result.format) : null;
  const ResultIcon =
    resultAction?.variant === "open-dashboard"
      ? ExternalLink
      : resultAction?.variant === "download-excel"
        ? Download
        : resultAction?.variant === "open-report"
          ? FileText
          : null;

  const firstStep = product.steps[0];

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
          <div className="flex flex-wrap items-center gap-2">
            <Button asChild size="sm">
              <Link
                to="/v4/run/$productId/$step"
                params={{ productId: product.id, step: firstStep }}
              >
                Продолжить <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
            {result && (
              <Button asChild size="sm" variant="outline">
                <Link
                  to="/v4/run/$productId/$step"
                  params={{ productId: product.id, step: firstStep }}
                >
                  <RefreshCw className="h-3.5 w-3.5" /> Повторить обработку
                </Link>
              </Button>
            )}
            <Button asChild size="sm" variant="ghost">
              <Link to="/v4/library">
                <LibraryIcon className="h-3.5 w-3.5" /> Открыть Библиотеку
              </Link>
            </Button>
          </div>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {/* Current result */}
          <Card className="border bg-card shadow-none">
            <CardContent className="p-5">
              <h2 className="text-sm font-semibold text-foreground">
                Текущий результат
              </h2>
              {result ? (
                <div className="mt-3 rounded-md border bg-surface p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    {resultFormatLabel[result.format]}
                  </p>
                  <p className="mt-1 text-sm font-medium text-foreground">
                    {result.name}
                  </p>
                  {result.notSavedToLibrary ? (
                    <p className="mt-2 inline-flex items-center gap-1.5 rounded-md border border-warning/30 bg-warning-soft px-2 py-1 text-xs text-warning-foreground">
                      <AlertTriangle className="h-3 w-3" />
                      Результат готов, но не сохранён в Библиотеке.
                    </p>
                  ) : (
                    <p className="mt-2 inline-flex items-center gap-1.5 rounded-md border border-success/30 bg-success-soft px-2 py-1 text-xs text-success">
                      <CheckCircle2 className="h-3 w-3" />
                      Сохранён в Библиотеке
                    </p>
                  )}
                  {resultAction && ResultIcon && (
                    <div className="mt-3">
                      <Button size="sm">
                        <ResultIcon className="h-3.5 w-3.5" /> {resultAction.label}
                      </Button>
                    </div>
                  )}
                  <p className="mt-4 rounded-md border bg-card px-3 py-2 text-[11px] text-muted-foreground">
                    Повторная обработка обновит текущий результат проекта. Чтобы
                    сохранить текущий результат отдельно, создайте новый проект.
                  </p>
                </div>
              ) : (
                <div className="mt-3 rounded-md border border-dashed bg-surface p-6 text-center">
                  <p className="text-sm text-foreground">Нет результата</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Запустите флоу, чтобы получить первый результат проекта.
                  </p>
                  <Button asChild size="sm" className="mt-3">
                    <Link
                      to="/v4/run/$productId/$step"
                      params={{ productId: product.id, step: firstStep }}
                    >
                      Продолжить флоу
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Sources */}
          <Card className="border bg-card shadow-none">
            <CardContent className="p-5">
              <h2 className="text-sm font-semibold text-foreground">Источники</h2>
              {project.sources.length === 0 ? (
                <p className="mt-2 text-xs text-muted-foreground">
                  Источники ещё не выбраны.
                </p>
              ) : (
                <ul className="mt-3 divide-y rounded-md border">
                  {project.sources.map((s) => {
                    const Icon = sourceIcon[s.kind];
                    return (
                      <li
                        key={s.name}
                        className="flex items-center gap-2 px-3 py-2 text-sm"
                      >
                        <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                        <span className="truncate text-foreground">{s.name}</span>
                        <span className="text-[11px] text-muted-foreground">
                          · {sourceKindLabel[s.kind]}
                          {s.meta ? ` · ${s.meta}` : ""}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </CardContent>
          </Card>

          {/* Parameters */}
          <Card className="border bg-card shadow-none">
            <CardContent className="p-5">
              <h2 className="text-sm font-semibold text-foreground">Параметры</h2>
              {project.parameters.length === 0 ? (
                <p className="mt-2 text-xs text-muted-foreground">
                  Дополнительные параметры не заданы.
                </p>
              ) : (
                <dl className="mt-3 grid grid-cols-1 gap-y-2 sm:grid-cols-3">
                  {project.parameters.map((p) => (
                    <div key={p.label} className="contents">
                      <dt className="text-xs text-muted-foreground sm:col-span-1">
                        {p.label}
                      </dt>
                      <dd className="text-sm text-foreground sm:col-span-2">
                        {p.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              )}
            </CardContent>
          </Card>

          {/* Processing history */}
          <Card className="border bg-card shadow-none">
            <CardContent className="p-5">
              <h2 className="text-sm font-semibold text-foreground">
                История обработок
              </h2>
              {project.history.length === 0 ? (
                <p className="mt-2 text-xs text-muted-foreground">
                  Запусков ещё не было.
                </p>
              ) : (
                <ul className="mt-3 divide-y rounded-md border">
                  {project.history.map((h) => {
                    const StatusIcon =
                      h.status === "completed"
                        ? CheckCircle2
                        : h.status === "saved-locally"
                          ? AlertTriangle
                          : XCircle;
                    const tone =
                      h.status === "completed"
                        ? "text-success"
                        : h.status === "saved-locally"
                          ? "text-warning-foreground"
                          : "text-destructive";
                    const label =
                      h.status === "completed"
                        ? "Завершено"
                        : h.status === "saved-locally"
                          ? "Готово локально"
                          : "Ошибка";
                    return (
                      <li
                        key={h.id}
                        className="flex items-start justify-between gap-3 px-3 py-2 text-sm"
                      >
                        <div className="min-w-0">
                          <p className="text-sm text-foreground">
                            {h.startedAt}
                            {h.finishedAt ? ` → ${h.finishedAt}` : ""}
                          </p>
                          {h.note && (
                            <p className="mt-0.5 text-xs text-muted-foreground">
                              {h.note}
                            </p>
                          )}
                        </div>
                        <span
                          className={`inline-flex shrink-0 items-center gap-1 text-xs ${tone}`}
                        >
                          <StatusIcon className="h-3.5 w-3.5" />
                          {label}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-3">
          <Card className="border bg-card shadow-none">
            <CardContent className="p-5">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Продукт
              </p>
              <Link
                to="/v4/products/$productId"
                params={{ productId: product.id }}
                className="mt-2 flex items-center gap-2 hover:underline"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-md border bg-surface">
                  <ProductIcon className="h-4 w-4" />
                </span>
                <span className="text-sm font-medium text-foreground">
                  {product.name}
                </span>
              </Link>
              <p className="mt-3 text-xs text-muted-foreground">
                Формат результата: {resultFormatLabel[product.resultFormat]}
              </p>
            </CardContent>
          </Card>
          <Card className="border bg-card shadow-none">
            <CardContent className="p-5">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Обновлено
              </p>
              <p className="mt-1 text-sm text-foreground">{project.updated}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShellV4>
  );
}
