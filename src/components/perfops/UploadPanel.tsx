import { useState } from "react";
import {
  UploadCloud,
  Loader2,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export type UploadState =
  | "idle"
  | "uploading"
  | "validating"
  | "invalid"
  | "accepted";

interface UploadPanelProps {
  state: UploadState;
  fileName?: string;
  onRetry?: () => void;
  acceptedTypes?: string[];
}

export function UploadPanel({
  state,
  fileName = "campaign_export.xlsx",
  onRetry,
  acceptedTypes = [".xlsx", ".csv"],
}: UploadPanelProps) {
  if (state === "idle") {
    return (
      <div className="rounded-lg border border-dashed bg-surface p-8 text-center">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-md bg-card text-muted-foreground">
          <UploadCloud className="h-5 w-5" />
        </div>
        <p className="mt-3 text-sm font-medium text-foreground">
          Перетащите файл или нажмите, чтобы загрузить
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Поддерживается: {acceptedTypes.join(", ")} · до 25 МБ
        </p>
        <div className="mt-4">
          <Button variant="outline" size="sm">
            Выбрать файл
          </Button>
        </div>
      </div>
    );
  }

  if (state === "uploading") {
    return (
      <FileRow
        icon={<Loader2 className="h-4 w-4 animate-spin text-info" />}
        name={fileName}
        status="Загружается…"
        statusClass="text-info"
      >
        <Progress value={42} className="mt-3 h-1.5" />
      </FileRow>
    );
  }

  if (state === "validating") {
    return (
      <FileRow
        icon={<Loader2 className="h-4 w-4 animate-spin text-info" />}
        name={fileName}
        status="Проверяем колонки и типы данных…"
        statusClass="text-info"
      >
        <Progress value={78} className="mt-3 h-1.5" />
      </FileRow>
    );
  }

  if (state === "invalid") {
    return (
      <FileRow
        icon={<AlertTriangle className="h-4 w-4 text-destructive" />}
        name={fileName}
        status="Не хватает обязательной колонки: campaign_id"
        statusClass="text-destructive"
      >
        <div className="mt-3 flex gap-2">
          <Button size="sm" variant="outline" onClick={onRetry}>
            Заменить файл
          </Button>
          <Button size="sm" variant="ghost">
            Посмотреть требования
          </Button>
        </div>
      </FileRow>
    );
  }

  return (
    <FileRow
      icon={<CheckCircle2 className="h-4 w-4 text-success" />}
      name={fileName}
      status="Файл принят · можно продолжать"
      statusClass="text-success"
    >
      <div className="mt-3 flex gap-2">
        <Button size="sm" variant="ghost" onClick={onRetry}>
          Заменить файл
        </Button>
      </div>
    </FileRow>
  );
}

function FileRow({
  icon,
  name,
  status,
  statusClass,
  children,
}: {
  icon: React.ReactNode;
  name: string;
  status: string;
  statusClass?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-surface">
          <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-medium text-foreground">{name}</p>
          </div>
          <div className={cn("mt-0.5 flex items-center gap-1.5 text-xs", statusClass)}>
            {icon}
            <span>{status}</span>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

interface UploadStateTabsProps {
  acceptedTypes?: string[];
}

const stateLabel: Record<UploadState, string> = {
  idle: "Ожидание",
  uploading: "Загрузка",
  validating: "Проверка",
  invalid: "Ошибка",
  accepted: "Принят",
};

export function UploadStateTabs({ acceptedTypes }: UploadStateTabsProps) {
  const [state, setState] = useState<UploadState>("idle");
  const states: UploadState[] = ["idle", "uploading", "validating", "invalid", "accepted"];
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-1 rounded-md border bg-surface p-1 text-xs">
        {states.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setState(s)}
            className={cn(
              "rounded-sm px-2.5 py-1 transition-colors",
              state === s
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {stateLabel[s]}
          </button>
        ))}
      </div>
      <UploadPanel
        state={state}
        onRetry={() => setState("idle")}
        acceptedTypes={acceptedTypes}
      />
    </div>
  );
}
