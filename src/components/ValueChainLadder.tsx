import { motion } from "framer-motion";
import { ArrowDown, Lock, Layers, Wrench, Network, Box, Users, TrendingDown } from "lucide-react";

interface ValueChainData {
  demand_creators: string[];
  integrators: string[];
  operators: string[];
  infrastructure: string[];
  picks_and_shovels: string[];
  bottleneck_owners: string[];
}

const defaultData: ValueChainData = {
  demand_creators: ["Cloud hyperscalers", "AI platforms", "Enterprise SaaS"],
  integrators: ["System integrators", "Solution architects"],
  operators: ["Data center operators", "Managed services"],
  infrastructure: ["Grid operators", "Fiber networks", "Cooling systems"],
  picks_and_shovels: ["Semiconductor equipment", "Networking gear"],
  bottleneck_owners: ["Power generation", "Transformer manufacturing", "GPU fabrication"],
};

const layers = [
  { key: "demand_creators" as const, label: "Demand Creators", icon: Users, isBottleneck: false },
  { key: "integrators" as const, label: "Integrators", icon: Network, isBottleneck: false },
  { key: "operators" as const, label: "Operators", icon: Box, isBottleneck: false },
  { key: "infrastructure" as const, label: "Infrastructure", icon: Layers, isBottleneck: false },
  { key: "picks_and_shovels" as const, label: "Picks & Shovels", icon: Wrench, isBottleneck: false },
  { key: "bottleneck_owners" as const, label: "Bottleneck Owners", icon: Lock, isBottleneck: true },
];

interface ValueChainLadderProps {
  data?: ValueChainData;
}

const ValueChainLadder = ({ data = defaultData }: ValueChainLadderProps) => {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-semibold text-sm text-foreground">Value Chain Ladder</h3>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span>Narrative</span>
          <ArrowDown className="w-3 h-3" />
          <span>Scarcity</span>
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-px bg-panel-border" />

        {layers.map((layer, i) => {
          const Icon = layer.icon;
          const items = data[layer.key];
          return (
            <motion.div
              key={layer.key}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08, duration: 0.3 }}
              className={`relative pl-10 py-3 ${
                layer.isBottleneck
                  ? "border border-evidence-green/30 bg-evidence-green/5 rounded-sm ml-2"
                  : ""
              }`}
            >
              <div className={`absolute left-2.5 top-4 w-3 h-3 rounded-sm flex items-center justify-center ${
                layer.isBottleneck ? "bg-evidence-green" : "bg-accent"
              }`}>
                <Icon className={`w-2 h-2 ${layer.isBottleneck ? "text-background" : "text-muted-foreground"}`} />
              </div>

              <p className={`text-xs font-mono uppercase tracking-wider mb-1 ${
                layer.isBottleneck ? "text-evidence-green font-semibold" : "text-muted-foreground"
              }`}>
                {layer.label}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {items.map((item) => (
                  <span
                    key={item}
                    className={`text-xs px-2 py-0.5 rounded-sm ${
                      layer.isBottleneck
                        ? "bg-evidence-green/10 text-evidence-green border border-evidence-green/20"
                        : "bg-accent text-muted-foreground"
                    }`}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ValueChainLadder;
