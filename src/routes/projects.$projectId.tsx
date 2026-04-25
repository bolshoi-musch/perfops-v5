import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/perfops/AppShell";
import { PageHeader } from "@/components/perfops/PageHeader";
import { ProjectContextBar } from "@/components/perfops/ProjectContextBar";
import { ToolCard } from "@/components/perfops/ToolCard";
import { Button } from "@/components/ui/button";
import {
  tools,
  getProject,
  libraryEntries,
  recentActivity,
  projectStatusLabel,
  libraryTypeLabel,
  getTool,
} from "@/lib/perfops-data";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/projects/$projectId")({
  head: () => ({ meta: [{ title: "Проект — PerfOps" }] }),
  component: ProjectWorkspace,
});

const tabs = ["Обзор", "Инструменты", "Библиотека", "Активность"] as const;
type Tab = (typeof tabs)[number];

function ProjectWorkspace() {
  const { projectId } = Route.useParams();
  const project = getProject(projectId);
  const [tab, setTab] = useState<Tab>("Обзор");

  const projectEntries = libraryEntries
    .filter((e) => e.projectId === project.id)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  return (
    <AppShell>
      <ProjectContextBar projectName={project.name} client={project.client} />
      <PageHeader
        eyebrow="Проект"
        title={project.name}
        subtitle={`${project.client} · обновлён ${project.updated} · статус: ${projectStatusLabel[project.status]}`}
        actions={
          <Button size="sm">
            <Plus className="h-4 w-4" />
            Запустить инструмент
          </Button>
        }
      />

      <div className="mb-5 flex gap-1 border-b">
        {tabs.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              "-mb-px border-b-2 px-3 py-2 text-sm transition-colors",
              tab === t
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Обзор" && (
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-lg border bg-card p-5 lg:col-span-2">
            <h3 className="text-sm font-semibold text-foreground">Сводка</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Активный весенний спринт для {project.client}. Все источники и результаты
              проекта хранятся в Библиотеке PerfOps.
            </p>
            <div className="mt-4 grid grid-cols-3 gap-4 border-t pt-4 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Статус</p>
                <p className="mt-1 text-foreground">
                  {projectStatusLabel[project.status]}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Инструменты</p>
                <p className="mt-1 text-foreground">{project.toolsUsed}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Результаты</p>
                <p className="mt-1 text-foreground">{project.results}</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-5">
            <h3 className="text-sm font-semibold text-foreground">Активность</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {recentActivity.slice(0, 5).map((a, i) => (
                <li key={i} className="flex flex-col">
                  <span className="text-foreground">{a.text}</span>
                  <span className="text-xs text-muted-foreground">{a.when}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {tab === "Инструменты" && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((t) => (
            <ToolCard key={t.id} tool={t} />
          ))}
        </div>
      )}

      {tab === "Библиотека" && (
        <div className="overflow-hidden rounded-lg border bg-card">
          <table className="w-full text-sm">
            <thead className="border-b bg-surface text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-2.5 font-medium">Запись</th>
                <th className="hidden px-4 py-2.5 font-medium md:table-cell">
                  Продукт
                </th>
                <th className="px-4 py-2.5 font-medium">Обновлено</th>
                <th className="hidden px-4 py-2.5 font-medium sm:table-cell">
                  Тип
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {projectEntries.map((e) => (
                <tr key={e.id} className="hover:bg-surface/60">
                  <td className="px-4 py-3">
                    <p className="font-medium text-foreground">{e.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {e.kind === "result" ? "Результат" : "Источник"}
                      {e.size !== "—" ? ` · ${e.size}` : ""}
                    </p>
                  </td>
                  <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">
                    {e.tool ? getTool(e.tool).name : "—"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{e.updated}</td>
                  <td className="hidden px-4 py-3 text-foreground sm:table-cell">
                    {libraryTypeLabel[e.type]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "Активность" && (
        <ol className="rounded-lg border bg-card divide-y">
          {recentActivity.map((a, i) => (
            <li
              key={i}
              className="flex items-center justify-between gap-4 px-4 py-3"
            >
              <span className="text-sm text-foreground">{a.text}</span>
              <span className="text-xs text-muted-foreground">{a.when}</span>
            </li>
          ))}
        </ol>
      )}
    </AppShell>
  );
}
