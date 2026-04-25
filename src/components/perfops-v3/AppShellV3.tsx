import { useState, type ReactNode } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import {
  Home,
  Boxes,
  FolderKanban,
  Library as LibraryIcon,
  Plug,
  ChevronDown,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  User,
  Layers,
  Wrench,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { products, projects } from "@/lib/perfops-v3-data";

interface NavItem {
  to: string;
  label: string;
  icon: typeof Home;
  exact?: boolean;
}

const primaryNav: NavItem[] = [
  { to: "/v3", label: "Главная", icon: Home, exact: true },
  { to: "/v3/products", label: "Продукты", icon: Boxes },
  { to: "/v3/projects", label: "Проекты", icon: FolderKanban },
  { to: "/v3/library", label: "Библиотека", icon: LibraryIcon },
  { to: "/v3/connections", label: "Подключения", icon: Plug },
];

const referenceNav: NavItem[] = [
  { to: "/v3/flow-states", label: "Справочник состояний", icon: Layers },
  { to: "/v3/components", label: "UI-компоненты", icon: Wrench },
];

export function AppShellV3({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const path = location.pathname;

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((v) => !v)}
        path={path}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <main className="flex-1 px-6 py-6 lg:px-8 lg:py-8">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
        <footer className="border-t bg-card px-6 py-3 text-xs text-muted-foreground">
          <div className="mx-auto flex max-w-6xl items-center justify-between">
            <span>PerfOps · визуальный прототип v3</span>
            <span>Статичные демо-данные</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

function Sidebar({
  collapsed,
  onToggle,
  path,
}: {
  collapsed: boolean;
  onToggle: () => void;
  path: string;
}) {
  const recents = [...projects]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 3);

  const productsActive =
    path === "/v3/products" || path.startsWith("/v3/products/");
  const [productsOpen, setProductsOpen] = useState(productsActive);

  return (
    <aside
      className={cn(
        "sticky top-0 flex h-screen shrink-0 flex-col border-r bg-card transition-[width] duration-200",
        collapsed ? "w-14" : "w-60",
      )}
    >
      {/* Logo + collapse toggle (always at top, same place) */}
      <div
        className={cn(
          "flex h-14 items-center border-b px-3",
          collapsed ? "justify-center" : "justify-between",
        )}
      >
        <Link to="/v3" className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-[11px] font-semibold text-primary-foreground">
            P
          </span>
          {!collapsed && (
            <span className="text-sm font-semibold tracking-tight text-foreground">
              PerfOps
            </span>
          )}
        </Link>
        <button
          type="button"
          onClick={onToggle}
          className={cn(
            "inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground",
            collapsed && "absolute right-[-12px] top-3 border bg-card shadow-sm",
          )}
          aria-label={collapsed ? "Развернуть боковую панель" : "Свернуть боковую панель"}
        >
          {collapsed ? (
            <PanelLeftOpen className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-3">
        <ul className="space-y-0.5">
          {primaryNav.map((item) => {
            const Icon = item.icon;
            const active = item.exact
              ? path === item.to
              : path === item.to || path.startsWith(item.to + "/");

            // Special handling for "Продукты" — collapsible group
            if (item.to === "/v3/products") {
              return (
                <li key={item.to}>
                  <div className="flex items-center">
                    <Link
                      to={item.to}
                      title={collapsed ? item.label : undefined}
                      className={cn(
                        "flex flex-1 items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
                        active
                          ? "bg-accent text-accent-foreground"
                          : "text-foreground/80 hover:bg-muted hover:text-foreground",
                        collapsed && "justify-center px-0",
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </Link>
                    {!collapsed && (
                      <button
                        type="button"
                        onClick={() => setProductsOpen((v) => !v)}
                        className="ml-1 inline-flex h-7 w-6 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                        aria-label={productsOpen ? "Свернуть продукты" : "Развернуть продукты"}
                      >
                        {productsOpen ? (
                          <ChevronDown className="h-3.5 w-3.5" />
                        ) : (
                          <ChevronRight className="h-3.5 w-3.5" />
                        )}
                      </button>
                    )}
                  </div>
                  {!collapsed && productsOpen && (
                    <ul className="mt-0.5 space-y-0.5 pl-7">
                      {products.map((p) => {
                        const productActive = path === `/v3/products/${p.id}`;
                        return (
                          <li key={p.id}>
                            <Link
                              to="/v3/products/$productId"
                              params={{ productId: p.id }}
                              className={cn(
                                "block truncate rounded-md px-2 py-1 text-xs transition-colors",
                                productActive
                                  ? "bg-accent text-accent-foreground"
                                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
                              )}
                            >
                              {p.name}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            }

            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  title={collapsed ? item.label : undefined}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
                    active
                      ? "bg-accent text-accent-foreground"
                      : "text-foreground/80 hover:bg-muted hover:text-foreground",
                    collapsed && "justify-center px-0",
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Recent projects */}
        {!collapsed && recents.length > 0 && (
          <div className="mt-6">
            <p className="mb-1 px-2 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              Недавние проекты
            </p>
            <ul className="space-y-0.5">
              {recents.map((p) => (
                <li key={p.id}>
                  <Link
                    to="/v3/projects/$projectId"
                    params={{ projectId: p.id }}
                    className="block truncate rounded-md px-2 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Reference */}
        <div className="mt-6">
          {!collapsed && (
            <p className="mb-1 px-2 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              Справочник
            </p>
          )}
          <ul className="space-y-0.5">
            {referenceNav.map((item) => {
              const Icon = item.icon;
              const active = path === item.to;
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    title={collapsed ? item.label : undefined}
                    className={cn(
                      "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
                      active
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      collapsed && "justify-center px-0",
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* User profile at bottom */}
      <div className="border-t p-2">
        {collapsed ? (
          <div className="flex flex-col items-center gap-1">
            <button
              type="button"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground"
              aria-label="Профиль"
            >
              <User className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Настройки"
            >
              <Settings className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="space-y-0.5">
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-foreground hover:bg-muted"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <User className="h-3.5 w-3.5" />
              </span>
              <span className="flex flex-col text-left leading-tight">
                <span className="text-xs font-medium text-foreground">Майя Чен</span>
                <span className="text-[11px] text-muted-foreground">Аккаунт</span>
              </span>
            </button>
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <Settings className="h-4 w-4" />
              Настройки
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
