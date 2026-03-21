import { useState } from "react";
import { useLocation } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { TopHeader } from "./TopHeader";

const routeMeta: Record<string, { label: string; sub?: string }> = {
  "/":          { label: "Prop Dashboard", sub: "Overview" },
  "/accounts":  { label: "Prop Dashboard", sub: "Accounts" },
  "/journal":   { label: "Prop Dashboard", sub: "Journal" },
  "/risk":      { label: "Prop Dashboard", sub: "Risk" },
  "/analytics": { label: "Prop Dashboard", sub: "Analytics" },
};

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const meta = routeMeta[location.pathname] ?? { label: "Prop Dashboard" };

  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar collapsed={collapsed} />
      <div className="flex-1 flex flex-col min-w-0">
        <TopHeader
          collapsed={collapsed}
          onToggle={() => setCollapsed(c => !c)}
          activeLabel={meta.label}
          subLabel={meta.sub}
        />
        <main className="flex-1 overflow-auto p-5">
          {children}
        </main>
      </div>
    </div>
  );
}
