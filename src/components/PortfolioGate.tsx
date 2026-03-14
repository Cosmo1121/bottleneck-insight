import { AlertTriangle } from "lucide-react";
import type { BottleneckAnalysis } from "@/types/analysis";

interface PortfolioGateProps {
  analysis: BottleneckAnalysis;
}

interface GateCheck {
  label: string;
  passed: boolean;
  detail: string;
}

const getGateChecks = (analysis: BottleneckAnalysis): GateCheck[] => {
  const evidenceCount = analysis.scarcity_evidence?.evidence_items?.length ?? 0;
  const confidence = analysis.overall_confidence ?? 0;
  const breakersStructured = analysis.thesis_breakers_structured;
  const breakersReviewed = breakersStructured
    ? Object.entries(breakersStructured).some(([k, v]) => k !== "notes" && v === true) ||
      (breakersStructured.notes?.trim()?.length ?? 0) > 0
    : false;
  const hasDisconfirming =
    (analysis.disconfirming_signals?.length ?? 0) > 0 ||
    (analysis.monitoring?.disconfirming_evidence?.length ?? 0) > 0;

  return [
    {
      label: "Evidence items",
      passed: evidenceCount >= 3,
      detail: `${evidenceCount} / 3 minimum sourced evidence items`,
    },
    {
      label: "Thesis breakers reviewed",
      passed: breakersReviewed,
      detail: breakersReviewed ? "At least one breaker assessed" : "No thesis breakers reviewed yet",
    },
    {
      label: "Disconfirming evidence",
      passed: hasDisconfirming,
      detail: hasDisconfirming ? "At least one disconfirming signal explored" : "No disconfirming signals explored",
    },
    {
      label: "Confidence threshold",
      passed: confidence >= 0.5,
      detail: `${Math.round(confidence * 100)}% / 50% minimum confidence`,
    },
  ];
};

const PortfolioGate = ({ analysis }: PortfolioGateProps) => {
  const checks = getGateChecks(analysis);
  const failedChecks = checks.filter((c) => !c.passed);

  if (failedChecks.length === 0) return null;

  return (
    <div className="rounded-sm border border-bottleneck-amber/30 bg-bottleneck-amber/5 p-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-bottleneck-amber shrink-0 mt-0.5" />
        <div className="space-y-2">
          <div>
            <p className="font-display font-bold text-sm text-bottleneck-amber">Premature conviction warning</p>
            <p className="text-xs text-foreground/70 mt-0.5">
              This thesis has not passed all review gates. Portfolio construction is available, but proceed with caution.
            </p>
          </div>
          <div className="space-y-1">
            {checks.map((check) => (
              <div key={check.label} className="flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${check.passed ? "bg-evidence-green" : "bg-thesis-breaker"}`} />
                <span className={`text-xs font-mono ${check.passed ? "text-muted-foreground" : "text-foreground/80"}`}>
                  {check.detail}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioGate;
