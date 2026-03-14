import { BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const factors = [
  { key: "scarcity_severity", label: "Scarcity Severity" },
  { key: "supply_response_speed", label: "Supply Response Speed" },
  { key: "time_to_add_capacity", label: "Time to Add Capacity" },
  { key: "capital_intensity", label: "Capital Intensity" },
  { key: "regulatory_friction", label: "Regulatory Friction" },
  { key: "demand_growth", label: "Demand Growth" },
  { key: "pricing_power", label: "Pricing Power" },
  { key: "barriers_to_entry", label: "Barriers to Entry" },
  { key: "market_crowding", label: "Market Crowding" },
];

interface HeatmapWorkspaceProps {
  scores: Record<string, number>;
  onScoresChange: (scores: Record<string, number>) => void;
}

const getBarColor = (score: number) => {
  if (score >= 4) return "bg-evidence-green";
  if (score >= 3) return "bg-bottleneck-amber";
  return "bg-muted-foreground";
};

const HeatmapWorkspace = ({ scores, onScoresChange }: HeatmapWorkspaceProps) => {
  const total = Object.values(scores).reduce((a, b) => a + b, 0);

  const handleChange = (key: string, value: number) => {
    onScoresChange({ ...scores, [key]: value });
  };

  return (
    <main className="flex-1 h-screen overflow-y-auto p-6 space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <BarChart3 className="w-4 h-4 text-primary" />
          <span className="data-label">Scarcity Heatmap Generator</span>
        </div>
        <h1 className="font-display text-2xl font-bold text-foreground">
          Quantify Bottleneck Strength
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Adjust each factor from 1 (weak) to 5 (extreme) to score the structural constraint.
        </p>
      </div>

      <div className="panel">
        <div className="panel-header">
          <span className="data-label">Factor Scores</span>
          <span className="ml-auto font-mono text-xs text-foreground">{total} / 45</span>
        </div>
        <div className="p-4 space-y-5">
          {factors.map((f, i) => (
            <motion.div
              key={f.key}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-foreground">{f.label}</span>
                <span className="font-mono text-sm font-semibold text-foreground">{scores[f.key]}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-3 bg-accent rounded-sm overflow-hidden">
                  <motion.div
                    className={`h-full rounded-sm ${getBarColor(scores[f.key])}`}
                    animate={{ width: `${(scores[f.key] / 5) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((v) => (
                    <button
                      key={v}
                      onClick={() => handleChange(f.key, v)}
                      className={`w-7 h-7 rounded-sm text-xs font-mono transition-colors ${
                        scores[f.key] === v
                          ? "bg-primary text-primary-foreground"
                          : "bg-accent text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default HeatmapWorkspace;
