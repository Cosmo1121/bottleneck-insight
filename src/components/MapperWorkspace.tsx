import { GitBranch, ArrowDown, Lock, Layers, Wrench, Network, Box, Users, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";

const layers = [
  {
    label: "Demand Creators",
    icon: Users,
    description: "Applications, services, and platforms that generate demand for the constrained resource.",
    examples: ["Cloud hyperscalers", "AI platforms", "Enterprise SaaS", "Consumer apps"],
    isBottleneck: false,
  },
  {
    label: "Integrators",
    icon: Network,
    description: "System builders and assemblers that combine components into solutions.",
    examples: ["System integrators", "Solution architects", "OEMs"],
    isBottleneck: false,
  },
  {
    label: "Downstream Operators",
    icon: Box,
    description: "The deployment layer — entities that run and maintain the systems.",
    examples: ["Data center operators", "Managed service providers", "Utilities"],
    isBottleneck: false,
  },
  {
    label: "Enabling Infrastructure",
    icon: Layers,
    description: "Logistics, connectivity, and utilities that support the system.",
    examples: ["Grid operators", "Fiber networks", "Cooling systems", "Land/permitting"],
    isBottleneck: false,
  },
  {
    label: "Picks & Shovels",
    icon: Wrench,
    description: "Tools, equipment, and component suppliers that enable buildout.",
    examples: ["Semiconductor equipment", "Networking gear", "Construction materials"],
    isBottleneck: false,
  },
  {
    label: "Bottleneck Owners",
    icon: Lock,
    description: "Scarce assets with pricing power, durable constraints, and economic leverage. This is where value accrues.",
    examples: ["Power generation", "Transformer manufacturing", "GPU fabrication", "Rare earth processing"],
    isBottleneck: true,
  },
];

const losers = [
  "Commoditized cloud resellers",
  "Generic hosting providers",
  "Low-margin hardware assemblers",
];

const MapperWorkspace = () => {
  return (
    <main className="flex-1 h-screen overflow-y-auto p-6 space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <GitBranch className="w-4 h-4 text-primary" />
          <span className="data-label">Value Chain Mapper</span>
        </div>
        <h1 className="font-display text-2xl font-bold text-foreground">
          Map Value Capture Layers
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Identify where economic value actually accrues in the system. The lower the layer, the stronger the structural advantage.
        </p>
      </div>

      <div className="flex items-center gap-2 text-xs text-muted-foreground px-1">
        <span className="font-mono">↑ NARRATIVE ATTENTION</span>
        <div className="flex-1 border-t border-dashed border-panel-border" />
        <span className="font-mono">STRUCTURAL SCARCITY ↓</span>
      </div>

      <div className="space-y-2">
        {layers.map((layer, i) => {
          const Icon = layer.icon;
          return (
            <motion.div
              key={layer.label}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07, duration: 0.3 }}
              className={`panel ${layer.isBottleneck ? "border-evidence-green/40 bg-evidence-green/5" : ""}`}
            >
              <div className="p-4 flex gap-4">
                <div className={`w-9 h-9 rounded-sm flex items-center justify-center shrink-0 ${
                  layer.isBottleneck ? "bg-evidence-green" : "bg-accent"
                }`}>
                  <Icon className={`w-4 h-4 ${layer.isBottleneck ? "text-background" : "text-muted-foreground"}`} />
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-display font-semibold mb-0.5 ${
                    layer.isBottleneck ? "text-evidence-green" : "text-foreground"
                  }`}>
                    {layer.label}
                  </p>
                  <p className="text-xs text-muted-foreground mb-2">{layer.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {layer.examples.map((ex) => (
                      <span key={ex} className={`text-xs font-mono px-2 py-0.5 rounded-sm ${
                        layer.isBottleneck
                          ? "bg-evidence-green/10 text-evidence-green border border-evidence-green/20"
                          : "bg-accent text-muted-foreground"
                      }`}>
                        {ex}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="panel border-thesis-breaker/30">
        <div className="panel-header">
          <TrendingDown className="w-4 h-4 text-thesis-breaker" />
          <span className="data-label">Likely Losers / Disintermediated</span>
        </div>
        <div className="p-4 flex flex-wrap gap-1.5">
          {losers.map((l) => (
            <span key={l} className="text-xs font-mono px-2 py-0.5 rounded-sm bg-thesis-breaker/10 text-thesis-breaker border border-thesis-breaker/20">
              {l}
            </span>
          ))}
        </div>
      </div>
    </main>
  );
};

export default MapperWorkspace;
