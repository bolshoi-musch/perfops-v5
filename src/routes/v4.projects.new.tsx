import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { AppShellV4 } from "@/components/perfops-v4/AppShellV4";
import { PageHeaderV4 } from "@/components/perfops-v4/PageHeaderV4";
import { BreadcrumbsV4 } from "@/components/perfops-v4/BreadcrumbsV4";
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
  type ProductId,
  resultFormatLabel,
} from "@/lib/perfops-v4-data";

const searchSchema = z.object({
  productId: z
    .enum([
      "dashboard-builder",
      "campaign-analysis",
      "semantics-generator",
      "cross-minus",
      "bd-optimization",
    ])
    .optional(),
});

export const Route = createFileRoute("/v4/projects/new")({
  head: () => ({ meta: [{ title: "Новый проект — PerfOps" }] }),
  validateSearch: searchSchema,
  component: NewProjectPage,
});

const today = "26.04.2026";

const exampleNameByProduct: Record<ProductId, string> = {
  "dashboard-builder": `Конструктор дашбордов — ${today}`,
  "campaign-analysis": `Анализ кампаний — ${today}`,
  "semantics-generator": `Сбор семантики — ${today}`,
  "cross-minus": `Кросс-минусовка — ${today}`,
  "bd-optimization": `BD Optimization — ${today}`,
};

function NewProjectPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const prefilled = !!search.productId;

  const [productId, setProductId] = useState<ProductId>(
    search.productId ?? "dashboard-builder",
  );
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const product = getProduct(productId);
  const canSubmit = name.trim().length > 0;
  const firstStep = product.steps[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({
      to: "/v4/run/$productId/$step",
      params: { productId, step: firstStep },
    });
  };

  return (
    <AppShellV4>
      <BreadcrumbsV4
        items={[
          { label: "Проекты", to: "/v4/projects" },
          { label: "Новый проект" },
        ]}
      />
      <PageHeaderV4
        eyebrow="Создание"
        title="Новый проект"
        subtitle="Заполните основные параметры. Источник выбирается на следующем шаге."
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
                placeholder={`Например: ${exampleNameByProduct[productId]}`}
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

            <div className="flex items-center gap-2 border-t pt-4">
              <Button type="submit" disabled={!canSubmit}>
                Создать проект
              </Button>
              <Button type="button" variant="ghost" asChild>
                <Link to="/v4/projects">Отмена</Link>
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
              <p className="mt-2 text-xs text-muted-foreground">
                {product.shortDescription}
              </p>
            </CardContent>
          </Card>
          <Card className="border bg-card shadow-none">
            <CardContent className="p-5">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Что дальше
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                После создания проекта откроется первый шаг — выбор источника.
                Все настройки можно поменять без потери данных проекта.
              </p>
            </CardContent>
          </Card>
        </div>
      </form>
    </AppShellV4>
  );
}
