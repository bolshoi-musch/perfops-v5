import { useState, type ReactNode } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import {
  Home,
  FolderKanban,
  Library as LibraryIcon,
  Plug,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  User,
  Wrench,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { projects } from "@/lib/perfops-data";

interface NavItem {
  to: string;
  label: string;
  icon: typeof Home;
  exact?: boolean;
}

const primaryNav: NavItem[] = [
  { to: "/", label: "Главная", icon: Home, exact: true },
  { to: "/projects", label: "Проекты", icon: FolderKanban },
  { to: "/library", label: "Библиотека", icon: LibraryIcon },
  { to: "/connections", label: "Подключения", icon: Plug },
];

const referenceNav: NavItem[] = [
  { to: "/flow-states", label: "Справочник состояний", icon: Layers },
  { to: "/components", label: "UI-компоненты", icon: Wrench },
];

export function AppShell({ children }: { children: ReactNode }) {
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
        <TopBar />
        <main className="flex-1 px-6 py-6 lg:px-8 lg:py-8">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
        <footer className="border-t bg-card px-6 py-3 text-xs text-muted-foreground">
          <div className="mx-auto flex max-w-6xl items-center justify-between">
            <span>PerfOps · визуальный прототип v2</span>
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
  const recents = projects.slice(0, 3);
  return (
    <aside
      className={cn(
        "sticky top-0 flex h-screen shrink-0 flex-col border-r bg-card transition-[width] duration-200",
        collapsed ? "w-14" : "w-60",
      )}
    >
      <div
        className={cn(
          "flex h-14 items-center border-b px-3",
          collapsed ? "justify-center" : "justify-between",
        )}
      >
        <Link to="/" className="flex items-center gap-2">
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

      <nav className="flex-1 overflow-y-auto px-2 py-3">
        <NavSection
          items={primaryNav}
          collapsed={collapsed}
          path={path}
        />

        {!collapsed && recents.length > 0 && (
          <div className="mt-6">
            <p className="mb-1 px-2 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              Недавние проекты
            </p>
            <ul className="space-y-0.5">
              {recents.map((p) => (
                <li key={p.id}>
                  <Link
                    to="/projects/$projectId"
                    params={{ projectId: p.id }}
                    className="block truncate rounded-md px-2 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground data-[status=active]:bg-accent data-[status=active]:text-accent-foreground"
                  >
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-6">
          {!collapsed && (
            <p className="mb-1 px-2 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              Справочник
            </p>
          )}
          <NavSection
            items={referenceNav}
            collapsed={collapsed}
            path={path}
            muted
          />
        </div>
      </nav>

      <div className="border-t p-2">
        {collapsed ? (
          <div className="flex flex-col items-center gap-1">
            <button
              type="button"
              onClick={onToggle}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Развернуть боковую панель"
            >
              <PanelLeftOpen className="h-4 w-4" />
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
          <button
            type="button"
            className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <Settings className="h-4 w-4" />
            Настройки
          </button>
        )}
      </div>
    </aside>
  );
}

function NavSection({
  items,
  collapsed,
  path,
  muted,
}: {
  items: NavItem[];
  collapsed: boolean;
  path: string;
  muted?: boolean;
}) {
  return (
    <ul className="space-y-0.5">
      {items.map((item) => {
        const Icon = item.icon;
        const active = item.exact
          ? path === item.to
          : path === item.to || path.startsWith(item.to + "/");
        return (
          <li key={item.to}>
            <Link
              to={item.to}
              activeOptions={{ exact: item.exact }}
              title={collapsed ? item.label : undefined}
              className={cn(
                "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
                active
                  ? "bg-accent text-accent-foreground"
                  : muted
                    ? "text-muted-foreground hover:bg-muted hover:text-foreground"
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
  );
}

function TopBar() {
  return (
    <header className="sticky top-0 z-20 flex h-12 items-center justify-end border-b bg-card/90 px-6 backdrop-blur">
      <div className="flex items-center gap-2 rounded-md border bg-card px-2 py-1">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-[11px] font-medium text-muted-foreground">
          <User className="h-3.5 w-3.5" />
        </span>
        <span className="text-xs text-muted-foreground">Майя Чен</span>
      </div>
    </header>
  );
}
