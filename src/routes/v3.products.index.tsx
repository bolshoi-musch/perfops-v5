import { createFileRoute } from "@tanstack/react-router";
import { AppShellV3 } from "@/components/perfops-v3/AppShellV3";
import { PageHeaderV3 } from "@/components/perfops-v3/PageHeaderV3";
import { ProductCardV3 } from "@/components/perfops-v3/ProductCardV3";
import { products } from "@/lib/perfops-v3-data";

export const Route = createFileRoute("/v3/products/")({
  head: () => ({
    meta: [{ title: "Продукты — PerfOps V3" }],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  return (
    <AppShellV3>
      <PageHeaderV3
        eyebrow="Каталог"
        title="Продукты"
        subtitle="Каждый продукт создаёт отдельный проект и сохраняет результат в Библиотеку."
      />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <ProductCardV3 key={p.id} product={p} />
        ))}
      </div>
    </AppShellV3>
  );
}
