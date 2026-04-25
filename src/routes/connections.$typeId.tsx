import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/perfops/AppShell";
import { PageHeader } from "@/components/perfops/PageHeader";
import { Breadcrumbs } from "@/components/perfops/Breadcrumbs";
import { Button } from "@/components/ui/button";
import {
  getConnectionType,
  accountStatusLabel,
  type AccountStatus,
} from "@/lib/perfops-data";
import { Plus, Settings, RefreshCw, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/connections/$typeId")({
  head: () => ({ meta: [{ title: "Управление подключением — PerfOps" }] }),
  component: ConnectionDetailPage,
});

const statusStyle: Record<AccountStatus, string> = {
  connected: "border-success/30 bg-success-soft text-success",
  "action-required": "border-warning/40 bg-warning-soft text-warning",
  disconnected: "border-border bg-surface text-muted-foreground",
};

function ConnectionDetailPage() {
  const { typeId } = Route.useParams();
  const type = getConnectionType(typeId);

  return (
    <AppShell>
      <Breadcrumbs
        items={[
          { label: "Подключения", to: "/connections" },
          { label: type.name },
        ]}
      />
      <PageHeader
        eyebrow="Тип подключения"
        title={type.name}
        subtitle={type.description}
        actions={
          <Button size="sm">
            <Plus className="h-4 w-4" />
            Подключить аккаунт
          </Button>
        }
      />

      {type.accounts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-surface px-6 py-12 text-center">
          <h3 className="text-sm font-medium text-foreground">
            Нет подключённых аккаунтов
          </h3>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground">
            Добавьте первый аккаунт {type.name}, чтобы инструменты могли использовать его как источник.
          </p>
          <Button size="sm" className="mt-4">
            <Plus className="h-4 w-4" />
            Подключить аккаунт
          </Button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border bg-card">
          <table className="w-full text-sm">
            <thead className="border-b bg-surface text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-2.5 font-medium">Аккаунт</th>
                <th className="hidden px-4 py-2.5 font-medium sm:table-cell">
                  Статус
                </th>
                <th className="hidden px-4 py-2.5 font-medium sm:table-cell">
                  Последняя синхронизация
                </th>
                <th className="px-4 py-2.5 text-right font-medium">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {type.accounts.map((a) => (
                <tr key={a.id} className="hover:bg-surface/60">
                  <td className="px-4 py-3">
                    <p className="font-medium text-foreground">{a.name}</p>
                    <p className="text-xs text-muted-foreground">{a.identifier}</p>
                  </td>
                  <td className="hidden px-4 py-3 sm:table-cell">
                    <span
                      className={cn(
                        "inline-flex rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide",
                        statusStyle[a.status],
                      )}
                    >
                      {accountStatusLabel[a.status]}
                    </span>
                  </td>
                  <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">
                    {a.lastSync}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Button size="sm" variant="ghost">
                        <Settings className="h-3.5 w-3.5" />
                        Настроить
                      </Button>
                      <Button size="sm" variant="ghost">
                        <RefreshCw className="h-3.5 w-3.5" />
                        Переподключить
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        aria-label="Удалить"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-3 text-xs text-muted-foreground">
        Конкретный аккаунт можно выбрать на шаге выбора источника при запуске инструмента.
        <Link to="/connections" className="ml-1 underline-offset-2 hover:underline">
          Все типы подключений
        </Link>
      </p>
    </AppShell>
  );
}
