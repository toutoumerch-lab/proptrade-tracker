import { useState } from "react";
import { BookOpen, Upload, ChevronLeft, ChevronRight, Filter, Download, Lightbulb } from "lucide-react";
import { mockTrades, mockAccounts, strategyTags } from "@/data/mockData";
import { cn } from "@/lib/utils";

const instruments = ["XAUUSD", "EURUSD", "NAS100", "GBPUSD", "BTCUSD", "USDJPY", "EURJPY"];

export default function JournalPage() {
  const [form, setForm] = useState({
    instrument: "",
    direction: "LONG" as "LONG" | "SHORT",
    strategyTag: "",
    entry: "",
    exit: "",
    lots: "",
    pnl: "",
  });

  const winRate = Math.round(
    (mockTrades.filter(t => t.outcome === "WIN").length / mockTrades.length) * 100
  );
  const profitFactor = 2.41;

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between animate-fadeInUp">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Trade Journal</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Systematic logging of market interactions. Balance the quantitative data with qualitative strategy insights.
          </p>
        </div>
        <div className="flex gap-6 text-right">
          <div>
            <div className="metric-label">Win Rate</div>
            <div className="text-xl font-bold text-profit font-mono">{winRate}%</div>
          </div>
          <div>
            <div className="metric-label">Profit Factor</div>
            <div className="text-xl font-bold text-foreground font-mono">{profitFactor}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Manual Entry form */}
        <div className="lg:col-span-2 card-surface rounded p-5 animate-fadeInUp delay-100">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-7 h-7 rounded bg-primary/10 border border-primary/20 flex items-center justify-center">
              <BookOpen className="w-3.5 h-3.5 text-primary" />
            </div>
            <span className="font-semibold text-foreground">Manual Entry</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Instrument */}
            <div>
              <label className="metric-label block mb-1.5">Instrument</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. XAUUSD"
                  list="instruments-list"
                  value={form.instrument}
                  onChange={e => setForm(p => ({ ...p, instrument: e.target.value }))}
                  className="w-full bg-surface-2 border border-border rounded px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
                />
                <datalist id="instruments-list">
                  {instruments.map(i => <option key={i} value={i} />)}
                </datalist>
              </div>
            </div>

            {/* Direction */}
            <div>
              <label className="metric-label block mb-1.5">Direction</label>
              <div className="flex rounded overflow-hidden border border-border">
                {(["LONG", "SHORT"] as const).map(d => (
                  <button
                    key={d}
                    onClick={() => setForm(p => ({ ...p, direction: d }))}
                    className={cn(
                      "flex-1 py-2 text-sm font-semibold transition-colors",
                      form.direction === d
                        ? d === "LONG"
                          ? "bg-profit/20 text-profit"
                          : "bg-loss/20 text-loss"
                        : "bg-surface-2 text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Strategy Tag */}
            <div>
              <label className="metric-label block mb-1.5">Strategy Tag</label>
              <select
                value={form.strategyTag}
                onChange={e => setForm(p => ({ ...p, strategyTag: e.target.value }))}
                className="w-full bg-surface-2 border border-border rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors"
              >
                <option value="">Select tag...</option>
                {strategyTags.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            {/* Entry */}
            <div>
              <label className="metric-label block mb-1.5">Entry / Exit</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Entry"
                  value={form.entry}
                  onChange={e => setForm(p => ({ ...p, entry: e.target.value }))}
                  className="flex-1 bg-surface-2 border border-border rounded px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                />
                <input
                  type="number"
                  placeholder="Exit"
                  value={form.exit}
                  onChange={e => setForm(p => ({ ...p, exit: e.target.value }))}
                  className="flex-1 bg-surface-2 border border-border rounded px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>
            </div>

            {/* Position Size */}
            <div>
              <label className="metric-label block mb-1.5">Position Size</label>
              <input
                type="number"
                placeholder="Lots / Units"
                value={form.lots}
                onChange={e => setForm(p => ({ ...p, lots: e.target.value }))}
                className="w-full bg-surface-2 border border-border rounded px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>

            {/* Final P&L */}
            <div>
              <label className="metric-label block mb-1.5">Final P&L</label>
              <div className="flex items-center gap-0">
                <span className="px-3 py-2 bg-surface-3 border border-r-0 border-border rounded-l text-xs text-muted-foreground">+$</span>
                <input
                  type="number"
                  placeholder="0.00"
                  value={form.pnl}
                  onChange={e => setForm(p => ({ ...p, pnl: e.target.value }))}
                  className="flex-1 bg-surface-2 border border-border rounded-r px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-5">
            <button
              onClick={() => setForm({ instrument: "", direction: "LONG", strategyTag: "", entry: "", exit: "", lots: "", pnl: "" })}
              className="px-4 py-2 rounded border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              Clear Form
            </button>
            <button className="px-5 py-2 rounded bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">
              Log Trade Instance
            </button>
          </div>
        </div>

        {/* CSV Import + Pro Tip */}
        <div className="space-y-4">
          <div className="card-surface rounded p-5 animate-fadeInUp delay-150">
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold text-foreground">CSV Import</span>
              <div className="w-7 h-7 rounded border border-border flex items-center justify-center">
                <Upload className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Instantly sync your trading history from MetaTrader 4 or 5 terminals. Supports multiple accounts.
            </p>
            <div className="border-2 border-dashed border-border rounded p-5 flex flex-col items-center gap-2 hover:border-primary/30 transition-colors cursor-pointer group">
              <Upload className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
              <div className="text-xs text-center text-muted-foreground">
                <span className="font-medium text-foreground">Drop MT4/MT5 report here</span>
                <br />or click to browse files
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center">
                <div className="w-3 h-3 rounded-sm bg-primary/40" />
              </div>
              <span className="text-2xs text-muted-foreground uppercase tracking-widest">Verified Formats</span>
            </div>
          </div>

          <div className="card-surface rounded p-4 animate-fadeInUp delay-200">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-4 h-4 text-caution" />
              <span className="text-sm font-semibold text-foreground">Pro Tip</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Tagging your trades with strategies allows the Analytics engine to identify which setups have the best expectancy in current market conditions.
            </p>
          </div>
        </div>
      </div>

      {/* Recent Market Interactions table */}
      <div className="card-surface rounded animate-fadeInUp delay-300">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="font-semibold text-foreground">Recent Market Interactions</div>
          <div className="flex items-center gap-2">
            <button className="w-7 h-7 rounded border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
              <Filter className="w-3.5 h-3.5" />
            </button>
            <button className="w-7 h-7 rounded border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {["Instrument", "Direction", "Outcome", "Strategy Tag", "Entry / Exit", "Profit / Loss"].map(h => (
                  <th key={h} className="px-5 py-3 text-left metric-label whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockTrades.map((t, i) => (
                <tr key={t.id} className="border-b border-border last:border-0 table-row-hover transition-colors">
                  <td className="px-5 py-3">
                    <div className="font-semibold text-foreground">{t.instrument}</div>
                    <div className="text-2xs text-muted-foreground">{t.date}</div>
                  </td>
                  <td className="px-5 py-3">
                    <span className={cn(
                      "text-xs font-bold px-2 py-0.5 rounded",
                      t.direction === "LONG" ? "badge-active" : "badge-breached"
                    )}>
                      {t.direction}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className={cn(
                      "w-5 h-5 rounded-full flex items-center justify-center",
                      t.outcome === "WIN" ? "bg-profit/15" : "bg-loss/15"
                    )}>
                      <div className={cn("w-2 h-2 rounded-full", t.outcome === "WIN" ? "bg-profit" : "bg-loss")} />
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className="bg-surface-3 text-muted-foreground text-xs px-2 py-0.5 rounded">
                      {t.strategyTag}
                    </span>
                  </td>
                  <td className="px-5 py-3 font-mono text-xs text-muted-foreground">
                    <span className="text-foreground">{t.entry}</span>
                    <span className="mx-1">/</span>
                    <span>{t.exit}</span>
                  </td>
                  <td className="px-5 py-3 font-mono font-semibold">
                    <span className={t.pnl >= 0 ? "text-profit" : "text-loss"}>
                      {t.pnl >= 0 ? "+" : ""}${Math.abs(t.pnl).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-5 py-3 border-t border-border">
          <span className="text-xs text-muted-foreground">Displaying {mockTrades.length} of 154 entries</span>
          <div className="flex items-center gap-1">
            <button className="w-7 h-7 rounded border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="px-3 py-1 rounded border border-primary/30 bg-primary/10 text-primary text-xs font-medium">Page 1</span>
            <button className="w-7 h-7 rounded border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
