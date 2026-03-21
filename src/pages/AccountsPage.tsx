import { CheckCircle2, AlertTriangle, XCircle, TrendingUp, Plus, Download, Copy } from "lucide-react";
import { mockAccounts } from "@/data/mockData";
import { cn } from "@/lib/utils";

const statusConfig = {
  ACTIVE:   { label: "ACTIVE",   icon: CheckCircle2, cls: "badge-active",   iconClass: "text-profit" },
  AT_RISK:  { label: "AT RISK",  icon: AlertTriangle, cls: "badge-risk",    iconClass: "text-caution" },
  BREACHED: { label: "BREACHED", icon: XCircle,       cls: "badge-breached", iconClass: "text-loss" },
};

export default function AccountsPage() {
  const totalBuyingPower = mockAccounts.reduce((s, a) => s + a.balance, 0);
  const totalProfit = 24102;
  const avgDrawdown = 1.4;
  const funded = mockAccounts.filter(a => a.status === "ACTIVE").length;

  return (
    <div className="space-y-5">
      <div className="animate-fadeInUp">
        <h1 className="text-2xl font-bold text-foreground">Account Manager</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Orchestrate your capital allocation across multiple prop firms from a single high-fidelity terminal.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Buying Power card */}
        <div className="card-surface rounded p-5 animate-fadeInUp delay-100">
          <div className="metric-label mb-2">Total Buying Power</div>
          <div className="text-3xl font-bold font-mono text-foreground tracking-tight">
            ${totalBuyingPower.toLocaleString()}
          </div>
          <div className="flex items-center gap-1 mt-1">
            <TrendingUp className="w-3.5 h-3.5 text-profit" />
            <span className="text-xs text-profit font-medium">+12%</span>
          </div>
        </div>
        <div className="card-surface rounded p-5 animate-fadeInUp delay-150">
          <div className="metric-label mb-2">Total Profit</div>
          <div className="text-3xl font-bold font-mono text-profit tracking-tight">
            +${totalProfit.toLocaleString()}
          </div>
        </div>
        <div className="card-surface rounded p-5 animate-fadeInUp delay-200">
          <div className="metric-label mb-2">Avg Drawdown</div>
          <div className="text-3xl font-bold font-mono text-caution tracking-tight">
            {avgDrawdown}%
          </div>
        </div>
      </div>

      {/* Active Portfolios table */}
      <div className="card-surface rounded animate-fadeInUp delay-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div>
            <div className="font-semibold text-foreground">Active Portfolios</div>
          </div>
          <div className="flex items-center gap-2">
            <span className="badge-active text-2xs font-bold px-2 py-0.5 rounded">{funded} FUNDED</span>
            <span className="badge-risk text-2xs font-bold px-2 py-0.5 rounded">
              {mockAccounts.filter(a => a.status !== "ACTIVE").length} CHALLENGES
            </span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {["Firm & Phase", "Balance", "Daily Limit", "Total Drawdown", "Target", "Status"].map(h => (
                  <th key={h} className="px-5 py-3 text-left metric-label">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockAccounts.map((acct, i) => {
                const cfg = statusConfig[acct.status as keyof typeof statusConfig];
                const drawPct = (acct.currentDrawdown / acct.totalDrawdown) * 100;
                return (
                  <tr
                    key={acct.id}
                    className="border-b border-border table-row-hover transition-colors"
                    style={{ animationDelay: `${i * 60 + 300}ms` }}
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded text-xs font-bold flex items-center justify-center shrink-0"
                          style={{ background: `${acct.firmColor}22`, color: acct.firmColor, border: `1px solid ${acct.firmColor}44` }}
                        >
                          {acct.firmCode}
                        </div>
                        <div>
                          <div className="font-semibold text-foreground">{acct.firm}</div>
                          <div className="text-2xs text-muted-foreground">{acct.phase}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 font-mono text-foreground">${acct.balance.toLocaleString()}</td>
                    <td className="px-5 py-3 font-mono text-loss">${acct.dailyLimit.toLocaleString()}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1 rounded-full bg-surface-3 w-20">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${drawPct}%`,
                              background: acct.status === "BREACHED" ? "#e84c3d" : acct.status === "AT_RISK" ? "#f5a623" : "#16c784",
                            }}
                          />
                        </div>
                        <span className="font-mono text-xs text-muted-foreground">${acct.totalDrawdown.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 font-mono text-profit">${acct.target.toLocaleString()}</td>
                    <td className="px-5 py-3">
                      <span className={cn("text-2xs font-bold px-2 py-0.5 rounded inline-flex items-center gap-1", cfg.cls)}>
                        <cfg.icon className={cn("w-3 h-3", cfg.iconClass)} />
                        {cfg.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fadeInUp delay-300">
        {[
          {
            icon: Plus,
            title: "New Challenge",
            desc: "Import credentials for a new prop firm challenge.",
            action: "Launch Wizard",
            color: "#38bdf8",
          },
          {
            icon: Download,
            title: "Request Payout",
            desc: "Ready to withdraw profits from funded accounts.",
            action: "Withdraw Funds",
            color: "#16c784",
          },
          {
            icon: Copy,
            title: "Copy Trading",
            desc: "Synchronize trades across all active challenges.",
            action: "Configure Link",
            color: "#f5a623",
          },
        ].map(({ icon: Icon, title, desc, action, color }) => (
          <div key={title} className="card-surface rounded p-5 flex flex-col items-center text-center gap-3">
            <div
              className="w-12 h-12 rounded flex items-center justify-center"
              style={{ background: `${color}18`, border: `1px solid ${color}33` }}
            >
              <Icon className="w-5 h-5" style={{ color }} />
            </div>
            <div>
              <div className="font-semibold text-foreground text-sm">{title}</div>
              <div className="text-xs text-muted-foreground mt-1">{desc}</div>
            </div>
            <button className="w-full py-2 rounded border border-border text-sm text-foreground hover:bg-accent transition-colors">
              {action}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
