import { useState, useEffect } from "react";
import { FileCheck, Save, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import type { BottleneckAnalysis } from "@/types/analysis";
import EditableTagList from "./EditableTagList";

interface SummaryWorkspaceProps {
  analysis: BottleneckAnalysis;
  onSave: (updates: Partial<BottleneckAnalysis>) => void;
  isSaving: boolean;
}

const strengthOptions = ["", "structural_bottleneck", "moderate_constraint", "narrative_theme", "weak_thesis"];
const strengthLabels: Record<string, string> = {
  structural_bottleneck: "Structural Bottleneck",
  moderate_constraint: "Moderate Constraint",
  narrative_theme: "Narrative Theme",
  weak_thesis: "Weak Thesis",
};
const priorityOptions = ["", "high", "medium", "low", "avoid"];

const SummaryWorkspace = ({ analysis, onSave, isSaving }: SummaryWorkspaceProps) => {
  const [local, setLocal] = useState({
    overall_confidence: analysis.overall_confidence,
    confidence_notes: analysis.confidence_notes,
    scarcity_strength: analysis.scarcity_strength,
    investment_priority: analysis.investment_priority,
    final_assessment: analysis.final_assessment,
  });
  const [unknowns, setUnknowns] = useState(analysis.major_unknowns);

  useEffect(() => {
    setLocal({
      overall_confidence: analysis.overall_confidence,
      confidence_notes: analysis.confidence_notes,
      scarcity_strength: analysis.scarcity_strength,
      investment_priority: analysis.investment_priority,
      final_assessment: analysis.final_assessment,
    });
    setUnknowns(analysis.major_unknowns);
  }, [analysis.id]);

  const totalScore = Object.values(analysis.scores).reduce((a, b) => a + b, 0);

  return (
    <main className="flex-1 h-screen overflow-y-auto p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FileCheck className="w-4 h-4 text-primary" />
            <span className="data-label">Summary & Confidence</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground">Final Assessment</h1>
          <p className="text-sm text-muted-foreground mt-1">Summarize the thesis conviction and overall assessment.</p>
        </div>
        <button onClick={() => onSave({ ...local, major_unknowns: unknowns })} disabled={isSaving} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono bg-primary text-primary-foreground rounded-sm hover:opacity-90 disabled:opacity-50">
          {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
          Save
        </button>
      </div>

      {/* Confidence */}
      <div className="panel">
        <div className="panel-header">
          <span className="data-label">Confidence</span>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <label className="data-label">Overall Confidence</label>
              <span className="font-mono text-sm font-bold text-foreground">{(local.overall_confidence * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={local.overall_confidence}
              onChange={(e) => setLocal((p) => ({ ...p, overall_confidence: parseFloat(e.target.value) }))}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground font-mono mt-1">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>
          <div>
            <label className="data-label mb-1 block">Confidence Notes</label>
            <textarea value={local.confidence_notes} onChange={(e) => setLocal((p) => ({ ...p, confidence_notes: e.target.value }))} placeholder="What drives your confidence level?" rows={2} className="w-full bg-accent text-foreground font-mono text-xs p-3 rounded-sm border border-panel-border focus:outline-none focus:border-primary placeholder:text-muted-foreground resize-none" />
          </div>
          <div>
            <label className="data-label mb-1 block">Major Unknowns</label>
            <EditableTagList items={unknowns} onChange={setUnknowns} placeholder="Add unknown..." tagClassName="bg-bottleneck-amber/10 text-bottleneck-amber border border-bottleneck-amber/20" />
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="panel">
        <div className="panel-header">
          <span className="data-label">Summary</span>
          <span className="ml-auto font-mono text-xs text-muted-foreground">Heatmap: {totalScore}/45</span>
        </div>
        <div className="p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="data-label mb-1 block">Scarcity Strength</label>
              <select value={local.scarcity_strength} onChange={(e) => setLocal((p) => ({ ...p, scarcity_strength: e.target.value }))} className="w-full bg-accent text-foreground text-xs px-2 py-1.5 rounded-sm border border-panel-border font-mono">
                {strengthOptions.map((s) => <option key={s} value={s}>{s || "Select..."}</option>)}
              </select>
            </div>
            <div>
              <label className="data-label mb-1 block">Investment Priority</label>
              <select value={local.investment_priority} onChange={(e) => setLocal((p) => ({ ...p, investment_priority: e.target.value }))} className="w-full bg-accent text-foreground text-xs px-2 py-1.5 rounded-sm border border-panel-border font-mono">
                {priorityOptions.map((p) => <option key={p} value={p}>{p || "Select..."}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="data-label mb-1 block">Final Assessment</label>
            <textarea value={local.final_assessment} onChange={(e) => setLocal((p) => ({ ...p, final_assessment: e.target.value }))} placeholder="Write the final assessment..." rows={4} className="w-full bg-accent text-foreground font-mono text-sm p-3 rounded-sm border border-panel-border focus:outline-none focus:border-primary placeholder:text-muted-foreground resize-none" />
          </div>
        </div>
      </div>

      {/* Principle */}
      <div className="panel border-primary/30 bg-primary/5">
        <div className="p-4 text-center">
          <p className="font-mono text-xs text-primary italic">
            "Do not invest in the story. Invest in what the story cannot proceed without."
          </p>
        </div>
      </div>
    </main>
  );
};

export default SummaryWorkspace;
