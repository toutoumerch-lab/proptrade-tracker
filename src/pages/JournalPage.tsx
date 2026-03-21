import { useState } from "react";
import Papa from "papaparse";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchTrades, fetchAccounts, createTrade, bulkCreateTrades } from "@/lib/api";
import { BookOpen, Upload, ChevronLeft, ChevronRight, Filter, Download, Lightbulb } from "lucide-react";
import { strategyTags } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const instruments = ["XAUUSD", "EURUSD", "NAS100", "GBPUSD", "BTCUSD", "USDJPY", "EURJPY"];

export default function JournalPage() {
  const queryClient = useQueryClient();
  const { data: accounts } = useQuery({ queryKey: ['accounts'], queryFn: fetchAccounts });
  const { data: trades } = useQuery({ queryKey: ['trades'], queryFn: fetchTrades });

  const [form, setForm] = useState({
    accountId: "",
    instrument: "",
    direction: "LONG" as "LONG" | "SHORT",
    strategyTag: "",
    session: "",
    entry: "",
    exit: "",
    lots: "",
    pnl: "",
  });

  const mutation = useMutation({
    mutationFn: createTrade,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trades"] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.invalidateQueries({ queryKey: ["analyticsSummary"] });
      queryClient.invalidateQueries({ queryKey: ["equityCurve"] });
      toast.success("Trade logged successfully");
      setForm(prev => ({ ...prev, instrument: "", entry: "", exit: "", lots: "", pnl: "" }));
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to log trade");
    }
  });

  const handleLogTrade = () => {
    if (!form.accountId || !form.instrument || !form.entry || !form.lots) {
      toast.error("Please fill in Account, Instrument, Entry, and Lots");
      return;
    }
    const pnlNum = form.pnl ? Number(form.pnl) : null;
    let outcome = "OPEN";
    if (pnlNum !== null) {
      outcome = pnlNum > 0 ? "WIN" : (pnlNum < 0 ? "LOSS" : "BREAK_EVEN");
    }

    mutation.mutate({
      ...form,
      entryPrice: form.entry,
      exitPrice: form.exit || undefined,
      pnl: form.pnl || undefined,
      outcome,
      closedAt: form.exit ? new Date().toISOString() : undefined
    });
  };

  const [importAccountId, setImportAccountId] = useState("");

  const bulkMutation = useMutation({
    mutationFn: bulkCreateTrades,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["trades"] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.invalidateQueries({ queryKey: ["analyticsSummary"] });
      queryClient.invalidateQueries({ queryKey: ["equityCurve"] });
      toast.success(`Successfully imported ${data.count} trades!`);
      setImportAccountId("");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to import trades");
    }
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!importAccountId) {
      toast.error("Please select a target account for the import");
      e.target.value = "";
      return;
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const mapped = results.data.map((row: any) => {
           const getField = (keys: string[]) => {
             const key = Object.keys(row).find(k => keys.includes(k.toLowerCase().trim()));
             return key ? row[key] : undefined;
           };

           const instrument = getField(['symbol', 'item', 'instrument', 'asset']) || 'Unknown';
           const pnlStr = getField(['profit', 'pnl', 'net', 'net pnl']);
           const pnl = pnlStr ? parseFloat(String(pnlStr).replace(/[^0-9.-]/g, '')) : 0;
           
           const entryStr = getField(['open', 'entry', 'price', 'entry price']);
           const exitStr = getField(['close', 'exit', 'exit price']);
           const typeStr = getField(['type', 'direction', 'side']);
           const sessionStr = getField(['session', 'time', 'trading session']);

           let direction = "LONG";
           if (typeStr && typeof typeStr === 'string' && (typeStr.toLowerCase().includes('sell') || typeStr.toLowerCase().includes('short'))) {
              direction = "SHORT";
           }

           return {
              accountId: importAccountId,
              instrument,
              direction,
              entryPrice: entryStr ? parseFloat(String(entryStr).replace(/[^0-9.-]/g, '')) : 0,
              exitPrice: exitStr ? parseFloat(String(exitStr).replace(/[^0-9.-]/g, '')) : null,
              lots: 1,
              pnl,
              outcome: pnl > 0 ? "WIN" : (pnl < 0 ? "LOSS" : "BREAK_EVEN"),
              strategyTag: "CSV Import",
              session: sessionStr || "Unknown",
              closedAt: new Date().toISOString()
           };
        });
        
        bulkMutation.mutate({ trades: mapped });
        e.target.value = "";
      },
      error: (error: any) => {
        toast.error("Error parsing CSV: " + error.message);
      }
    });
  };

  const [filterStrategy, setFilterStrategy] = useState("ALL");
  const [filterSession, setFilterSession] = useState("ALL");

  const unfilteredTrades = trades || [];
  const displayedTrades = unfilteredTrades.filter((t: any) => {
    if (filterStrategy !== "ALL" && t.strategyTag !== filterStrategy) return false;
    if (filterSession !== "ALL" && t.session !== filterSession) return false;
    return true;
  });

  const wins = displayedTrades.filter((t: any) => t.outcome === "WIN").length;
  const winRate = displayedTrades.length > 0 ? Math.round((wins / displayedTrades.length) * 100) : 0;
  
  let grossProfit = 0;
  let grossLoss = 0;
  displayedTrades.forEach((t: any) => {
    if (t.pnl > 0) grossProfit += t.pnl;
    if (t.pnl < 0) grossLoss += Math.abs(t.pnl);
  });
  const profitFactor = grossLoss > 0 ? (grossProfit / grossLoss).toFixed(2) : (grossProfit > 0 ? "∞" : "0.00");

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
            {/* Account */}
            <div>
              <label className="metric-label block mb-1.5">Account</label>
              <select
                value={form.accountId}
                onChange={e => setForm(p => ({ ...p, accountId: e.target.value }))}
                className="w-full bg-surface-2 border border-border rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors"
              >
                <option value="">Select account...</option>
                {accounts?.map((a: any) => <option key={a.id} value={a.id}>{a.firmName} ({a.firmCode})</option>)}
              </select>
            </div>

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
                <option value="ALL">Select session...</option>
                <option value="New York">New York</option>
                <option value="London">London</option>
                <option value="Asian">Asian</option>
                <option value="Sydney">Sydney</option>
                <option value="Overnight">Overnight</option>
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
              onClick={() => setForm({ accountId: "", instrument: "", direction: "LONG", strategyTag: "", session: "", entry: "", exit: "", lots: "", pnl: "" })}
              className="px-4 py-2 rounded border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              Clear Form
            </button>
            <button 
              onClick={handleLogTrade}
              disabled={mutation.isPending}
              className="px-5 py-2 rounded bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {mutation.isPending ? "Logging..." : "Log Trade Instance"}
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

            <div className="mb-4">
              <select
                value={importAccountId}
                onChange={e => setImportAccountId(e.target.value)}
                className="w-full bg-surface-2 border border-border rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors"
              >
                <option value="">Select target account...</option>
                {accounts?.map((a: any) => <option key={a.id} value={a.id}>{a.firmName} ({a.firmCode})</option>)}
              </select>
            </div>

            <label className={cn("border-2 border-dashed rounded p-5 flex flex-col items-center gap-2 transition-colors cursor-pointer group", bulkMutation.isPending ? "border-primary/50 opacity-50 cursor-not-allowed" : "border-border hover:border-primary/30")}>
              <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} disabled={bulkMutation.isPending} />
              <Upload className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
              <div className="text-xs text-center text-muted-foreground">
                <span className="font-medium text-foreground">{bulkMutation.isPending ? "Importing Data..." : "Drop MT4/MT5 report here"}</span>
                <br />{!bulkMutation.isPending && "or click to browse files"}
              </div>
            </label>
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
            <select
              value={filterStrategy}
              onChange={e => setFilterStrategy(e.target.value)}
              className="bg-surface-2 border border-border rounded px-2 py-1 text-xs text-foreground focus:outline-none focus:border-primary/50"
            >
              <option value="ALL">All Strategies</option>
              {strategyTags.map(t => <option key={t} value={t}>{t}</option>)}
              <option value="CSV Import">CSV Import</option>
            </select>
            <select
              value={filterSession}
              onChange={e => setFilterSession(e.target.value)}
              className="bg-surface-2 border border-border rounded px-2 py-1 text-xs text-foreground focus:outline-none focus:border-primary/50"
            >
              <option value="ALL">All Sessions</option>
              <option value="New York">New York</option>
              <option value="London">London</option>
              <option value="Asian">Asian</option>
              <option value="Sydney">Sydney</option>
              <option value="Overnight">Overnight</option>
            </select>
            <button className="w-7 h-7 ml-2 rounded border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {["Instrument", "Direction", "Outcome", "Strategy & Session", "Entry / Exit", "Profit / Loss"].map(h => (
                  <th key={h} className="px-5 py-3 text-left metric-label whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayedTrades.length > 0 ? displayedTrades.map((t: any) => (
                <tr key={t.id} className="border-b border-border last:border-0 table-row-hover transition-colors">
                  <td className="px-5 py-3">
                    <div className="font-semibold text-foreground">{t.instrument}</div>
                    <div className="text-2xs text-muted-foreground">{new Date(t.openedAt).toLocaleDateString()}</div>
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
                      t.outcome === "WIN" ? "bg-profit/15" : (t.outcome === "LOSS" ? "bg-loss/15" : "bg-caution/15")
                    )}>
                      <div className={cn("w-2 h-2 rounded-full", t.outcome === "WIN" ? "bg-profit" : (t.outcome === "LOSS" ? "bg-loss" : "bg-caution"))} />
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className="bg-surface-3 text-muted-foreground text-xs px-2 py-0.5 rounded block w-max mb-1">
                      {t.strategyTag || "Uncategorized"}
                    </span>
                    <span className="text-2xs text-muted-foreground font-semibold uppercase tracking-wider">
                      {t.session || "No Session"}
                    </span>
                  </td>
                  <td className="px-5 py-3 font-mono text-xs text-muted-foreground">
                    <span className="text-foreground">{t.entryPrice}</span>
                    <span className="mx-1">/</span>
                    <span>{t.exitPrice || "-"}</span>
                  </td>
                  <td className="px-5 py-3 font-mono font-semibold">
                    <span className={t.pnl && t.pnl > 0 ? "text-profit" : (t.pnl && t.pnl < 0 ? "text-loss" : "text-muted-foreground")}>
                      {t.pnl && t.pnl > 0 ? "+" : ""}{t.pnl ? "$" + Math.abs(t.pnl).toLocaleString("en-US", { minimumFractionDigits: 2 }) : "-"}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-muted-foreground text-sm">
                    No trades logged yet. Create one above!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-5 py-3 border-t border-border">
          <span className="text-xs text-muted-foreground">Displaying {displayedTrades.length} entries</span>
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
