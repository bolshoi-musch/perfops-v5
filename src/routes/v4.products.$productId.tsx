import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShellV4 } from "@/components/perfops-v4/AppShellV4";
import { BreadcrumbsV4 } from "@/components/perfops-v4/BreadcrumbsV4";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getProduct, resultFormatLabel } from "@/lib/perfops-v4-data";
import { ExternalLink } from "lucide-react";

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

      {/* Hero: иконка рядом с названием, без CTA справа */}
      <header className="mb-6 border-b pb-5">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border bg-surface text-foreground">
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              {product.name}
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              {product.page.description}
            </p>
          </div>
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Left: проверенный контент продукта */}
        <Card className="border bg-card shadow-none lg:col-span-2">
          <CardContent className="space-y-6 p-6">
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

        {/* Right: формат результата + как начать */}
        <div className="space-y-3">
          <Card className="border bg-card shadow-none">
            <CardContent className="p-5">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Формат результата
              </p>
              <p className="mt-1 text-sm font-medium text-foreground">
                {resultFormatLabel[product.resultFormat]}
              </p>
            </CardContent>
          </Card>

          <Card className="border bg-card shadow-none">
            <CardContent className="p-5">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Как начать
              </p>
              <p className="mt-2 text-sm text-foreground">
                Создайте проект — на следующем шаге вы выберете источник.
              </p>
              <div className="mt-3 space-y-2">
                <Button asChild size="sm" className="w-full">
                  <Link to="/v4/projects/new" search={{ productId: product.id }}>
                    Создать проект
                  </Link>
                </Button>
                {product.hasDemoDashboard && (
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="w-full"
                  >
                    <a href="#" onClick={(e) => e.preventDefault()}>
                      <ExternalLink className="h-3.5 w-3.5" /> Открыть демо-дашборд
                    </a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShellV4>
  );
}
