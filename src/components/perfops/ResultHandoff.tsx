import type { ReactNode } from "react";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ResultHandoffProps {
  variant: "success" | "degraded";
  title: string;
  resultName: string;
  description: ReactNode;
  primaryCta: ReactNode;
  secondaryCta?: ReactNode;
  tertiaryCta?: ReactNode;
}

export function ResultHandoff({
  variant,
  title,
  resultName,
  description,
  primaryCta,
  secondaryCta,
  tertiaryCta,
}: ResultHandoffProps) {
  const isSuccess = variant === "success";
  return (
    <div
      className={cn(
        "rounded-lg border bg-card p-6",
        isSuccess ? "border-success/30" : "border-warning/40",
      )}
    >
      <div className="flex items-start gap-4">
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-md",
            isSuccess ? "bg-success-soft" : "bg-warning-soft",
          )}
        >
          {isSuccess ? (
            <CheckCircle2 className="h-5 w-5 text-success" />
          ) : (
            <AlertTriangle className="h-5 w-5 text-warning" />
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-base font-semibold text-foreground">{title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>

          <div className="mt-4 rounded-md border bg-surface px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Результат
                </p>
                <p className="mt-0.5 text-sm font-medium text-foreground">{resultName}</p>
              </div>
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
                  isSuccess
                    ? "border-success/30 bg-success-soft text-success"
                    : "border-warning/40 bg-warning-soft text-warning",
                )}
              >
                {isSuccess ? "Сохранён в Библиотеке PerfOps" : "Пока не сохранён в Библиотеке"}
              </span>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            {primaryCta}
            {secondaryCta}
            {tertiaryCta}
          </div>
        </div>
      </div>
    </div>
  );
}
