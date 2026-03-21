import { Bell, HelpCircle, PanelLeftClose, PanelLeftOpen, RefreshCw } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface TopHeaderProps {
  collapsed: boolean;
  onToggle: () => void;
  activeLabel: string;
  subLabel?: string;
}

export function TopHeader({ collapsed, onToggle, activeLabel, subLabel }: TopHeaderProps) {
  const { user } = useAuth();
  const userName = user?.name || "Trader";
  const userInitials = userName.substring(0, 2).toUpperCase();

  return (
    <header className="h-12 border-b border-border flex items-center justify-between px-4 bg-surface shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggle}
          className="w-7 h-7 rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        >
          {collapsed
            ? <PanelLeftOpen className="w-4 h-4" />
            : <PanelLeftClose className="w-4 h-4" />}
        </button>
        <div className="h-4 w-px bg-border" />
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-primary tracking-tight">{activeLabel}</span>
          {subLabel && (
            <>
              <span className="text-muted-foreground text-sm">·</span>
              <span className="text-sm text-muted-foreground">{subLabel}</span>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="w-7 h-7 rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
        <button className="w-7 h-7 rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors relative">
          <Bell className="w-3.5 h-3.5" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-loss" />
        </button>
        <button className="w-7 h-7 rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
          <HelpCircle className="w-3.5 h-3.5" />
        </button>
        <div className="h-4 w-px bg-border mx-1" />
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-2xs font-bold text-primary">
            {userInitials}
          </div>
          <div className="hidden sm:block">
            <div className="text-xs font-semibold text-foreground leading-none">{userName}</div>
            <div className="text-2xs text-muted-foreground mt-0.5">Switch Account</div>
          </div>
        </div>
        <button className="ml-2 px-3 py-1.5 rounded bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors">
          Execute Trade
        </button>
      </div>
    </header>
  );
}
