import { PieChart, Pie, Cell } from "recharts";
import { Zap, AlertTriangle, Info, Mail, Bell, ShieldOff } from "lucide-react";
import { mockRiskData } from "@/data/mockData";
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
  const { dailyPnlUtilization, maxTrailingDrawdown, dailyProfit, hardStopLimit, currentDrawdown, maxAllowed,
    maxTradeableAccounts, assetExposure, alerts } = mockRiskData;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between animate-fadeInUp">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Risk Observatory</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Real-time surveillance of exposure and drawdown limits. Monitor your safety margins with high-precision telemetry.
          </p>
        </div>
        <div className="flex gap-6 text-right">
          <div>
            <div className="metric-label">Global Status</div>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-2 h-2 rounded-full bg-profit animate-pulseGlow" />
              <span className="text-sm font-bold text-profit">SECURE</span>
            </div>
          </div>
          <div>
            <div className="metric-label">Total Capital at Risk</div>
            <div className="text-xl font-bold font-mono text-foreground">$12,450.00</div>
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
              <span className="badge-active text-2xs font-bold px-2 py-0.5 rounded">HEALTHY</span>
            </div>
            <GaugeChart
              value={dailyPnlUtilization}
              color="#16c784"
              label="Utilized"
              status="HEALTHY"
              statusClass="text-profit"
            />
            <div className="mt-4 space-y-2 divider pt-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Daily Profit/Loss</span>
                <span className="font-mono text-profit">+${dailyProfit.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Hard Stop Limit</span>
                <span className="font-mono text-loss">${hardStopLimit.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Max Trailing Drawdown */}
          <div className="card-surface rounded p-5 animate-fadeInUp delay-150">
            <div className="flex items-center justify-between mb-3">
              <div className="font-medium text-foreground">Max Trailing Drawdown</div>
              <span className="badge-risk text-2xs font-bold px-2 py-0.5 rounded">CAUTION</span>
            </div>
            <GaugeChart
              value={maxTrailingDrawdown}
              color="#f5a623"
              label="Threshold"
              status="CAUTION"
              statusClass="text-caution"
            />
            <div className="mt-4 space-y-2 divider pt-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Current Drawdown</span>
                <span className="font-mono text-caution">${currentDrawdown.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Max Allowed</span>
                <span className="font-mono text-foreground">${maxAllowed.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Asset Exposure Mix */}
          <div className="card-surface rounded p-5 sm:col-span-2 animate-fadeInUp delay-250">
            <div className="flex items-center justify-between mb-4">
              <div className="font-semibold text-foreground">Asset Exposure Mix</div>
              <div className="flex gap-1.5">
                {["XAUUSD", "EURUSD", "NAS100"].map(t => (
                  <span key={t} className="bg-surface-3 text-muted-foreground text-2xs px-2 py-0.5 rounded border border-border">
                    {t}
                  </span>
                ))}
              </div>
            </div>
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
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Max Tradeable */}
          <div className="card-surface rounded p-4 animate-fadeInUp delay-200">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-3.5 h-3.5 text-primary" />
              <div className="text-xs font-bold text-primary uppercase tracking-wider">Max Tradeable Today</div>
            </div>
            <div className="space-y-3">
              {maxTradeableAccounts.map(acct => {
                const statusColors = {
                  AVAILABLE: { dot: "bg-profit", text: "text-profit" },
                  LIMITED:   { dot: "bg-caution", text: "text-caution" },
                  LOCKED:    { dot: "bg-muted-foreground", text: "text-muted-foreground" },
                };
                const sc = statusColors[acct.status as keyof typeof statusColors];
                return (
                  <div key={acct.name} className="flex items-center justify-between">
                    <div>
                      <div className="text-2xs text-muted-foreground">{acct.name}</div>
                      <div className={cn(
                        "text-lg font-bold font-mono",
                        acct.lots === 0 ? "text-muted-foreground" : "text-foreground"
                      )}>
                        {acct.lots} Lots
                      </div>
                    </div>
                    <span className={cn("text-2xs font-bold uppercase tracking-wider", sc.text)}>
                      {acct.status}
                    </span>
                  </div>
                );
              })}
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
          <div className="space-y-3 animate-fadeInUp delay-300">
            {alerts.map((a, i) => {
              const isCritical = a.type === "CRITICAL";
              return (
                <div
                  key={i}
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
                  <div className="text-2xs text-muted-foreground/60 mt-2">{a.time}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
