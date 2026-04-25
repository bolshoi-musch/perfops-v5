import type { ReactNode } from "react";
import {
  Info,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type StateSeverity = "info" | "success" | "warning" | "blocked" | "error";

const severityConfig: Record<
  StateSeverity,
  { icon: LucideIcon; ring: string; bg: string; iconColor: string; label: string }
> = {
  info: {
    icon: Info,
    ring: "border-info/30",
    bg: "bg-info-soft",
    iconColor: "text-info",
    label: "Инфо",
  },
  success: {
    icon: CheckCircle2,
    ring: "border-success/30",
    bg: "bg-success-soft",
    iconColor: "text-success",
    label: "Успех",
  },
  warning: {
    icon: AlertTriangle,
    ring: "border-warning/40",
    bg: "bg-warning-soft",
    iconColor: "text-warning",
    label: "Предупреждение",
  },
  blocked: {
    icon: ShieldAlert,
    ring: "border-destructive/30",
    bg: "bg-blocked-soft",
    iconColor: "text-destructive",
    label: "Блокировка",
  },
  error: {
    icon: XCircle,
    ring: "border-destructive/30",
    bg: "bg-blocked-soft",
    iconColor: "text-destructive",
    label: "Ошибка",
  },
};

interface StateMessageProps {
  severity: StateSeverity;
  title: string;
  message: ReactNode;
  primaryCta?: ReactNode;
  secondaryCta?: ReactNode;
  details?: ReactNode;
}

export function StateMessage({
  severity,
  title,
  message,
  primaryCta,
  secondaryCta,
  details,
}: StateMessageProps) {
  const cfg = severityConfig[severity];
  const Icon = cfg.icon;
  return (
    <div
      className={cn(
        "rounded-lg border bg-card p-5",
        cfg.ring,
      )}
    >
      <div className="flex items-start gap-4">
        <div
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-md",
            cfg.bg,
          )}
        >
          <Icon className={cn("h-5 w-5", cfg.iconColor)} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "text-[10px] font-semibold uppercase tracking-wide",
                cfg.iconColor,
              )}
            >
              {cfg.label}
            </span>
          </div>
          <h3 className="mt-0.5 text-base font-semibold text-foreground">{title}</h3>
          <div className="mt-1 text-sm text-muted-foreground">{message}</div>
          {details && <div className="mt-3 text-sm text-foreground">{details}</div>}
          {(primaryCta || secondaryCta) && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {primaryCta}
              {secondaryCta}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
