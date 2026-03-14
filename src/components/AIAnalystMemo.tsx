import { motion, AnimatePresence } from "framer-motion";
import { Brain, X, AlertTriangle, HelpCircle, Shield } from "lucide-react";
import type { BottleneckAnalysis } from "@/types/analysis";

interface AIAnalystMemoProps {
  analysis: BottleneckAnalysis;
  visible: boolean;
  onDismiss: () => void;
}

const getDecision = (analysis: BottleneckAnalysis): string => {
  const total = Object.values(analysis.scores).reduce((a, b) => a + b, 0);
  const confidence = analysis.overall_confidence ?? 0;
  if (total >= 30 && confidence >= 0.5) return "Promising";
  if (total < 15 || confidence < 0.2) return "Reject";
  if (total >= 20) return "Needs Evidence";
  return "Watch";
};

const getConfidenceLabel = (c: number): string => {
  if (c >= 0.7) return "High";
  if (c >= 0.4) return "Medium";
  return "Low";
};

const getFragileAssumption = (analysis: BottleneckAnalysis): string => {
  if (analysis.worldview_assumption) return analysis.worldview_assumption;
  if (analysis.thesis) return `The core thesis: "${analysis.thesis.slice(0, 80)}..."`;
  return "No explicit worldview assumption defined.";
};

const getMissingEvidence = (analysis: BottleneckAnalysis): string[] => {
  const missing: string[] = [];
  const ev = analysis.scarcity_evidence;
  if (!ev?.supply_shortages && !ev?.rising_prices) missing.push("No supply shortage or pricing signals confirmed");
  if (!ev?.evidence_items?.length) missing.push("No sourced evidence items added");
  if (!analysis.disconfirming_signals?.length && !analysis.monitoring?.disconfirming_evidence?.length) {
    missing.push("No disconfirming signals explored");
  }
  if (missing.length === 0) missing.push("Core evidence coverage looks adequate");
  return missing;
};

const getFalseFriendWarning = (analysis: BottleneckAnalysis): string => {
  if (analysis.false_friends?.length) {
    return `Watch for: ${analysis.false_friends.slice(0, 3).join(", ")}`;
  }
  return "No false friends identified — consider whether apparent beneficiaries may not capture value.";
};

const AIAnalystMemo = ({ analysis, visible, onDismiss }: AIAnalystMemoProps) => {
  const decision = getDecision(analysis);
  const confidence = analysis.overall_confidence ?? 0;
  const confidenceLabel = getConfidenceLabel(confidence);
  const missingEvidence = getMissingEvidence(analysis);

  const decisionColor =
    decision === "Promising" ? "text-evidence-green" :
    decision === "Reject" ? "text-thesis-breaker" :
    decision === "Watch" ? "text-primary" :
    "text-bottleneck-amber";

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -12, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -12, height: 0 }}
          className="panel border-primary/30 overflow-hidden"
        >
          <div className="panel-header justify-between">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-primary" />
              <span className="data-label">AI Analyst Memo</span>
            </div>
            <button onClick={onDismiss} className="text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="p-4 space-y-3">
            {/* Decision + Confidence */}
            <div className="flex items-center gap-4">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Decision</p>
                <p className={`font-display font-bold text-sm ${decisionColor}`}>{decision}</p>
              </div>
              <div>
                <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Confidence</p>
                <p className="font-display font-bold text-sm text-foreground">
                  {confidenceLabel} <span className="text-muted-foreground font-mono text-xs">({Math.round(confidence * 100)}%)</span>
                </p>
              </div>
            </div>

            {/* Core Reason */}
            <div>
              <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">Core Reason</p>
              <p className="text-xs text-foreground/80 leading-relaxed">
                {analysis.thesis || "No thesis defined yet."}
              </p>
            </div>

            {/* Fragile Assumption */}
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-bottleneck-amber shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-0.5">Most Fragile Assumption</p>
                <p className="text-xs text-foreground/80">{getFragileAssumption(analysis)}</p>
              </div>
            </div>

            {/* Missing Evidence */}
            <div className="flex items-start gap-2">
              <HelpCircle className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-0.5">Missing Evidence</p>
                <ul className="space-y-0.5">
                  {missingEvidence.map((m, i) => (
                    <li key={i} className="text-xs text-foreground/70">• {m}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* False Friend Warning */}
            <div className="flex items-start gap-2">
              <Shield className="w-3.5 h-3.5 text-thesis-breaker shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-0.5">False Friend Risk</p>
                <p className="text-xs text-foreground/70">{getFalseFriendWarning(analysis)}</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AIAnalystMemo;
