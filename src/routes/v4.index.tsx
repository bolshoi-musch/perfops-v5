import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShellV4 } from "@/components/perfops-v4/AppShellV4";
import { PageHeaderV4 } from "@/components/perfops-v4/PageHeaderV4";
import { ProductCardV4 } from "@/components/perfops-v4/ProductCardV4";
import {
  products,
  projects,
  getProduct,
  getProjectResultAction,
} from "@/lib/perfops-v4-data";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/v4/")({
  head: () => ({
    meta: [
      { title: "PerfOps — Главная" },
      {
        name: "description",
        content:
          "PerfOps — операционная платформа для performance-маркетинга. Каталог продуктов и недавние проекты.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const recents = [...projects]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 4);

  return (
    <AppShellV4>
      <PageHeaderV4
        title="С чего начать"
        subtitle="Выберите продукт, чтобы создать новый проект, или продолжите недавнюю работу."
      />

      <section>
        <h2 className="mb-3 text-sm font-semibold text-foreground">Продукты</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCardV4 key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section className="mt-10">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">Недавние проекты</h2>
          <Link
            to="/v4/projects"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            Все проекты <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <ul className="divide-y rounded-lg border bg-card">
          {recents.map((p) => {
            const product = getProduct(p.productId);
            const result = getProjectResultAction(p);
            return (
              <li key={p.id}>
                <Link
                  to="/v4/projects/$projectId"
                  params={{ projectId: p.id }}
                  className="flex items-center justify-between gap-4 px-4 py-2.5 hover:bg-surface"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {p.name}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      Продукт: {product.name}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3 text-xs text-muted-foreground">
                    <span>Обновлено {p.updated}</span>
                    <span className="text-foreground">{result.label}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </AppShellV4>
  );
}
