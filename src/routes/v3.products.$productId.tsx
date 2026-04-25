import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShellV3 } from "@/components/perfops-v3/AppShellV3";
import { PageHeaderV3 } from "@/components/perfops-v3/PageHeaderV3";
import { BreadcrumbsV3 } from "@/components/perfops-v3/BreadcrumbsV3";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  getProduct,
  resultFormatLabel,
  connectionTypes,
} from "@/lib/perfops-v3-data";
import { ArrowRight, Check, Database, FileBarChart, Lightbulb, MapPin } from "lucide-react";

export const Route = createFileRoute("/v3/products/$productId")({
  head: () => ({ meta: [{ title: "Продукт — PerfOps V3" }] }),
  component: ProductDetailPage,
});

function ProductDetailPage() {
  const { productId } = Route.useParams();
  const product = getProduct(productId);
  const Icon = product.icon;
  const supported = connectionTypes.filter((c) =>
    product.supportedConnections.includes(c.id),
  );

  return (
    <AppShellV3>
      <BreadcrumbsV3
        items={[
          { label: "Продукты", to: "/v3/products" },
          { label: product.name },
        ]}
      />
      <PageHeaderV3
        eyebrow="Продукт"
        title={product.name}
        subtitle={product.shortDescription}
        actions={
          <Button asChild size="sm">
            <Link
              to="/v3/projects/new"
              search={{ productId: product.id }}
            >
              Создать проект <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="border bg-card shadow-none lg:col-span-2">
          <CardContent className="space-y-6 p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md border bg-surface text-foreground">
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <SectionTitle icon={Lightbulb}>Что делает продукт</SectionTitle>
                <p className="text-sm text-muted-foreground">{product.longDescription}</p>
              </div>
            </div>

            <div>
              <SectionTitle icon={MapPin}>Когда использовать</SectionTitle>
              <p className="text-sm text-muted-foreground">{product.whenToUse}</p>
            </div>

            <div>
              <SectionTitle icon={Database}>Что нужно на входе</SectionTitle>
              <ul className="space-y-1.5">
                {product.inputs.map((req) => (
                  <li key={req} className="flex items-start gap-2 text-sm text-foreground">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                    {req}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <SectionTitle icon={FileBarChart}>Пример результата</SectionTitle>
              <div className="rounded-md border bg-surface px-4 py-3 text-sm">
                <p className="font-medium text-foreground">{product.exampleResultName}</p>
                <p className="mt-1 text-muted-foreground">{product.exampleResultSummary}</p>
              </div>
            </div>

            <p className="rounded-md border bg-surface px-4 py-3 text-sm text-muted-foreground">
              {product.executionNote}
            </p>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <Card className="border bg-card shadow-none">
            <CardContent className="p-5">
              <h3 className="text-xs uppercase tracking-wide text-muted-foreground">
                Формат результата
              </h3>
              <p className="mt-1 text-sm font-medium text-foreground">
                {resultFormatLabel[product.resultFormat]}
              </p>
            </CardContent>
          </Card>
          <Card className="border bg-card shadow-none">
            <CardContent className="p-5">
              <h3 className="text-xs uppercase tracking-wide text-muted-foreground">
                Куда сохраняется
              </h3>
              <p className="mt-1 text-sm text-foreground">{product.resultDestination}</p>
            </CardContent>
          </Card>
          <Card className="border bg-card shadow-none">
            <CardContent className="p-5">
              <h3 className="text-xs uppercase tracking-wide text-muted-foreground">
                Подключения
              </h3>
              {supported.length > 0 ? (
                <ul className="mt-1 space-y-1 text-sm text-foreground">
                  {supported.map((c) => (
                    <li key={c.id}>· {c.name}</li>
                  ))}
                </ul>
              ) : (
                <p className="mt-1 text-sm text-muted-foreground">
                  Подключения не требуются — данные загружаются вручную.
                </p>
              )}
              <p className="mt-3 text-xs text-muted-foreground">
                Загрузка файла: {product.acceptedFileTypes.join(", ")}.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShellV3>
  );
}

function SectionTitle({
  icon: Icon,
  children,
}: {
  icon: typeof Lightbulb;
  children: React.ReactNode;
}) {
  return (
    <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
      <Icon className="h-4 w-4 text-muted-foreground" />
      {children}
    </h2>
  );
}
