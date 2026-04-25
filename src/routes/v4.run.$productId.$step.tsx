import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
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
  projects,
  resultFormatLabel,
  semanticsModes,
  metricsCatalog,
  connectionTypes,
  libraryEntries,
  sourceKindLabel,
  type Product,
  type StepId,
  type SourceKind,
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
} from "lucide-react";

const stepSchema = z.enum([
  "mode",
  "source",
  "merge",
  "params",
  "metrics-focus",
  "check",
  "run",
  "result",
]);

export const Route = createFileRoute("/v4/run/$productId/$step")({
  head: ({ params }) => ({
    meta: [{ title: `${stepLabel[params.step as StepId] ?? "Шаг"} — PerfOps V4` }],
  }),
  parseParams: (raw) => ({
    productId: String(raw.productId),
    step: stepSchema.parse(raw.step),
  }),
  component: FlowRunnerPage,
});

function FlowRunnerPage() {
  const params = Route.useParams();
  const productId = params.productId;
  const step = params.step as StepId;
  const product = getProduct(productId);
  if (!product.steps.includes(step)) {
    throw notFound();
  }
  // Demo project association — first project that uses this product
  const project = projects.find((p) => p.productId === productId) ?? projects[0];

  const stepIndex = product.steps.indexOf(step);

  return (
    <AppShellV4>
      <ProjectContextBarV4
        projectName={project.name}
        projectId={project.id}
        productName={product.name}
        step={stepLabel[step]}
      />
      <PageHeaderV4
        eyebrow={`Шаг ${stepIndex + 1} из ${product.steps.length}`}
        title={titleFor(step, product)}
        subtitle={subtitleFor(step, product)}
      />
      <FlowStepperV4 product={product} current={step} />

      <StepBody product={product} step={step} projectId={project.id} />
    </AppShellV4>
  );
}

function titleFor(step: StepId, product: Product): string {
  switch (step) {
    case "mode":
      return "Выберите режим";
    case "source":
      return "Выберите источник";
    case "merge":
      return "Объединение источников";
    case "params":
      return "Параметры запуска";
    case "metrics-focus":
      return "Метрики и фокус анализа";
    case "check":
      return "Проверка перед запуском";
    case "run":
      return "Идёт обработка";
    case "result":
      return `Результат: ${product.resultName.toLowerCase()}`;
  }
}

function subtitleFor(step: StepId, product: Product): string | undefined {
  switch (step) {
    case "mode":
      return "Режим определяет, как продукт обработает источник.";
    case "source":
      return "Поведение и набор источников зависят от продукта.";
    case "merge":
      return "Если добавлено два источника — выберите план объединения.";
    case "params":
      return "Параметры можно изменить позже без потери источника.";
    case "metrics-focus":
      return "Что в первую очередь должно попасть в отчёт.";
    case "check":
      return "Здесь видны источник, параметры и предупреждения. Можно вернуться и исправить.";
    case "run":
      return "Можно безопасно вернуться позже — результат появится в Библиотеке проекта.";
    case "result":
      return `Сохранён в Библиотеке проекта · ${resultFormatLabel[product.resultFormat]}.`;
  }
}

// --------------------- Step body dispatcher ---------------------

function StepBody({
  product,
  step,
  projectId,
}: {
  product: Product;
  step: StepId;
  projectId: string;
}) {
  switch (step) {
    case "mode":
      return <ModeStep product={product} projectId={projectId} />;
    case "source":
      return <SourceStep product={product} projectId={projectId} />;
    case "merge":
      return <MergeStep product={product} projectId={projectId} />;
    case "params":
      return <ParamsStep product={product} projectId={projectId} />;
    case "metrics-focus":
      return <MetricsFocusStep product={product} projectId={projectId} />;
    case "check":
      return <CheckStep product={product} projectId={projectId} />;
    case "run":
      return <RunStep product={product} projectId={projectId} />;
    case "result":
      return <ResultStep product={product} projectId={projectId} />;
  }
}

// --------------------- Mode (semantics) ---------------------

function ModeStep({ product, projectId }: { product: Product; projectId: string }) {
  const [mode, setMode] = useState<string>("balanced");
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card className="border bg-card shadow-none lg:col-span-2">
        <CardContent className="space-y-2 p-5">
          <p className="text-xs text-muted-foreground">
            Режим меняет дальнейшие шаги. По умолчанию — «Сбалансированный».
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {semanticsModes.map((m) => {
              const active = mode === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMode(m.id)}
                  className={cn(
                    "rounded-md border bg-card px-3 py-2.5 text-left transition-colors",
                    active
                      ? "border-primary ring-1 ring-primary/30"
                      : "hover:border-border-strong",
                  )}
                >
                  <p className="text-sm font-medium text-foreground">{m.name}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{m.description}</p>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>
      <HelpCard
        title="Как выбрать режим"
        items={[
          "Для нового направления — «Охватный»",
          "Для регулярных запусков — «Сбалансированный»",
          "Для чистки и точечных задач — «Консервативный»",
          "Для группировки готового ядра — «Кластеризация»",
        ]}
      />
      <div className="lg:col-span-3">
        <FlowActionBar product={product} current="mode" projectId={projectId} />
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

function SourceStep({ product, projectId }: { product: Product; projectId: string }) {
  const [activeKind, setActiveKind] = useState<SourceKind>(product.allowedSources[0]);
  const [hasFile, setHasFile] = useState(true); // demo: file pre-attached so step preserves data
  const [secondSourceOpen, setSecondSourceOpen] = useState(false);
  const supportsMerge = product.steps.includes("merge");

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="space-y-3 lg:col-span-2">
        <Card className="border bg-card shadow-none">
          <CardContent className="p-5">
            <p className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">
              Тип источника
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

        {supportsMerge && (
          <Card className="border border-dashed bg-card shadow-none">
            <CardContent className="p-5">
              {!secondSourceOpen ? (
                <button
                  type="button"
                  onClick={() => setSecondSourceOpen(true)}
                  className="flex w-full items-center justify-between gap-3 rounded-md text-left text-sm text-muted-foreground hover:text-foreground"
                >
                  <span className="inline-flex items-center gap-2">
                    <Plus className="h-4 w-4" /> Добавить второй источник для объединения
                  </span>
                  <span className="text-xs text-muted-foreground">
                    На шаге «Объединение» вы выберете план
                  </span>
                </button>
              ) : (
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      Второй источник
                    </p>
                    <button
                      type="button"
                      onClick={() => setSecondSourceOpen(false)}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <SourcePanel
                    kind={activeKind}
                    product={product}
                    hasFile={false}
                    onAttachFile={() => undefined}
                    onClearFile={() => undefined}
                    secondary
                  />
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      <HelpCard items={product.sourceHelp} />

      <div className="lg:col-span-3">
        <FlowActionBar product={product} current="source" projectId={projectId} />
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
  secondary,
}: {
  kind: SourceKind;
  product: Product;
  hasFile: boolean;
  onAttachFile: () => void;
  onClearFile: () => void;
  secondary?: boolean;
}) {
  if (kind === "upload") {
    if (hasFile && !secondary) {
      return (
        <div className="flex items-center justify-between gap-3 rounded-md border bg-success-soft px-3 py-2.5 text-sm">
          <div className="flex min-w-0 items-center gap-2">
            <FileSpreadsheet className="h-4 w-4 shrink-0 text-success" />
            <span className="truncate font-medium text-foreground">campaign_export.xlsx</span>
            <span className="text-xs text-muted-foreground">· 412 КБ · принято</span>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <Button size="sm" variant="ghost" onClick={onClearFile}>
              Удалить
            </Button>
            <Button size="sm" variant="outline" onClick={onAttachFile}>
              Заменить файл
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
    const conns = connectionTypes.filter((c) =>
      product.supportedConnections.includes(c.id),
    );
    return (
      <ul className="divide-y rounded-md border">
        {conns.flatMap((c) =>
          c.accounts.map((a) => (
            <li
              key={a.id}
              className="flex items-center justify-between gap-3 px-3 py-2 text-sm hover:bg-surface"
            >
              <div className="min-w-0">
                <p className="truncate text-sm text-foreground">{a.name}</p>
                <p className="truncate text-[11px] text-muted-foreground">
                  {c.name} · {a.identifier}
                </p>
              </div>
              <Button size="sm" variant="outline">
                Выбрать
              </Button>
            </li>
          )),
        )}
        {conns.every((c) => c.accounts.length === 0) && (
          <li className="px-3 py-3 text-sm text-muted-foreground">
            Подходящих подключений нет — добавьте их в разделе «Подключения».
          </li>
        )}
      </ul>
    );
  }

  if (kind === "library") {
    const candidates = libraryEntries.filter((e) => e.kind === "source");
    return (
      <ul className="divide-y rounded-md border">
        {candidates.map((e) => (
          <li
            key={e.id}
            className="flex items-center justify-between gap-3 px-3 py-2 text-sm hover:bg-surface"
          >
            <div className="min-w-0">
              <p className="truncate text-sm text-foreground">{e.name}</p>
              <p className="truncate text-[11px] text-muted-foreground">
                Проект: {e.projectName} · обновлено {e.updated}
              </p>
            </div>
            <Button size="sm" variant="outline">
              Выбрать
            </Button>
          </li>
        ))}
      </ul>
    );
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

// --------------------- Merge ---------------------

function MergeStep({ product, projectId }: { product: Product; projectId: string }) {
  const [plan, setPlan] = useState<"by-keys" | "concat" | "manual">("by-keys");
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="space-y-3 lg:col-span-2">
        <Card className="border bg-card shadow-none">
          <CardContent className="space-y-3 p-5">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Источники
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              <SourceChip name="campaign_export.xlsx" sub="2 184 строки · 17 колонок" />
              <SourceChip name="stats_april.csv" sub="2 010 строк · 12 колонок" />
            </div>

            <p className="mt-2 text-xs uppercase tracking-wide text-muted-foreground">
              План объединения
            </p>
            <div className="grid gap-2">
              <PlanRow
                active={plan === "by-keys"}
                onClick={() => setPlan("by-keys")}
                title="Связать по ключам"
                desc="Найдено совпадение по колонкам campaign_id и date — рекомендуемый план."
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

            <div className="rounded-md border bg-surface p-3 text-xs">
              <p className="mb-2 font-medium text-foreground">Превью совпадений</p>
              <div className="overflow-hidden rounded-md border bg-card">
                <table className="w-full text-xs">
                  <thead className="bg-surface text-left text-muted-foreground">
                    <tr>
                      <th className="px-2 py-1 font-medium">campaign_id</th>
                      <th className="px-2 py-1 font-medium">date</th>
                      <th className="px-2 py-1 font-medium">источник 1</th>
                      <th className="px-2 py-1 font-medium">источник 2</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {[
                      ["c-1042", "2025-04-12", "✓", "✓"],
                      ["c-1042", "2025-04-13", "✓", "✓"],
                      ["c-1043", "2025-04-12", "✓", "—"],
                    ].map((row, i) => (
                      <tr key={i}>
                        {row.map((cell, j) => (
                          <td key={j} className="px-2 py-1 text-foreground">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
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
        <FlowActionBar product={product} current="merge" projectId={projectId} />
      </div>
    </div>
  );
}

function SourceChip({ name, sub }: { name: string; sub: string }) {
  return (
    <div className="flex items-center gap-2 rounded-md border bg-surface px-3 py-2 text-sm">
      <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-foreground">{name}</p>
        <p className="text-[11px] text-muted-foreground">{sub}</p>
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

function ParamsStep({ product, projectId }: { product: Product; projectId: string }) {
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
            <ParamRow label="Бренды" hint="включить или исключить из результата">
              <select className="h-9 rounded-md border bg-card px-2 text-sm">
                <option>Включить</option>
                <option>Исключить</option>
              </select>
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
          <FlowActionBar product={product} current="params" projectId={projectId} />
        </div>
      </div>
    );
  }

  // bd-optimization placeholder params
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card className="border bg-card shadow-none lg:col-span-2">
        <CardContent className="space-y-4 p-5">
          <ParamRow label="Целевая метрика" hint="что оптимизируем">
            <select className="h-9 rounded-md border bg-card px-2 text-sm">
              <option>CPA</option>
              <option>ROAS</option>
              <option>CR</option>
            </select>
          </ParamRow>
          <ParamRow label="Целевое значение" hint="например, целевой CPA">
            <Input defaultValue="450" className="h-9 w-32 text-sm" />
          </ParamRow>
          <ParamRow label="Лимит бюджета" hint="дневной, в рублях">
            <Input defaultValue="80000" className="h-9 w-32 text-sm" />
          </ParamRow>
          <ParamRow label="Стратегия" hint="агрессивность изменения ставок">
            <select className="h-9 rounded-md border bg-card px-2 text-sm">
              <option>Аккуратная</option>
              <option>Стандартная</option>
              <option>Агрессивная</option>
            </select>
          </ParamRow>
        </CardContent>
      </Card>
      <HelpCard
        title="Подсказки"
        items={[
          "Для новых кампаний выбирайте «Аккуратную» стратегию",
          "Лимит бюджета влияет на верхнюю границу рекомендуемых ставок",
          "Можно вернуться и поменять параметры — источник сохранится",
        ]}
      />
      <div className="lg:col-span-3">
        <FlowActionBar product={product} current="params" projectId={projectId} />
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

// --------------------- Metrics & focus ---------------------

function MetricsFocusStep({
  product,
  projectId,
}: {
  product: Product;
  projectId: string;
}) {
  const [selected, setSelected] = useState<Set<string>>(
    new Set(["impressions", "clicks", "cost", "conversions"]),
  );
  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card className="border bg-card shadow-none lg:col-span-2">
        <CardContent className="space-y-4 p-5">
          <div>
            <Label htmlFor="focus" className="text-xs font-medium">
              Фокус анализа
            </Label>
            <Textarea
              id="focus"
              placeholder="На что обратить особое внимание: сегмент, период, гипотеза…"
              className="mt-1 min-h-[72px] text-sm"
            />
          </div>
          <div>
            <p className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">
              Метрики ({selected.size} из {metricsCatalog.length})
            </p>
            <div className="flex flex-wrap gap-2">
              {metricsCatalog.map((m) => {
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
        </CardContent>
      </Card>
      <HelpCard
        title="Подсказки"
        items={[
          "Выберите 4–6 ключевых метрик — отчёт будет компактнее",
          "Фокус анализа помогает выделить нужный сегмент",
          "Можно вернуться и поменять метрики позже",
        ]}
      />
      <div className="lg:col-span-3">
        <FlowActionBar product={product} current="metrics-focus" projectId={projectId} />
      </div>
    </div>
  );
}

// --------------------- Check ---------------------

function CheckStep({ product, projectId }: { product: Product; projectId: string }) {
  const next = getNextStep(product, "check");
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
                <dd className="text-foreground">01.04.2025 — 24.04.2025</dd>
              </dl>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Параметры запуска
              </p>
              <ul className="mt-1 space-y-1 text-sm text-muted-foreground">
                <li>· Продукт: {product.name}</li>
                <li>· Формат результата: {resultFormatLabel[product.resultFormat]}</li>
                <li>· Куда сохранится: Библиотека проекта</li>
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
                  Запустить с предупреждением <ArrowRight className="h-3.5 w-3.5" />
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
                {product.name} — выполняется
              </p>
              <p className="text-xs text-muted-foreground">
                Подготовка результата · ~2 мин
              </p>
            </div>
          </div>
          <Progress value={62} className="h-1.5" />
          <ul className="space-y-1 text-xs text-muted-foreground">
            <li>· Чтение источника</li>
            <li>· Подготовка структуры результата</li>
            <li className="text-foreground">· Формирование итогового артефакта…</li>
            <li>· Регистрация в Библиотеке проекта</li>
          </ul>
          <p className="rounded-md border bg-surface px-3 py-2 text-xs text-muted-foreground">
            Можно безопасно закрыть страницу — мы продолжим обработку и сохраним результат
            в Библиотеке проекта.
          </p>
        </CardContent>
      </Card>
      <HelpCard
        title="Что произойдёт"
        items={[
          "Платформа подготовит результат",
          "Зарегистрирует его в Библиотеке проекта",
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
            Результат сохранён в Библиотеке проекта.
          </div>

          <div className="rounded-md border bg-surface px-4 py-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Имя результата
            </p>
            <p className="mt-1 text-base font-semibold text-foreground">
              {product.exampleResultName}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Формат: {resultFormatLabel[product.resultFormat]} · Продукт: {product.name}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button>
              <PrimaryIcon className="h-3.5 w-3.5" /> {primaryLabel}
            </Button>
            <Button variant="outline" asChild>
              <Link to="/v4/library">Открыть библиотеку</Link>
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
          <p className="mt-1 text-sm text-foreground">{product.page.resultDestination}</p>
          <p className="mt-3 text-xs text-muted-foreground">
            Все источники и результаты проекта собраны в Библиотеке проекта.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
