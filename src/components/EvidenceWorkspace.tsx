import { useState, useEffect } from "react";
import { CheckCircle2, Save, Loader2, Plus, X, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import type { BottleneckAnalysis, ScarcityEvidence, EvidenceItem } from "@/types/analysis";

const booleanFlags: { key: keyof Omit<ScarcityEvidence, "notes" | "evidence_items">; label: string }[] = [
  { key: "supply_shortages", label: "Supply Shortages" },
  { key: "long_lead_times", label: "Long Lead Times" },
  { key: "regulatory_backlog", label: "Regulatory Backlog" },
  { key: "capacity_constraints", label: "Capacity Constraints" },
  { key: "rising_prices", label: "Rising Prices" },
  { key: "industry_warnings", label: "Industry Warnings" },
  { key: "capex_surge", label: "Capex Surge" },
  { key: "utilization_pressure", label: "Utilization Pressure" },
];

const emptyItem: EvidenceItem = { source_name: "", source_type: "", date: "", signal: "", summary: "", confidence: 0.5 };

interface EvidenceWorkspaceProps {
  analysis: BottleneckAnalysis;
  onSave: (updates: Partial<BottleneckAnalysis>) => void;
  isSaving: boolean;
}

const EvidenceWorkspace = ({ analysis, onSave, isSaving }: EvidenceWorkspaceProps) => {
  const [evidence, setEvidence] = useState<ScarcityEvidence>(analysis.scarcity_evidence);

  useEffect(() => {
    setEvidence(analysis.scarcity_evidence);
  }, [analysis.id]);

  const toggleFlag = (key: keyof Omit<ScarcityEvidence, "notes" | "evidence_items">) => {
    setEvidence((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const addItem = () => {
    setEvidence((prev) => ({ ...prev, evidence_items: [...prev.evidence_items, { ...emptyItem }] }));
  };

  const updateItem = (idx: number, field: keyof EvidenceItem, value: any) => {
    setEvidence((prev) => {
      const items = [...prev.evidence_items];
      items[idx] = { ...items[idx], [field]: value };
      return { ...prev, evidence_items: items };
    });
  };

  const removeItem = (idx: number) => {
    setEvidence((prev) => ({ ...prev, evidence_items: prev.evidence_items.filter((_, i) => i !== idx) }));
  };

  const confirmedCount = booleanFlags.filter((f) => evidence[f.key]).length;

  return (
    <main className="flex-1 h-screen overflow-y-auto p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 className="w-4 h-4 text-evidence-green" />
            <span className="data-label">Scarcity Evidence</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground">Verify Scarcity</h1>
          <p className="text-sm text-muted-foreground mt-1">Document evidence that confirms or weakens the scarcity thesis.</p>
        </div>
        <button onClick={() => onSave({ scarcity_evidence: evidence })} disabled={isSaving} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono bg-primary text-primary-foreground rounded-sm hover:opacity-90 disabled:opacity-50">
          {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
          Save
        </button>
      </div>

      {/* Evidence Flags */}
      <div className="panel">
        <div className="panel-header">
          <span className="data-label">Evidence Indicators</span>
          <span className="ml-auto text-xs font-mono text-evidence-green">{confirmedCount}/{booleanFlags.length} confirmed</span>
        </div>
        <div className="p-4 grid grid-cols-2 gap-2">
          {booleanFlags.map((flag) => (
            <label key={flag.key} className="flex items-center gap-2 text-sm cursor-pointer py-1 px-2 rounded-sm hover:bg-accent transition-colors">
              <input type="checkbox" checked={evidence[flag.key] as boolean} onChange={() => toggleFlag(flag.key)} className="rounded-sm" />
              <span className={evidence[flag.key] ? "text-evidence-green" : "text-muted-foreground"}>{flag.label}</span>
            </label>
          ))}
        </div>
        <div className="px-4 pb-4">
          <label className="data-label mb-1 block">Evidence Notes</label>
          <textarea
            value={evidence.notes}
            onChange={(e) => setEvidence((p) => ({ ...p, notes: e.target.value }))}
            placeholder="General notes on scarcity evidence..."
            rows={2}
            className="w-full bg-accent text-foreground font-mono text-xs p-3 rounded-sm border border-panel-border focus:outline-none focus:border-primary placeholder:text-muted-foreground resize-none"
          />
        </div>
      </div>

      {/* Evidence Items */}
      <div className="panel">
        <div className="panel-header">
          <span className="data-label">Evidence Items</span>
          <button onClick={addItem} className="ml-auto flex items-center gap-1 text-xs text-primary hover:text-foreground transition-colors">
            <Plus className="w-3 h-3" /> Add Source
          </button>
        </div>
        <div className="divide-y divide-panel-border">
          {evidence.evidence_items.length === 0 && (
            <p className="px-4 py-6 text-xs text-muted-foreground text-center italic">No evidence items yet. Click "Add Source" to begin.</p>
          )}
          {evidence.evidence_items.map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="data-label">Source #{i + 1}</span>
                <button onClick={() => removeItem(i)} className="text-thesis-breaker hover:opacity-80"><X className="w-3 h-3" /></button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <input value={item.source_name} onChange={(e) => updateItem(i, "source_name", e.target.value)} placeholder="Source name..." className="bg-accent text-foreground text-xs px-2 py-1.5 rounded-sm border border-panel-border font-mono placeholder:text-muted-foreground" />
                <input value={item.source_type} onChange={(e) => updateItem(i, "source_type", e.target.value)} placeholder="Type (report, data, news)..." className="bg-accent text-foreground text-xs px-2 py-1.5 rounded-sm border border-panel-border font-mono placeholder:text-muted-foreground" />
                <input type="date" value={item.date} onChange={(e) => updateItem(i, "date", e.target.value)} className="bg-accent text-foreground text-xs px-2 py-1.5 rounded-sm border border-panel-border font-mono" />
              </div>
              <input value={item.signal} onChange={(e) => updateItem(i, "signal", e.target.value)} placeholder="Signal (what does this evidence show?)..." className="w-full bg-accent text-foreground text-xs px-2 py-1.5 rounded-sm border border-panel-border font-mono placeholder:text-muted-foreground" />
              <div className="flex gap-2">
                <input value={item.summary} onChange={(e) => updateItem(i, "summary", e.target.value)} placeholder="Summary..." className="flex-1 bg-accent text-foreground text-xs px-2 py-1.5 rounded-sm border border-panel-border font-mono placeholder:text-muted-foreground" />
                <div className="flex items-center gap-1">
                  <span className="text-xs text-muted-foreground">Conf:</span>
                  <input type="number" value={item.confidence} onChange={(e) => updateItem(i, "confidence", parseFloat(e.target.value) || 0)} min={0} max={1} step={0.1} className="w-14 bg-accent text-foreground text-xs px-2 py-1.5 rounded-sm border border-panel-border font-mono text-right" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default EvidenceWorkspace;
