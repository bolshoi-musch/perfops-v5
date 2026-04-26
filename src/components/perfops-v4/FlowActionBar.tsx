import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Product, StepId } from "@/lib/perfops-v4-data";
import { stepLabel } from "@/lib/perfops-v4-data";

interface FlowActionBarProps {
  product: Product;
  /** Effective step list (may differ from product.steps when optional steps
   *  like "combining" are hidden). Used to compute prev/next. */
  steps: StepId[];
  current: StepId;
  projectId: string;
  /** Search params to preserve across step navigation (e.g. ?second=1). */
  search?: Record<string, unknown>;
  /** Override default Continue label. */
  nextLabel?: string;
  /** Disable the Continue action. */
  nextDisabled?: boolean;
  /** Replace the Continue button entirely (e.g. on result step). */
  nextSlot?: ReactNode;
  /** Extra elements between Back and Continue. */
  middleSlot?: ReactNode;
}

export function FlowActionBar({
  product,
  steps,
  current,
  projectId,
  search,
  nextLabel,
  nextDisabled,
  nextSlot,
  middleSlot,
}: FlowActionBarProps) {
  const idx = steps.indexOf(current);
  const next = idx >= 0 && idx < steps.length - 1 ? steps[idx + 1] : undefined;
  const prev = idx > 0 ? steps[idx - 1] : undefined;

  const computedNextLabel =
    nextLabel ?? (next ? `Далее: ${stepLabel[next]}` : "Готово");

  return (
    <div className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t pt-4">
      <div>
        {prev ? (
          <Button variant="ghost" asChild>
            <Link
              to="/v4/run/$productId/$step"
              params={{ productId: product.id, step: prev }}
              search={search}
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Назад
            </Link>
          </Button>
        ) : (
          <Button variant="ghost" asChild>
            <Link to="/v4/projects/$projectId" params={{ projectId }}>
              <ArrowLeft className="h-3.5 w-3.5" /> К проекту
            </Link>
          </Button>
        )}
      </div>
      {middleSlot && <div className="flex-1 text-center">{middleSlot}</div>}
      <div className="flex items-center gap-2">
        {nextSlot
          ? nextSlot
          : next && (
              <Button asChild disabled={nextDisabled}>
                <Link
                  to="/v4/run/$productId/$step"
                  params={{ productId: product.id, step: next }}
                  search={search}
                >
                  {computedNextLabel} <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            )}
      </div>
    </div>
  );
}
