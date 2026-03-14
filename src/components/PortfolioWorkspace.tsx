import { Briefcase, Shield, Layers, Wrench, Rocket, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

const portfolioLayers = [
  {
    label: "Core Bottleneck",
    icon: Shield,
    weight: "40%",
    color: "text-evidence-green",
    bgColor: "bg-evidence-green/10 border-evidence-green/20",
    barColor: "bg-evidence-green",
    items: ["Power generation assets", "Transformer manufacturers", "Grid infrastructure owners"],
  },
  {
    label: "Supporting Infrastructure",
    icon: Layers,
    weight: "25%",
    color: "text-primary",
    bgColor: "bg-primary/10 border-primary/20",
    barColor: "bg-primary",
    items: ["Utility-scale solar/wind developers", "Natural gas pipeline operators", "Grid connectivity"],
  },
  {
    label: "Picks & Shovels",
    icon: Wrench,
    weight: "20%",
    color: "text-bottleneck-amber",
    bgColor: "bg-bottleneck-amber/10 border-bottleneck-amber/20",
    barColor: "bg-bottleneck-amber",
    items: ["Electrical equipment manufacturers", "Cooling technology providers", "Construction materials"],
  },
  {
    label: "Speculative Satellite",
    icon: Rocket,
    weight: "10%",
    color: "text-muted-foreground",
    bgColor: "bg-accent",
    barColor: "bg-muted-foreground",
    items: ["Small modular reactor developers", "Next-gen battery storage", "Emerging grid tech"],
  },
  {
    label: "Risk Hedges",
    icon: AlertTriangle,
    weight: "5%",
    color: "text-thesis-breaker",
    bgColor: "bg-thesis-breaker/10 border-thesis-breaker/20",
    barColor: "bg-thesis-breaker",
    items: ["Puts on overvalued narrative-layer names", "Energy demand short positions"],
  },
];

const risks = [
  { label: "Correlation Risk", level: "Medium", description: "Power-adjacent assets may correlate in a downturn" },
  { label: "Narrative Crowding", level: "Low", description: "Power bottleneck still under-recognized vs AI software" },
  { label: "Supply Response", level: "Low", description: "3-7 year lead times limit rapid supply expansion" },
];

const PortfolioWorkspace = () => {
  return (
    <main className="flex-1 h-screen overflow-y-auto p-6 space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Briefcase className="w-4 h-4 text-primary" />
          <span className="data-label">Portfolio Builder</span>
        </div>
        <h1 className="font-display text-2xl font-bold text-foreground">
          Bottleneck Portfolio Construction
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Translate the bottleneck thesis into layered exposure weighted by conviction and scarcity duration.
        </p>
      </div>

      <div className="space-y-3">
        {portfolioLayers.map((layer, i) => {
          const Icon = layer.icon;
          return (
            <motion.div
              key={layer.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="panel"
            >
              <div className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Icon className={`w-4 h-4 ${layer.color}`} />
                  <span className={`font-display font-semibold text-sm ${layer.color}`}>{layer.label}</span>
                  <span className="ml-auto font-mono text-lg font-bold text-foreground">{layer.weight}</span>
                </div>
                <div className="h-2 bg-accent rounded-sm overflow-hidden mb-3">
                  <motion.div
                    className={`h-full rounded-sm ${layer.barColor}`}
                    initial={{ width: 0 }}
                    animate={{ width: layer.weight }}
                    transition={{ duration: 0.6, delay: i * 0.08 }}
                  />
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {layer.items.map((item) => (
                    <span key={item} className={`text-xs font-mono px-2 py-0.5 rounded-sm border ${layer.bgColor}`}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="panel">
        <div className="panel-header">
          <AlertTriangle className="w-4 h-4 text-bottleneck-amber" />
          <span className="data-label">Risk Assessment</span>
        </div>
        <div className="p-4 space-y-3">
          {risks.map((r) => (
            <div key={r.label} className="flex items-start gap-3">
              <span className={`text-xs font-mono px-1.5 py-0.5 rounded-sm ${
                r.level === "Low" ? "bg-evidence-green/10 text-evidence-green" :
                r.level === "Medium" ? "bg-bottleneck-amber/10 text-bottleneck-amber" :
                "bg-thesis-breaker/10 text-thesis-breaker"
              }`}>{r.level}</span>
              <div>
                <p className="text-sm text-foreground font-medium">{r.label}</p>
                <p className="text-xs text-muted-foreground">{r.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default PortfolioWorkspace;
