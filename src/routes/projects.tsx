import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/perfops/AppShell";
import { PageHeader } from "@/components/perfops/PageHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  projects,
  getTool,
  projectStatusLabel,
  type ProjectStatus,
} from "@/lib/perfops-data";
import {
  Search,
  Plus,
  ArrowRight,
  ArrowDownUp,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Проекты — PerfOps" },
      {
        name: "description",
        content: "Список ваших проектов performance-маркетинга в PerfOps.",
      },
    ],
  }),
  component: ProjectsPage,
});

const filters: ("all" | ProjectStatus)[] = ["all", "active", "paused", "archived"];

const filterLabel: Record<(typeof filters)[number], string> = {
  all: "Все",
  active: "Активные",
  paused: "На паузе",
  archived: "В архиве",
};

const statusDot: Record<ProjectStatus, string> = {
  active: "bg-success",
  paused: "bg-warning",
  archived: "bg-muted-foreground/40",
};

function ProjectsPage() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("all");
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    return projects
      .filter((p) => (filter === "all" ? true : p.status === filter))
      .filter((p) =>
        query.trim() === ""
          ? true
          : `${p.name} ${p.client}`
              .toLowerCase()
              .includes(query.trim().toLowerCase()),
      )
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }, [filter, query]);

  return (
    <AppShell>
      <PageHeader
        title="Проекты"
        subtitle="Сначала — недавно обновлённые. Здесь хранятся ваши запуски и результаты."
        actions={
          <Button size="sm">
            <Plus className="h-4 w-4" />
            Новый проект
          </Button>
        }
      />

      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск по проектам…"
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
              <th className="px-4 py-2.5 font-medium">Проект</th>
              <th className="hidden px-4 py-2.5 font-medium md:table-cell">
                Последний инструмент
              </th>
              <th className="px-4 py-2.5 font-medium">
                <span className="inline-flex items-center gap-1">
                  Активность
                  <ArrowDownUp className="h-3 w-3 text-muted-foreground/60" />
                </span>
              </th>
              <th className="hidden px-4 py-2.5 font-medium sm:table-cell">Статус</th>
              <th className="hidden px-4 py-2.5 text-right font-medium sm:table-cell">
                Результаты
              </th>
              <th className="w-10 px-2 py-2.5" />
            </tr>
          </thead>
          <tbody className="divide-y">
            {visible.map((p) => {
              const lastTool = getTool(p.lastTool);
              return (
                <tr key={p.id} className="hover:bg-surface/60">
                  <td className="px-4 py-3">
                    <Link
                      to="/projects/$projectId"
                      params={{ projectId: p.id }}
                      className="block"
                    >
                      <p className="font-medium text-foreground">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.client}</p>
                    </Link>
                  </td>
                  <td className="hidden px-4 py-3 text-foreground md:table-cell">
                    {lastTool.name}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{p.updated}</td>
                  <td className="hidden px-4 py-3 sm:table-cell">
                    <span className="inline-flex items-center gap-1.5 text-xs text-foreground">
                      <span
                        className={cn(
                          "h-1.5 w-1.5 rounded-full",
                          statusDot[p.status],
                        )}
                      />
                      {projectStatusLabel[p.status]}
                    </span>
                  </td>
                  <td className="hidden px-4 py-3 text-right text-foreground tabular-nums sm:table-cell">
                    {p.results}
                  </td>
                  <td className="px-2 py-3 text-right">
                    <Link
                      to="/projects/$projectId"
                      params={{ projectId: p.id }}
                      className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                      aria-label="Открыть проект"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Link>
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
                  Проектов по выбранным условиям не найдено.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
        <MoreHorizontal className="h-3 w-3" />
        Действия по проекту доступны на странице проекта.
      </p>
    </AppShell>
  );
}
