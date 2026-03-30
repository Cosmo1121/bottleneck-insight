import { motion } from "framer-motion";
import { Gauge, TrendingUp, TrendingDown, AlertTriangle, Shield, Zap, Clock, DollarSign, Scale, Users, Lock, BarChart3 } from "lucide-react";
import type { BottleneckAnalysis, HeatmapScores, ThesisBreakersStructured } from "@/types/analysis";

interface Props {
  analysis: BottleneckAnalysis;
}

const factorConfig: Record<keyof HeatmapScores, { label: string; icon: typeof Gauge; positive: boolean }> = {
  scarcity_severity: { label: "Scarcity Severity", icon: Zap, positive: true },
  supply_response_speed: { label: "Supply Response", icon: Clock, positive: true },
  time_to_add_capacity: { label: "Capacity Build Time", icon: Clock, positive: true },
  capital_intensity: { label: "Capital Intensity", icon: DollarSign, positive: true },
  regulatory_friction: { label: "Regulatory Friction", icon: Scale, positive: true },
  demand_growth: { label: "Demand Growth", icon: TrendingUp, positive: true },
  pricing_power: { label: "Pricing Power", icon: DollarSign, positive: true },
  barriers_to_entry: { label: "Barriers to Entry", icon: Lock, positive: true },
  market_crowding: { label: "Market Crowding", icon: Users, positive: false },
};

const breakerLabels: Record<keyof Omit<ThesisBreakersStructured, "notes">, string> = {
  technology_disruption: "Tech Disruption",
  regulatory_change: "Regulatory Change",
  supply_expansion: "Supply Expansion",
  demand_decline: "Demand Decline",
  capital_flood: "Capital Flood",
  substitution: "Substitution",
  timing_mismatch: "Timing Mismatch",
  valuation_crowding: "Valuation Crowding",
};

const getScoreColor = (score: number, positive: boolean) => {
  if (!positive) {
    if (score <= 2) return "text-evidence-green";
    if (score <= 3) return "text-bottleneck-amber";
    return "text-thesis-breaker";
  }
  if (score >= 4) return "text-evidence-green";
  if (score >= 3) return "text-bottleneck-amber";
  return "text-muted-foreground";
};

const getBarColor = (score: number, positive: boolean) => {
  if (!positive) {
    if (score <= 2) return "bg-evidence-green";
    if (score <= 3) return "bg-bottleneck-amber";
    return "bg-thesis-breaker";
  }
  if (score >= 4) return "bg-evidence-green";
  if (score >= 3) return "bg-bottleneck-amber";
  return "bg-muted-foreground";
};

const getTrafficLight = (score: number, positive: boolean): { color: string; label: string } => {
  if (!positive) {
    if (score <= 2) return { color: "bg-evidence-green", label: "Low Risk" };
    if (score <= 3) return { color: "bg-bottleneck-amber", label: "Moderate" };
    return { color: "bg-thesis-breaker", label: "High Risk" };
  }
  if (score >= 4) return { color: "bg-evidence-green", label: "Strong" };
  if (score >= 3) return { color: "bg-bottleneck-amber", label: "Moderate" };
  return { color: "bg-muted-foreground", label: "Weak" };
};

const getClassification = (total: number) => {
  if (total >= 30) return { label: "STRUCTURAL BOTTLENECK", color: "text-evidence-green", bg: "bg-evidence-green/10", border: "border-evidence-green/30" };
  if (total >= 20) return { label: "MODERATE CONSTRAINT", color: "text-bottleneck-amber", bg: "bg-bottleneck-amber/10", border: "border-bottleneck-amber/30" };
  if (total >= 10) return { label: "NARRATIVE THEME", color: "text-muted-foreground", bg: "bg-muted/50", border: "border-border" };
  return { label: "WEAK THESIS", color: "text-thesis-breaker", bg: "bg-thesis-breaker/10", border: "border-thesis-breaker/30" };
};

const getConfidenceColor = (confidence: number) => {
  if (confidence >= 70) return "text-evidence-green";
  if (confidence >= 40) return "text-bottleneck-amber";
  return "text-thesis-breaker";
};

const GaugeRing = ({ value, max, size = 120, strokeWidth = 10, color }: { value: number; max: number; size?: number; strokeWidth?: number; color: string }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (value / max) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="hsl(var(--accent))" strokeWidth={strokeWidth} />
      <motion.circle
        cx={size / 2} cy={size / 2} r={radius} fill="none"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: circumference - progress }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />
    </svg>
  );
};

const VisualScorecardWorkspace = ({ analysis }: Props) => {
  const { scores, thesis_breakers_structured: breakers, overall_confidence } = analysis;
  const total = Object.values(scores).reduce((a, b) => a + b, 0);
  const classification = getClassification(total);

  const activeBreakers = (Object.keys(breakerLabels) as (keyof Omit<ThesisBreakersStructured, "notes">)[])
    .filter((k) => breakers[k]);
  const evidenceFlags = analysis.scarcity_evidence;
  const evidenceCount = [
    evidenceFlags.supply_shortages, evidenceFlags.long_lead_times, evidenceFlags.regulatory_backlog,
    evidenceFlags.capacity_constraints, evidenceFlags.rising_prices, evidenceFlags.industry_warnings,
    evidenceFlags.capex_surge, evidenceFlags.utilization_pressure,
  ].filter(Boolean).length;

  const portfolioAllocated = analysis.portfolio.layers.reduce((s, l) => s + l.weight, 0);

  return (
    <main className="flex-1 h-screen overflow-y-auto bg-background">
      <div className="panel-header sticky top-0 z-10 bg-background/95 backdrop-blur">
        <Gauge className="w-4 h-4 text-primary" />
        <span className="data-label">Visual Scorecard</span>
        <span className="text-xs text-muted-foreground ml-2 font-mono">{analysis.theme}</span>
      </div>

      <div className="p-6 space-y-6 max-w-6xl mx-auto">
        {/* Hero: Total Score + Classification + Confidence */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {/* Total Score Gauge */}
          <div className={`rounded-md border ${classification.border} ${classification.bg} p-6 flex flex-col items-center justify-center`}>
            <div className="relative">
              <GaugeRing value={total} max={45} size={140} strokeWidth={12} color={`hsl(var(--${total >= 30 ? 'evidence-green' : total >= 20 ? 'bottleneck-amber' : 'thesis-breaker'}))`} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span
                  className="font-display text-4xl font-bold text-foreground"
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
                >
                  {total}
                </motion.span>
                <span className="text-xs font-mono text-muted-foreground">/45</span>
              </div>
            </div>
            <p className={`text-sm font-mono font-semibold mt-4 ${classification.color}`}>{classification.label}</p>
            <p className="text-xs text-muted-foreground mt-1">Scarcity Score</p>
          </div>

          {/* Confidence Gauge */}
          <div className="rounded-md border border-border bg-card p-6 flex flex-col items-center justify-center">
            <div className="relative">
              <GaugeRing value={overall_confidence} max={100} size={140} strokeWidth={12} color={`hsl(var(--${overall_confidence >= 70 ? 'evidence-green' : overall_confidence >= 40 ? 'bottleneck-amber' : 'thesis-breaker'}))`} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span
                  className={`font-display text-4xl font-bold ${getConfidenceColor(overall_confidence)}`}
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.4 }}
                >
                  {overall_confidence}%
                </motion.span>
              </div>
            </div>
            <p className="text-sm font-mono font-semibold mt-4 text-foreground">Confidence</p>
            <p className="text-xs text-muted-foreground mt-1 text-center line-clamp-2">{analysis.confidence_notes || "Not assessed"}</p>
          </div>

          {/* Quick Stats */}
          <div className="rounded-md border border-border bg-card p-6 space-y-3">
            <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3">Quick Stats</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Status</span>
              <span className="text-xs font-mono text-foreground uppercase">{analysis.status || "Draft"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Thesis Stage</span>
              <span className="text-xs font-mono text-foreground">{analysis.thesis_stage || "—"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Evidence Signals</span>
              <span className={`text-xs font-mono ${evidenceCount >= 5 ? 'text-evidence-green' : evidenceCount >= 3 ? 'text-bottleneck-amber' : 'text-muted-foreground'}`}>{evidenceCount}/8</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Thesis Breakers</span>
              <span className={`text-xs font-mono ${activeBreakers.length === 0 ? 'text-evidence-green' : activeBreakers.length <= 2 ? 'text-bottleneck-amber' : 'text-thesis-breaker'}`}>{activeBreakers.length} active</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Portfolio Alloc.</span>
              <span className="text-xs font-mono text-foreground">{portfolioAllocated}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Monitor Status</span>
              <span className="text-xs font-mono text-foreground">{analysis.monitoring.thesis_status || "—"}</span>
            </div>
          </div>
        </motion.div>

        {/* Factor Scorecard with traffic lights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
          className="rounded-md border border-border bg-card"
        >
          <div className="p-4 border-b border-border">
            <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <BarChart3 className="w-3.5 h-3.5 text-primary" /> Factor Breakdown
            </p>
          </div>
          <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            {(Object.keys(scores) as (keyof HeatmapScores)[]).map((key, i) => {
              const cfg = factorConfig[key];
              const score = scores[key];
              const traffic = getTrafficLight(score, cfg.positive);
              const Icon = cfg.icon;
              const rationale = analysis.heatmap_rationale[key];

              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 + i * 0.05 }}
                  className="rounded-sm border border-border bg-background p-3 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-3.5 h-3.5 ${getScoreColor(score, cfg.positive)}`} />
                      <span className="text-xs text-muted-foreground">{cfg.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${traffic.color}`} />
                      <span className={`font-mono text-sm font-bold ${getScoreColor(score, cfg.positive)}`}>{score}</span>
                      <span className="text-[10px] text-muted-foreground">/5</span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-accent rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${getBarColor(score, cfg.positive)}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${(score / 5) * 100}%` }}
                      transition={{ duration: 0.8, delay: 0.3 + i * 0.05 }}
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground font-mono">{traffic.label}{!cfg.positive && score >= 4 ? " ⚠" : ""}</p>
                  {rationale && <p className="text-[10px] text-foreground/60 line-clamp-2">{rationale}</p>}
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Bottom row: Thesis Breakers + Evidence + Portfolio */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {/* Thesis Breakers */}
          <div className="rounded-md border border-border bg-card p-4">
            <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-thesis-breaker" /> Thesis Breakers
            </p>
            <div className="space-y-2">
              {(Object.keys(breakerLabels) as (keyof Omit<ThesisBreakersStructured, "notes">)[]).map((key) => {
                const active = breakers[key];
                return (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{breakerLabels[key]}</span>
                    <div className={`w-2.5 h-2.5 rounded-full ${active ? 'bg-thesis-breaker' : 'bg-evidence-green'}`} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Evidence Signals */}
          <div className="rounded-md border border-border bg-card p-4">
            <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-evidence-green" /> Evidence Signals
            </p>
            <div className="space-y-2">
              {[
                { key: "supply_shortages", label: "Supply Shortages" },
                { key: "long_lead_times", label: "Long Lead Times" },
                { key: "regulatory_backlog", label: "Regulatory Backlog" },
                { key: "capacity_constraints", label: "Capacity Constraints" },
                { key: "rising_prices", label: "Rising Prices" },
                { key: "industry_warnings", label: "Industry Warnings" },
                { key: "capex_surge", label: "Capex Surge" },
                { key: "utilization_pressure", label: "Utilization Pressure" },
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{label}</span>
                  <div className={`w-2.5 h-2.5 rounded-full ${(evidenceFlags as any)[key] ? 'bg-evidence-green' : 'bg-accent'}`} />
                </div>
              ))}
            </div>
          </div>

          {/* Portfolio Allocation */}
          <div className="rounded-md border border-border bg-card p-4">
            <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5 text-primary" /> Portfolio Allocation
            </p>
            <div className="space-y-3">
              {analysis.portfolio.layers.map((layer, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{layer.label}</span>
                    <span className="text-xs font-mono text-foreground">{layer.weight}%</span>
                  </div>
                  <div className="h-1.5 bg-accent rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-primary"
                      initial={{ width: 0 }}
                      animate={{ width: `${layer.weight}%` }}
                      transition={{ duration: 0.8, delay: 0.4 + i * 0.1 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Thesis & Assessment summary */}
        {(analysis.thesis || analysis.final_assessment) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.45 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {analysis.thesis && (
              <div className="rounded-md border border-border bg-card p-4">
                <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">Thesis</p>
                <p className="text-sm text-foreground/80 leading-relaxed">{analysis.thesis}</p>
              </div>
            )}
            {analysis.final_assessment && (
              <div className="rounded-md border border-border bg-card p-4">
                <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">Final Assessment</p>
                <p className="text-sm text-foreground/80 leading-relaxed">{analysis.final_assessment}</p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </main>
  );
};

export default VisualScorecardWorkspace;
