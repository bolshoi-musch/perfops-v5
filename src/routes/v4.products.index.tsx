import { createFileRoute } from "@tanstack/react-router";
import { AppShellV4 } from "@/components/perfops-v4/AppShellV4";
import { PageHeaderV4 } from "@/components/perfops-v4/PageHeaderV4";
import { ProductCardV4 } from "@/components/perfops-v4/ProductCardV4";
import { products } from "@/lib/perfops-v4-data";

export const Route = createFileRoute("/v4/products/")({
  head: () => ({ meta: [{ title: "Продукты — PerfOps V4" }] }),
  component: ProductsPage,
});

function ProductsPage() {
  return (
    <AppShellV4>
      <PageHeaderV4
        eyebrow="Каталог"
        title="Продукты"
        subtitle="Каждый продукт работает в едином флоу-фреймворке. Конкретные шаги отличаются, поведение — одинаковое."
      />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <ProductCardV4 key={p.id} product={p} />
        ))}
      </div>
    </AppShellV4>
  );
}
