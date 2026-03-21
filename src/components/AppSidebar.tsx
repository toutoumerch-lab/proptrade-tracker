import { LayoutDashboard, Briefcase, BookOpen, ShieldAlert, BarChart3, Settings, LogOut, Zap } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Overview",  to: "/",          icon: LayoutDashboard },
  { label: "Accounts",  to: "/accounts",  icon: Briefcase },
  { label: "Journal",   to: "/journal",   icon: BookOpen },
  { label: "Risk",      to: "/risk",      icon: ShieldAlert },
  { label: "Analytics", to: "/analytics", icon: BarChart3 },
];

interface AppSidebarProps {
  collapsed: boolean;
}

export function AppSidebar({ collapsed }: AppSidebarProps) {
  const location = useLocation();

  return (
    <aside
      className={cn(
        "flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out shrink-0",
        collapsed ? "w-14" : "w-52"
      )}
      style={{ minHeight: "100vh" }}
    >
      {/* Brand */}
      <div className={cn(
        "flex items-center gap-2.5 px-4 py-5 border-b border-sidebar-border",
        collapsed && "justify-center px-0"
      )}>
        <div className="w-7 h-7 rounded bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0">
          <Zap className="w-4 h-4 text-primary" />
        </div>
        {!collapsed && (
          <div>
            <div className="text-sm font-bold text-foreground leading-none tracking-tight">Digital Observatory</div>
            <div className="text-2xs text-muted-foreground mt-0.5 tracking-widest uppercase">Elite Trader</div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 pt-4 space-y-0.5">
        {navItems.map(({ label, to, icon: Icon }) => {
          const isActive = to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);
          return (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={cn(
                "flex items-center gap-3 px-2.5 py-2 rounded text-sm font-medium transition-all duration-150",
                "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                collapsed && "justify-center px-0 w-10 mx-auto"
              )}
              activeClassName="bg-sidebar-accent text-primary border-l-2 border-primary pl-[calc(0.625rem-2px)]"
            >
              <Icon className="w-4 h-4 shrink-0" />
              {!collapsed && <span>{label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="px-2 pb-4 space-y-0.5 border-t border-sidebar-border pt-3 mt-3">
        {!collapsed && (
          <>
            <button className={cn(
              "flex items-center gap-3 px-2.5 py-2 rounded text-sm font-medium w-full",
              "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
            )}>
              <Settings className="w-4 h-4 shrink-0" />
              <span>Settings</span>
            </button>
            <button className={cn(
              "flex items-center gap-3 px-2.5 py-2 rounded text-sm font-medium w-full",
              "text-loss/70 hover:text-loss hover:bg-loss/10 transition-colors"
            )}>
              <LogOut className="w-4 h-4 shrink-0" />
              <span>Logout</span>
            </button>
          </>
        )}
        {collapsed && (
          <>
            <button className="flex items-center justify-center w-10 h-9 mx-auto rounded text-sidebar-foreground hover:bg-sidebar-accent transition-colors">
              <Settings className="w-4 h-4" />
            </button>
            <button className="flex items-center justify-center w-10 h-9 mx-auto rounded text-loss/70 hover:text-loss hover:bg-loss/10 transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {/* New Challenge CTA */}
      {!collapsed && (
        <div className="px-3 pb-4">
          <button className="w-full py-2 rounded bg-primary/10 border border-primary/30 text-primary text-sm font-semibold hover:bg-primary/20 transition-colors">
            + New Challenge
          </button>
        </div>
      )}
    </aside>
  );
}
