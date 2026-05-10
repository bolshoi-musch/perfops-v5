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

// Search params for the runner.
//   second    — second source active (dashboard-builder dynamic "Combining" step)
//   clarify   — show inline "unrecognized metrics" block on the metrics step
//   state     — drives the diagnostic state of the check step
//   dashboard — adds optional "Open dashboard" CTA on analytics-report result
//   scenario  — selected semantics scenario id (drives source/params)
//   saved     — 1 (default) — result saved to Library; 0 — local copy only
//   save      — "error" — saving result to Library failed
type CheckState = "clean" | "warning" | "blocked";
type SaveState = "ok" | "error";
type RunnerSearch = {
  second?: number;
  clarify?: number;
  state?: CheckState;
  dashboard?: number;
  scenario?: string;
  saved?: number;
  save?: SaveState;
};
const searchSchema = z.object({
  second: z.coerce.number().optional(),
  clarify: z.coerce.number().optional(),
  state: z.enum(["clean", "warning", "blocked"]).optional(),
  dashboard: z.coerce.number().optional(),
  scenario: z.string().optional(),
  saved: z.coerce.number().optional(),
  save: z.enum(["ok", "error"]).optional(),
});

// ---- Semantics scenarios: per-scenario source/params config ----
const SEMANTICS_SOURCE_BY_SCENARIO: Record<string, SourceKind[]> = {
  conservative: ["topic", "url", "upload", "library"],
  balanced: ["topic", "url", "upload", "library"],
  broad: ["topic", "url", "upload", "library"],
  "topic-list": ["topic", "upload", "library"],
  expand: ["topic", "upload", "library"],
  cluster: ["upload", "library"],
};
const semanticsTopicLabel = (scenario?: string) =>
  scenario === "expand"
    ? "Исходный список запросов"
    : scenario === "topic-list"
      ? "Тема списка"
      : "Тема или направление";
const semanticsTopicPlaceholder = (scenario?: string) =>
  scenario === "expand"
    ? "Например: александр пушкин\nстихи пушкина\nпоэт пушкин"
    : "Например: запуск весенней коллекции спортивной обуви";
const semanticsScenarioName = (id?: string) =>
  semanticsScenarios.find((s) => s.id === id)?.name ?? "Не выбран";
const semanticsScenarioGroupOf = (id?: string) =>
  semanticsScenarios.find((s) => s.id === id)?.group;

const PROCESS_TITLES: Record<string, string> = {
  "dashboard-builder": "Подготовка дашборда",
  "campaign-analysis": "Анализ рекламных кампаний",
  "semantics-generator": "Сбор и обработка семантики",
  "cross-minus": "Кросс-минусовка",
};

export const Route = createFileRoute("/v4/run/$productId/$step")({
  head: ({ params }) => {
    const stepName = stepLabel[params.step as StepId] ?? "Шаг";
    const processTitle = PROCESS_TITLES[params.productId] ?? null;
    const title = processTitle
      ? `${stepName} — ${processTitle} — PerfOps`
      : `${stepName} — PerfOps`;
    return { meta: [{ title }] };
  },
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
  const navSearch: Record<string, unknown> = {};
  if (hasSecondSource) navSearch.second = 1;
  if (search.scenario) navSearch.scenario = search.scenario;

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
      // Per-product result title.
      if (product.resultFormat === "dashboard-link") return "Дашборд готов";
      if (product.resultFormat === "excel") return "Файл готов";
      if (product.resultFormat === "analytics-report") return "Аналитический отчёт готов";
      return "Результат готов";
  }
  // Defensive: unreachable
  return product.name;
}

/** Process title displayed inside the runner — not the user-facing product name. */
// (currently surfaced only via head meta in PROCESS_TITLES)

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
  const search = Route.useSearch() as RunnerSearch;
  const navigate = useNavigate();
  const scenario = search.scenario;
  const groups: SemanticsScenarioGroup[] = ["collection", "research", "processing"];
  const setScenario = (id: string) => {
    navigate({
      to: "/v4/run/$productId/$step",
      params: { productId: product.id, step: "scenario" },
      search: { scenario: id },
      replace: true,
    });
  };
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card className="border bg-card shadow-none lg:col-span-2">
        <CardContent className="space-y-5 p-5">
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
          {!scenario && (
            <p className="rounded-md border border-dashed bg-surface px-3 py-2 text-xs text-muted-foreground">
              Выберите сценарий, чтобы продолжить. Дальнейшие шаги — источник и параметры —
              зависят от сценария.
            </p>
          )}
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
          search={scenario ? { scenario } : {}}
          nextDisabled={!scenario}
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
  const search = Route.useSearch() as RunnerSearch;
  const isSemantics = product.id === "semantics-generator";
  const scenario = search.scenario;
  // For semantics, the set of available source kinds depends on the scenario.
  const effectiveSources: SourceKind[] =
    isSemantics && scenario && SEMANTICS_SOURCE_BY_SCENARIO[scenario]
      ? SEMANTICS_SOURCE_BY_SCENARIO[scenario]
      : product.allowedSources;
  const [activeKind, setActiveKind] = useState<SourceKind>(effectiveSources[0]);
  const [secondKind, setSecondKind] = useState<SourceKind>(effectiveSources[0]);
  // For cluster scenario, default to no file (so user sees the empty upload).
  const [hasFile, setHasFile] = useState(!(isSemantics && scenario === "cluster"));
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

  const sourceHelp: string[] = isSemantics
    ? [
        scenario === "cluster"
          ? "Загрузите файл с готовым списком фраз: TXT, CSV или XLSX"
          : scenario === "expand"
            ? "Можно вставить seed-список или загрузить файл с фразами"
            : "Можно указать тему, ссылку или загрузить файл",
        "Можно выбрать источник из Библиотеки",
        ...(scenario === "cluster"
          ? ["Текстовый столбец определим автоматически — указать его можно в параметрах"]
          : []),
      ]
    : [
        `Поддерживаются: ${product.acceptedFileTypes.join(", ")}`,
        ...(product.supportedConnections.length > 0
          ? ["Можно выбрать подключённый аккаунт"]
          : []),
        "Можно выбрать источник из Библиотеки",
        ...(product.supportsSecondSource
          ? ["Второй источник равноправен первому: те же варианты"]
          : []),
      ];

  const navSearch: Record<string, unknown> = {};
  if (hasSecondSource) navSearch.second = 1;
  if (scenario) navSearch.scenario = scenario;

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="space-y-3 lg:col-span-2">
        <Card className="border bg-card shadow-none">
          <CardContent className="p-5">
            <p className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">
              {product.supportsSecondSource ? "Источник 1 · тип" : "Тип источника"}
            </p>
            <div className="flex flex-wrap gap-2">
              {effectiveSources.map((k) => {
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
                scenario={scenario}
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
          search={navSearch}
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
  scenario,
}: {
  kind: SourceKind;
  product: Product;
  hasFile: boolean;
  onAttachFile: () => void;
  onClearFile: () => void;
  scenario?: string;
}) {
  const isSemantics = product.id === "semantics-generator";
  const isCluster = isSemantics && scenario === "cluster";

  if (kind === "upload") {
    if (hasFile) {
      const fileName = isSemantics
        ? isCluster
          ? "phrases_to_cluster.csv"
          : scenario === "expand"
            ? "seed_keywords.txt"
            : "topic_brief.txt"
        : "campaign_export.xlsx";
      const fileMeta = isSemantics
        ? isCluster
          ? "CSV · 18 КБ · 4 320 фраз · принят"
          : "TXT · 4 КБ · принят"
        : "412 КБ · принят";
      return (
        <div className="flex items-center justify-between gap-3 rounded-md border bg-success-soft px-3 py-2.5 text-sm">
          <div className="flex min-w-0 items-center gap-2">
            <FileSpreadsheet className="h-4 w-4 shrink-0 text-success" />
            <span className="truncate font-medium text-foreground">{fileName}</span>
            <span className="text-xs text-muted-foreground">· {fileMeta}</span>
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
    const accepted = isCluster
      ? ".txt, .csv, .xlsx"
      : product.acceptedFileTypes.join(", ");
    const sizeHint = isSemantics
      ? "до 10 МБ"
      : product.id === "cross-minus"
        ? "до 50 МБ"
        : "до 25 МБ";
    return (
      <div className="rounded-md border border-dashed bg-surface px-4 py-8 text-center">
        <Upload className="mx-auto h-7 w-7 text-muted-foreground" />
        <p className="mt-2 text-sm font-medium text-foreground">
          {isCluster ? "Загрузите файл с фразами" : "Перетащите файл сюда"}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {accepted} · {sizeHint}
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
          {isSemantics ? semanticsTopicLabel(scenario) : "Тема или направление"}
        </Label>
        <Textarea
          id="topic"
          placeholder={
            isSemantics
              ? semanticsTopicPlaceholder(scenario)
              : "Например: запуск весенней коллекции спортивной обуви"
          }
          className={cn(
            "text-sm",
            isSemantics && scenario === "expand" ? "min-h-[120px]" : "min-h-[88px]",
          )}
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
  // Internal merge codes preserved for data: append_strict | append_union | join | manual_join.
  // UI exposes only Russian human labels.
  const [plan, setPlan] = useState<
    "join" | "append_strict" | "append_union" | "manual_join"
  >("join");
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
                  active={plan === "join"}
                  onClick={() => setPlan("join")}
                  title="Объединить столбцы по ключам"
                  desc="Подходит, если источники нужно связать по дате, кампании или другому ключу."
                  badge="Рекомендуется"
                />
                <PlanRow
                  active={plan === "append_strict"}
                  onClick={() => setPlan("append_strict")}
                  title="Добавить строки"
                  desc="Подходит, если источники имеют одинаковую структуру."
                />
                <PlanRow
                  active={plan === "append_union"}
                  onClick={() => setPlan("append_union")}
                  title="Расширить структуру"
                  desc="Добавляет недостающие столбцы из второго источника."
                />
                <PlanRow
                  active={plan === "manual_join"}
                  onClick={() => setPlan("manual_join")}
                  title="Выбрать ключи вручную"
                  desc="Используйте, если автоматическое сопоставление не подходит."
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <HelpCard
        title="Как работает объединение"
        items={[
          "Объединить столбцы по ключам — если в обоих источниках есть общие колонки",
          "Добавить строки — если структура одинаковая",
          "Расширить структуру — добавит недостающие столбцы",
          "Выбрать ключи вручную — для нестандартных случаев",
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
    return <SemanticsParamsStep product={product} projectId={projectId} steps={steps} />;
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

// --------------------- Semantics params ---------------------

function SemanticsParamsStep({
  product,
  projectId,
  steps,
}: {
  product: Product;
  projectId: string;
  steps: StepId[];
}) {
  const search = Route.useSearch() as RunnerSearch;
  const scenario = search.scenario;
  const group = semanticsScenarioGroupOf(scenario);
  const isCluster = scenario === "cluster";
  const showBrands = group === "collection";
  const showExclusionsFile = group === "collection" || scenario === "topic-list";

  const [phrases, setPhrases] = useState("200");
  const [maxLen, setMaxLen] = useState("3");
  const [brands, setBrands] = useState<"include" | "exclude">("exclude");
  const [exclFile, setExclFile] = useState<string | null>(null);
  const [phrasesError, setPhrasesError] = useState<string | null>(null);

  const onPhrasesBlur = () => {
    const n = Number(phrases);
    if (!Number.isFinite(n) || n < 50 || n > 1000) {
      setPhrasesError("Количество фраз должно быть от 50 до 1000.");
    } else {
      setPhrasesError(null);
    }
  };

  const navSearch: Record<string, unknown> = scenario ? { scenario } : {};

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card className="border bg-card shadow-none lg:col-span-2">
        <CardContent className="space-y-4 p-5">
          {/* Scenario reminder */}
          <div className="rounded-md border bg-surface px-3 py-2 text-xs">
            <span className="text-muted-foreground">Сценарий: </span>
            <span className="font-medium text-foreground">
              {semanticsScenarioName(scenario)}
            </span>
            {group && (
              <span className="ml-1.5 text-muted-foreground">
                · {semanticsScenarioGroupLabel[group]}
              </span>
            )}
          </div>

          {isCluster ? (
            <ParamRow
              label="Столбец с фразами"
              hint="Если оставить пусто — определим автоматически"
            >
              <Input placeholder="phrase" className="h-9 w-48 text-sm" />
            </ParamRow>
          ) : (
            <>
              <ParamRow label="Количество фраз" hint="от 50 до 1000">
                <div className="space-y-1">
                  <select
                    value={phrases}
                    onChange={(e) => {
                      setPhrases(e.target.value);
                      setPhrasesError(null);
                    }}
                    onBlur={onPhrasesBlur}
                    className="h-9 w-32 rounded-md border bg-card px-2 text-sm text-foreground"
                  >
                    {["100", "200", "300", "500", "1000"].map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                  {phrasesError && (
                    <p className="text-[11px] text-destructive">{phrasesError}</p>
                  )}
                </div>
              </ParamRow>

              <ParamRow label="Максимальная длина фразы" hint="в словах, от 1 до 5">
                <select
                  value={maxLen}
                  onChange={(e) => setMaxLen(e.target.value)}
                  className="h-9 w-24 rounded-md border bg-card px-2 text-sm text-foreground"
                >
                  {["1", "2", "3", "4", "5"].map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </ParamRow>

              {showBrands && (
                <ParamRow label="Бренды">
                  <div className="flex items-center gap-4 text-sm">
                    <label className="inline-flex items-center gap-1.5">
                      <input
                        type="radio"
                        name="brands"
                        checked={brands === "include"}
                        onChange={() => setBrands("include")}
                        className="h-3.5 w-3.5 accent-primary"
                      />
                      Включать
                    </label>
                    <label className="inline-flex items-center gap-1.5">
                      <input
                        type="radio"
                        name="brands"
                        checked={brands === "exclude"}
                        onChange={() => setBrands("exclude")}
                        className="h-3.5 w-3.5 accent-primary"
                      />
                      Исключить
                    </label>
                  </div>
                </ParamRow>
              )}

              <ParamRow
                label="Исключения"
                hint="через запятую, точку с запятой или с новой строки"
              >
                <Textarea
                  placeholder="бесплатно, скачать, отзывы…"
                  className="min-h-[72px] text-sm"
                />
              </ParamRow>

              {showExclusionsFile && (
                <ParamRow label="Файл с исключениями" hint=".txt, .csv или .xlsx">
                  {exclFile ? (
                    <div className="inline-flex items-center gap-2 rounded-md border bg-success-soft px-2.5 py-1.5 text-xs">
                      <FileSpreadsheet className="h-3.5 w-3.5 text-success" />
                      <span className="font-medium text-foreground">{exclFile}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 px-1.5"
                        onClick={() => setExclFile("exclusions_v2.txt")}
                      >
                        Заменить
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 px-1.5 text-muted-foreground"
                        onClick={() => setExclFile(null)}
                      >
                        Удалить
                      </Button>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setExclFile("exclusions.txt")}
                    >
                      <Upload className="h-3.5 w-3.5" /> Загрузить файл
                    </Button>
                  )}
                </ParamRow>
              )}
            </>
          )}
        </CardContent>
      </Card>
      <HelpCard
        title="Подсказки"
        items={
          isCluster
            ? [
                "Столбец с фразами обычно определяется автоматически",
                "Других параметров для кластеризации не нужно",
              ]
            : [
                "Количество фраз — между 50 и 1000",
                "Длина — сколько слов максимум должно быть в одной фразе",
                "Исключения отфильтруют ненужные слова из результата",
                "Изменение параметров не сбрасывает источник",
              ]
        }
      />
      <div className="lg:col-span-3">
        <FlowActionBar
          product={product}
          steps={steps}
          current="params"
          projectId={projectId}
          search={navSearch}
          nextDisabled={!!phrasesError}
        />
      </div>
    </div>
  );
}



type ClarifyChoice = "volume" | "rate" | "skip";

function MetricsStep({
  product,
  projectId,
  steps,
}: {
  product: Product;
  projectId: string;
  steps: StepId[];
}) {
  const search = Route.useSearch() as RunnerSearch;
  const showClarify = search.clarify === 1;

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
  const noAbsoluteError = selected.size > 0 && !hasAbsolute;

  // Demo: fixed list of unrecognized columns (only when ?clarify=1).
  const unrecognized = [
    { column: "engagement_score", guess: "rate" as ClarifyChoice },
    { column: "post_saves", guess: "volume" as ClarifyChoice },
    { column: "lead_value_uah", guess: "volume" as ClarifyChoice },
  ];
  const [choices, setChoices] = useState<Record<string, ClarifyChoice>>(() =>
    Object.fromEntries(unrecognized.map((u) => [u.column, u.guess])),
  );

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="space-y-3 lg:col-span-2">
        {showClarify && (
          <Card className="border border-warning/40 bg-card shadow-none">
            <CardContent className="space-y-3 p-5">
              <div className="flex items-start gap-2">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning-foreground" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">
                    Некоторые метрики не распознаны
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Укажите тип, чтобы они учитывались правильно. Можно пропустить — тогда
                    колонка не попадёт в анализ.
                  </p>
                </div>
              </div>
              <ul className="divide-y rounded-md border bg-surface">
                {unrecognized.map((u) => (
                  <li
                    key={u.column}
                    className="grid grid-cols-1 items-center gap-2 px-3 py-2.5 sm:grid-cols-[1fr_auto_auto]"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">
                        {u.column}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        Предполагаемый тип:{" "}
                        {u.guess === "volume"
                          ? "Абсолютная"
                          : u.guess === "rate"
                            ? "Относительная"
                            : "Пропустить"}
                      </p>
                    </div>
                    <select
                      value={choices[u.column]}
                      onChange={(e) =>
                        setChoices((prev) => ({
                          ...prev,
                          [u.column]: e.target.value as ClarifyChoice,
                        }))
                      }
                      className="h-8 rounded-md border bg-card px-2 text-xs text-foreground"
                      aria-label={`Тип метрики ${u.column}`}
                    >
                      <option value="volume">Абсолютная</option>
                      <option value="rate">Относительная</option>
                      <option value="skip">Пропустить</option>
                    </select>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        <Card className="border bg-card shadow-none">
          <CardContent className="space-y-5 p-5">
            <div>
              <p className="text-sm font-medium text-foreground">Ключевые метрики</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Выберите 1–2 ключевые метрики, которые важны для вашего анализа. Хотя бы одна
                должна быть абсолютной.
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
              {noAbsoluteError && (
                <div className="mt-3 flex items-start gap-2 rounded-md border border-destructive/30 bg-blocked-soft px-3 py-2 text-xs text-destructive">
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  <span>
                    Среди выбранных метрик должна быть хотя бы одна абсолютная (например, клики
                    или конверсии).
                  </span>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="focus" className="text-xs font-medium">
                Фокус анализа <span className="text-muted-foreground">(опционально)</span>
              </Label>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                Не влияет на расчёт метрик. Помогает выделить акценты в тексте отчёта.
              </p>
              <Textarea
                id="focus"
                placeholder="Например: сделайте акцент на CPA, проблемных кампаниях и точках роста"
                className="mt-1.5 min-h-[72px] text-sm"
              />
            </div>
          </CardContent>
        </Card>
      </div>
      <HelpCard
        title="Подсказки"
        items={[
          "Не больше 2 ключевых метрик — отчёт будет точнее",
          "Хотя бы одна метрика — из абсолютных (клики, конверсии, расход)",
          "Если часть колонок не распознана — укажите их тип выше",
          "Фокус анализа влияет только на акценты текста",
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
  const search = Route.useSearch() as RunnerSearch;
  const state: CheckState = search.state ?? "clean";
  const scenario = search.scenario;
  const isSemantics = product.id === "semantics-generator";
  const isCrossMinus = product.id === "cross-minus";
  const group = semanticsScenarioGroupOf(scenario);
  const isCluster = scenario === "cluster";
  const isFileScenario = isSemantics && (isCluster || scenario === "expand");
  const idx = steps.indexOf("check");
  const next = idx >= 0 && idx < steps.length - 1 ? steps[idx + 1] : undefined;
  const canRun = state !== "blocked";
  const navSearch: Record<string, unknown> = scenario ? { scenario } : {};

  // Semantics-specific copy
  const semWarning =
    "Файл прочитан, но в 124 строках обнаружены пустые значения и 38 повторов фраз — будут пропущены при обработке.";
  const semBlocked = isCluster
    ? "Не удалось определить столбец с фразами. Укажите его в параметрах или замените файл."
    : "Файл не содержит ни одной валидной фразы. Замените источник.";
  // Cross-minus-specific copy
  const crossWarning =
    "В 312 строках нет показов — они будут пропущены. Найдено 47 повторов ключевых фраз — объединим при подсчёте.";
  const crossBlocked =
    "Не найдена обязательная колонка «Показы». Без неё посчитать пересечения невозможно.";
  const reportWarning =
    "В выгрузке есть 14 строк с пустой валютой и 3 нераспознанные колонки";
  const reportBlocked = "Не хватает обязательных колонок: campaign_id, date";

  const sourceLabel = isSemantics
    ? isCluster
      ? "phrases_to_cluster.csv"
      : scenario === "expand"
        ? "seed_keywords.txt"
        : scenario === "topic-list"
          ? "Тема списка: «спортивная обувь»"
          : "Тема: «весенняя коллекция спортивной обуви»"
    : isCrossMinus
      ? "keywords_export.xlsx"
      : "campaign_export.xlsx";

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="space-y-3 lg:col-span-2">
        <Card className="border bg-card shadow-none">
          <CardContent className="space-y-3 p-5">
            {state === "clean" && (
              <div className="flex items-center gap-2 rounded-md border bg-success-soft px-3 py-2 text-sm text-success">
                <CheckCircle2 className="h-4 w-4" />
                {isSemantics
                  ? "Источник принят, всё готово к запуску."
                  : isCrossMinus
                    ? "Источник подходит для запуска: найдены кампании, ключевые фразы и показы."
                    : "Источник принят, структура соответствует ожиданиям. Можно запускать."}
              </div>
            )}
            {state === "warning" && (
              <div className="flex items-start gap-2 rounded-md border border-warning/40 bg-warning-soft px-3 py-2 text-sm">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning-foreground" />
                <div>
                  <p className="font-medium text-warning-foreground">
                    {isSemantics ? semWarning : isCrossMinus ? crossWarning : reportWarning}
                  </p>
                  <p className="mt-0.5 text-xs text-warning-foreground/80">
                    Можно продолжить — такие строки и колонки будут пропущены при обработке.
                  </p>
                </div>
              </div>
            )}
            {state === "blocked" && (
              <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-blocked-soft px-3 py-2 text-sm text-destructive">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <div>
                  <p className="font-medium">
                    {isSemantics ? semBlocked : isCrossMinus ? crossBlocked : reportBlocked}
                  </p>
                  <p className="mt-0.5 text-xs">
                    {isSemantics
                      ? "Запуск невозможен. Исправьте источник или параметры."
                      : isCrossMinus
                        ? "Запуск невозможен. Замените файл — нужна выгрузка «Ключевые фразы» с показами по кампаниям."
                        : "Запуск невозможен. Вернитесь к источнику и загрузите выгрузку с этими колонками."}
                  </p>
                </div>
              </div>
            )}

            {isSemantics && scenario && (
              <div className="rounded-md border bg-surface px-3 py-2 text-xs">
                <span className="text-muted-foreground">Сценарий: </span>
                <span className="font-medium text-foreground">
                  {semanticsScenarioName(scenario)}
                </span>
                {group && (
                  <span className="ml-1.5 text-muted-foreground">
                    · {semanticsScenarioGroupLabel[group]}
                  </span>
                )}
              </div>
            )}

            <div className="rounded-md border bg-surface px-4 py-3">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Источник
              </p>
              <p className="mt-1 text-sm font-medium text-foreground">{sourceLabel}</p>
              <dl className="mt-2 grid grid-cols-2 gap-y-1 text-xs">
                {isSemantics ? (
                  isFileScenario ? (
                    <>
                      <dt className="text-muted-foreground">Строк</dt>
                      <dd className="text-foreground">4 320</dd>
                      <dt className="text-muted-foreground">Колонок</dt>
                      <dd className="text-foreground">{isCluster ? "1 (phrase)" : "1"}</dd>
                      <dt className="text-muted-foreground">Уникальных фраз</dt>
                      <dd className="text-foreground">4 282</dd>
                      <dt className="text-muted-foreground">Размер</dt>
                      <dd className="text-foreground">18 КБ</dd>
                    </>
                  ) : (
                    <>
                      <dt className="text-muted-foreground">Тип входа</dt>
                      <dd className="text-foreground">Тема / список</dd>
                      <dt className="text-muted-foreground">Сценарий</dt>
                      <dd className="text-foreground">{semanticsScenarioName(scenario)}</dd>
                    </>
                  )
                ) : isCrossMinus ? (
                  <>
                    <dt className="text-muted-foreground">Формат</dt>
                    <dd className="text-foreground">XLSX · 2,1 МБ</dd>
                    <dt className="text-muted-foreground">Строк всего</dt>
                    <dd className="text-foreground">8 412</dd>
                    <dt className="text-muted-foreground">Кампаний</dt>
                    <dd className="text-foreground">14</dd>
                    <dt className="text-muted-foreground">Ключевых фраз</dt>
                    <dd className="text-foreground">7 906</dd>
                    <dt className="text-muted-foreground">Строк с показами</dt>
                    <dd className="text-foreground">
                      {state === "warning" ? "8 100 (312 без показов)" : "8 412"}
                    </dd>
                    <dt className="text-muted-foreground">Обязательные колонки</dt>
                    <dd className="text-foreground">
                      {state === "blocked"
                        ? "Кампания, Фраза — найдены; Показы — не найдена"
                        : "Кампания, Фраза, Показы — найдены"}
                    </dd>
                    <dt className="text-muted-foreground">Пересечения</dt>
                    <dd className="text-foreground">
                      {state === "blocked"
                        ? "не определены"
                        : state === "warning"
                          ? "мало — результат может быть коротким"
                          : "достаточно для расчёта"}
                    </dd>
                  </>
                ) : (
                  <>
                    <dt className="text-muted-foreground">Строк</dt>
                    <dd className="text-foreground">2 184</dd>
                    <dt className="text-muted-foreground">Колонок</dt>
                    <dd className="text-foreground">17</dd>
                    <dt className="text-muted-foreground">Период</dt>
                    <dd className="text-foreground">01.04.2026 — 24.04.2026</dd>
                    <dt className="text-muted-foreground">Кампаний</dt>
                    <dd className="text-foreground">18</dd>
                  </>
                )}
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
                <li>
                  · Ожидаемое время обработки:{" "}
                  {isSemantics ? "~3–5 мин" : isCrossMinus ? "~1–3 мин" : "~2 мин"}
                </li>
              </ul>
            </div>

            <div className="flex flex-wrap gap-2 border-t pt-3 text-xs">
              <Button variant="ghost" size="sm" asChild>
                <Link
                  to="/v4/run/$productId/$step"
                  params={{ productId: product.id, step: "source" }}
                  search={navSearch}
                >
                  {state === "blocked" && (isFileScenario || isCrossMinus)
                    ? "Заменить файл"
                    : "Изменить источник"}
                </Link>
              </Button>
              {product.steps.includes("params") && (
                <Button variant="ghost" size="sm" asChild>
                  <Link
                    to="/v4/run/$productId/$step"
                    params={{ productId: product.id, step: "params" }}
                    search={navSearch}
                  >
                    Изменить параметры
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
          steps={steps}
          current="check"
          projectId={projectId}
          search={navSearch}
          nextSlot={
            next &&
            (canRun ? (
              <Button asChild>
                <Link
                  to="/v4/run/$productId/$step"
                  params={{ productId: product.id, step: next }}
                  search={navSearch}
                >
                  Запустить <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            ) : (
              <Button disabled title="Сначала исправьте блокирующие ошибки">
                Запустить <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            ))
          }
        />
      </div>
    </div>
  );
}

// --------------------- Run ---------------------

function RunStep({
  product,
  projectId,
  steps,
}: {
  product: Product;
  projectId: string;
  steps: StepId[];
}) {
  const search = Route.useSearch() as RunnerSearch;
  const isSemantics = product.id === "semantics-generator";
  const isCampaignAnalysis = product.id === "campaign-analysis";
  const isCrossMinus = product.id === "cross-minus";
  const navSearch: Record<string, unknown> = search.scenario ? { scenario: search.scenario } : {};
  const headline = isCampaignAnalysis
    ? "Анализ выполняется"
    : isCrossMinus
      ? "Считаем кросс-минусовку"
      : `${product.name} — идёт обработка`;
  const eta = isSemantics
    ? "Подготовка Excel-файла · ~3–5 мин"
    : isCampaignAnalysis
      ? "Подготовка аналитического отчёта · ~2–3 мин"
      : isCrossMinus
        ? "Подготовка Excel-файла · ~1–3 мин"
        : "Подготовка результата · ~2 мин";
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card className="border bg-card shadow-none lg:col-span-2">
        <CardContent className="space-y-4 p-6">
          <div className="flex items-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <div>
              <p className="text-sm font-medium text-foreground">{headline}</p>
              <p className="text-xs text-muted-foreground">{eta}</p>
            </div>
          </div>
          <Progress value={62} className="h-1.5" />
          <ul className="space-y-1 text-xs text-muted-foreground">
            {isSemantics ? (
              <>
                <li>· Читаем источник</li>
                <li>· Собираем фразы</li>
                <li className="text-foreground">· Дедуплицируем и фильтруем…</li>
                <li>· Формируем Excel</li>
                <li>· Сохраняем в Библиотеке</li>
              </>
            ) : isCampaignAnalysis ? (
              <>
                <li>· Читаем источник</li>
                <li>· Считаем выбранные метрики</li>
                <li className="text-foreground">· Готовим выводы и инсайты…</li>
                <li>· Формируем аналитический отчёт</li>
                <li>· Сохраняем в Библиотеке</li>
              </>
            ) : isCrossMinus ? (
              <>
                <li>· Читаем источник</li>
                <li>· Проверяем структуру и колонки</li>
                <li className="text-foreground">· Считаем пересечения между кампаниями…</li>
                <li>· Формируем списки минус-фраз</li>
                <li>· Сохраняем Excel в Библиотеке</li>
              </>
            ) : (
              <>
                <li>· Читаем источник</li>
                <li>· Проверяем структуру</li>
                <li className="text-foreground">· Формируем результат…</li>
                <li>· Сохраняем в Библиотеке</li>
              </>
            )}
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
          steps={steps}
          current="run"
          projectId={projectId}
          search={navSearch}
          nextSlot={
            <Button asChild>
              <Link
                to="/v4/run/$productId/$step"
                params={{ productId: product.id, step: "result" }}
                search={navSearch}
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

function ResultStep({ product, projectId, steps: _steps }: { product: Product; projectId: string; steps: StepId[] }) {
  const search = Route.useSearch() as RunnerSearch;
  const isSemantics = product.id === "semantics-generator";
  const isCrossMinus = product.id === "cross-minus";
  const scenario = search.scenario;
  // For excel results: saved=0 means local copy only; save=error means saving failed.
  const saved = search.saved !== 0;
  const saveError = search.save === "error";
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
  const showDashboardCta =
    product.resultFormat === "analytics-report" && search.dashboard === 1;

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card className="border bg-card shadow-none lg:col-span-2">
        <CardContent className="space-y-4 p-6">
          {saveError ? (
            <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-blocked-soft px-3 py-2 text-sm text-destructive">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <div>
                <p className="font-medium">Не удалось сохранить результат в Библиотеку</p>
                <p className="mt-0.5 text-xs">
                  Файл готов и его можно скачать. Сохранение в Библиотеку можно повторить.
                </p>
              </div>
            </div>
          ) : saved ? (
            <div className="flex items-center gap-2 rounded-md border bg-success-soft px-3 py-2 text-sm text-success">
              <CheckCircle2 className="h-4 w-4" />
              Результат сохранён в Библиотеке.
            </div>
          ) : (
            <div className="flex items-start gap-2 rounded-md border border-warning/40 bg-warning-soft px-3 py-2 text-sm">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning-foreground" />
              <div>
                <p className="font-medium text-warning-foreground">
                  Файл готов, но не сохранён в Библиотеку
                </p>
                <p className="mt-0.5 text-xs text-warning-foreground/80">
                  Скачайте его сейчас или сохраните в Библиотеку, чтобы вернуться позже.
                </p>
              </div>
            </div>
          )}

          <div className="rounded-md border bg-surface px-4 py-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Результат готов
            </p>
            <p className="mt-1 text-base font-semibold text-foreground">
              {product.name} — 26.04.2026
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Формат: {resultFormatLabel[product.resultFormat]}
              {isSemantics && scenario && ` · Сценарий: ${semanticsScenarioName(scenario)}`}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button>
              <PrimaryIcon className="h-3.5 w-3.5" /> {primaryLabel}
            </Button>
            {showDashboardCta && (
              <Button variant="outline">
                <ExternalLink className="h-3.5 w-3.5" /> Открыть дашборд
              </Button>
            )}
            {product.resultFormat === "excel" && saveError && (
              <Button variant="outline">
                <ArrowRight className="h-3.5 w-3.5" /> Повторить сохранение
              </Button>
            )}
            {product.resultFormat === "excel" && !saved && !saveError && (
              <Button variant="outline">
                <Database className="h-3.5 w-3.5" /> Сохранить в Библиотеку
              </Button>
            )}
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
          <p className="mt-1 text-sm text-foreground">
            {saveError ? "Сохранение не удалось" : saved ? "Библиотека" : "Локально (не сохранён)"}
          </p>
          <p className="mt-3 text-xs text-muted-foreground">
            Все источники и результаты проекта собраны в Библиотеке.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
