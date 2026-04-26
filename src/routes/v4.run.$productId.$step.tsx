import { useState } from "react";
import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { AppShellV4 } from "@/components/perfops-v4/AppShellV4";
import { PageHeaderV4 } from "@/components/perfops-v4/PageHeaderV4";
import { ProjectContextBarV4 } from "@/components/perfops-v4/ProjectContextBarV4";
import { FlowStepperV4 } from "@/components/perfops-v4/FlowStepperV4";
import { FlowActionBar } from "@/components/perfops-v4/FlowActionBar";
import { HelpCard } from "@/components/perfops-v4/HelpCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  getProduct,
  products,
  projects,
  resultFormatLabel,
  semanticsScenarios,
  semanticsScenarioGroupLabel,
  metricsCatalog,
  metricGroupLabel,
  connectionTypes,
  libraryEntries,
  libraryKindLabel,
  formatLabel,
  sourceKindLabel,
  type Product,
  type StepId,
  type SourceKind,
  type SemanticsScenarioGroup,
  type MetricGroup,
  type LibraryEntry,
  stepLabel,
  getNextStep,
} from "@/lib/perfops-v4-data";
import {
  Upload,
  Plug,
  Database,
  FileText,
  Link as LinkIcon,
  Type as TypeIcon,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Download,
  ExternalLink,
  ArrowRight,
  Plus,
  X,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

const stepSchema = z.enum([
  "scenario",
  "source",
  "combining",
  "params",
  "metrics",
  "check",
  "run",
  "result",
]);

// Search params for the runner — currently just whether a second source is
// active (drives the dynamic "Объединение" step in the stepper).
type RunnerSearch = { second?: number };
const searchSchema = z.object({
  second: z.coerce.number().optional(),
});

export const Route = createFileRoute("/v4/run/$productId/$step")({
  head: ({ params }) => ({
    meta: [{ title: `${stepLabel[params.step as StepId] ?? "Шаг"} — PerfOps` }],
  }),
  parseParams: (raw) => ({
    productId: String(raw.productId),
    step: stepSchema.parse(raw.step),
  }),
  validateSearch: (raw): RunnerSearch => searchSchema.parse(raw),
  component: FlowRunnerPage,
});

/**
 * Build the effective step list shown to the user.
 *
 * Note (UI prototype): step composition is currently derived inline from
 * `product.steps` plus a runtime flag (second source). When the platform
 * gains real product configuration, this should move into a per-product
 * config / loader so the first step (and presence of optional steps like
 * "combining") is determined by the product, not by hard-coded routing.
 */
function getEffectiveSteps(product: Product, hasSecondSource: boolean): StepId[] {
  if (!product.supportsCombining) return product.steps;
  if (hasSecondSource) return product.steps;
  return product.steps.filter((s) => s !== "combining");
}

function FlowRunnerPage() {
  const params = Route.useParams();
  const search = Route.useSearch() as RunnerSearch;
  const productId = params.productId;
  const step = params.step as StepId;
  const product = getProduct(productId);
  if (!product.steps.includes(step)) {
    throw notFound();
  }
  const hasSecondSource = search.second === 1;
  const effectiveSteps = getEffectiveSteps(product, hasSecondSource);

  // If the URL points to "combining" but no second source is active, the
  // step does not exist in the current flow — bounce back to source.
  if (step === "combining" && !effectiveSteps.includes("combining")) {
    throw notFound();
  }

  const project = projects.find((p) => p.productId === productId) ?? projects[0];
  const navSearch = hasSecondSource ? { second: 1 } : {};

  return (
    <AppShellV4>
      <ProjectContextBarV4
        projectName={project.name}
        projectId={project.id}
        productName={product.name}
        step={stepLabel[step]}
      />
      <PageHeaderV4
        title={titleFor(step, product)}
        subtitle={subtitleFor(step, product)}
      />
      <FlowStepperV4
        product={product}
        steps={effectiveSteps}
        current={step}
        search={navSearch}
      />
      <StepBody
        product={product}
        step={step}
        projectId={project.id}
        steps={effectiveSteps}
        hasSecondSource={hasSecondSource}
      />
    </AppShellV4>
  );
}

function titleFor(step: StepId, product: Product): string {
  switch (step) {
    case "scenario":
      return "Выберите сценарий";
    case "source":
      return "Выберите источник";
    case "combining":
      return "Объединение источников";
    case "params":
      return "Параметры";
    case "metrics":
      return "Метрики и фокус анализа";
    case "check":
      return "Проверка перед запуском";
    case "run":
      return "Идёт обработка";
    case "result":
      return `Результат готов`;
  }
  // Defensive: unreachable
  return product.name;
}

function subtitleFor(step: StepId, product: Product): string | undefined {
  switch (step) {
    case "scenario":
      return "Выберите сценарий работы. Он определит следующие шаги и параметры.";
    case "source":
      return "Поведение и набор источников зависят от продукта.";
    case "combining":
      return "Выберите план объединения двух источников.";
    case "params":
      return "Параметры можно изменить позже без потери источника.";
    case "metrics":
      return "Что в первую очередь должно попасть в отчёт.";
    case "check":
      return "Здесь видны источник, параметры и предупреждения. Можно вернуться и исправить.";
    case "run":
      return "Можно безопасно вернуться позже — результат появится в Библиотеке.";
    case "result":
      return `Формат: ${resultFormatLabel[product.resultFormat]}.`;
  }
  return undefined;
}

function StepBody({
  product,
  step,
  projectId,
  steps,
  hasSecondSource,
}: {
  product: Product;
  step: StepId;
  projectId: string;
  steps: StepId[];
  hasSecondSource: boolean;
}) {
  switch (step) {
    case "scenario":
      return <ScenarioStep product={product} projectId={projectId} steps={steps} />;
    case "source":
      return (
        <SourceStep
          product={product}
          projectId={projectId}
          steps={steps}
          hasSecondSource={hasSecondSource}
        />
      );
    case "combining":
      return <CombiningStep product={product} projectId={projectId} steps={steps} />;
    case "params":
      return <ParamsStep product={product} projectId={projectId} steps={steps} />;
    case "metrics":
      return <MetricsStep product={product} projectId={projectId} steps={steps} />;
    case "check":
      return <CheckStep product={product} projectId={projectId} steps={steps} />;
    case "run":
      return <RunStep product={product} projectId={projectId} steps={steps} />;
    case "result":
      return <ResultStep product={product} projectId={projectId} steps={steps} />;
  }
}

// --------------------- Scenario (semantics) ---------------------

function ScenarioStep({
  product,
  projectId,
  steps,
}: {
  product: Product;
  projectId: string;
  steps: StepId[];
}) {
  const [scenario, setScenario] = useState<string>("balanced");
  const groups: SemanticsScenarioGroup[] = ["collection", "research", "processing"];
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card className="border bg-card shadow-none lg:col-span-2">
        <CardContent className="space-y-4 p-5">
          {groups.map((g) => (
            <div key={g}>
              <p className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">
                {semanticsScenarioGroupLabel[g]}
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {semanticsScenarios
                  .filter((s) => s.group === g)
                  .map((s) => {
                    const active = scenario === s.id;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setScenario(s.id)}
                        className={cn(
                          "rounded-md border bg-card px-3 py-2.5 text-left transition-colors",
                          active
                            ? "border-primary ring-1 ring-primary/30"
                            : "hover:border-border-strong",
                        )}
                      >
                        <p className="text-sm font-medium text-foreground">{s.name}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">{s.description}</p>
                      </button>
                    );
                  })}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
      <HelpCard
        title="Как выбрать сценарий"
        items={[
          "Сбор семантики — собрать ключевые фразы по теме",
          "Исследование — найти идеи или расширить готовый список",
          "Обработка — кластеризовать готовое ядро",
        ]}
      />
      <div className="lg:col-span-3">
        <FlowActionBar
          product={product}
          steps={steps}
          current="scenario"
          projectId={projectId}
        />
      </div>
    </div>
  );
}

// --------------------- Source step ---------------------

const sourceIcon: Record<SourceKind, typeof Upload> = {
  upload: Upload,
  connection: Plug,
  library: Database,
  topic: TypeIcon,
  url: LinkIcon,
};

function SourceStep({
  product,
  projectId,
  steps,
  hasSecondSource,
}: {
  product: Product;
  projectId: string;
  steps: StepId[];
  hasSecondSource: boolean;
}) {
  const navigate = useNavigate();
  const [activeKind, setActiveKind] = useState<SourceKind>(product.allowedSources[0]);
  const [secondKind, setSecondKind] = useState<SourceKind>(product.allowedSources[0]);
  const [hasFile, setHasFile] = useState(true);
  const [hasSecondFile, setHasSecondFile] = useState(false);

  const enableSecondSource = () => {
    if (!hasSecondSource) {
      // Sync URL flag → makes the "Объединение" step appear in the stepper
      // and changes nav targets for prev/next.
      navigate({
        to: "/v4/run/$productId/$step",
        params: { productId: product.id, step: "source" },
        search: { second: 1 },
        replace: true,
      });
    }
  };

  const disableSecondSource = () => {
    setHasSecondFile(false);
    navigate({
      to: "/v4/run/$productId/$step",
      params: { productId: product.id, step: "source" },
      search: {},
      replace: true,
    });
  };

  const sourceHelp: string[] = [
    `Поддерживаются: ${product.acceptedFileTypes.join(", ")}`,
    ...(product.supportedConnections.length > 0
      ? ["Можно выбрать подключённый аккаунт"]
      : []),
    "Можно выбрать источник из Библиотеки",
    ...(product.supportsSecondSource
      ? ["Второй источник равноправен первому: те же варианты"]
      : []),
  ];

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="space-y-3 lg:col-span-2">
        <Card className="border bg-card shadow-none">
          <CardContent className="p-5">
            <p className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">
              {product.supportsSecondSource ? "Источник 1 · тип" : "Тип источника"}
            </p>
            <div className="flex flex-wrap gap-2">
              {product.allowedSources.map((k) => {
                const Icon = sourceIcon[k];
                const active = activeKind === k;
                return (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setActiveKind(k)}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs transition-colors",
                      active
                        ? "border-primary bg-accent text-accent-foreground"
                        : "border-border bg-card text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {sourceKindLabel[k]}
                  </button>
                );
              })}
            </div>

            <div className="mt-4">
              <SourcePanel
                kind={activeKind}
                product={product}
                hasFile={hasFile}
                onClearFile={() => setHasFile(false)}
                onAttachFile={() => setHasFile(true)}
              />
            </div>
          </CardContent>
        </Card>

        {product.supportsSecondSource && (
          <Card className="border border-dashed bg-card shadow-none">
            <CardContent className="p-5">
              {!hasSecondSource ? (
                <button
                  type="button"
                  onClick={enableSecondSource}
                  className="flex w-full items-center justify-between gap-3 rounded-md text-left text-sm text-muted-foreground hover:text-foreground"
                >
                  <span className="inline-flex items-center gap-2">
                    <Plus className="h-4 w-4" /> Добавить второй источник
                  </span>
                  {product.supportsCombining && (
                    <span className="text-xs text-muted-foreground">
                      Появится шаг «Объединение»
                    </span>
                  )}
                </button>
              ) : (
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      Источник 2 · тип
                    </p>
                    <button
                      type="button"
                      onClick={disableSecondSource}
                      className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                      aria-label="Удалить второй источник"
                    >
                      <X className="h-3.5 w-3.5" /> Удалить
                    </button>
                  </div>
                  <div className="mb-3 flex flex-wrap gap-2">
                    {product.allowedSources.map((k) => {
                      const Icon = sourceIcon[k];
                      const active = secondKind === k;
                      return (
                        <button
                          key={k}
                          type="button"
                          onClick={() => setSecondKind(k)}
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs transition-colors",
                            active
                              ? "border-primary bg-accent text-accent-foreground"
                              : "border-border bg-card text-muted-foreground hover:text-foreground",
                          )}
                        >
                          <Icon className="h-3.5 w-3.5" />
                          {sourceKindLabel[k]}
                        </button>
                      );
                    })}
                  </div>
                  <SourcePanel
                    kind={secondKind}
                    product={product}
                    hasFile={hasSecondFile}
                    onAttachFile={() => setHasSecondFile(true)}
                    onClearFile={() => setHasSecondFile(false)}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      <HelpCard items={sourceHelp} />

      <div className="lg:col-span-3">
        <FlowActionBar
          product={product}
          steps={steps}
          current="source"
          projectId={projectId}
          search={hasSecondSource ? { second: 1 } : {}}
        />
      </div>
    </div>
  );
}

function SourcePanel({
  kind,
  product,
  hasFile,
  onAttachFile,
  onClearFile,
}: {
  kind: SourceKind;
  product: Product;
  hasFile: boolean;
  onAttachFile: () => void;
  onClearFile: () => void;
}) {
  if (kind === "upload") {
    if (hasFile) {
      return (
        <div className="flex items-center justify-between gap-3 rounded-md border bg-success-soft px-3 py-2.5 text-sm">
          <div className="flex min-w-0 items-center gap-2">
            <FileSpreadsheet className="h-4 w-4 shrink-0 text-success" />
            <span className="truncate font-medium text-foreground">campaign_export.xlsx</span>
            <span className="text-xs text-muted-foreground">· 412 КБ · принят</span>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <Button size="sm" variant="ghost" onClick={onClearFile}>
              Удалить
            </Button>
            <Button size="sm" variant="outline" onClick={onAttachFile}>
              Заменить
            </Button>
          </div>
        </div>
      );
    }
    return (
      <div className="rounded-md border border-dashed bg-surface px-4 py-8 text-center">
        <Upload className="mx-auto h-7 w-7 text-muted-foreground" />
        <p className="mt-2 text-sm font-medium text-foreground">Перетащите файл сюда</p>
        <p className="mt-1 text-xs text-muted-foreground">
          {product.acceptedFileTypes.join(", ")} · до 25 МБ
        </p>
        <Button size="sm" variant="outline" className="mt-3" onClick={onAttachFile}>
          Выбрать файл
        </Button>
      </div>
    );
  }

  if (kind === "connection") {
    return <ConnectedAccountPicker product={product} />;
  }

  if (kind === "library") {
    return <LibrarySourcePicker product={product} />;
  }

  if (kind === "topic") {
    return (
      <div className="space-y-1.5">
        <Label htmlFor="topic" className="text-xs font-medium">
          Тема или направление
        </Label>
        <Textarea
          id="topic"
          placeholder="Например: запуск весенней коллекции спортивной обуви"
          className="min-h-[88px] text-sm"
        />
      </div>
    );
  }

  if (kind === "url") {
    return (
      <div className="space-y-1.5">
        <Label htmlFor="url" className="text-xs font-medium">
          Ссылка / URL
        </Label>
        <Input id="url" type="url" placeholder="https://example.com/page" className="h-9" />
      </div>
    );
  }

  return null;
}

// --------------------- Connected account picker (grouped by system) ---------------------

function ConnectedAccountPicker({ product }: { product: Product }) {
  const groups = connectionTypes.filter((c) =>
    product.supportedConnections.includes(c.id),
  );
  const initialOpen = groups.find((g) =>
    g.accounts.some((a) => a.status === "connected"),
  );
  const [openId, setOpenId] = useState<string | null>(initialOpen?.id ?? null);
  const [selected, setSelected] = useState<{
    typeId: string;
    typeName: string;
    accountId: string;
    accountName: string;
    identifier: string;
  } | null>(null);

  if (selected) {
    return (
      <div className="rounded-md border bg-success-soft px-3 py-2.5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="flex items-center gap-2 text-sm font-medium text-foreground">
              <CheckCircle2 className="h-4 w-4 text-success" />
              {selected.accountName}
              <span className="rounded-md border border-success/30 bg-card px-1.5 py-0.5 text-[10px] font-medium text-success">
                принят
              </span>
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {selected.typeName} · {selected.identifier}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <Button size="sm" variant="ghost" onClick={() => setSelected(null)}>
              Удалить
            </Button>
            <Button size="sm" variant="outline" onClick={() => setSelected(null)}>
              Заменить
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (groups.length === 0) {
    return (
      <p className="rounded-md border bg-surface px-3 py-3 text-sm text-muted-foreground">
        Этот продукт не использует подключения.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {groups.map((group) => {
        const isOpen = openId === group.id;
        const connectedCount = group.accounts.filter(
          (a) => a.status === "connected",
        ).length;
        return (
          <div key={group.id} className="overflow-hidden rounded-md border bg-card">
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? null : group.id)}
              className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left hover:bg-surface"
              aria-expanded={isOpen}
            >
              <span className="flex items-center gap-2">
                {isOpen ? (
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                )}
                <span className="text-sm font-medium text-foreground">{group.name}</span>
              </span>
              <span className="text-xs text-muted-foreground">
                {group.accounts.length === 0
                  ? "нет подключений"
                  : `${connectedCount} из ${group.accounts.length}`}
              </span>
            </button>
            {isOpen && (
              <ul className="divide-y border-t">
                {group.accounts.length === 0 && (
                  <li className="px-3 py-2.5 text-xs text-muted-foreground">
                    Нет подключённых аккаунтов. Добавьте подключение в разделе «Подключения».
                  </li>
                )}
                {group.accounts.map((a) => {
                  const usable = a.status === "connected";
                  return (
                    <li
                      key={a.id}
                      className="flex items-center justify-between gap-3 px-3 py-2.5 hover:bg-surface"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm text-foreground">{a.name}</p>
                        <p className="truncate text-[11px] text-muted-foreground">
                          {a.identifier}
                          {!usable && " · требуется действие"}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={!usable}
                        onClick={() =>
                          setSelected({
                            typeId: group.id,
                            typeName: group.name,
                            accountId: a.id,
                            accountName: a.name,
                            identifier: a.identifier,
                          })
                        }
                      >
                        Выбрать
                      </Button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}

// --------------------- Library source picker (search + filters) ---------------------

function LibrarySourcePicker({ product }: { product: Product }) {
  const [query, setQuery] = useState("");
  const [productFilter, setProductFilter] = useState<string>("all");
  const [kindFilter, setKindFilter] = useState<"all" | "source" | "result">("all");
  const [visible, setVisible] = useState(5);
  const [selected, setSelected] = useState<LibraryEntry | null>(null);

  if (selected) {
    return (
      <div className="rounded-md border bg-success-soft px-3 py-2.5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="flex items-center gap-2 text-sm font-medium text-foreground">
              <CheckCircle2 className="h-4 w-4 text-success" />
              {selected.name}
              <span className="rounded-md border border-success/30 bg-card px-1.5 py-0.5 text-[10px] font-medium text-success">
                принят
              </span>
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {libraryKindLabel[selected.kind]} · {formatLabel(selected.format)} · {selected.projectName} · обновлено {selected.updated}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <Button size="sm" variant="ghost" onClick={() => setSelected(null)}>
              Удалить
            </Button>
            <Button size="sm" variant="outline" onClick={() => setSelected(null)}>
              Заменить
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const filtered = libraryEntries
    .filter((e) =>
      kindFilter === "all" ? true : e.kind === kindFilter,
    )
    .filter((e) => (productFilter === "all" ? true : e.productId === productFilter))
    .filter((e) =>
      query.trim() === ""
        ? true
        : e.name.toLowerCase().includes(query.trim().toLowerCase()),
    )
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  const slice = filtered.slice(0, visible);

  return (
    <div className="space-y-3">
      <div className="grid gap-2 sm:grid-cols-[1fr_auto_auto]">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Поиск по названию"
          className="h-9 text-sm"
        />
        <select
          value={productFilter}
          onChange={(e) => setProductFilter(e.target.value)}
          className="h-9 rounded-md border bg-card px-2 text-xs text-foreground"
          aria-label="Фильтр по продукту"
        >
          <option value="all">Все продукты</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <div className="flex h-9 items-center rounded-md border bg-card p-0.5 text-xs">
          {(["all", "source", "result"] as const).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setKindFilter(k)}
              className={cn(
                "rounded-sm px-2 py-1 transition-colors",
                kindFilter === k
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {k === "all" ? "Все" : k === "source" ? "Источники" : "Результаты"}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-md border bg-card">
        {slice.length === 0 ? (
          <p className="px-3 py-4 text-sm text-muted-foreground">
            Ничего не найдено. Уточните запрос или фильтры.
          </p>
        ) : (
          <ul className="divide-y">
            {slice.map((e) => (
              <li
                key={e.id}
                className="flex items-center justify-between gap-3 px-3 py-2.5 hover:bg-surface"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm text-foreground">{e.name}</p>
                  <p className="truncate text-[11px] text-muted-foreground">
                    {libraryKindLabel[e.kind]} · {formatLabel(e.format)} ·{" "}
                    {e.projectName}
                    {e.productId && ` · ${getProduct(e.productId).name}`}{" "}
                    · обновлено {e.updated}
                  </p>
                </div>
                <Button size="sm" variant="outline" onClick={() => setSelected(e)}>
                  Выбрать
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {visible < filtered.length && (
        <div className="text-center">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setVisible((v) => v + 5)}
          >
            Показать ещё ({filtered.length - visible})
          </Button>
        </div>
      )}
    </div>
  );
}


// --------------------- Combining ---------------------

function CombiningStep({
  product,
  projectId,
  steps,
}: {
  product: Product;
  projectId: string;
  steps: StepId[];
}) {
  const [plan, setPlan] = useState<"by-keys" | "concat" | "manual">("by-keys");
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="space-y-3 lg:col-span-2">
        <Card className="border bg-card shadow-none">
          <CardContent className="space-y-4 p-5">
            {/* Selected sources summary */}
            <div>
              <p className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">
                Выбранные источники
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                <div className="rounded-md border bg-surface px-3 py-2.5">
                  <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                    Источник 1
                  </p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-sm font-medium text-foreground">
                    <FileSpreadsheet className="h-3.5 w-3.5 text-muted-foreground" />
                    campaign_export.xlsx
                  </p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    XLSX · 2 184 строки · 17 колонок
                  </p>
                </div>
                <div className="rounded-md border bg-surface px-3 py-2.5">
                  <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                    Источник 2
                  </p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-sm font-medium text-foreground">
                    <Plug className="h-3.5 w-3.5 text-muted-foreground" />
                    Яндекс Директ — Основной кабинет
                  </p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    Подключение · 1 097 строк · 12 колонок
                  </p>
                </div>
              </div>
            </div>

            {/* Match diagnostics */}
            <div>
              <p className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">
                Совпадение источников
              </p>
              <ul className="space-y-1 text-sm text-foreground">
                <li>· Источник 1 совпало: 100%</li>
                <li>· Источник 2 совпало: 87%</li>
                <li>· Строк в итоге: ~1 239</li>
                <li>· Ключи совпадения: date + campaign_id</li>
                <li className="text-muted-foreground">
                  · Только в источнике 1: 142 строки · только в источнике 2: 0
                </li>
                <li className="text-muted-foreground">· Дубли по ключам: 6</li>
              </ul>
            </div>

            {/* Plan picker */}
            <div>
              <p className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">
                План объединения
              </p>
              <div className="grid gap-2">
                <PlanRow
                  active={plan === "by-keys"}
                  onClick={() => setPlan("by-keys")}
                  title="Связать по ключам"
                  desc="Найдено совпадение по колонкам campaign_id и date."
                  badge="Рекомендуется"
                />
                <PlanRow
                  active={plan === "concat"}
                  onClick={() => setPlan("concat")}
                  title="Объединить строки"
                  desc="Структуры совпадают — можно склеить как одну таблицу."
                />
                <PlanRow
                  active={plan === "manual"}
                  onClick={() => setPlan("manual")}
                  title="Выбрать ключи вручную"
                  desc="Указать колонки соответствия самостоятельно."
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <HelpCard
        title="Как работает объединение"
        items={[
          "Связать по ключам — если в обоих источниках есть общие колонки",
          "Объединить строки — если структура одинаковая",
          "Вручную — для нестандартных случаев",
        ]}
      />
      <div className="lg:col-span-3">
        <FlowActionBar
          product={product}
          steps={steps}
          current="combining"
          projectId={projectId}
          search={{ second: 1 }}
        />
      </div>
    </div>
  );
}

function PlanRow({
  active,
  onClick,
  title,
  desc,
  badge,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  desc: string;
  badge?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-start justify-between gap-3 rounded-md border bg-card px-3 py-2 text-left transition-colors",
        active ? "border-primary ring-1 ring-primary/30" : "hover:border-border-strong",
      )}
    >
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{desc}</p>
      </div>
      {badge && (
        <span className="shrink-0 rounded-md border border-info/30 bg-info-soft px-1.5 py-0.5 text-[10px] font-medium text-info">
          {badge}
        </span>
      )}
    </button>
  );
}

// --------------------- Params ---------------------

function ParamsStep({
  product,
  projectId,
  steps,
}: {
  product: Product;
  projectId: string;
  steps: StepId[];
}) {
  if (product.id === "semantics-generator") {
    return (
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="border bg-card shadow-none lg:col-span-2">
          <CardContent className="space-y-4 p-5">
            <ParamRow label="Количество фраз" hint="до 20 000">
              <Input defaultValue="5000" className="h-9 w-32 text-sm" />
            </ParamRow>
            <ParamRow label="Максимальная длина фразы" hint="в словах">
              <Input defaultValue="6" className="h-9 w-32 text-sm" />
            </ParamRow>
            <ParamRow label="Минус-слова" hint="через запятую или с новой строки">
              <Textarea
                placeholder="бесплатно, скачать, отзывы…"
                className="min-h-[72px] text-sm"
              />
            </ParamRow>
            <ParamRow label="Файл с минус-словами" hint=".txt или .xlsx">
              <Button size="sm" variant="outline">
                <Upload className="h-3.5 w-3.5" /> Загрузить файл
              </Button>
            </ParamRow>
          </CardContent>
        </Card>
        <HelpCard
          title="Подсказки"
          items={[
            "Если не уверены в количестве — оставьте 5 000",
            "Минус-слова можно загрузить файлом из Библиотеки",
            "Изменение параметров не сбрасывает источник",
          ]}
        />
        <div className="lg:col-span-3">
          <FlowActionBar
            product={product}
            steps={steps}
            current="params"
            projectId={projectId}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card className="border bg-card shadow-none lg:col-span-2">
        <CardContent className="space-y-4 p-5">
          <ParamRow label="Дополнительные параметры">
            <p className="text-xs text-muted-foreground">
              Для этого продукта дополнительные параметры не требуются. Перейдите к проверке.
            </p>
          </ParamRow>
        </CardContent>
      </Card>
      <HelpCard
        title="Подсказки"
        items={["Параметры можно поменять позже без потери источника"]}
      />
      <div className="lg:col-span-3">
        <FlowActionBar
          product={product}
          steps={steps}
          current="params"
          projectId={projectId}
        />
      </div>
    </div>
  );
}

function ParamRow({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 gap-1 sm:grid-cols-3 sm:items-center">
      <div className="sm:col-span-1">
        <p className="text-sm font-medium text-foreground">{label}</p>
        {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
      </div>
      <div className="sm:col-span-2">{children}</div>
    </div>
  );
}

// --------------------- Metrics & focus (campaign-analysis) ---------------------

function MetricsStep({
  product,
  projectId,
  steps,
}: {
  product: Product;
  projectId: string;
  steps: StepId[];
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set(["cpa", "clicks"]));
  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else if (next.size < 2) next.add(id);
      return next;
    });
  const groups: MetricGroup[] = ["absolute", "relative"];
  const hasAbsolute = [...selected].some(
    (id) => metricsCatalog.find((m) => m.id === id)?.group === "absolute",
  );

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card className="border bg-card shadow-none lg:col-span-2">
        <CardContent className="space-y-5 p-5">
          <div>
            <p className="text-sm font-medium text-foreground">Ключевые метрики</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Выберите 1–2 ключевые метрики, которые важны для вашего анализа.
            </p>
            <div className="mt-3 space-y-3">
              {groups.map((g) => (
                <div key={g}>
                  <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                    {metricGroupLabel[g]}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {metricsCatalog
                      .filter((m) => m.group === g)
                      .map((m) => {
                        const active = selected.has(m.id);
                        return (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => toggle(m.id)}
                            className={cn(
                              "rounded-md border px-2.5 py-1 text-xs transition-colors",
                              active
                                ? "border-primary bg-accent text-accent-foreground"
                                : "border-border bg-card text-muted-foreground hover:text-foreground",
                            )}
                          >
                            {m.name}
                          </button>
                        );
                      })}
                  </div>
                </div>
              ))}
            </div>
            {!hasAbsolute && selected.size > 0 && (
              <p className="mt-2 text-[11px] text-warning-foreground">
                Хотя бы одна выбранная метрика должна быть из абсолютных.
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="focus" className="text-xs font-medium">
              Фокус анализа <span className="text-muted-foreground">(опционально)</span>
            </Label>
            <Textarea
              id="focus"
              placeholder="Например: сделайте акцент на CPA, проблемных кампаниях и точках роста"
              className="mt-1 min-h-[72px] text-sm"
            />
          </div>
        </CardContent>
      </Card>
      <HelpCard
        title="Подсказки"
        items={[
          "Не больше 2 ключевых метрик — отчёт будет точнее",
          "Хотя бы одна метрика — из абсолютных",
          "Фокус анализа помогает выделить нужный сегмент",
        ]}
      />
      <div className="lg:col-span-3">
        <FlowActionBar
          product={product}
          steps={steps}
          current="metrics"
          projectId={projectId}
          nextDisabled={selected.size === 0 || !hasAbsolute}
        />
      </div>
    </div>
  );
}

// --------------------- Check ---------------------

function CheckStep({
  product,
  projectId,
  steps,
}: {
  product: Product;
  projectId: string;
  steps: StepId[];
}) {
  const idx = steps.indexOf("check");
  const next = idx >= 0 && idx < steps.length - 1 ? steps[idx + 1] : undefined;
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="space-y-3 lg:col-span-2">
        <Card className="border bg-card shadow-none">
          <CardContent className="space-y-3 p-5">
            <div className="flex items-center gap-2 rounded-md border bg-success-soft px-3 py-2 text-sm text-success">
              <CheckCircle2 className="h-4 w-4" />
              Источник принят, структура соответствует ожиданиям.
            </div>
            <div className="flex items-start gap-2 rounded-md border bg-warning-soft px-3 py-2 text-sm">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning-foreground" />
              <div>
                <p className="font-medium text-warning-foreground">
                  В выгрузке есть 14 строк с пустой валютой
                </p>
                <p className="mt-0.5 text-xs text-warning-foreground/80">
                  Можно продолжить — такие строки будут пропущены.
                </p>
              </div>
            </div>

            <div className="rounded-md border bg-surface px-4 py-3">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Источник
              </p>
              <p className="mt-1 text-sm font-medium text-foreground">campaign_export.xlsx</p>
              <dl className="mt-2 grid grid-cols-2 gap-y-1 text-xs">
                <dt className="text-muted-foreground">Строк</dt>
                <dd className="text-foreground">2 184</dd>
                <dt className="text-muted-foreground">Колонок</dt>
                <dd className="text-foreground">17</dd>
                <dt className="text-muted-foreground">Период</dt>
                <dd className="text-foreground">01.04.2026 — 24.04.2026</dd>
                <dt className="text-muted-foreground">Кампаний</dt>
                <dd className="text-foreground">18</dd>
              </dl>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Параметры запуска
              </p>
              <ul className="mt-1 space-y-1 text-sm text-muted-foreground">
                <li>· Продукт: {product.name}</li>
                <li>· Формат результата: {resultFormatLabel[product.resultFormat]}</li>
                <li>· Куда сохранится: Библиотека</li>
                <li>· Ожидаемое время обработки: ~2 мин</li>
              </ul>
            </div>

            <div className="flex flex-wrap gap-2 border-t pt-3 text-xs">
              <Button variant="ghost" size="sm" asChild>
                <Link
                  to="/v4/run/$productId/$step"
                  params={{ productId: product.id, step: "source" }}
                >
                  Изменить источник
                </Link>
              </Button>
              {product.steps.includes("params") && (
                <Button variant="ghost" size="sm" asChild>
                  <Link
                    to="/v4/run/$productId/$step"
                    params={{ productId: product.id, step: "params" }}
                  >
                    Вернуться к параметрам
                  </Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      <HelpCard
        title="Что такое проверка"
        items={[
          "Видит источник, параметры и предупреждения",
          "Помогает исправить, а не блокирует",
          "Запуск становится доступен, когда нет блокирующих ошибок",
        ]}
      />
      <div className="lg:col-span-3">
        <FlowActionBar
          product={product}
          current="check"
          projectId={projectId}
          nextSlot={
            next && (
              <Button asChild>
                <Link
                  to="/v4/run/$productId/$step"
                  params={{ productId: product.id, step: next }}
                >
                  Запустить <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            )
          }
        />
      </div>
    </div>
  );
}

// --------------------- Run ---------------------

function RunStep({ product, projectId }: { product: Product; projectId: string }) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card className="border bg-card shadow-none lg:col-span-2">
        <CardContent className="space-y-4 p-6">
          <div className="flex items-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <div>
              <p className="text-sm font-medium text-foreground">
                {product.name} — идёт обработка
              </p>
              <p className="text-xs text-muted-foreground">
                Подготовка результата · ~2 мин
              </p>
            </div>
          </div>
          <Progress value={62} className="h-1.5" />
          <ul className="space-y-1 text-xs text-muted-foreground">
            <li>· Читаем источник</li>
            <li>· Проверяем структуру</li>
            <li className="text-foreground">· Формируем результат…</li>
            <li>· Сохраняем в Библиотеке</li>
          </ul>
          <p className="rounded-md border bg-surface px-3 py-2 text-xs text-muted-foreground">
            Можно безопасно вернуться позже — результат появится в Библиотеке.
          </p>
        </CardContent>
      </Card>
      <HelpCard
        title="Что произойдёт"
        items={[
          "Платформа подготовит результат",
          "Сохранит его в Библиотеке",
          "Покажет ссылку или файл на следующем шаге",
        ]}
      />
      <div className="lg:col-span-3">
        <FlowActionBar
          product={product}
          current="run"
          projectId={projectId}
          nextSlot={
            <Button asChild>
              <Link
                to="/v4/run/$productId/$step"
                params={{ productId: product.id, step: "result" }}
              >
                Посмотреть результат (демо) <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          }
        />
      </div>
    </div>
  );
}

// --------------------- Result ---------------------

function ResultStep({ product, projectId }: { product: Product; projectId: string }) {
  const PrimaryIcon =
    product.resultFormat === "excel"
      ? Download
      : product.resultFormat === "dashboard-link"
        ? ExternalLink
        : FileText;
  const primaryLabel =
    product.resultFormat === "excel"
      ? "Скачать Excel-файл"
      : product.resultFormat === "dashboard-link"
        ? "Открыть дашборд"
        : "Открыть отчёт";

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card className="border bg-card shadow-none lg:col-span-2">
        <CardContent className="space-y-4 p-6">
          <div className="flex items-center gap-2 rounded-md border bg-success-soft px-3 py-2 text-sm text-success">
            <CheckCircle2 className="h-4 w-4" />
            Результат сохранён в Библиотеке.
          </div>

          <div className="rounded-md border bg-surface px-4 py-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Результат готов
            </p>
            <p className="mt-1 text-base font-semibold text-foreground">
              {product.name} — 26.04.2026
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Формат: {resultFormatLabel[product.resultFormat]}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button>
              <PrimaryIcon className="h-3.5 w-3.5" /> {primaryLabel}
            </Button>
            <Button variant="outline" asChild>
              <Link to="/v4/library">Открыть Библиотеку</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/v4/projects/$projectId" params={{ projectId }}>
                Вернуться в проект <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card className="border bg-card shadow-none h-fit">
        <CardContent className="p-5">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Где сохранён
          </p>
          <p className="mt-1 text-sm text-foreground">Библиотека</p>
          <p className="mt-3 text-xs text-muted-foreground">
            Все источники и результаты проекта собраны в Библиотеке.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
