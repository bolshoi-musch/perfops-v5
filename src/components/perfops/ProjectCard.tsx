import { Link } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { type Project, projectStatusLabel, getTool } from "@/lib/perfops-data";
import { cn } from "@/lib/utils";

const statusStyles: Record<Project["status"], string> = {
  active: "border-success/30 bg-success-soft text-success",
  paused: "border-warning/40 bg-warning-soft text-warning",
  archived: "border-border bg-surface text-muted-foreground",
};

export function ProjectCard({ project }: { project: Project }) {
  const lastTool = getTool(project.lastTool);
  return (
    <Link
      to="/projects/$projectId"
      params={{ projectId: project.id }}
      className="block focus:outline-none"
    >
      <Card className="border bg-card shadow-none transition-colors hover:border-border-strong">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold text-foreground">
                {project.name}
              </h3>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {project.client}
              </p>
            </div>
            <span
              className={cn(
                "shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide",
                statusStyles[project.status],
              )}
            >
              {projectStatusLabel[project.status]}
            </span>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 border-t pt-3 text-xs">
            <div>
              <p className="text-muted-foreground">Последний инструмент</p>
              <p className="mt-0.5 truncate text-foreground">{lastTool.name}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Результаты</p>
              <p className="mt-0.5 text-foreground">{project.results}</p>
            </div>
          </div>
          <p className="mt-3 text-[11px] text-muted-foreground">
            Обновлён · {project.updated}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
