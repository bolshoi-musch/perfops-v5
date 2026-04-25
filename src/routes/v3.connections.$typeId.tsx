import { createFileRoute } from "@tanstack/react-router";
import { AppShellV3 } from "@/components/perfops-v3/AppShellV3";
import { PageHeaderV3 } from "@/components/perfops-v3/PageHeaderV3";
import { BreadcrumbsV3 } from "@/components/perfops-v3/BreadcrumbsV3";
import { Button } from "@/components/ui/button";
import {
  getConnectionType,
  accountStatusLabel,
  type AccountStatus,
} from "@/lib/perfops-v3-data";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/v3/connections/$typeId")({
  head: () => ({ meta: [{ title: "Подключение — PerfOps V3" }] }),
  component: ConnectionDetailPage,
});

const statusStyle: Record<AccountStatus, string> = {
  connected: "bg-success-soft text-success border-success/30",
  "action-required": "bg-warning-soft text-warning-foreground border-warning/30",
  disconnected: "bg-muted text-muted-foreground border-border",
};

function ConnectionDetailPage() {
  const { typeId } = Route.useParams();
  const connection = getConnectionType(typeId);

  return (
    <AppShellV3>
      <BreadcrumbsV3
        items={[
          { label: "Подключения", to: "/v3/connections" },
          { label: connection.name },
        ]}
      />
      <PageHeaderV3
        eyebrow="Подключение"
        title={connection.name}
        subtitle={connection.description}
        actions={
          <Button size="sm">
            <Plus className="h-3.5 w-3.5" /> Добавить аккаунт
          </Button>
        }
      />

      <h2 className="mb-2 text-sm font-semibold text-foreground">Подключённые аккаунты</h2>
      {connection.accounts.length === 0 ? (
        <div className="rounded-lg border bg-card p-8 text-center">
          <p className="text-sm text-foreground">Нет подключённых аккаунтов</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Добавьте аккаунт, чтобы продукты могли использовать данные из {connection.name}.
          </p>
          <Button size="sm" className="mt-4">
            <Plus className="h-3.5 w-3.5" /> Добавить аккаунт
          </Button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border bg-card">
          <table className="w-full text-sm">
            <thead className="border-b bg-surface text-left text-xs text-muted-foreground">
              <tr>
                <th className="px-3 py-2 font-medium">Аккаунт</th>
                <th className="px-3 py-2 font-medium">Идентификатор</th>
                <th className="px-3 py-2 font-medium">Статус</th>
                <th className="px-3 py-2 font-medium">Последняя синхронизация</th>
                <th className="px-3 py-2 font-medium" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {connection.accounts.map((a) => (
                <tr key={a.id} className="hover:bg-surface">
                  <td className="px-3 py-2.5 align-middle text-sm font-medium text-foreground">
                    {a.name}
                  </td>
                  <td className="px-3 py-2.5 align-middle text-xs text-muted-foreground">
                    {a.identifier}
                  </td>
                  <td className="px-3 py-2.5 align-middle">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-md border px-1.5 py-0.5 text-[11px] font-medium",
                        statusStyle[a.status],
                      )}
                    >
                      {accountStatusLabel[a.status]}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 align-middle text-xs text-muted-foreground">
                    {a.lastSync}
                  </td>
                  <td className="px-3 py-2.5 align-middle text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        className="inline-flex h-7 items-center gap-1 rounded-md px-2 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
                      >
                        Настроить
                      </button>
                      <button
                        type="button"
                        className="inline-flex h-7 items-center gap-1 rounded-md px-2 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
                      >
                        Переподключить
                      </button>
                      <button
                        type="button"
                        className="inline-flex h-7 items-center gap-1 rounded-md px-2 text-xs text-destructive hover:bg-destructive-soft"
                      >
                        Удалить
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AppShellV3>
  );
}
