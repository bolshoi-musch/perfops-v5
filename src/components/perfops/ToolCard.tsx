import { Link } from "@tanstack/react-router";
import { ArrowRight, History } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Tool } from "@/lib/perfops-data";

export function ToolCard({ tool }: { tool: Tool }) {
  const Icon = tool.icon;
  const hasLast = Boolean(tool.lastResultLibraryId);
  return (
    <Card className="flex h-full flex-col border bg-card shadow-none transition-colors hover:border-border-strong">
      <CardContent className="flex flex-1 flex-col p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border bg-surface text-foreground">
            <Icon className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-foreground">{tool.name}</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {tool.shortDescription}
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <span className="rounded-full border bg-surface px-2 py-0.5 font-medium uppercase tracking-wide">
            {tool.resultType}
          </span>
        </div>

        <div className="mt-auto flex items-center gap-2 pt-5">
          <Button size="sm" asChild>
            <Link to="/tools/$toolId" params={{ toolId: tool.id }}>
              Создать проект <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
          {hasLast ? (
            <Button size="sm" variant="ghost" asChild>
              <Link to="/library">
                <History className="h-3.5 w-3.5" />
                Открыть последний
              </Link>
            </Button>
          ) : (
            <Button size="sm" variant="ghost" asChild>
              <Link to="/tools/$toolId/about" params={{ toolId: tool.id }}>
                Подробнее
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
