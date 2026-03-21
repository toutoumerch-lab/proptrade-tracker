import { PieChart, Pie, Cell } from "recharts";
import { Zap, AlertTriangle, Info, Mail, Bell, ShieldOff } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchAccounts, fetchTrades, fetchAlerts } from "@/lib/api";
import { cn } from "@/lib/utils";

interface GaugeProps {
  value: number;
  color: string;
  label: string;
  status: string;
  statusClass: string;
}

function GaugeChart({ value, color, label, status, statusClass }: GaugeProps) {
  const data = [{ v: value }, { v: 100 - value }];
  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <PieChart width={170} height={110}>
          <Pie
            data={data}
            cx={80}
            cy={100}
            startAngle={180}
            endAngle={0}
            innerRadius={55}
            outerRadius={80}
            paddingAngle={0}
            dataKey="v"
            strokeWidth={0}
          >
            <Cell fill={color} />
            <Cell fill="hsl(224 18% 15%)" />
          </Pie>
        </PieChart>
        <div className="absolute inset-0 flex items-end justify-center pb-2">
          <div className="text-center">
            <div className="text-3xl font-bold font-mono" style={{ color }}>{value}%</div>
            <div className="text-2xs text-muted-foreground uppercase tracking-widest">{label}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

const alertIconMap = {
  CRITICAL: AlertTriangle,
  INFO: Info,
};

export default function RiskPage() {
  const { data: accountsRaw } = useQuery({ queryKey: ["accounts"], queryFn: fetchAccounts });
  const { data: trades } = useQuery({ queryKey: ["trades"], queryFn: fetchTrades });
  const { data: dbAlerts } = useQuery({ queryKey: ["alerts"], queryFn: fetchAlerts });

  const accounts = accountsRaw || [];
  const allAlerts = dbAlerts || [];

  // 1. Global Metrics
  let totalCapitalAtRisk = 0;
  let totalDailyLossCounter = 0;
  let totalDailyLimit = 0;
  let totalDrawdown = 0;
  let totalDrawdownLimit = 0;
  
  let globalStatus = "SECURE";
  let badgeClass = "badge-active";
  let fontClass = "text-profit";
  
  accounts.forEach((acc: any) => {
    totalCapitalAtRisk += (acc.currentDrawdown || 0);
    totalDailyLossCounter += (acc.currentDailyLoss || 0);
    totalDailyLimit += (acc.dailyLimit || 0);
    totalDrawdown += (acc.currentDrawdown || 0);
    totalDrawdownLimit += (acc.totalDrawdownLimit || 0);
  });

  const avgGlobalDrawdown = totalDrawdownLimit > 0 ? (totalDrawdown / totalDrawdownLimit) * 100 : 0;
  if (avgGlobalDrawdown > 85) { globalStatus = "DANGER"; badgeClass = "badge-breached"; fontClass="text-loss"; }
  else if (avgGlobalDrawdown > 60) { globalStatus = "CAUTION"; badgeClass = "badge-risk"; fontClass="text-caution"; }

  const dailyPnlUtilization = totalDailyLimit > 0 ? Math.round((totalDailyLossCounter / totalDailyLimit) * 100) : 0;
  const maxTrailingDrawdown = totalDrawdownLimit > 0 ? Math.round((totalDrawdown / totalDrawdownLimit) * 100) : 0;

  // Asset Exposure logic
  const exposureMap: Record<string, number> = {};
  let totalLots = 0;
  (trades || []).forEach((t: any) => {
    if (t.outcome === "OPEN") {
      exposureMap[t.instrument] = (exposureMap[t.instrument] || 0) + (t.lots || 1);
      totalLots += (t.lots || 1);
    }
  });

  const assetExposure = Object.keys(exposureMap).map((k, i) => {
     const pct = totalLots > 0 ? Math.round((exposureMap[k] / totalLots) * 100) : 0;
     const colors = ["#16c784", "#38bdf8", "#f5a623"];
     return { asset: k, ticker: k, pct, color: colors[i % colors.length] };
  }).sort((a,b) => b.pct - a.pct).slice(0,3);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between animate-fadeInUp">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Risk Observatory</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Real-time surveillance of exposure and drawdown limits.
          </p>
        </div>
        <div className="flex gap-6 text-right">
          <div>
            <div className="metric-label">Global Status</div>
            <div className="flex items-center justify-end gap-1.5 mt-1">
              <span className={cn("w-2 h-2 rounded-full animate-pulseGlow", globalStatus === "SECURE" ? "bg-profit" : (globalStatus === "DANGER" ? "bg-loss" : "bg-caution"))} />
              <span className={cn("text-sm font-bold", fontClass)}>{globalStatus}</span>
            </div>
          </div>
          <div>
            <div className="metric-label">Total Capital at Risk</div>
            <div className="text-xl font-bold font-mono text-foreground">${totalCapitalAtRisk.toLocaleString("en-US", { minimumFractionDigits: 2 })}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Gauges */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Daily P&L Utilization */}
          <div className="card-surface rounded p-5 animate-fadeInUp delay-100">
            <div className="flex items-center justify-between mb-3">
              <div className="font-medium text-foreground">Daily P&L Utilization</div>
              <span className={cn("text-2xs font-bold px-2 py-0.5 rounded", dailyPnlUtilization > 80 ? "badge-breached" : "badge-active")}>
                {dailyPnlUtilization > 80 ? "LIMIT REACHED" : "HEALTHY"}
              </span>
            </div>
            <GaugeChart
              value={dailyPnlUtilization}
              color={dailyPnlUtilization > 80 ? "#f7665e" : "#16c784"}
              label="Utilized"
              status={dailyPnlUtilization > 80 ? "DANGER" : "HEALTHY"}
              statusClass={dailyPnlUtilization > 80 ? "text-loss" : "text-profit"}
            />
            <div className="mt-4 space-y-2 divider pt-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Current Loss Tracked</span>
                <span className="font-mono text-caution">${totalDailyLossCounter.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Hard Stop Limit</span>
                <span className="font-mono text-loss">${totalDailyLimit.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Max Trailing Drawdown */}
          <div className="card-surface rounded p-5 animate-fadeInUp delay-150">
            <div className="flex items-center justify-between mb-3">
              <div className="font-medium text-foreground">Max Trailing Drawdown</div>
              <span className={cn("text-2xs font-bold px-2 py-0.5 rounded", maxTrailingDrawdown > 80 ? "badge-breached" : (maxTrailingDrawdown > 60 ? "badge-risk" : "badge-active"))}>
                {maxTrailingDrawdown > 80 ? "DANGER" : (maxTrailingDrawdown > 60 ? "CAUTION" : "HEALTHY")}
              </span>
            </div>
            <GaugeChart
              value={maxTrailingDrawdown}
              color={maxTrailingDrawdown > 80 ? "#f7665e" : (maxTrailingDrawdown > 60 ? "#f5a623" : "#16c784")}
              label="Threshold"
              status={maxTrailingDrawdown > 80 ? "DANGER" : "CAUTION"}
              statusClass={maxTrailingDrawdown > 80 ? "text-loss" : "text-caution"}
            />
            <div className="mt-4 space-y-2 divider pt-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Current Drawdown</span>
                <span className="font-mono text-caution">${totalDrawdown.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Max Allowed</span>
                <span className="font-mono text-foreground">${totalDrawdownLimit.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Asset Exposure Mix */}
          <div className="card-surface rounded p-5 sm:col-span-2 animate-fadeInUp delay-250">
            <div className="flex items-center justify-between mb-4">
              <div className="font-semibold text-foreground">Open Asset Exposure Mix</div>
              <div className="flex gap-1.5">
                {assetExposure.map(t => (
                  <span key={t.asset} className="bg-surface-3 text-muted-foreground text-2xs px-2 py-0.5 rounded border border-border">
                    {t.asset}
                  </span>
                ))}
              </div>
            </div>
            {assetExposure.length > 0 ? (
              <div className="space-y-3">
                {assetExposure.map(item => (
                  <div key={item.ticker}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-foreground">{item.asset}</span>
                    <span className="text-xs font-semibold font-mono" style={{ color: item.color }}>
                      {item.pct}% Exposure
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-surface-3">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${item.pct}%`, background: item.color }}
                    />
                  </div>
                </div>
              ))}
              </div>
            ) : (
              <div className="p-8 text-center text-sm text-muted-foreground border-2 border-dashed border-border rounded">
                No active open trades exposing capital.
              </div>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Max Tradeable */}
          <div className="card-surface rounded p-4 animate-fadeInUp delay-200">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-3.5 h-3.5 text-primary" />
              <div className="text-xs font-bold text-primary uppercase tracking-wider">Account Active Status</div>
            </div>
            <div className="space-y-3">
              {accounts.map((acct: any) => {
                const statusColors = {
                  ACTIVE: { text: "text-profit" },
                  AT_RISK:   { text: "text-caution" },
                  BREACHED:    { text: "text-loss" },
                };
                const sc = statusColors[acct.status as keyof typeof statusColors] || statusColors.ACTIVE;
                return (
                  <div key={acct.id} className="flex items-center justify-between">
                    <div>
                      <div className="text-2xs text-muted-foreground">{acct.firmName} ({acct.firmCode})</div>
                      <div className={cn(
                        "text-lg font-bold font-mono",
                        acct.status === "BREACHED" ? "text-muted-foreground" : "text-foreground"
                      )}>
                        ${acct.balance.toLocaleString()}
                      </div>
                    </div>
                    <span className={cn("text-2xs font-bold uppercase tracking-wider", sc.text)}>
                      {acct.status}
                    </span>
                  </div>
                );
              })}
              {accounts.length === 0 && <div className="text-sm text-muted-foreground text-center">No accounts tracked.</div>}
            </div>
          </div>

          {/* Surveillance Alerts */}
          <div className="card-surface rounded p-4 animate-fadeInUp delay-250">
            <div className="font-semibold text-foreground mb-3">Surveillance Alerts</div>
            <div className="space-y-2">
              {[
                { icon: Mail, label: "Email Alerts", active: true },
                { icon: Bell, label: "In-App Notifications", active: true },
                { icon: ShieldOff, label: "Hard Stop Push", active: false },
              ].map(({ icon: Icon, label, active }) => (
                <div key={label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">{label}</span>
                  </div>
                  <button
                    className={cn(
                      "w-10 h-5 rounded-full relative transition-colors",
                      active ? "bg-profit" : "bg-surface-3"
                    )}
                  >
                    <span
                      className={cn(
                        "absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform",
                        active ? "translate-x-5" : "translate-x-0.5"
                      )}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Alert feed */}
          <div className="space-y-3 animate-fadeInUp delay-300 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
            {allAlerts.length > 0 ? allAlerts.map((a: any) => {
              const isCritical = a.type === "CRITICAL";
              return (
                <div
                  key={a.id}
                  className={cn(
                    "rounded p-4 border",
                    isCritical
                      ? "bg-loss/8 border-loss/25"
                      : "bg-info/8 border-info/20"
                  )}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    {isCritical
                      ? <AlertTriangle className="w-3.5 h-3.5 text-loss" />
                      : <Info className="w-3.5 h-3.5 text-info" />
                    }
                    <span className={cn(
                      "text-2xs font-bold uppercase tracking-wider",
                      isCritical ? "text-loss" : "text-info"
                    )}>
                      {a.title}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{a.message}</p>
                  <div className="text-2xs text-muted-foreground/60 mt-2">{new Date(a.createdAt).toLocaleString()}</div>
                </div>
              );
            }) : (
              <div className="text-sm text-muted-foreground text-center p-5 card-surface rounded border border-border">
                No active threats or risk deviations detected across your portfolios.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
