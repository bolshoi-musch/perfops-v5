import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { LifeBuoy } from "lucide-react";

interface HelpCardProps {
  title?: string;
  items?: string[];
  children?: ReactNode;
}

export function HelpCard({ title = "Что можно использовать", items, children }: HelpCardProps) {
  return (
    <Card className="border bg-card shadow-none h-fit">
      <CardContent className="p-5">
        <p className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
          <LifeBuoy className="h-3.5 w-3.5" /> {title}
        </p>
        {items && items.length > 0 && (
          <ul className="mt-2 space-y-1.5 text-sm text-foreground">
            {items.map((i) => (
              <li key={i} className="leading-snug">
                · {i}
              </li>
            ))}
          </ul>
        )}
        {children && <div className="mt-2 text-sm text-muted-foreground">{children}</div>}
      </CardContent>
    </Card>
  );
}
