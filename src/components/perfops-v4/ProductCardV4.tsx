import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { type Product, resultFormatLabel } from "@/lib/perfops-v4-data";

export function ProductCardV4({ product }: { product: Product }) {
  const Icon = product.icon;
  return (
    <div className="flex h-full flex-col rounded-lg border bg-card p-4 transition-colors hover:border-border-strong">
      <div className="mb-3 flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border bg-surface text-foreground">
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-foreground">
            {product.name}
          </h3>
          <p className="text-[11px] text-muted-foreground">
            Результат: {resultFormatLabel[product.resultFormat]}
          </p>
        </div>
      </div>
      <p className="mb-4 flex-1 text-sm leading-relaxed text-muted-foreground">
        {product.shortDescription}
      </p>
      <div className="flex flex-wrap items-center gap-2 border-t pt-3">
        <Button asChild size="sm">
          <Link
            to="/v4/projects/new"
            search={{ productId: product.id }}
          >
            Создать проект
          </Link>
        </Button>
        <Button asChild size="sm" variant="ghost">
          <Link
            to="/v4/products/$productId"
            params={{ productId: product.id }}
          >
            Открыть продукт <ArrowRight className="h-3 w-3" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
