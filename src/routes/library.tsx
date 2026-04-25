import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/perfops/AppShell";
import { PageHeader } from "@/components/perfops/PageHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  libraryEntries,
  libraryTypeLabel,
  getTool,
  type LibraryEntryKind,
  type LibraryEntry,
} from "@/lib/perfops-data";
import { cn } from "@/lib/utils";
import {
  Search,
  CheckCircle2,
  AlertTriangle,
  Download,
  Share2,
  ExternalLink,
  FileSpreadsheet,
  FileBarChart,
  Database,
  LayoutDashboard,
  FileText,
  Link as LinkIcon,
  type LucideIcon,
} from "lucide-react";

export const Route = createFileRoute("/library")({
  head: () => ({
    meta: [
      { title: "Библиотека — PerfOps" },
      {
        name: "description",
        content:
          "Источники и результаты, сохранённые в PerfOps. Отсортировано по дате обновления.",
      },
    ],
  }),
  component: LibraryPage,
});

const filters: ("all" | LibraryEntryKind)[] = ["all", "source", "result"];
const filterLabel: Record<(typeof filters)[number], string> = {
  all: "Все",
  source: "Источники",
  result: "Результаты",
};

const typeIcon: Record<LibraryEntry["type"], LucideIcon> = {
  file: FileSpreadsheet,
  dataset: Database,
  report: FileText,
  dashboard: LayoutDashboard,
  export: FileBarChart,
  link: LinkIcon,
};

function LibraryPage() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("all");
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    return libraryEntries
      .filter((e) => (filter === "all" ? true : e.kind === filter))
      .filter((e) =>
        query.trim() === ""
          ? true
          : `${e.name} ${e.project}`
              .toLowerCase()
              .includes(query.trim().toLowerCase()),
      )
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }, [filter, query]);

  return (
    <AppShell>
      <PageHeader
        title="Библиотека"
        subtitle="Источники и результаты со всех проектов. Сначала — самые свежие записи."
      />

      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск по библиотеке…"
            className="h-9 pl-8 text-sm"
          />
        </div>
        <div className="flex flex-wrap gap-1 rounded-md border bg-surface p-1 text-xs">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={cn(
                "h-7 rounded-sm px-2.5 transition-colors",
                filter === f
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {filterLabel[f]}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border bg-card">
        <table className="w-full text-sm">
          <thead className="border-b bg-surface text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-2.5 font-medium">Запись</th>
              <th className="hidden px-4 py-2.5 font-medium md:table-cell">Проект</th>
              <th className="hidden px-4 py-2.5 font-medium md:table-cell">Продукт</th>
              <th className="px-4 py-2.5 font-medium">Обновлено</th>
              <th className="hidden px-4 py-2.5 font-medium sm:table-cell">Статус</th>
              <th className="px-4 py-2.5 text-right font-medium">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {visible.map((e) => {
              const Icon = typeIcon[e.type];
              const tool = e.tool ? getTool(e.tool) : undefined;
              return (
                <tr key={e.id} className="hover:bg-surface/60">
                  <td className="px-4 py-3">
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-surface">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-foreground">
                          {e.name}
                        </p>
                        <div className="mt-1 flex flex-wrap items-center gap-1 text-[10px] uppercase tracking-wide">
                          <span
                            className={cn(
                              "rounded-full border px-1.5 py-0.5 font-medium",
                              e.kind === "result"
                                ? "border-info/30 bg-info-soft text-info"
                                : "border-border bg-surface text-muted-foreground",
                            )}
                          >
                            {e.kind === "result" ? "Результат" : "Источник"}
                          </span>
                          <span className="rounded-full border bg-surface px-1.5 py-0.5 font-medium text-muted-foreground">
                            {libraryTypeLabel[e.type]}
                          </span>
                          {e.size !== "—" && (
                            <span className="text-[11px] normal-case text-muted-foreground">
                              · {e.size}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 text-foreground md:table-cell">
                    {e.project}
                  </td>
                  <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">
                    {tool ? tool.name : "—"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{e.updated}</td>
                  <td className="hidden px-4 py-3 sm:table-cell">
                    {e.saved === "saved" ? (
                      <span className="inline-flex items-center gap-1.5 text-xs text-success">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Сохранено
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs text-warning">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        Не сохранено
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Button size="sm" variant="ghost">
                        <ExternalLink className="h-3.5 w-3.5" />
                        Открыть
                      </Button>
                      {e.downloadable && (
                        <Button
                          size="icon"
                          variant="ghost"
                          aria-label="Скачать"
                          className="h-7 w-7"
                        >
                          <Download className="h-3.5 w-3.5" />
                        </Button>
                      )}
                      {e.shareable && (
                        <Button
                          size="icon"
                          variant="ghost"
                          aria-label="Поделиться"
                          className="h-7 w-7"
                        >
                          <Share2 className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
            {visible.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-sm text-muted-foreground"
                >
                  Записей не найдено.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
