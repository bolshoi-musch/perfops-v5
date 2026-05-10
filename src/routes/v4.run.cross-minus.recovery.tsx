import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { AppShellV4 } from "@/components/perfops-v4/AppShellV4";
import { PageHeaderV4 } from "@/components/perfops-v4/PageHeaderV4";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

type RecoveryReason = "missing" | "expired";

const searchSchema = z.object({
  reason: z.enum(["missing", "expired"]).default("missing"),
});

export const Route = createFileRoute("/v4/run/cross-minus/recovery")({
  head: () => ({
    meta: [{ title: "Восстановление кросс-минусовки — PerfOps" }],
  }),
  validateSearch: (raw) => searchSchema.parse(raw),
  component: RecoveryPage,
});

const copy: Record<RecoveryReason, { title: string; message: string }> = {
  missing: {
    title: "Сессия кросс-минусовки не найдена",
    message:
      "Мы не нашли активную сессию кросс-минусовки для этого проекта. Запустите расчёт заново.",
  },
  expired: {
    title: "Сессия кросс-минусовки устарела",
    message:
      "Сессия кросс-минусовки устарела и больше недоступна. Запустите расчёт заново.",
  },
};

function RecoveryPage() {
  const { reason } = Route.useSearch() as { reason: RecoveryReason };
  const text = copy[reason];

  return (
    // No ProjectContextBar — recovery is an edge state and the project
    // context may be unknown.
    <AppShellV4>
      <PageHeaderV4
        title={text.title}
        subtitle="Это служебная страница. Она не входит в основной поток кросс-минусовки."
      />
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="border bg-card shadow-none lg:col-span-2">
          <CardContent className="space-y-4 p-6">
            <div className="flex items-start gap-3 rounded-md border border-warning/30 bg-warning-soft px-3 py-3 text-sm">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning-foreground" />
              <p className="text-warning-foreground">{text.message}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button asChild>
                <Link to="/v4/projects">Начать заново</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/v4/library">Открыть Библиотеку</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link to="/v4/projects">Вернуться в проекты</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card className="border bg-card shadow-none h-fit">
          <CardContent className="space-y-2 p-5">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Что произошло
            </p>
            <p className="text-sm text-muted-foreground">
              Кросс-минусовка — короткая сессия. Если её прервали или она устарела,
              продолжить с того же места не получится. Все ранее сохранённые
              источники и Excel-файлы остаются в Библиотеке.
            </p>
          </CardContent>
        </Card>
      </div>
    </AppShellV4>
  );
}
