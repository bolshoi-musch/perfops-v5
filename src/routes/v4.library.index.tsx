import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShellV4 } from "@/components/perfops-v4/AppShellV4";
import { PageHeaderV4 } from "@/components/perfops-v4/PageHeaderV4";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  libraryEntries,
  products,
  getProduct,
  formatLabel,
  libraryKindLabel,
  type LibraryEntryKind,
  type ProductId,
} from "@/lib/perfops-v4-data";
import {
  Search,
  Download,
  Share2,
  ExternalLink,
  FileText,
  FileSpreadsheet,
  File as FileIcon,
  Plug,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/v4/library/")({
  head: () => ({ meta: [{ title: "Библиотека — PerfOps V4" }] }),
  component: LibraryPage,
});

function LibraryPage() {
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<LibraryEntryKind | "all">("all");
  const [productFilter, setProductFilter] = useState<ProductId | "all">("all");

  const filtered = useMemo(() => {
    return [...libraryEntries]
      .filter((e) => (kind === "all" ? true : e.kind === kind))
      .filter((e) =>
        productFilter === "all" ? true : e.productId === productFilter,
      )
      .filter((e) =>
        query ? e.name.toLowerCase().includes(query.toLowerCase()) : true,
      )
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }, [query, kind, productFilter]);

  return (
    <AppShellV4>
      <PageHeaderV4
        eyebrow="Хранилище"
        title="Библиотека"
        subtitle="Источники и результаты, привязанные к проектам. Сортировка по дате обновления."
      />

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-56 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск по записям"
            className="h-8 pl-8 text-sm"
          />
        </div>
        <div className="inline-flex h-8 rounded-md border bg-card p-0.5 text-xs">
          {(["all", "source", "result"] as const).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setKind(k)}
              className={cn(
                "rounded-[5px] px-3 text-xs font-medium transition-colors",
                kind === k
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {k === "all" ? "Все" : libraryKindLabel[k] + "и"}
            </button>
          ))}
        </div>
        <Select
          value={productFilter}
          onValueChange={(v) => setProductFilter(v as ProductId | "all")}
        >
          <SelectTrigger className="h-8 w-56 text-sm">
            <SelectValue placeholder="Продукт" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все продукты</SelectItem>
            {products.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="ml-auto text-xs text-muted-foreground">
          {filtered.length} из {libraryEntries.length}
        </span>
      </div>

      <div className="overflow-hidden rounded-lg border bg-card">
        <table className="w-full text-sm">
          <thead className="border-b bg-surface text-left text-xs text-muted-foreground">
            <tr>
              <th className="px-3 py-2 font-medium">Запись</th>
              <th className="px-3 py-2 font-medium">Тип</th>
              <th className="px-3 py-2 font-medium">Формат</th>
              <th className="px-3 py-2 font-medium">Проект</th>
              <th className="px-3 py-2 font-medium">Продукт</th>
              <th className="px-3 py-2 font-medium">Обновлено</th>
              <th className="px-3 py-2 font-medium" />
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((e) => {
              const FormatIcon =
                e.format === "excel"
                  ? FileSpreadsheet
                  : e.format === "dashboard-link"
                    ? ExternalLink
                    : e.format === "analytics-report"
                      ? FileText
                      : e.format === "yandex-direct" || e.format === "google-ads" || e.format === "google-sheets"
                        ? Plug
                        : FileIcon;
              const product = e.productId ? getProduct(e.productId) : null;
              const downloadable = e.format === "excel" || e.format === "xlsx" || e.format === "csv";
              const shareable = e.format === "dashboard-link";
              return (
                <tr key={e.id} className="hover:bg-surface">
                  <td className="px-3 py-2.5 align-middle">
                    <div className="flex items-center gap-2">
                      <FormatIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">{e.name}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5 align-middle">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-md border px-1.5 py-0.5 text-[11px] font-medium",
                        e.kind === "source"
                          ? "border-info/30 bg-info-soft text-info-foreground/80"
                          : "border-success/30 bg-success-soft text-success",
                      )}
                    >
                      {libraryKindLabel[e.kind]}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 align-middle text-xs text-muted-foreground">
                    {formatLabel(e.format)}
                  </td>
                  <td className="px-3 py-2.5 align-middle">
                    <Link
                      to="/v4/projects/$projectId"
                      params={{ projectId: e.projectId }}
                      className="text-xs text-muted-foreground hover:text-foreground hover:underline"
                    >
                      {e.projectName}
                    </Link>
                  </td>
                  <td className="px-3 py-2.5 align-middle text-xs text-muted-foreground">
                    {product ? product.name : "—"}
                  </td>
                  <td className="px-3 py-2.5 align-middle text-xs text-muted-foreground">
                    {e.updated}
                  </td>
                  <td className="px-3 py-2.5 align-middle">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        className="inline-flex h-7 items-center gap-1 rounded-md px-2 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
                      >
                        Открыть
                      </button>
                      {downloadable && (
                        <button
                          type="button"
                          className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                          aria-label="Скачать"
                        >
                          <Download className="h-3.5 w-3.5" />
                        </button>
                      )}
                      {shareable && (
                        <button
                          type="button"
                          className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                          aria-label="Поделиться"
                        >
                          <Share2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-3 py-12 text-center text-sm text-muted-foreground">
                  Ничего не найдено.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AppShellV4>
  );
}
