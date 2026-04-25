import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShellV3 } from "@/components/perfops-v3/AppShellV3";
import { PageHeaderV3 } from "@/components/perfops-v3/PageHeaderV3";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { connectionTypes } from "@/lib/perfops-v3-data";
import { ArrowRight, Plug } from "lucide-react";

export const Route = createFileRoute("/v3/connections/")({
  head: () => ({ meta: [{ title: "Подключения — PerfOps V3" }] }),
  component: ConnectionsPage,
});

function ConnectionsPage() {
  return (
    <AppShellV3>
      <PageHeaderV3
        eyebrow="Интеграции"
        title="Подключения"
        subtitle="Постоянные интеграции с внешними сервисами. Загрузка файлов выполняется внутри продуктов."
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {connectionTypes.map((c) => (
          <Card key={c.id} className="border bg-card shadow-none">
            <CardContent className="flex h-full flex-col p-5">
              <div className="mb-3 flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border bg-surface text-foreground">
                  <Plug className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-foreground">{c.name}</h3>
                  <p className="text-[11px] text-muted-foreground">
                    {c.accounts.length === 0
                      ? "Нет подключённых аккаунтов"
                      : `${c.accounts.length} ${pluralAccounts(c.accounts.length)}`}
                  </p>
                </div>
              </div>
              <p className="mb-4 flex-1 text-sm text-muted-foreground">{c.description}</p>
              <Button variant="outline" size="sm" asChild className="self-start">
                <Link to="/v3/connections/$typeId" params={{ typeId: c.id }}>
                  Управлять <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShellV3>
  );
}

function pluralAccounts(n: number) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return "подключённый аккаунт";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "подключённых аккаунта";
  return "подключённых аккаунтов";
}
