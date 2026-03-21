import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { Download, TrendingUp, TrendingDown, ArrowUpRight, MoreVertical } from "lucide-react";
import { mockSessionVolume, mockPropFirmMatrix } from "@/data/mockData";
import { cn } from "@/lib/utils";

const metricCards = [
  {
    label: "Profit Factor",
    value: "2.84",
    sub: "Institutional Grade",
    subClass: "text-profit",
    border: "border-l-profit",
    note: null,
  },
  {
    label: "Win Rate",
    value: "64.2%",
    sub: "+4.1%",
    subClass: "text-profit",
    border: "border-l-caution",
    bars: [true, true, true, true, false, false, false],
  },
  {
    label: "Avg R:R Ratio",
    value: "1:3.2",
    sub: "Target 1:4.0",
    subClass: "text-caution",
    border: "border-l-primary",
    note: "Optimizing Exit Strategy Recommended",
  },
  {
    label: "Max Drawdown",
    value: "3.18%",
    sub: "Soft Cap: 5%",
    subClass: "text-loss",
    border: "border-l-loss",
    note: "Daily Limit Remaining $4,820.00",
  },
];

const statusBadgeMap: Record<string, string> = {
  HIGH_YIELD:     "badge-active",
  SCALING_READY:  "badge-risk",
  MONITORING:     "bg-surface-3 text-muted-foreground border border-border",
};

const statusLabelMap: Record<string, string> = {
  HIGH_YIELD:    "HIGH YIELD",
  SCALING_READY: "SCALING READY",
  MONITORING:    "MONITORING",
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="card-surface rounded p-2 text-xs border border-border-strong">
        <div className="text-muted-foreground mb-1">{label}</div>
        {payload.map((p: any) => (
          <div key={p.name} className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: p.fill }} />
            <span style={{ color: p.fill }}>{p.name}: {p.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function AnalyticsPage() {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between animate-fadeInUp">
        <div>
          <h1 className="text-2xl font-bold">
            Performance{" "}
            <span className="text-primary">Intelligence</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Detailed algorithmic performance audit across all funding providers.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-2 rounded border border-border text-sm text-foreground hover:bg-accent transition-colors">
            <Download className="w-3.5 h-3.5" />
            Export PDF Report
          </button>
          <div className="flex gap-1">
            {["Last 30D", "Last 90D", "All Time"].map((t, i) => (
              <button
                key={t}
                className={cn(
                  "px-2.5 py-1.5 rounded text-xs font-medium transition-colors",
                  i === 0
                    ? "bg-primary/15 text-primary border border-primary/30"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {metricCards.map(({ label, value, sub, subClass, border, bars, note }, i) => (
          <div
            key={label}
            className={cn("card-surface rounded p-4 border-l-2 animate-fadeInUp", border)}
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="metric-label mb-2">{label}</div>
            <div className="text-3xl font-bold font-mono text-foreground tracking-tight">{value}</div>
            {bars && (
              <div className="flex gap-1 mt-2">
                {bars.map((filled, j) => (
                  <div
                    key={j}
                    className="h-1.5 w-5 rounded-sm"
                    style={{ background: filled ? "#16c784" : "hsl(224 18% 20%)" }}
                  />
                ))}
              </div>
            )}
            <div className={cn("text-xs mt-1.5 font-medium", subClass)}>{sub}</div>
            {note && <div className="text-2xs text-caution mt-1 flex items-center gap-1">
              <TrendingUp className="w-2.5 h-2.5" />{note}
            </div>}
          </div>
        ))}
      </div>

      {/* Session Volume + Best/Worst */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
        <div className="xl:col-span-3 card-surface rounded p-5 animate-fadeInUp delay-300">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="font-semibold text-foreground">Session Volume & Edge Analysis</div>
            </div>
            <div className="flex items-center gap-3 text-xs">
              {[
                { label: "London",   color: "#16c784" },
                { label: "New York", color: "#38bdf8" },
                { label: "Asian",    color: "#f5a623" },
              ].map(s => (
                <div key={s.label} className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                  <span className="text-muted-foreground">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={mockSessionVolume} margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 18% 14%)" vertical={false} />
              <XAxis dataKey="time" tick={{ fill: "hsl(215 14% 45%)", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "hsl(215 14% 45%)", fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="london"  name="London"   fill="#16c784" radius={[2,2,0,0]} maxBarSize={18} />
              <Bar dataKey="newYork" name="New York"  fill="#38bdf8" radius={[2,2,0,0]} maxBarSize={18} />
              <Bar dataKey="asian"   name="Asian"    fill="#f5a623" radius={[2,2,0,0]} maxBarSize={18} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-4">
          <div className="card-surface rounded p-4 animate-fadeInUp delay-350">
            <div className="metric-label mb-2">Best Performer</div>
            <div className="text-2xl font-bold text-foreground font-mono">XAUUSD</div>
            <div className="text-profit text-sm font-semibold mt-1">+$42,105.00 PnL</div>
            <div className="mt-3 w-10 h-10 rounded bg-profit/10 border border-profit/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-profit" />
            </div>
          </div>
          <div className="card-surface rounded p-4 animate-fadeInUp delay-400">
            <div className="metric-label mb-2">Worst Performer</div>
            <div className="text-2xl font-bold text-foreground font-mono">EURJPY</div>
            <div className="text-loss text-sm font-semibold mt-1">-$8,420.00 PnL</div>
            <div className="mt-3 w-10 h-10 rounded bg-loss/10 border border-loss/20 flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-loss" />
            </div>
          </div>
        </div>
      </div>

      {/* Prop Firm Comparison Matrix */}
      <div className="card-surface rounded animate-fadeInUp delay-400">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div>
            <div className="font-semibold text-foreground">Prop Firm Comparison Matrix</div>
            <div className="text-xs text-muted-foreground mt-0.5">
              Relative performance and profitability across active allocations.
            </div>
          </div>
          <button className="text-xs text-primary hover:underline flex items-center gap-1">
            View Detailed Audit <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {["Funding Provider", "Total PnL", "Payout Frequency", "Slippage Avg", "Status", "Action"].map(h => (
                  <th key={h} className="px-5 py-3 text-left metric-label">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockPropFirmMatrix.map((firm, i) => (
                <tr key={firm.code} className="border-b border-border last:border-0 table-row-hover transition-colors"
                  style={{ animationDelay: `${i * 80 + 500}ms` }}
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded text-xs font-bold flex items-center justify-center shrink-0"
                        style={{ background: `${firm.color}22`, color: firm.color, border: `1px solid ${firm.color}44` }}
                      >
                        {firm.code}
                      </div>
                      <span className="font-semibold text-foreground">{firm.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 font-mono font-semibold">
                    <span className={firm.totalPnl >= 0 ? "text-profit" : "text-loss"}>
                      {firm.totalPnl >= 0 ? "+" : ""}${Math.abs(firm.totalPnl).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">{firm.payoutFreq}</td>
                  <td className="px-5 py-4 font-mono text-muted-foreground">{firm.slippageAvg} pips</td>
                  <td className="px-5 py-4">
                    <span className={cn(
                      "text-2xs font-bold px-2 py-0.5 rounded",
                      statusBadgeMap[firm.status] ?? "bg-surface-3 text-muted-foreground"
                    )}>
                      {statusLabelMap[firm.status] ?? firm.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <button className="w-7 h-7 rounded border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                      <MoreVertical className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
