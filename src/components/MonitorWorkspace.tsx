import { Activity, TrendingUp, TrendingDown, Minus, Clock } from "lucide-react";
import { motion } from "framer-motion";

type SignalDirection = "confirming" | "neutral" | "disconfirming";

interface Signal {
  label: string;
  value: string;
  direction: SignalDirection;
  timestamp: string;
}

const signals: Signal[] = [
  { label: "Transformer Lead Times", value: "3.5 years", direction: "confirming", timestamp: "2026-03-10" },
  { label: "Grid Interconnection Queue", value: "2,600 GW backlog", direction: "confirming", timestamp: "2026-03-08" },
  { label: "Utility Capex Guidance", value: "+52% YoY avg", direction: "confirming", timestamp: "2026-03-05" },
  { label: "Natural Gas Prices", value: "$3.20/MMBtu", direction: "neutral", timestamp: "2026-03-12" },
  { label: "AI Chip Efficiency Gains", value: "15% improvement", direction: "neutral", timestamp: "2026-02-28" },
  { label: "Nuclear Permit Fast-Track", value: "No policy change", direction: "confirming", timestamp: "2026-03-01" },
  { label: "Data Center Demand Growth", value: "+38% YoY", direction: "confirming", timestamp: "2026-03-11" },
  { label: "Battery Storage Costs", value: "-8% YoY", direction: "neutral", timestamp: "2026-03-07" },
];

const directionConfig = {
  confirming: { icon: TrendingUp, color: "text-evidence-green", bg: "bg-evidence-green/10", label: "Confirming" },
  neutral: { icon: Minus, color: "text-bottleneck-amber", bg: "bg-bottleneck-amber/10", label: "Neutral" },
  disconfirming: { icon: TrendingDown, color: "text-thesis-breaker", bg: "bg-thesis-breaker/10", label: "Disconfirming" },
};

const MonitorWorkspace = () => {
  const confirming = signals.filter((s) => s.direction === "confirming").length;
  const neutral = signals.filter((s) => s.direction === "neutral").length;
  const disconfirming = signals.filter((s) => s.direction === "disconfirming").length;

  return (
    <main className="flex-1 h-screen overflow-y-auto p-6 space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Activity className="w-4 h-4 text-primary" />
          <span className="data-label">Thesis Monitor</span>
        </div>
        <h1 className="font-display text-2xl font-bold text-foreground">
          Signal Tracking
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Track confirming and disconfirming signals to maintain or update the bottleneck thesis.
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Confirming", count: confirming, color: "text-evidence-green", border: "border-evidence-green/30" },
          { label: "Neutral", count: neutral, color: "text-bottleneck-amber", border: "border-bottleneck-amber/30" },
          { label: "Disconfirming", count: disconfirming, color: "text-thesis-breaker", border: "border-thesis-breaker/30" },
        ].map((s) => (
          <div key={s.label} className={`panel ${s.border} p-4 text-center`}>
            <p className={`font-display text-3xl font-bold ${s.color}`}>{s.count}</p>
            <p className="data-label mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Thesis Health */}
      <div className="panel">
        <div className="panel-header">
          <span className="data-label">Thesis Health</span>
          <span className="ml-auto text-xs font-mono text-evidence-green font-semibold">STRONG — HOLD CONVICTION</span>
        </div>
        <div className="p-4">
          <div className="h-3 bg-accent rounded-sm overflow-hidden flex">
            <motion.div
              className="h-full bg-evidence-green"
              initial={{ width: 0 }}
              animate={{ width: `${(confirming / signals.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
            <motion.div
              className="h-full bg-bottleneck-amber"
              initial={{ width: 0 }}
              animate={{ width: `${(neutral / signals.length) * 100}%` }}
              transition={{ duration: 0.5, delay: 0.1 }}
            />
            <motion.div
              className="h-full bg-thesis-breaker"
              initial={{ width: 0 }}
              animate={{ width: `${(disconfirming / signals.length) * 100}%` }}
              transition={{ duration: 0.5, delay: 0.2 }}
            />
          </div>
        </div>
      </div>

      {/* Signal Feed */}
      <div className="panel">
        <div className="panel-header">
          <span className="data-label">Signal Feed</span>
        </div>
        <div className="divide-y divide-panel-border">
          {signals.map((signal, i) => {
            const config = directionConfig[signal.direction];
            const Icon = config.icon;
            return (
              <motion.div
                key={signal.label}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.04 }}
                className="px-4 py-3 flex items-center gap-3"
              >
                <div className={`w-7 h-7 rounded-sm flex items-center justify-center ${config.bg}`}>
                  <Icon className={`w-3.5 h-3.5 ${config.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">{signal.label}</p>
                  <p className="text-xs text-muted-foreground font-mono">{signal.value}</p>
                </div>
                <span className={`text-xs font-mono px-1.5 py-0.5 rounded-sm ${config.bg} ${config.color}`}>
                  {config.label}
                </span>
                <span className="text-xs text-muted-foreground font-mono flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {signal.timestamp}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </main>
  );
};

export default MonitorWorkspace;
