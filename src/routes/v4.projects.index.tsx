import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShellV4 } from "@/components/perfops-v4/AppShellV4";
import { PageHeaderV4 } from "@/components/perfops-v4/PageHeaderV4";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  projects,
  products,
  getProduct,
  getProjectResultAction,
  type ProductId,
} from "@/lib/perfops-v4-data";
import { ArrowRight, Search, Plus, Download, ExternalLink, FileText } from "lucide-react";

export const Route = createFileRoute("/v4/projects/")({
  head: () => ({ meta: [{ title: "Проекты — PerfOps" }] }),
  component: ProjectsPage,
});

function ProjectsPage() {
  const [query, setQuery] = useState("");
  const [productFilter, setProductFilter] = useState<ProductId | "all">("all");

  const filtered = useMemo(() => {
    return [...projects]
      .filter((p) => (productFilter === "all" ? true : p.productId === productFilter))
      .filter((p) =>
        query ? p.name.toLowerCase().includes(query.toLowerCase()) : true,
      )
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }, [query, productFilter]);

  return (
    <AppShellV4>
      <PageHeaderV4
        title="Проекты"
        subtitle="Каждый проект создаётся для одного продукта. Сортировка по последнему обновлению."
        actions={
          <Button asChild size="sm">
            <Link to="/v4/projects/new">
              <Plus className="h-3.5 w-3.5" /> Новый проект
            </Link>
          </Button>
        }
      />

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-56 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск по проектам"
            className="h-9 pl-8 text-sm"
          />
        </div>
        <Select
          value={productFilter}
          onValueChange={(v) => setProductFilter(v as ProductId | "all")}
        >
          <SelectTrigger className="h-9 w-56 text-sm">
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
          {filtered.length} из {projects.length}
        </span>
      </div>

      <div className="overflow-hidden rounded-lg border bg-card">
        <table className="w-full text-sm">
          <thead className="border-b bg-surface text-left text-xs text-muted-foreground">
            <tr>
              <th className="px-3 py-2 font-medium">Проект</th>
              <th className="px-3 py-2 font-medium">Продукт</th>
              <th className="px-3 py-2 font-medium">Обновлено</th>
              <th className="px-3 py-2 font-medium">Результат</th>
              <th className="px-3 py-2 font-medium" />
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((p) => {
              const product = getProduct(p.productId);
              const result = getProjectResultAction(p);
              const ResultIcon =
                result.variant === "open-dashboard"
                  ? ExternalLink
                  : result.variant === "download-excel"
                    ? Download
                    : result.variant === "open-report"
                      ? FileText
                      : null;
              return (
                <tr key={p.id} className="hover:bg-surface">
                  <td className="px-3 py-2.5 align-top">
                    <Link
                      to="/v4/projects/$projectId"
                      params={{ projectId: p.id }}
                      className="text-sm font-medium text-foreground hover:underline"
                    >
                      {p.name}
                    </Link>
                    {p.description && (
                      <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                        {p.description}
                      </p>
                    )}
                  </td>
                  <td className="px-3 py-2.5 align-top text-muted-foreground">
                    {product.name}
                  </td>
                  <td className="px-3 py-2.5 align-top text-muted-foreground">
                    {p.updated}
                  </td>
                  <td className="px-3 py-2.5 align-top">
                    {result.variant === "none" ? (
                      <span className="text-xs text-muted-foreground">{result.label}</span>
                    ) : (
                      <Link
                        to="/v4/projects/$projectId"
                        params={{ projectId: p.id }}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
                      >
                        {ResultIcon && <ResultIcon className="h-3.5 w-3.5" />}
                        {result.label}
                      </Link>
                    )}
                  </td>
                  <td className="px-3 py-2.5 align-top text-right">
                    <Link
                      to="/v4/projects/$projectId"
                      params={{ projectId: p.id }}
                      className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                    >
                      Открыть <ArrowRight className="h-3 w-3" />
                    </Link>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-3 py-12 text-center text-sm text-muted-foreground">
                  Ничего не найдено по выбранным фильтрам.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AppShellV4>
  );
}
