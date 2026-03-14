import { useState, useEffect } from "react";
import { XCircle, Save, Loader2 } from "lucide-react";
import type { BottleneckAnalysis, ThesisBreakersStructured } from "@/types/analysis";

const breakerFlags: { key: keyof Omit<ThesisBreakersStructured, "notes">; label: string; desc: string }[] = [
  { key: "technology_disruption", label: "Technology Disruption", desc: "Breakthrough making the bottleneck irrelevant" },
  { key: "regulatory_change", label: "Regulatory Change", desc: "Policy reform removing the constraint" },
  { key: "supply_expansion", label: "Supply Expansion", desc: "Rapid capacity build-out resolving scarcity" },
  { key: "demand_decline", label: "Demand Decline", desc: "Demand collapse eliminating pressure" },
  { key: "capital_flood", label: "Capital Flood", desc: "Massive investment compressing returns" },
  { key: "substitution", label: "Substitution", desc: "Alternative technology or resource replacing the bottleneck" },
  { key: "timing_mismatch", label: "Timing Mismatch", desc: "Thesis plays out but not in investable timeframe" },
  { key: "valuation_crowding", label: "Valuation Crowding", desc: "Market prices in the thesis before realization" },
];

interface ThesisBreakersWorkspaceProps {
  analysis: BottleneckAnalysis;
  onSave: (updates: Partial<BottleneckAnalysis>) => void;
  isSaving: boolean;
}

const ThesisBreakersWorkspace = ({ analysis, onSave, isSaving }: ThesisBreakersWorkspaceProps) => {
  const [breakers, setBreakers] = useState<ThesisBreakersStructured>(analysis.thesis_breakers_structured);

  useEffect(() => {
    setBreakers(analysis.thesis_breakers_structured);
  }, [analysis.id]);

  const toggle = (key: keyof Omit<ThesisBreakersStructured, "notes">) => {
    setBreakers((p) => ({ ...p, [key]: !p[key] }));
  };

  const activeCount = breakerFlags.filter((f) => breakers[f.key]).length;

  return (
    <main className="flex-1 h-screen overflow-y-auto p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <XCircle className="w-4 h-4 text-thesis-breaker" />
            <span className="data-label">Thesis Breakers</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground">Evaluate Failure Modes</h1>
          <p className="text-sm text-muted-foreground mt-1">Flag conditions that would invalidate the bottleneck thesis.</p>
        </div>
        <button onClick={() => onSave({ thesis_breakers_structured: breakers })} disabled={isSaving} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono bg-primary text-primary-foreground rounded-sm hover:opacity-90 disabled:opacity-50">
          {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
          Save
        </button>
      </div>

      <div className="panel">
        <div className="panel-header">
          <span className="data-label">Breaker Flags</span>
          <span className={`ml-auto text-xs font-mono ${activeCount > 3 ? "text-thesis-breaker" : activeCount > 1 ? "text-bottleneck-amber" : "text-evidence-green"}`}>
            {activeCount}/{breakerFlags.length} active risks
          </span>
        </div>
        <div className="divide-y divide-panel-border">
          {breakerFlags.map((flag) => (
            <label key={flag.key} className="flex items-center gap-4 px-4 py-3 cursor-pointer hover:bg-accent/50 transition-colors">
              <input type="checkbox" checked={breakers[flag.key] as boolean} onChange={() => toggle(flag.key)} className="rounded-sm" />
              <div className="flex-1">
                <p className={`text-sm font-medium ${breakers[flag.key] ? "text-thesis-breaker" : "text-foreground"}`}>{flag.label}</p>
                <p className="text-xs text-muted-foreground">{flag.desc}</p>
              </div>
              {breakers[flag.key] && <span className="text-xs font-mono px-1.5 py-0.5 rounded-sm bg-thesis-breaker/10 text-thesis-breaker">ACTIVE</span>}
            </label>
          ))}
        </div>
        <div className="p-4">
          <label className="data-label mb-1 block">Notes</label>
          <textarea
            value={breakers.notes}
            onChange={(e) => setBreakers((p) => ({ ...p, notes: e.target.value }))}
            placeholder="Additional notes on thesis risks..."
            rows={3}
            className="w-full bg-accent text-foreground font-mono text-xs p-3 rounded-sm border border-panel-border focus:outline-none focus:border-primary placeholder:text-muted-foreground resize-none"
          />
        </div>
      </div>
    </main>
  );
};

export default ThesisBreakersWorkspace;
