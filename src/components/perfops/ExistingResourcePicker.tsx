import { useState } from "react";
import { Search, FileSpreadsheet } from "lucide-react";
import { Input } from "@/components/ui/input";
import { libraryEntries } from "@/lib/perfops-data";
import { cn } from "@/lib/utils";

export function ExistingResourcePicker() {
  const [selected, setSelected] = useState<string>("campaign_export");
  const sources = libraryEntries.filter((e) => e.kind === "source");

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Поиск файлов в Библиотеке…" className="h-9 pl-8 text-sm" />
      </div>
      <div className="rounded-lg border bg-card divide-y">
        {sources.map((entry) => {
          const active = entry.id === selected;
          return (
            <button
              type="button"
              key={entry.id}
              onClick={() => setSelected(entry.id)}
              className={cn(
                "flex w-full items-center justify-between px-4 py-3 text-left hover:bg-surface",
                active && "bg-accent/50",
              )}
            >
              <div className="flex items-center gap-3">
                <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">{entry.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {entry.project} · {entry.size} · обновлено {entry.updated}
                  </p>
                </div>
              </div>
              <span className="text-xs text-success">Сохранён в Библиотеке</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
