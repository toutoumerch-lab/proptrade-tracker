import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { AppSidebar } from "./AppSidebar";
import { TopHeader } from "./TopHeader";

const routeMeta: Record<string, { label: string; sub?: string }> = {
  "/dashboard": { label: "Prop Dashboard", sub: "Overview" },
  "/accounts":  { label: "Prop Dashboard", sub: "Accounts" },
  "/journal":   { label: "Prop Dashboard", sub: "Journal" },
  "/risk":      { label: "Prop Dashboard", sub: "Risk" },
  "/analytics": { label: "Prop Dashboard", sub: "Analytics" },
};

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { token } = useAuth();

  useEffect(() => {
    // Also use localStorage directly in case context is slow to mount
    if (!token && !localStorage.getItem("proptrack_token")) {
      navigate('/auth');
    }
  }, [token, navigate]);

  const meta = routeMeta[location.pathname] ?? { label: "Prop Dashboard" };

  if (!token && !localStorage.getItem("proptrack_token")) return null;

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
