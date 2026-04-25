import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShellV3 } from "@/components/perfops-v3/AppShellV3";
import { PageHeaderV3 } from "@/components/perfops-v3/PageHeaderV3";
import { ProjectContextBarV3 } from "@/components/perfops-v3/ProjectContextBarV3";
import { FlowStepperV3 } from "@/components/perfops-v3/FlowStepperV3";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getProduct, projects, getConnectionType } from "@/lib/perfops-v3-data";
import { Upload, Plug, FileSpreadsheet, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/v3/tools/$productId/source")({
  head: () => ({ meta: [{ title: "Источник — PerfOps V3" }] }),
  component: SourceStepPage,
});

function SourceStepPage() {
  const { productId } = Route.useParams();
  const product = getProduct(productId);
  // Demo: pick first project that uses this product, or the very first
  const project = projects.find((p) => p.productId === productId) ?? projects[0];
  const connections = product.supportedConnections.map((id) => getConnectionType(id));

  return (
    <AppShellV3>
      <ProjectContextBarV3
        projectName={project.name}
        projectId={project.id}
        productName={product.name}
        step="Источник"
      />
      <PageHeaderV3
        eyebrow="Шаг 1 из 4"
        title="Выберите источник данных"
        subtitle="Загрузите файл или используйте подключённый аккаунт."
      />
      <FlowStepperV3 current={0} />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-2">
          <Card className="border bg-card shadow-none">
            <CardContent className="p-5">
              <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                <Upload className="h-4 w-4 text-muted-foreground" /> Загрузить файл
              </h2>
              <div className="rounded-md border border-dashed bg-surface px-4 py-8 text-center">
                <FileSpreadsheet className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="mt-2 text-sm font-medium text-foreground">
                  Перетащите файл сюда
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Поддерживаемые форматы: {product.acceptedFileTypes.join(", ")}. До 25 МБ.
                </p>
                <Button size="sm" variant="outline" className="mt-3">
                  Выбрать файл
                </Button>
              </div>
            </CardContent>
          </Card>

          {connections.length > 0 && (
            <Card className="border bg-card shadow-none">
              <CardContent className="p-5">
                <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Plug className="h-4 w-4 text-muted-foreground" /> Использовать подключение
                </h2>
                <ul className="divide-y rounded-md border">
                  {connections.flatMap((c) =>
                    c.accounts.map((a) => (
                      <li
                        key={a.id}
                        className="flex items-center justify-between gap-3 px-3 py-2 text-sm hover:bg-surface"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm text-foreground">{a.name}</p>
                          <p className="truncate text-[11px] text-muted-foreground">
                            {c.name} · {a.identifier}
                          </p>
                        </div>
                        <button
                          type="button"
                          className="inline-flex h-7 items-center gap-1 rounded-md px-2 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
                        >
                          Выбрать
                        </button>
                      </li>
                    )),
                  )}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        <Card className="border bg-card shadow-none h-fit">
          <CardContent className="p-5">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Что нужно
            </p>
            <ul className="mt-2 space-y-1.5 text-sm text-foreground">
              {product.inputs.map((i) => (
                <li key={i}>· {i}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="mt-5 flex items-center justify-between border-t pt-4">
        <Button variant="ghost" asChild>
          <Link to="/v3/projects/$projectId" params={{ projectId: project.id }}>
            Назад
          </Link>
        </Button>
        <Button asChild>
          <Link to="/v3/tools/$productId/review" params={{ productId: product.id }}>
            Далее: проверка <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>
    </AppShellV3>
  );
}
