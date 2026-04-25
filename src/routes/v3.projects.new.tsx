import { useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { AppShellV3 } from "@/components/perfops-v3/AppShellV3";
import { PageHeaderV3 } from "@/components/perfops-v3/PageHeaderV3";
import { BreadcrumbsV3 } from "@/components/perfops-v3/BreadcrumbsV3";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  products,
  getProduct,
  getConnectionType,
  type ProductId,
  resultFormatLabel,
} from "@/lib/perfops-v3-data";

const searchSchema = z.object({
  productId: z
    .enum([
      "dashboard-builder",
      "campaign-analysis",
      "cross-minus",
      "bd-optimization",
      "semantics-generator",
    ])
    .optional(),
});

export const Route = createFileRoute("/v3/projects/new")({
  head: () => ({ meta: [{ title: "Новый проект — PerfOps V3" }] }),
  validateSearch: searchSchema,
  component: NewProjectPage,
});

function NewProjectPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const prefilled = !!search.productId;

  const [productId, setProductId] = useState<ProductId>(
    search.productId ?? "dashboard-builder",
  );
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [accountId, setAccountId] = useState<string>("");

  const product = getProduct(productId);
  const supportedConnections = useMemo(
    () =>
      product.supportedConnections
        .map((id) => getConnectionType(id))
        .filter((c) => c.accounts.length > 0),
    [product],
  );

  const canSubmit = name.trim().length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Static prototype: fake project creation, jump to flow source step
    navigate({
      to: "/v3/tools/$productId/source",
      params: { productId },
    });
  };

  return (
    <AppShellV3>
      <BreadcrumbsV3
        items={[
          { label: "Проекты", to: "/v3/projects" },
          { label: "Новый проект" },
        ]}
      />
      <PageHeaderV3
        eyebrow="Создание"
        title="Новый проект"
        subtitle="Заполните основные параметры. После создания вы перейдёте к выбору источника данных."
      />

      <form onSubmit={handleSubmit} className="grid gap-4 lg:grid-cols-3">
        <Card className="border bg-card shadow-none lg:col-span-2">
          <CardContent className="space-y-5 p-6">
            <div>
              <Label htmlFor="product" className="text-xs font-medium">
                Продукт
              </Label>
              {prefilled ? (
                <div className="mt-1 flex items-center justify-between rounded-md border bg-surface px-3 py-2 text-sm">
                  <span className="font-medium text-foreground">{product.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {resultFormatLabel[product.resultFormat]}
                  </span>
                </div>
              ) : (
                <Select
                  value={productId}
                  onValueChange={(v) => setProductId(v as ProductId)}
                >
                  <SelectTrigger id="product" className="mt-1 h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div>
              <Label htmlFor="name" className="text-xs font-medium">
                Название проекта
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={`Например: ${product.exampleResultName.replace(".xlsx", "")}`}
                className="mt-1 h-9"
                autoFocus
              />
              <p className="mt-1 text-[11px] text-muted-foreground">
                Короткое название, которое будет видно в списке проектов.
              </p>
            </div>

            <div>
              <Label htmlFor="description" className="text-xs font-medium">
                Описание <span className="text-muted-foreground">(опционально)</span>
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Зачем создаётся проект, какой период или направление."
                className="mt-1 min-h-[72px] text-sm"
              />
            </div>

            {supportedConnections.length > 0 && (
              <div>
                <Label htmlFor="account" className="text-xs font-medium">
                  Подключение / аккаунт{" "}
                  <span className="text-muted-foreground">(опционально)</span>
                </Label>
                <Select value={accountId} onValueChange={setAccountId}>
                  <SelectTrigger id="account" className="mt-1 h-9">
                    <SelectValue placeholder="Выбрать аккаунт или пропустить" />
                  </SelectTrigger>
                  <SelectContent>
                    {supportedConnections.map((c) => (
                      <div key={c.id}>
                        <div className="px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                          {c.name}
                        </div>
                        {c.accounts.map((a) => (
                          <SelectItem key={a.id} value={a.id}>
                            {a.name}{" "}
                            <span className="text-muted-foreground">— {a.identifier}</span>
                          </SelectItem>
                        ))}
                      </div>
                    ))}
                  </SelectContent>
                </Select>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Если аккаунт не выбран, источник можно будет загрузить файлом на
                  следующем шаге.
                </p>
              </div>
            )}

            <div className="flex items-center gap-2 border-t pt-4">
              <Button type="submit" disabled={!canSubmit}>
                Создать проект
              </Button>
              <Button type="button" variant="ghost" asChild>
                <Link to="/v3/projects">Отмена</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <Card className="border bg-card shadow-none">
            <CardContent className="p-5">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Что вы получите
              </p>
              <p className="mt-1 text-sm font-medium text-foreground">
                {resultFormatLabel[product.resultFormat]}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {product.exampleResultSummary}
              </p>
            </CardContent>
          </Card>
          <Card className="border bg-card shadow-none">
            <CardContent className="p-5">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Дальнейшие шаги
              </p>
              <ol className="mt-2 space-y-1 text-xs text-muted-foreground">
                <li>1. Источник — загрузка или подключение</li>
                <li>2. Проверка</li>
                <li>3. Запуск</li>
                <li>4. Результат сохраняется в Библиотеку</li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </form>
    </AppShellV3>
  );
}
