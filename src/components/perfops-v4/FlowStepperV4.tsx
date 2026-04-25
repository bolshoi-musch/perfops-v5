import { Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Product, StepId } from "@/lib/perfops-v4-data";
import { stepLabel } from "@/lib/perfops-v4-data";

interface FlowStepperV4Props {
  product: Product;
  current: StepId;
}

export function FlowStepperV4({ product, current }: FlowStepperV4Props) {
  const currentIndex = product.steps.indexOf(current);

  return (
    <ol className="mb-6 flex w-full flex-wrap items-center gap-2">
      {product.steps.map((step, i) => {
        const done = i < currentIndex;
        const active = i === currentIndex;
        const clickable = done; // completed steps are clickable
        const label = stepLabel[step];

        const inner = (
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "flex h-6 w-6 items-center justify-center rounded-full border text-[11px] font-medium transition-colors",
                done && "border-primary bg-primary text-primary-foreground",
                active && "border-primary bg-card text-primary",
                !done && !active && "border-border bg-card text-muted-foreground",
              )}
            >
              {done ? <Check className="h-3 w-3" /> : i + 1}
            </span>
            <span
              className={cn(
                "text-xs",
                active ? "font-medium text-foreground" : "text-muted-foreground",
                clickable && "group-hover:text-foreground",
              )}
            >
              {label}
            </span>
          </div>
        );

        return (
          <li key={step} className="flex flex-1 items-center gap-2 min-w-fit">
            {clickable ? (
              <Link
                to="/v4/run/$productId/$step"
                params={{ productId: product.id, step }}
                className="group"
              >
                {inner}
              </Link>
            ) : (
              inner
            )}
            {i < product.steps.length - 1 && (
              <div className={cn("h-px flex-1", done ? "bg-primary" : "bg-border")} />
            )}
          </li>
        );
      })}
    </ol>
  );
}
