import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FlowPageLayoutProps {
  title: string;
  description?: string;
  children: ReactNode;
  side?: ReactNode;
  footer?: ReactNode;
}

export function FlowPageLayout({
  title,
  description,
  children,
  side,
  footer,
}: FlowPageLayoutProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="border bg-card shadow-none lg:col-span-2">
        <CardHeader className="border-b">
          <CardTitle className="text-lg">{title}</CardTitle>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </CardHeader>
        <CardContent className="pt-6">{children}</CardContent>
        {footer && <div className="px-6 pb-6">{footer}</div>}
      </Card>
      {side && <div className="space-y-4">{side}</div>}
    </div>
  );
}
