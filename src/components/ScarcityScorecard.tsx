import { motion } from "framer-motion";

interface HeatmapScores {
  scarcity_severity: number;
  supply_response_speed: number;
  time_to_add_capacity: number;
  capital_intensity: number;
  regulatory_friction: number;
  demand_growth: number;
  pricing_power: number;
  barriers_to_entry: number;
  market_crowding: number;
}

interface ScarcityScorecardProps {
  scores: HeatmapScores;
  theme?: string;
}

const factorLabels: Record<keyof HeatmapScores, string> = {
  scarcity_severity: "Scarcity Severity",
  supply_response_speed: "Supply Response",
  time_to_add_capacity: "Capacity Build Time",
  capital_intensity: "Capital Intensity",
  regulatory_friction: "Regulatory Friction",
  demand_growth: "Demand Growth",
  pricing_power: "Pricing Power",
  barriers_to_entry: "Barriers to Entry",
  market_crowding: "Market Crowding",
};

const getBarColor = (score: number) => {
  if (score >= 4) return "bg-evidence-green";
  if (score >= 3) return "bg-bottleneck-amber";
  return "bg-muted-foreground";
};

const getClassification = (total: number) => {
  if (total >= 30) return { label: "STRUCTURAL BOTTLENECK", color: "text-evidence-green" };
  if (total >= 20) return { label: "MODERATE CONSTRAINT", color: "text-bottleneck-amber" };
  if (total >= 10) return { label: "NARRATIVE THEME", color: "text-muted-foreground" };
  return { label: "WEAK THESIS", color: "text-thesis-breaker" };
};

const ScarcityScorecard = ({ scores, theme }: ScarcityScorecardProps) => {
  const total = Object.values(scores).reduce((a, b) => a + b, 0);
  const classification = getClassification(total);

  return (
    <aside className="w-72 shrink-0 bg-sidebar border-l border-sidebar-border h-screen overflow-y-auto">
      <div className="panel-header">
        <span className="data-label">Scarcity Scorecard</span>
      </div>

      <div className="p-4 border-b border-panel-border text-center">
        {theme && (
          <p className="text-xs text-muted-foreground mb-2 font-mono uppercase tracking-wider">{theme}</p>
        )}
        <motion.div
          className="font-display text-5xl font-bold text-foreground"
          key={total}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {total}
        </motion.div>
        <p className="text-xs text-muted-foreground mt-1 font-mono">/ 45</p>
        <p className={`text-xs font-mono font-semibold mt-2 ${classification.color}`}>
          {classification.label}
        </p>
      </div>

      <div className="p-4 space-y-3">
        {(Object.keys(scores) as (keyof HeatmapScores)[]).map((key, i) => (
          <div key={key}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-muted-foreground">{factorLabels[key]}</span>
              <span className="font-mono text-xs text-foreground font-medium">{scores[key]}</span>
            </div>
            <div className="h-2 bg-accent rounded-sm overflow-hidden">
              <motion.div
                className={`score-bar ${getBarColor(scores[key])}`}
                initial={{ width: 0 }}
                animate={{ width: `${(scores[key] / 5) * 100}%` }}
                transition={{ duration: 0.6, delay: i * 0.05, ease: "easeOut" }}
              />
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default ScarcityScorecard;
