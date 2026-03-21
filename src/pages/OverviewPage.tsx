import { useState, useMemo } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import {
  TrendingUp, TrendingDown, Shield, Wallet, Activity, Users, Zap, Newspaper, ArrowUpRight,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchAnalyticsSummary, fetchEquityCurve, fetchAccounts, fetchTrades } from "@/lib/api";
import { mockRecentWins, mockNews } from "@/data/mockData";
import { cn } from "@/lib/utils";

const HEALTH_COLORS = ["#16c784", "#1e293b"];

const statusConfig = {
  ACTIVE:   { label: "ACTIVE",   cls: "badge-active" },
  AT_RISK:  { label: "AT RISK",  cls: "badge-risk" },
  BREACHED: { label: "BREACHED", cls: "badge-breached" },
};

function MetricCard({
  label, value, sub, icon: Icon, valueClass = "", delay = 0,
}: {
  label: string; value: string; sub?: string; icon: React.ElementType; valueClass?: string; delay?: number;
}) {
  return (
    <div
      className="card-surface rounded p-4 animate-fadeInUp"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="metric-label">{label}</span>
        <Icon className="w-4 h-4 text-muted-foreground" />
      </div>
      <div className={cn("text-2xl font-bold font-mono tabular tracking-tight", valueClass)}>
        {value}
      </div>
      {sub && <div className="text-xs text-muted-foreground mt-1">{sub}</div>}
    </div>
  );
}

function HealthGauge({ score }: { score: number }) {
  const data = [{ value: score }, { value: 100 - score }];
  return (
    <div className="relative flex flex-col items-center">
      <PieChart width={120} height={70}>
        <Pie
          data={data}
          cx={55}
          cy={65}
          startAngle={180}
          endAngle={0}
          innerRadius={42}
          outerRadius={58}
          paddingAngle={0}
          dataKey="value"
          strokeWidth={0}
        >
          <Cell fill="#16c784" />
          <Cell fill="hsl(224 18% 15%)" />
        </Pie>
      </PieChart>
      <div className="absolute bottom-0 text-center">
        <div className="text-2xl font-bold text-profit font-mono">{score}</div>
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="card-surface rounded p-2 text-xs border border-border-strong">
        <div className="text-muted-foreground mb-1">{label}</div>
        <div className="text-profit font-mono font-semibold">
          ${Number(payload[0]?.value).toLocaleString()}
        </div>
      </div>
    );
  }
  return null;
};

export default function OverviewPage() {
  const { data: metrics, isLoading: isMetricsLoading } = useQuery({ queryKey: ['analyticsSummary'], queryFn: fetchAnalyticsSummary });
  const { data: equityCurve } = useQuery({ queryKey: ['equityCurve'], queryFn: fetchEquityCurve });
  const { data: accounts } = useQuery({ queryKey: ['accounts'], queryFn: fetchAccounts });
  const { data: trades } = useQuery({ queryKey: ['trades'], queryFn: fetchTrades });
  const [timeRange, setTimeRange] = useState("ALL");

  const summary = metrics || {
    totalEquity: 0,
    totalPnl: 0,
    dailyPnl: 0,
    totalRisk: 0,
    activeAccounts: 0,
    equityChange: 0,
    dailyPnlPositions: 0,
    totalRiskPct: '0.00',
    globalHealthScore: 85
  };
  const curve = equityCurve || [];
  
  const filteredCurve = useMemo(() => {
    if (!curve.length) return [];
    if (timeRange === "ALL") return curve;

    const now = new Date();
    let cutoff = new Date(0);
    if (timeRange === "1W") cutoff = new Date(now.setDate(now.getDate() - 7));
    else if (timeRange === "1M") cutoff = new Date(now.setMonth(now.getMonth() - 1));
    else if (timeRange === "3M") cutoff = new Date(now.setMonth(now.getMonth() - 3));

    return curve.filter((point: any) => new Date(point.date) >= cutoff);
  }, [curve, timeRange]);

  const activeAccts = accounts || [];
  const recentWinsLists = trades?.filter((t: any) => t.pnl && t.pnl > 0).slice(0, 3) || mockRecentWins.slice(0, 0); // fallback to empty if no trades

  return (
    <div className="space-y-5">
      {/* Page heading */}
      <div className="animate-fadeInUp">
        <h1 className="text-2xl font-bold text-foreground">Performance Overview</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Aggregated equity curve across all prop firms
        </p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MetricCard
          label="Total Equity"
          value={`$${summary.totalEquity.toLocaleString()}`}
          sub={`↑ +${summary.equityChange}% from last week`}
          icon={Wallet}
          delay={0}
        />
        <MetricCard
          label="Daily P&L"
          value={`+$${summary.dailyPnl.toLocaleString()}`}
          sub={`Open positions: ${summary.dailyPnlPositions}`}
          icon={TrendingUp}
          valueClass="text-profit"
          delay={80}
        />
        <MetricCard
          label="Active Accounts"
          value={String(summary.activeAccounts).padStart(2, "0")}
          sub="08 Platforms"
          icon={Users}
          delay={160}
        />
        <MetricCard
          label="Total Risk"
          value={`$${summary.totalRisk.toLocaleString()}`}
          sub={`${summary.totalRiskPct}% of total equity`}
          icon={Shield}
          valueClass="text-loss"
          delay={240}
        />
      </div>

      {/* Main content: chart + account status */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Equity chart */}
        <div className="xl:col-span-2 card-surface rounded p-4 animate-fadeInUp delay-300">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="font-semibold text-foreground">Performance Overview</div>
              <div className="text-xs text-muted-foreground">Equity curve across all accounts</div>
            </div>
            <div className="flex gap-1">
              {["1W", "1M", "3M", "ALL"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeRange(t)}
                  className={cn(
                    "px-2.5 py-1 rounded text-xs font-medium transition-colors",
                    timeRange === t
                      ? "bg-primary/15 text-primary border border-primary/30"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={filteredCurve} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="equityGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#38bdf8" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 18% 14%)" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fill: "hsl(215 14% 45%)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "hsl(215 14% 45%)", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={v => `$${(v / 1000).toFixed(0)}k`}
                width={48}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="equity"
                stroke="#38bdf8"
                strokeWidth={2}
                fill="url(#equityGrad)"
                dot={false}
                activeDot={{ r: 4, fill: "#38bdf8", strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Account Status panel */}
        <div className="card-surface rounded p-4 animate-fadeInUp delay-400">
          <div className="font-semibold text-foreground mb-3">Account Status</div>
          <div className="space-y-2">
            {activeAccts.slice(0, 4).map(acct => {
              const cfg = statusConfig[acct.status as keyof typeof statusConfig] ?? statusConfig.ACTIVE;
              const pct = Math.round((acct.currentDrawdown / acct.totalDrawdown) * 100);
              return (
                <div key={acct.id} className="card-surface-2 rounded p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-7 h-7 rounded text-xs font-bold flex items-center justify-center"
                        style={{ background: `${acct.firmColor}22`, color: acct.firmColor, border: `1px solid ${acct.firmColor}44` }}
                      >
                        {acct.firmCode}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-foreground">{acct.firm}</div>
                        <div className="text-2xs text-muted-foreground">{acct.phase}</div>
                      </div>
                    </div>
                    <span className={cn("text-2xs font-bold px-1.5 py-0.5 rounded", cfg.cls)}>
                      {cfg.label}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-2xs text-muted-foreground mb-1">
                    <span>Drawdown Limit</span>
                    <span className="font-mono text-caution">
                      ${acct.currentDrawdown.toLocaleString()} / ${acct.totalDrawdown.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full h-1 rounded-full bg-surface-3">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${pct}%`,
                        background: acct.status === "BREACHED" ? "#e84c3d" : acct.status === "AT_RISK" ? "#f5a623" : "#16c784",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Recent Wins */}
        <div className="card-surface rounded p-4 animate-fadeInUp delay-400">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-profit" />
            <div className="font-semibold text-foreground text-sm">Recent Wins</div>
          </div>
          <div className="space-y-3">
            {recentWinsLists.length > 0 ? recentWinsLists.map((w: any, i: number) => (
              <div key={i} className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-foreground">{w.instrument || 'Trade'}</div>
                  <div className="text-2xs text-muted-foreground">Account #{w.accountId.substring(0, 4)}</div>
                </div>
                <div className="text-sm font-bold text-profit font-mono">+${Number(w.pnl).toLocaleString()}</div>
              </div>
            )) : <div className="text-xs text-muted-foreground p-2">No recent wins logged.</div>}
          </div>
        </div>

        {/* High Impact News */}
        <div className="card-surface rounded p-4 animate-fadeInUp delay-500">
          <div className="flex items-center gap-2 mb-3">
            <Newspaper className="w-4 h-4 text-caution" />
            <div className="font-semibold text-foreground text-sm">High Impact News</div>
          </div>
          <div className="space-y-3">
            {mockNews.map((n, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-8 h-8 rounded bg-loss/15 border border-loss/20 flex items-center justify-center shrink-0">
                  <Activity className="w-3.5 h-3.5 text-loss" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">{n.title}</div>
                  <div className="text-2xs text-muted-foreground">{n.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Global Health Score */}
        <div className="card-surface rounded p-4 animate-fadeInUp delay-500">
          <div className="metric-label mb-3">Global Health Score</div>
          <div className="flex flex-col items-center">
            <HealthGauge score={summary.globalHealthScore} />
            <div className="text-xs text-muted-foreground mt-3 text-center">
              Excellent risk management this session
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
