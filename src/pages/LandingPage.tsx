import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, BarChart3, ShieldCheck, BookOpen, Activity, Target, Zap, Check } from "lucide-react";

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.1 } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-[#0B1220] text-zinc-300 font-sans selection:bg-blue-500/30 overflow-x-hidden">
      
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#0B1220]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-white font-bold">P</div>
            <span className="text-white font-bold text-xl tracking-tight">PropTrack</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/auth" className="text-sm font-medium hover:text-white transition-colors">Sign In</Link>
            <Link to="/auth" className="text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-full transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)]">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-sm font-medium mb-6"
          >
            <Zap className="w-4 h-4" />
            <span>The #1 Prop Firm Tracker</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold text-white tracking-tight max-w-4xl leading-tight mb-6"
          >
            Track All Your Prop Firm Accounts <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">in One Place</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-zinc-400 max-w-2xl mb-10"
          >
            Stop using Excel. Monitor P&L, risk, and performance across all accounts in real time. Never hit a daily drawdown limit by surprise again.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <Link to="/auth" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-full font-semibold transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)]">
              Get Started Free <ArrowRight className="w-5 h-5" />
            </Link>
            <button className="flex items-center gap-2 px-8 py-4 rounded-full font-semibold border border-white/10 hover:bg-white/5 transition-colors">
              View Demo
            </button>
          </motion.div>

          {/* Abstract Dashboard Graphic */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="w-full max-w-5xl mt-20 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220] via-transparent to-transparent z-10" />
            <div className="relative rounded-2xl border border-white/10 bg-[#111827] shadow-xl overflow-hidden p-6">
              <div className="flex items-center gap-4 mb-8">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="h-4 w-48 bg-white/5 rounded-full" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
                <div className="h-24 rounded-xl bg-white/5 border border-white/5 p-4 flex flex-col justify-between">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20" />
                  <div className="h-4 w-24 bg-white/10 rounded" />
                </div>
                <div className="h-24 rounded-xl bg-green-500/5 border border-green-500/20 p-4 flex flex-col justify-between shadow-[0_0_15px_rgba(34,197,94,0.1)]">
                  <div className="w-8 h-8 rounded-full bg-green-500/20" />
                  <div className="h-4 w-32 bg-green-500/40 rounded" />
                </div>
                <div className="h-24 rounded-xl bg-red-500/5 border border-red-500/20 p-4 flex flex-col justify-between">
                  <div className="w-8 h-8 rounded-full bg-red-500/20" />
                  <div className="h-4 w-20 bg-red-500/40 rounded" />
                </div>
              </div>
              <div className="h-64 rounded-xl bg-white/5 border border-white/5" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 relative z-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 px-4">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Everything you need to scale</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">Stop guessing your numbers. PropTrack gives you institutional-grade analytics for retail traders.</p>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[
              { icon: Target, title: "Multi-account tracking", desc: "Aggregate 10+ prop firm accounts in one unified dashboard view.", color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-500/20" },
              { icon: ShieldCheck, title: "Drawdown alerts", desc: "Get SMS or email alerts when you're 1% away from your daily loss limit.", color: "text-red-400", bg: "bg-red-400/10", border: "border-red-500/20" },
              { icon: BookOpen, title: "Trade journal + CSV", desc: "Automatically import trades via CSV or let our webhook sync them.", color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-500/20" },
              { icon: BarChart3, title: "Advanced analytics", desc: "View win rate, expectancy, session volume, and strategy performance.", color: "text-purple-400", bg: "bg-purple-400/10", border: "border-purple-500/20" },
              { icon: Activity, title: "Risk dashboard", desc: "Visualize aggregated risk exposure across correlating assets.", color: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-500/20" },
              { icon: Zap, title: "Performance insights", desc: "AI-driven tips showing which pairs and times are most profitable.", color: "text-cyan-400", bg: "bg-cyan-400/10", border: "border-cyan-500/20" },
            ].map((f, i) => (
              <motion.div key={i} variants={itemVariants} className="p-6 rounded-2xl bg-[#111827] border border-white/5 hover:border-white/20 transition-all hover:-translate-y-1">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${f.bg} ${f.color} border ${f.border}`}>
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{f.title}</h3>
                <p className="text-zinc-400 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-6 bg-gradient-to-b from-transparent to-[#0B1220] relative border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">How it works</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">Three simple steps to professional trading metrics.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Connect Accounts", desc: "Link your FTMO, Apex, Topstep or manual accounts securely." },
              { step: "02", title: "Log Trades", desc: "Trades sync automatically or upload your platform's CSV file." },
              { step: "03", title: "Track & Scale", desc: "Monitor your aggregated equity curve and secure funding smoothly." }
            ].map((s, i) => (
              <div key={i} className="relative p-8 rounded-2xl bg-[#111827] border border-white/5 overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 text-6xl font-bold text-white/5 group-hover:text-blue-500/10 transition-colors pointer-events-none">
                  {s.step}
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 mt-8 relative z-10">{s.title}</h3>
                <p className="text-zinc-400 relative z-10">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Simple, transparent pricing</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">Start for free. Upgrade when you secure funding.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free */}
            <div className="p-8 rounded-3xl bg-[#111827] border border-white/5">
              <h3 className="text-xl font-bold text-white mb-2">Hobby</h3>
              <div className="text-4xl font-bold text-white mb-6">$0<span className="text-lg text-zinc-500 font-normal">/mo</span></div>
              <ul className="space-y-4 mb-8">
                {["Up to 2 accounts", "Basic journaling", "Weekly analytics sync"].map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-zinc-300">
                    <Check className="w-5 h-5 text-blue-500" /> {f}
                  </li>
                ))}
              </ul>
              <Link to="/auth" className="block w-full text-center py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-colors font-semibold">Start Free</Link>
            </div>
            {/* Pro */}
            <div className="p-8 rounded-3xl bg-[#111827] border border-blue-500/50 shadow-[0_0_30px_rgba(37,99,235,0.15)] relative transform md:-translate-y-4">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-bold tracking-wide">MOST POPULAR</div>
              <h3 className="text-xl font-bold text-white mb-2">Pro Trader</h3>
              <div className="text-4xl font-bold text-white mb-6">$29<span className="text-lg text-blue-300 font-normal">/mo</span></div>
              <ul className="space-y-4 mb-8">
                {["Up to 10 accounts", "Real-time sync", "Drawdown SMS alerts", "Strategy tagging"].map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-zinc-100">
                    <Check className="w-5 h-5 text-green-500" /> {f}
                  </li>
                ))}
              </ul>
              <Link to="/auth" className="block w-full text-center py-3 rounded-xl bg-blue-600 hover:bg-blue-500 transition-colors font-semibold text-white shadow-[0_0_15px_rgba(37,99,235,0.3)]">Upgrade to Pro</Link>
            </div>
            {/* Elite */}
            <div className="p-8 rounded-3xl bg-[#111827] border border-white/5">
              <h3 className="text-xl font-bold text-white mb-2">Elite</h3>
              <div className="text-4xl font-bold text-white mb-6">$99<span className="text-lg text-zinc-500 font-normal">/mo</span></div>
              <ul className="space-y-4 mb-8">
                {["Unlimited accounts", "API Access", "Custom risk presets", "1-on-1 onboarding"].map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-zinc-300">
                    <Check className="w-5 h-5 text-blue-500" /> {f}
                  </li>
                ))}
              </ul>
              <Link to="/auth" className="block w-full text-center py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-colors font-semibold">Contact Sales</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-600/10 blur-[100px] pointer-events-none" />
        <div className="max-w-4xl mx-auto bg-[#111827] border border-blue-500/20 rounded-3xl p-12 text-center relative z-10 shadow-2xl">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Start tracking your trades like a pro</h2>
          <p className="text-zinc-400 max-w-2xl mx-auto mb-8 text-lg">Join thousands of funded traders who trust PropTrack to manage their risk and scaling strategy.</p>
          <Link to="/auth" className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full font-bold hover:scale-105 transition-transform">
            Create Free Account <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-zinc-500">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-blue-500 flex items-center justify-center text-white font-bold text-xs">P</div>
            <span className="font-semibold text-white/80">PropTrack</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">Discord</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
          </div>
          <div>© 2026 PropTrack. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
