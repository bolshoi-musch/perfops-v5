import { useState, type ReactNode } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import {
  Home,
  Boxes,
  FolderKanban,
  Library as LibraryIcon,
  Plug,
  PanelLeftClose,
  PanelLeftOpen,
  User,
  Layers,
  Wrench,
  Settings,
  Plus,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { products } from "@/lib/perfops-v4-data";

interface NavItem {
  to: string;
  label: string;
  icon: typeof Home;
  exact?: boolean;
}

const homeNav: NavItem = { to: "/v4", label: "Главная", icon: Home, exact: true };

const afterProductsNav: NavItem[] = [
  { to: "/v4/projects", label: "Проекты", icon: FolderKanban },
  { to: "/v4/library", label: "Библиотека", icon: LibraryIcon },
  { to: "/v4/connections", label: "Подключения", icon: Plug },
];

const referenceNav: NavItem[] = [
  { to: "/v4/flow-states", label: "Справочник состояний", icon: Layers },
  { to: "/v4/components", label: "UI-компоненты", icon: Wrench },
];

export function AppShellV4({ children }: { children: ReactNode }) {
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
            <span>PerfOps · визуальный прототип</span>
            <span>Единый продуктовый поток</span>
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
  return (
    <aside
      className={cn(
        "sticky top-0 flex h-screen shrink-0 flex-col border-r bg-card transition-[width] duration-200",
        collapsed ? "w-14" : "w-60",
      )}
    >
      {/* Top zone: logo + collapse/expand control (always together) */}
      <div
        className={cn(
          "flex h-14 items-center border-b px-3",
          collapsed ? "justify-center" : "justify-between",
        )}
      >
        <Link to="/v4" className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-[11px] font-semibold text-primary-foreground">
            P
          </span>
          {!collapsed && (
            <span className="text-sm font-semibold tracking-tight text-foreground">
              PerfOps
            </span>
          )}
        </Link>
        {!collapsed && (
          <button
            type="button"
            onClick={onToggle}
            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Свернуть боковую панель"
          >
            <PanelLeftClose className="h-4 w-4" />
          </button>
        )}
      </div>

      {collapsed && (
        <div className="flex justify-center border-b py-1">
          <button
            type="button"
            onClick={onToggle}
            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Развернуть боковую панель"
          >
            <PanelLeftOpen className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* New project CTA — always reachable */}
      <div className="border-b px-2 py-2">
        <Link
          to="/v4/projects/new"
          title={collapsed ? "Новый проект" : undefined}
          className={cn(
            "flex items-center gap-2 rounded-md bg-primary px-2 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
            collapsed && "justify-center px-0",
          )}
        >
          <Plus className="h-4 w-4 shrink-0" />
          {!collapsed && <span className="truncate">Новый проект</span>}
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-3">
        <ul className="space-y-0.5">
          <NavRow item={homeNav} path={path} collapsed={collapsed} />
          <ProductsNavGroup path={path} collapsed={collapsed} />
          {afterProductsNav.map((item) => (
            <NavRow key={item.to} item={item} path={path} collapsed={collapsed} />
          ))}
        </ul>

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

      {/* Bottom: account block */}
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
