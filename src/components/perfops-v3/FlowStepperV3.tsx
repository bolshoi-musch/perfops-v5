import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FlowStep {
  label: string;
}

export const v3FlowSteps: FlowStep[] = [
  { label: "Источник" },
  { label: "Проверка" },
  { label: "Запуск" },
  { label: "Результат" },
];

export function FlowStepperV3({
  steps = v3FlowSteps,
  current,
}: {
  steps?: FlowStep[];
  current: number;
}) {
  return (
    <ol className="mb-6 flex w-full items-center gap-2">
      {steps.map((step, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={i} className="flex flex-1 items-center gap-2">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full border text-[11px] font-medium",
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
                )}
              >
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={cn("h-px flex-1", done ? "bg-primary" : "bg-border")} />
            )}
          </li>
        );
      })}
    </ol>
  );
}
