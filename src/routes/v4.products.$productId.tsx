import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShellV4 } from "@/components/perfops-v4/AppShellV4";
import { PageHeaderV4 } from "@/components/perfops-v4/PageHeaderV4";
import { BreadcrumbsV4 } from "@/components/perfops-v4/BreadcrumbsV4";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  getProduct,
  resultFormatLabel,
  connectionTypes,
  stepLabel,
} from "@/lib/perfops-v4-data";
import {
  ArrowRight,
  Check,
  Database,
  FileBarChart,
  Lightbulb,
  Sparkles,
  ShieldAlert,
  ListChecks,
  Star,
  MapPin,
} from "lucide-react";

export const Route = createFileRoute("/v4/products/$productId")({
  head: () => ({ meta: [{ title: "Продукт — PerfOps V4" }] }),
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
        subtitle={product.shortDescription}
        actions={
          <Button asChild size="sm">
            <Link to="/v4/projects/new" search={{ productId: product.id }}>
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
                <Section icon={Lightbulb} title="Что делает продукт">
                  <p className="text-sm text-muted-foreground">{product.page.whatItDoes}</p>
                </Section>
              </div>
            </div>

            <Section icon={Sparkles} title="Что вы получите">
              <p className="text-sm text-muted-foreground">{product.page.whatYouGet}</p>
              <div className="mt-2 rounded-md border bg-surface px-3 py-2 text-sm">
                <p className="font-medium text-foreground">{product.exampleResultName}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {product.exampleResultSummary}
                </p>
              </div>
            </Section>

            <Section icon={Database} title="Поддерживаемые источники">
              <ul className="space-y-1.5">
                {product.page.supportedSources.map((s) => (
                  <li key={s} className="flex items-start gap-2 text-sm text-foreground">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                    {s}
                  </li>
                ))}
              </ul>
            </Section>

            <Section icon={Star} title="Предпочтительные источники">
              <ul className="space-y-1.5">
                {product.page.preferredSources.map((s) => (
                  <li key={s} className="text-sm text-muted-foreground">
                    · {s}
                  </li>
                ))}
              </ul>
            </Section>

            <Section icon={ListChecks} title="Советы и рекомендации">
              <ul className="space-y-1.5">
                {product.page.tips.map((t) => (
                  <li key={t} className="text-sm text-muted-foreground">
                    · {t}
                  </li>
                ))}
              </ul>
            </Section>

            <Section icon={ShieldAlert} title="Ограничения">
              <ul className="space-y-1.5">
                {product.page.limitations.map((l) => (
                  <li key={l} className="text-sm text-muted-foreground">
                    · {l}
                  </li>
                ))}
              </ul>
            </Section>

            <Section icon={MapPin} title="Где сохраняется результат">
              <p className="text-sm text-muted-foreground">{product.page.resultDestination}</p>
            </Section>
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
              <p className="mt-1 text-xs text-muted-foreground">{product.resultName}</p>
            </CardContent>
          </Card>

          <Card className="border bg-card shadow-none">
            <CardContent className="p-5">
              <h3 className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
                <FileBarChart className="h-3.5 w-3.5" /> Шаги флоу
              </h3>
              <ol className="mt-2 space-y-1 text-sm text-foreground">
                {product.steps.map((s, i) => (
                  <li key={s} className="flex items-center gap-2">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border text-[10px] text-muted-foreground">
                      {i + 1}
                    </span>
                    {stepLabel[s]}
                  </li>
                ))}
              </ol>
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
                  Подключения не используются — данные подаются вручную.
                </p>
              )}
              {product.acceptedFileTypes.length > 0 && (
                <p className="mt-3 text-xs text-muted-foreground">
                  Загрузка файла: {product.acceptedFileTypes.join(", ")}.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShellV4>
  );
}

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Lightbulb;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
        <Icon className="h-4 w-4 text-muted-foreground" />
        {title}
      </h2>
      {children}
    </div>
  );
}
