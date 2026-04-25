import { Loader2 } from "lucide-react";

interface ProcessingPanelProps {
  title: string;
  status: string;
  destination: string;
}

export function ProcessingPanel({ title, status, destination }: ProcessingPanelProps) {
  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-info-soft">
          <Loader2 className="h-4 w-4 animate-spin text-info" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground">{status}</p>
        </div>
      </div>

      <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-surface">
        <div className="h-full w-1/3 animate-pulse rounded-full bg-info" />
      </div>

      <div className="mt-5 grid gap-3 rounded-md border bg-surface p-4 text-sm sm:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Что произойдёт дальше
          </p>
          <p className="mt-1 text-foreground">
            Когда обработка завершится, результат будет зарегистрирован в Библиотеке PerfOps.
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Где появится результат
          </p>
          <p className="mt-1 text-foreground">{destination}</p>
        </div>
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        Можно закрыть страницу — обработка продолжится в фоне.
      </p>
    </div>
  );
}
