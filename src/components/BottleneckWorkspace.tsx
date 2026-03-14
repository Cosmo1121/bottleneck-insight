import { AlertTriangle, CheckCircle2, XCircle, FileText, Save, Loader2 } from "lucide-react";
import ValueChainLadder from "./ValueChainLadder";
import type { BottleneckAnalysis } from "@/types/analysis";
import { useState, useEffect } from "react";

interface BottleneckWorkspaceProps {
  analysis: BottleneckAnalysis;
  onSave: (updates: Partial<BottleneckAnalysis>) => void;
  isSaving: boolean;
}

const BottleneckWorkspace = ({ analysis, onSave, isSaving }: BottleneckWorkspaceProps) => {
  const [thesis, setThesis] = useState(analysis.thesis);
  const [bottleneck, setBottleneck] = useState(analysis.primary_bottleneck);
  const [evidenceText, setEvidenceText] = useState("");

  useEffect(() => {
    setThesis(analysis.thesis);
    setBottleneck(analysis.primary_bottleneck);
  }, [analysis.id]);

  const handleSave = () => {
    onSave({
      thesis,
      primary_bottleneck: bottleneck,
    });
  };

  return (
    <main className="flex-1 h-screen overflow-y-auto p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="status-dot bg-evidence-green" />
            <span className="data-label">Active Analysis</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground">{analysis.theme}</h1>
          <div className="flex gap-3 mt-1">
            {analysis.geography && <span className="text-xs font-mono text-muted-foreground">{analysis.geography}</span>}
            {analysis.time_horizon && <span className="text-xs font-mono text-muted-foreground">{analysis.time_horizon}</span>}
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono bg-primary text-primary-foreground rounded-sm hover:opacity-90 disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
          Save
        </button>
      </div>

      {/* Thesis */}
      <div className="panel">
        <div className="panel-header">
          <FileText className="w-4 h-4 text-primary" />
          <span className="data-label">Thesis</span>
        </div>
        <div className="p-4">
          <textarea
            value={thesis}
            onChange={(e) => setThesis(e.target.value)}
            placeholder="What is the one-sentence investment thesis?"
            rows={3}
            className="w-full bg-accent text-foreground font-mono text-sm p-3 rounded-sm border border-panel-border focus:outline-none focus:border-primary placeholder:text-muted-foreground resize-none"
          />
        </div>
      </div>

      {/* Constraint */}
      <div className="panel">
        <div className="panel-header">
          <AlertTriangle className="w-4 h-4 text-bottleneck-amber" />
          <span className="data-label">Primary Constraint</span>
        </div>
        <div className="p-4">
          <input
            value={bottleneck}
            onChange={(e) => setBottleneck(e.target.value)}
            placeholder="What is the primary bottleneck?"
            className="w-full bg-accent text-foreground font-mono text-sm px-3 py-2 rounded-sm border border-panel-border focus:outline-none focus:border-primary placeholder:text-muted-foreground"
          />
          {analysis.scarcity_types.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {analysis.scarcity_types.map((t) => (
                <span key={t} className="text-xs font-mono px-2 py-0.5 rounded-sm bg-bottleneck-amber/10 text-bottleneck-amber border border-bottleneck-amber/20">
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Evidence */}
      <div className="panel">
        <div className="panel-header">
          <CheckCircle2 className="w-4 h-4 text-evidence-green" />
          <span className="data-label">Scarcity Evidence</span>
        </div>
        <div className="p-4 space-y-1.5">
          {analysis.evidence_notes.map((e, i) => (
            <div key={i} className="flex items-start gap-2">
              <CheckCircle2 className="w-3 h-3 text-evidence-green mt-0.5 shrink-0" />
              <span className="text-xs text-muted-foreground">{e}</span>
            </div>
          ))}
          {analysis.evidence_notes.length === 0 && (
            <p className="text-xs text-muted-foreground italic">No evidence added yet</p>
          )}
        </div>
      </div>

      {/* Value Chain */}
      <div className="panel">
        <div className="panel-header">
          <span className="data-label">Value Chain Analysis</span>
        </div>
        <div className="p-4">
          <ValueChainLadder data={analysis.value_chain} />
        </div>
      </div>

      {/* False Friends + Thesis Breakers */}
      <div className="grid grid-cols-2 gap-4">
        <div className="panel">
          <div className="panel-header">
            <AlertTriangle className="w-4 h-4 text-bottleneck-amber" />
            <span className="data-label">False Friends</span>
          </div>
          <div className="p-4 space-y-1.5">
            {analysis.false_friends.length > 0
              ? analysis.false_friends.map((f) => (
                  <div key={f} className="flex items-start gap-2">
                    <AlertTriangle className="w-3 h-3 text-bottleneck-amber mt-0.5 shrink-0" />
                    <span className="text-xs text-muted-foreground">{f}</span>
                  </div>
                ))
              : <p className="text-xs text-muted-foreground italic">None identified</p>
            }
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <XCircle className="w-4 h-4 text-thesis-breaker" />
            <span className="data-label">Thesis Breakers</span>
          </div>
          <div className="p-4 space-y-1.5">
            {analysis.thesis_breakers.length > 0
              ? analysis.thesis_breakers.map((t) => (
                  <div key={t} className="flex items-start gap-2">
                    <XCircle className="w-3 h-3 text-thesis-breaker mt-0.5 shrink-0" />
                    <span className="text-xs text-muted-foreground">{t}</span>
                  </div>
                ))
              : <p className="text-xs text-muted-foreground italic">None identified</p>
            }
          </div>
        </div>
      </div>
    </main>
  );
};

export default BottleneckWorkspace;
