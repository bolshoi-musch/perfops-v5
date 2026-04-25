import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/perfops/AppShell";
import { PageHeader } from "@/components/perfops/PageHeader";
import { ToolCard } from "@/components/perfops/ToolCard";
import { tools, projects, getTool, projectStatusLabel } from "@/lib/perfops-data";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PerfOps — Операции performance-маркетинга" },
      {
        name: "description",
        content:
          "PerfOps — спокойная B2B-платформа: каталог продуктов performance-маркетинга, проекты и единая Библиотека результатов.",
      },
    ],
  }),
  component: HomePage,
});

const statusDot: Record<(typeof projects)[number]["status"], string> = {
  active: "bg-success",
  paused: "bg-warning",
  archived: "bg-muted-foreground/40",
};

function HomePage() {
  const recents = [...projects]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 4);

  return (
    <AppShell>
      <PageHeader
        eyebrow="Каталог продуктов"
        title="С чего начать"
        subtitle="Выберите продукт, чтобы создать новый проект, или вернитесь к недавнему."
      />

      <section>
        <h2 className="mb-3 text-sm font-semibold text-foreground">Продукты</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>

      <section className="mt-10">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">Недавние проекты</h2>
          <Link
            to="/projects"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            Все проекты <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <ul className="divide-y rounded-lg border bg-card">
          {recents.map((p) => {
            const lastTool = getTool(p.lastTool);
            return (
              <li key={p.id}>
                <Link
                  to="/projects/$projectId"
                  params={{ projectId: p.id }}
                  className="flex items-center justify-between gap-4 px-4 py-2.5 hover:bg-surface"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      className={cn("h-1.5 w-1.5 rounded-full", statusDot[p.status])}
                      aria-hidden="true"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">
                        {p.name}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {p.client} · последний — {lastTool.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-3 text-xs text-muted-foreground">
                    <span className="hidden sm:inline">
                      {projectStatusLabel[p.status]}
                    </span>
                    <span>{p.updated}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </AppShell>
  );
}
