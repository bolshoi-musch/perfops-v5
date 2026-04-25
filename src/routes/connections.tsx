import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/perfops/AppShell";
import { PageHeader } from "@/components/perfops/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { connectionTypes } from "@/lib/perfops-data";
import { ArrowRight, Plug, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/connections")({
  head: () => ({
    meta: [
      { title: "Подключения — PerfOps" },
      {
        name: "description",
        content:
          "Типы интеграций PerfOps. Внутри каждого типа — конкретные подключённые аккаунты.",
      },
    ],
  }),
  component: ConnectionsPage,
});

function ConnectionsPage() {
  return (
    <AppShell>
      <PageHeader
        title="Подключения"
        subtitle="Типы интеграций для проектов. Загрузка файлов происходит внутри сценариев инструментов и не требует постоянного подключения."
      />

      <div className="grid gap-3 sm:grid-cols-2">
        {connectionTypes.map((c) => {
          const total = c.accounts.length;
          const needsAttention = c.accounts.some(
            (a) => a.status === "action-required",
          );
          return (
            <Card key={c.id} className="border bg-card shadow-none">
              <CardContent className="flex flex-col gap-3 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-foreground">
                      {c.name}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {c.description}
                    </p>
                  </div>
                  <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border bg-surface text-muted-foreground">
                    <Plug className="h-3.5 w-3.5" />
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3 border-t pt-3">
                  <div className="text-xs text-muted-foreground">
                    {total === 0
                      ? "Нет подключённых аккаунтов"
                      : `${total} ${pluralize(total)}`}
                    {needsAttention && (
                      <span className="ml-2 inline-flex items-center gap-1 text-warning">
                        <AlertTriangle className="h-3 w-3" />
                        требуется действие
                      </span>
                    )}
                  </div>
                  <Button size="sm" variant="outline" asChild>
                    <Link
                      to="/connections/$typeId"
                      params={{ typeId: c.id }}
                    >
                      Управлять <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </AppShell>
  );
}

function pluralize(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return "аккаунт";
  if ([2, 3, 4].includes(mod10) && ![12, 13, 14].includes(mod100)) return "аккаунта";
  return "аккаунтов";
}
