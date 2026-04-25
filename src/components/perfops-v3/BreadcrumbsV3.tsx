import { Link } from "@tanstack/react-router";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  to?: string;
  params?: Record<string, string>;
}

export function BreadcrumbsV3({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav
      aria-label="Хлебные крошки"
      className="mb-3 flex items-center gap-1 text-xs text-muted-foreground"
    >
      <Link to="/v3" className="inline-flex items-center hover:text-foreground">
        <Home className="h-3.5 w-3.5" />
      </Link>
      {items.map((item, i) => {
        const last = i === items.length - 1;
        return (
          <span key={i} className="inline-flex items-center gap-1">
            <ChevronRight className="h-3 w-3" />
            {item.to && !last ? (
              <Link
                to={item.to}
                params={item.params as never}
                className="hover:text-foreground"
              >
                {item.label}
              </Link>
            ) : (
              <span className={last ? "text-foreground" : ""}>{item.label}</span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
