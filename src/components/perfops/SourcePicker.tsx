import { useState } from "react";
import { UploadCloud, FolderOpen, Plug } from "lucide-react";
import { cn } from "@/lib/utils";
import { UploadPanel } from "./UploadPanel";
import { ExistingResourcePicker } from "./ExistingResourcePicker";

type SourceOption = "upload" | "library" | "connection";

const options: {
  id: SourceOption;
  title: string;
  description: string;
  icon: typeof UploadCloud;
}[] = [
  {
    id: "upload",
    title: "Загрузить новый файл",
    description: "Добавить свежую выгрузку с вашего устройства.",
    icon: UploadCloud,
  },
  {
    id: "library",
    title: "Выбрать из Библиотеки",
    description: "Использовать файл, уже сохранённый в PerfOps.",
    icon: FolderOpen,
  },
  {
    id: "connection",
    title: "Использовать подключение",
    description: "Получить данные напрямую из Google Ads, Sheets или Яндекс Директ.",
    icon: Plug,
  },
];

export function SourcePicker() {
  const [selected, setSelected] = useState<SourceOption>("upload");
  return (
    <div className="space-y-6">
      <div className="grid gap-3 md:grid-cols-3">
        {options.map((opt) => {
          const Icon = opt.icon;
          const active = opt.id === selected;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => setSelected(opt.id)}
              className={cn(
                "rounded-lg border bg-card p-4 text-left transition-all hover:border-border-strong",
                active && "border-primary ring-2 ring-primary/20",
              )}
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-md border",
                    active ? "border-primary/30 bg-accent text-primary" : "bg-surface text-muted-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{opt.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{opt.description}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div>
        {selected === "upload" && <UploadPanel state="idle" />}
        {selected === "library" && <ExistingResourcePicker />}
        {selected === "connection" && <ConnectionSourcePanel />}
      </div>
    </div>
  );
}

function ConnectionSourcePanel() {
  const items = [
    { name: "Google Ads · acme-retail@ads.example", status: "Подключено" },
    { name: "Google Sheets · ops@acme-retail.example", status: "Подключено" },
    { name: "Яндекс Директ · acme-retail@yandex.example", status: "Требуется действие" },
  ];
  return (
    <div className="rounded-lg border bg-card divide-y">
      {items.map((it) => (
        <label
          key={it.name}
          className="flex cursor-pointer items-center justify-between px-4 py-3 hover:bg-surface"
        >
          <div className="flex items-center gap-3">
            <input type="radio" name="conn" className="h-3.5 w-3.5 accent-primary" />
            <span className="text-sm text-foreground">{it.name}</span>
          </div>
          <span className="text-xs text-muted-foreground">{it.status}</span>
        </label>
      ))}
    </div>
  );
}
