import { useState } from "react";
import { motion } from "framer-motion";
import type { HeatmapScores } from "@/types/analysis";

interface ScarcityScorecardProps {
  scores: HeatmapScores;
  theme?: string;
}

interface RubricEntry {
  label: string;
  low: string;
  mid: string;
  high: string;
  direction: string;
  positive: boolean; // true = higher is good for thesis, false = higher is a risk
}

const rubrics: Record<keyof HeatmapScores, RubricEntry> = {
  scarcity_severity: {
    label: "Scarcity Severity",
    low: "Abundant supply, no scarcity signals",
    mid: "Moderate tightness, some constraints visible",
    high: "Acute shortage, severe supply-demand imbalance",
    direction: "Higher = stronger scarcity",
    positive: true,
  },
  supply_response_speed: {
    label: "Supply Response",
    low: "Supply responds quickly (<1 year)",
    mid: "Moderate response time (2–4 years)",
    high: "Very slow supply response (5+ years)",
    direction: "Higher = slower response",
    positive: true,
  },
  time_to_add_capacity: {
    label: "Capacity Build Time",
    low: "New capacity online in months",
    mid: "Multi-year buildout required",
    high: "Decade+ to meaningfully expand capacity",
    direction: "Higher = longer build time",
    positive: true,
  },
  capital_intensity: {
    label: "Capital Intensity",
    low: "Low capex, easy to fund",
    mid: "Significant investment required",
    high: "Massive capex, few can finance",
    direction: "Higher = harder to solve",
    positive: true,
  },
  regulatory_friction: {
    label: "Regulatory Friction",
    low: "Minimal regulatory barriers",
    mid: "Meaningful permitting/approval process",
    high: "Heavy regulatory burden, multi-year approvals",
    direction: "Higher = more friction",
    positive: true,
  },
  demand_growth: {
    label: "Demand Growth",
    low: "Flat or declining demand",
    mid: "Steady moderate growth",
    high: "Explosive structural demand growth",
    direction: "Higher = stronger demand pressure",
    positive: true,
  },
  pricing_power: {
    label: "Pricing Power",
    low: "Commoditized, no pricing leverage",
    mid: "Some differentiation, moderate pricing power",
    high: "Essential/scarce, strong pricing power",
    direction: "Higher = better investability",
    positive: true,
  },
  barriers_to_entry: {
    label: "Barriers to Entry",
    low: "Low barriers, easy for new entrants",
    mid: "Moderate barriers (capital, know-how)",
    high: "Near-impossible to enter (permits, IP, scale)",
    direction: "Higher = more durable advantage",
    positive: true,
  },
  market_crowding: {
    label: "Market Crowding",
    low: "Uncrowded, thesis is contrarian",
    mid: "Some institutional attention",
    high: "Heavily crowded, consensus trade",
    direction: "Higher = more crowding risk ⚠",
    positive: false,
  },
};

const getBarColor = (score: number, positive: boolean) => {
  if (!positive) {
    // Inverted: low is good, high is bad
    if (score <= 2) return "bg-evidence-green";
    if (score <= 3) return "bg-bottleneck-amber";
    return "bg-thesis-breaker";
  }
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
  const [hoveredFactor, setHoveredFactor] = useState<keyof HeatmapScores | null>(null);
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
        {(Object.keys(scores) as (keyof HeatmapScores)[]).map((key, i) => {
          const rubric = rubrics[key];
          const score = scores[key];
          const isHovered = hoveredFactor === key;

          return (
            <div
              key={key}
              className="relative"
              onMouseEnter={() => setHoveredFactor(key)}
              onMouseLeave={() => setHoveredFactor(null)}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-muted-foreground cursor-help">{rubric.label}</span>
                <span className="font-mono text-xs text-foreground font-medium">{score}</span>
              </div>
              <div className="h-2 bg-accent rounded-sm overflow-hidden">
                <motion.div
                  className={`score-bar ${getBarColor(score, rubric.positive)}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${(score / 5) * 100}%` }}
                  transition={{ duration: 0.6, delay: i * 0.05, ease: "easeOut" }}
                />
              </div>

              {/* Rubric tooltip */}
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 top-full mt-1 z-50 w-56 bg-popover border border-border rounded-sm p-3 shadow-lg"
                >
                  <p className="text-[10px] font-mono uppercase tracking-wider text-primary mb-2">{rubric.direction}</p>
                  <div className="space-y-1.5">
                    <div className="flex gap-2">
                      <span className="font-mono text-[10px] text-muted-foreground shrink-0 w-4">1</span>
                      <span className="text-[11px] text-foreground/70">{rubric.low}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-mono text-[10px] text-muted-foreground shrink-0 w-4">3</span>
                      <span className="text-[11px] text-foreground/70">{rubric.mid}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-mono text-[10px] text-muted-foreground shrink-0 w-4">5</span>
                      <span className="text-[11px] text-foreground/70">{rubric.high}</span>
                    </div>
                  </div>
                  {!rubric.positive && (
                    <p className="text-[10px] text-thesis-breaker mt-2 font-mono">⚠ High score = risk factor</p>
                  )}
                </motion.div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
};

export default ScarcityScorecard;
