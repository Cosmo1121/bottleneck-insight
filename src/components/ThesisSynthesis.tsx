import { motion } from "framer-motion";
import { TrendingUp, AlertTriangle, Eye, XCircle, HelpCircle } from "lucide-react";
import type { BottleneckAnalysis, HeatmapScores } from "@/types/analysis";

interface ThesisSynthesisProps {
  analysis: BottleneckAnalysis;
}

type Verdict = "Promising" | "Needs Evidence" | "Watch" | "Reject";

const getVerdict = (analysis: BottleneckAnalysis): { verdict: Verdict; reason: string } => {
  const total = Object.values(analysis.scores).reduce((a, b) => a + b, 0);
  const evidenceCount = analysis.scarcity_evidence?.evidence_items?.length ?? 0;
  const confidence = analysis.overall_confidence ?? 0;
  const hasThesis = !!analysis.thesis?.trim();
  const hasBottleneck = !!analysis.primary_bottleneck?.trim();
  const breakersActive = analysis.thesis_breakers_structured
    ? Object.entries(analysis.thesis_breakers_structured)
        .filter(([k, v]) => k !== "notes" && v === true).length
    : 0;

  if (!hasThesis && !hasBottleneck) {
    return { verdict: "Needs Evidence", reason: "Thesis and bottleneck not yet defined." };
  }
  if (total < 15 || confidence < 0.2) {
    return { verdict: "Reject", reason: "Scarcity scores or confidence too low to support thesis." };
  }
  if (total >= 30 && confidence >= 0.5 && evidenceCount >= 2 && breakersActive <= 2) {
    return { verdict: "Promising", reason: "Strong scarcity signal with supporting evidence and manageable risks." };
  }
  if (total >= 20 && evidenceCount < 3) {
    return { verdict: "Needs Evidence", reason: "Scores suggest potential, but more evidence is needed to confirm." };
  }
  if (breakersActive >= 4) {
    return { verdict: "Watch", reason: "Multiple thesis breakers flagged — monitor before committing." };
  }
  return { verdict: "Watch", reason: "Moderate signal — requires further analysis before conviction." };
};

const verdictConfig: Record<Verdict, { icon: typeof TrendingUp; color: string; bg: string }> = {
  Promising: { icon: TrendingUp, color: "text-evidence-green", bg: "border-evidence-green/30 bg-evidence-green/5" },
  "Needs Evidence": { icon: HelpCircle, color: "text-bottleneck-amber", bg: "border-bottleneck-amber/30 bg-bottleneck-amber/5" },
  Watch: { icon: Eye, color: "text-primary", bg: "border-primary/30 bg-primary/5" },
  Reject: { icon: XCircle, color: "text-thesis-breaker", bg: "border-thesis-breaker/30 bg-thesis-breaker/5" },
};

const getTopBreaker = (analysis: BottleneckAnalysis): string => {
  if (!analysis.thesis_breakers_structured) return "Not assessed";
  const breakerLabels: Record<string, string> = {
    technology_disruption: "Technology disruption",
    regulatory_change: "Regulatory change",
    supply_expansion: "Supply expansion",
    demand_decline: "Demand decline",
    capital_flood: "Capital flood",
    substitution: "Substitution risk",
    timing_mismatch: "Timing mismatch",
    valuation_crowding: "Valuation crowding",
  };
  const active = Object.entries(analysis.thesis_breakers_structured)
    .filter(([k, v]) => k !== "notes" && v === true)
    .map(([k]) => breakerLabels[k] || k);
  return active.length > 0 ? active[0] : "None flagged";
};

const ThesisSynthesis = ({ analysis }: ThesisSynthesisProps) => {
  const { verdict, reason } = getVerdict(analysis);
  const config = verdictConfig[verdict];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-sm border p-4 ${config.bg}`}
    >
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${config.color}`} />
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-center gap-2">
            <span className={`font-display font-bold text-sm ${config.color}`}>{verdict}</span>
            <span className="text-xs text-muted-foreground font-mono">
              {Math.round((analysis.overall_confidence ?? 0) * 100)}% confidence
            </span>
          </div>
          <p className="text-sm text-foreground/80 leading-relaxed">{reason}</p>
          <div className="grid grid-cols-3 gap-3 pt-1">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-0.5">Bottleneck</p>
              <p className="text-xs text-foreground truncate">{analysis.primary_bottleneck || "—"}</p>
            </div>
            <div>
              <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-0.5">Value Capture</p>
              <p className="text-xs text-foreground truncate">{analysis.value_capture_layer || "—"}</p>
            </div>
            <div>
              <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-0.5">Top Breaker</p>
              <p className="text-xs text-foreground truncate">{getTopBreaker(analysis)}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ThesisSynthesis;
