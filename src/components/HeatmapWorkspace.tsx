import { BarChart3, Save, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import type { HeatmapScores, HeatmapRationale } from "@/types/analysis";

const factors: { key: keyof HeatmapScores; label: string }[] = [
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

const getBarColor = (score: number) => {
  if (score >= 4) return "bg-evidence-green";
  if (score >= 3) return "bg-bottleneck-amber";
  return "bg-muted-foreground";
};

interface HeatmapWorkspaceProps {
  scores: HeatmapScores;
  rationale: HeatmapRationale;
  onScoresChange: (scores: HeatmapScores) => void;
  onRationaleChange: (rationale: HeatmapRationale) => void;
  onSave: () => void;
  isSaving: boolean;
}

const HeatmapWorkspace = ({ scores, rationale, onScoresChange, onRationaleChange, onSave, isSaving }: HeatmapWorkspaceProps) => {
  const total = Object.values(scores).reduce((a, b) => a + b, 0);

  const handleScoreChange = (key: keyof HeatmapScores, value: number) => {
    onScoresChange({ ...scores, [key]: value });
  };

  const handleRationaleChange = (key: keyof HeatmapRationale, value: string) => {
    onRationaleChange({ ...rationale, [key]: value });
  };

  return (
    <main className="flex-1 h-screen overflow-y-auto p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="w-4 h-4 text-primary" />
            <span className="data-label">Scarcity Heatmap Generator</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground">Quantify Bottleneck Strength</h1>
          <p className="text-sm text-muted-foreground mt-1">Adjust each factor from 1 (weak) to 5 (extreme) and provide rationale.</p>
        </div>
        <button onClick={onSave} disabled={isSaving} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono bg-primary text-primary-foreground rounded-sm hover:opacity-90 disabled:opacity-50">
          {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
          Save Scores
        </button>
      </div>

      <div className="panel">
        <div className="panel-header">
          <span className="data-label">Factor Scores</span>
          <span className="ml-auto font-mono text-xs text-foreground">{total} / 45</span>
        </div>
        <div className="p-4 space-y-5">
          {factors.map((f, i) => (
            <motion.div key={f.key} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-foreground">{f.label}</span>
                <span className="font-mono text-sm font-semibold text-foreground">{scores[f.key]}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-3 bg-accent rounded-sm overflow-hidden">
                  <motion.div className={`h-full rounded-sm ${getBarColor(scores[f.key])}`} animate={{ width: `${(scores[f.key] / 5) * 100}%` }} transition={{ duration: 0.3 }} />
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((v) => (
                    <button key={v} onClick={() => handleScoreChange(f.key, v)} className={`w-7 h-7 rounded-sm text-xs font-mono transition-colors ${scores[f.key] === v ? "bg-primary text-primary-foreground" : "bg-accent text-muted-foreground hover:text-foreground"}`}>
                      {v}
                    </button>
                  ))}
                </div>
              </div>
              <input
                value={rationale[f.key]}
                onChange={(e) => handleRationaleChange(f.key, e.target.value)}
                placeholder={`Why ${f.label.toLowerCase()} = ${scores[f.key]}?`}
                className="w-full mt-1.5 bg-accent text-foreground text-xs px-2 py-1 rounded-sm border border-panel-border font-mono placeholder:text-muted-foreground focus:outline-none focus:border-primary"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default HeatmapWorkspace;
