import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShellV4 } from "@/components/perfops-v4/AppShellV4";
import { PageHeaderV4 } from "@/components/perfops-v4/PageHeaderV4";
import { BreadcrumbsV4 } from "@/components/perfops-v4/BreadcrumbsV4";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getProduct, resultFormatLabel } from "@/lib/perfops-v4-data";
import { ArrowRight, ArrowLeft, ExternalLink } from "lucide-react";

export const Route = createFileRoute("/v4/products/$productId")({
  head: () => ({ meta: [{ title: "Продукт — PerfOps" }] }),
  component: ProductDetailPage,
});

function ProductDetailPage() {
  const { productId } = Route.useParams();
  const product = getProduct(productId);
  const Icon = product.icon;

  return (
    <AppShellV4>
      <BreadcrumbsV4
        items={[
          { label: "Продукты", to: "/v4/products" },
          { label: product.name },
        ]}
      />
      <PageHeaderV4
        eyebrow="Продукт"
        title={product.name}
        subtitle={product.page.description}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button asChild size="sm">
              <Link to="/v4/projects/new" search={{ productId: product.id }}>
                Создать проект <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
            {product.hasDemoDashboard && (
              <Button asChild size="sm" variant="outline">
                <a href="#" onClick={(e) => e.preventDefault()}>
                  <ExternalLink className="h-3.5 w-3.5" /> Открыть демо-дашборд
                </a>
              </Button>
            )}
            <Button asChild size="sm" variant="ghost">
              <Link to="/v4/products">
                <ArrowLeft className="h-3.5 w-3.5" /> Назад к продуктам
              </Link>
            </Button>
          </div>
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
                <Badge
                  variant="outline"
                  className="border-info/30 bg-info-soft text-info-foreground"
                >
                  Результат: {resultFormatLabel[product.resultFormat]}
                </Badge>
              </div>
            </div>

            {product.page.sections.map((s) => (
              <section key={s.title}>
                <h2 className="mb-2 text-sm font-semibold text-foreground">
                  {s.title}
                </h2>
                <ul className="space-y-1.5">
                  {s.items.map((item) => (
                    <li
                      key={item}
                      className="text-sm leading-relaxed text-muted-foreground"
                    >
                      · {item}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
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
                Как начать
              </h3>
              <p className="mt-2 text-sm text-foreground">
                Создайте проект — на следующем шаге вы выберете источник.
              </p>
              <Button asChild size="sm" className="mt-3 w-full">
                <Link to="/v4/projects/new" search={{ productId: product.id }}>
                  Создать проект
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShellV4>
  );
}
