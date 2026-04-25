interface ReviewItem {
  label: string;
  value: React.ReactNode;
}

export function ReviewSummary({ items }: { items: ReviewItem[] }) {
  return (
    <dl className="rounded-lg border bg-card divide-y">
      {items.map((item) => (
        <div
          key={item.label}
          className="grid grid-cols-1 gap-1 px-4 py-3 sm:grid-cols-3 sm:items-center"
        >
          <dt className="text-xs uppercase tracking-wide text-muted-foreground">
            {item.label}
          </dt>
          <dd className="text-sm text-foreground sm:col-span-2">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
