import { Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { type Product, resultFormatLabel } from "@/lib/perfops-v4-data";

export function ProductCardV4({ product }: { product: Product }) {
  const Icon = product.icon;
  const navigate = useNavigate();

  return (
    <div
      role="link"
      tabIndex={0}
      onClick={() =>
        navigate({
          to: "/v4/products/$productId",
          params: { productId: product.id },
        })
      }
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          navigate({
            to: "/v4/products/$productId",
            params: { productId: product.id },
          });
        }
      }}
      className="group flex h-full cursor-pointer flex-col rounded-lg border bg-card p-4 transition-colors hover:border-border-strong focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
    >
      <div className="mb-3 flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border bg-surface text-foreground">
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-foreground group-hover:text-foreground">
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
      <div className="border-t pt-3" onClick={(e) => e.stopPropagation()}>
        <Button asChild size="sm">
          <Link
            to="/v4/projects/new"
            search={{ productId: product.id }}
          >
            Создать проект
          </Link>
        </Button>
      </div>
    </div>
  );
}
