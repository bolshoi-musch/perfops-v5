import {
  FileSpreadsheet,
  FileBarChart,
  CheckCircle2,
  AlertTriangle,
  Database,
  LayoutDashboard,
  FileText,
  Link as LinkIcon,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  type LibraryEntry,
  libraryKindLabel,
  libraryTypeLabel,
} from "@/lib/perfops-data";
import { cn } from "@/lib/utils";

const typeIcon: Record<LibraryEntry["type"], LucideIcon> = {
  file: FileSpreadsheet,
  dataset: Database,
  report: FileText,
  dashboard: LayoutDashboard,
  export: FileBarChart,
  link: LinkIcon,
};

export function LibraryEntryCard({ entry }: { entry: LibraryEntry }) {
  const Icon = typeIcon[entry.type];
  const saved = entry.saved === "saved";
  return (
    <Card className="border bg-card shadow-none transition-colors hover:border-border-strong">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-surface">
            <Icon className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <p className="truncate text-sm font-medium text-foreground">
                {entry.name}
              </p>
              <div className="flex shrink-0 items-center gap-1">
                <span
                  className={cn(
                    "rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide",
                    entry.kind === "result"
                      ? "border-info/30 bg-info-soft text-info"
                      : "border-border bg-surface text-muted-foreground",
                  )}
                >
                  {libraryKindLabel[entry.kind]}
                </span>
                <span className="rounded-full border bg-surface px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                  {libraryTypeLabel[entry.type]}
                </span>
              </div>
            </div>
            <p className="mt-1 truncate text-xs text-muted-foreground">
              {entry.project} · {entry.size} · {entry.updated}
            </p>
            <div className="mt-3 flex items-center justify-between">
              {saved ? (
                <span className="inline-flex items-center gap-1.5 text-xs text-success">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Результат сохранён
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs text-warning">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  Результат пока не сохранён
                </span>
              )}
              <Button size="sm" variant="ghost">
                Открыть
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
