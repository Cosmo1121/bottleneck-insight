import { useState, useEffect } from "react";
import { Activity, Save, Loader2, Plus, X, TrendingUp, TrendingDown, Minus, Clock } from "lucide-react";
import { motion } from "framer-motion";
import type { BottleneckAnalysis, MonitoringData, MonitoringIndicator } from "@/types/analysis";
import EditableTagList from "./EditableTagList";

const emptyIndicator: MonitoringIndicator = {
  indicator: "", category: "", current_signal: "", desired_direction: "", frequency: "", notes: "",
};

const statusOptions = ["", "strong", "intact", "weakening", "broken"];
const directionOptions = ["", "improving", "stable", "deteriorating"];
const frequencyOptions = ["", "daily", "weekly", "monthly", "quarterly"];

interface MonitorWorkspaceProps {
  analysis: BottleneckAnalysis;
  onSave: (updates: Partial<BottleneckAnalysis>) => void;
  isSaving: boolean;
}

const MonitorWorkspace = ({ analysis, onSave, isSaving }: MonitorWorkspaceProps) => {
  const [mon, setMon] = useState<MonitoringData>(analysis.monitoring);

  useEffect(() => {
    setMon(analysis.monitoring);
  }, [analysis.id]);

  const addIndicator = () => {
    setMon((p) => ({ ...p, key_indicators: [...p.key_indicators, { ...emptyIndicator }] }));
  };

  const updateIndicator = (idx: number, field: keyof MonitoringIndicator, value: string) => {
    setMon((p) => {
      const inds = [...p.key_indicators];
      inds[idx] = { ...inds[idx], [field]: value };
      return { ...p, key_indicators: inds };
    });
  };

  const removeIndicator = (idx: number) => {
    setMon((p) => ({ ...p, key_indicators: p.key_indicators.filter((_, i) => i !== idx) }));
  };

  return (
    <main className="flex-1 h-screen overflow-y-auto p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-4 h-4 text-primary" />
            <span className="data-label">Thesis Monitor</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground">Signal Tracking</h1>
          <p className="text-sm text-muted-foreground mt-1">Track indicators that confirm or invalidate the thesis.</p>
        </div>
        <button onClick={() => onSave({ monitoring: mon })} disabled={isSaving} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono bg-primary text-primary-foreground rounded-sm hover:opacity-90 disabled:opacity-50">
          {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
          Save
        </button>
      </div>

      {/* Thesis Status */}
      <div className="panel">
        <div className="panel-header">
          <span className="data-label">Thesis Status</span>
        </div>
        <div className="p-4">
          <select
            value={mon.thesis_status}
            onChange={(e) => setMon((p) => ({ ...p, thesis_status: e.target.value }))}
            className="bg-accent text-foreground text-sm px-3 py-2 rounded-sm border border-panel-border font-mono w-full"
          >
            {statusOptions.map((s) => <option key={s} value={s}>{s || "Select thesis status..."}</option>)}
          </select>
        </div>
      </div>

      {/* Key Indicators */}
      <div className="panel">
        <div className="panel-header">
          <span className="data-label">Key Indicators</span>
          <button onClick={addIndicator} className="ml-auto flex items-center gap-1 text-xs text-primary hover:text-foreground transition-colors">
            <Plus className="w-3 h-3" /> Add Indicator
          </button>
        </div>
        <div className="divide-y divide-panel-border">
          {mon.key_indicators.length === 0 && (
            <p className="px-4 py-6 text-xs text-muted-foreground text-center italic">No indicators added yet.</p>
          )}
          {mon.key_indicators.map((ind, i) => (
            <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="data-label">Indicator #{i + 1}</span>
                <button onClick={() => removeIndicator(i)} className="text-thesis-breaker hover:opacity-80"><X className="w-3 h-3" /></button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input value={ind.indicator} onChange={(e) => updateIndicator(i, "indicator", e.target.value)} placeholder="Indicator name..." className="bg-accent text-foreground text-xs px-2 py-1.5 rounded-sm border border-panel-border font-mono placeholder:text-muted-foreground" />
                <input value={ind.category} onChange={(e) => updateIndicator(i, "category", e.target.value)} placeholder="Category..." className="bg-accent text-foreground text-xs px-2 py-1.5 rounded-sm border border-panel-border font-mono placeholder:text-muted-foreground" />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <input value={ind.current_signal} onChange={(e) => updateIndicator(i, "current_signal", e.target.value)} placeholder="Current signal..." className="bg-accent text-foreground text-xs px-2 py-1.5 rounded-sm border border-panel-border font-mono placeholder:text-muted-foreground" />
                <select value={ind.desired_direction} onChange={(e) => updateIndicator(i, "desired_direction", e.target.value)} className="bg-accent text-foreground text-xs px-2 py-1.5 rounded-sm border border-panel-border font-mono">
                  {directionOptions.map((d) => <option key={d} value={d}>{d || "Direction..."}</option>)}
                </select>
                <select value={ind.frequency} onChange={(e) => updateIndicator(i, "frequency", e.target.value)} className="bg-accent text-foreground text-xs px-2 py-1.5 rounded-sm border border-panel-border font-mono">
                  {frequencyOptions.map((f) => <option key={f} value={f}>{f || "Frequency..."}</option>)}
                </select>
              </div>
              <input value={ind.notes} onChange={(e) => updateIndicator(i, "notes", e.target.value)} placeholder="Notes..." className="w-full bg-accent text-foreground text-xs px-2 py-1.5 rounded-sm border border-panel-border font-mono placeholder:text-muted-foreground" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Evidence lists */}
      <div className="grid grid-cols-2 gap-4">
        <div className="panel">
          <div className="panel-header">
            <TrendingUp className="w-4 h-4 text-evidence-green" />
            <span className="data-label">Confirming Evidence</span>
          </div>
          <div className="p-4">
            <EditableTagList items={mon.confirming_evidence} onChange={(items) => setMon((p) => ({ ...p, confirming_evidence: items }))} placeholder="Add confirming signal..." tagClassName="bg-evidence-green/10 text-evidence-green border border-evidence-green/20" />
          </div>
        </div>
        <div className="panel">
          <div className="panel-header">
            <Minus className="w-4 h-4 text-bottleneck-amber" />
            <span className="data-label">Weakening Signals</span>
          </div>
          <div className="p-4">
            <EditableTagList items={mon.weakening_signals} onChange={(items) => setMon((p) => ({ ...p, weakening_signals: items }))} placeholder="Add weakening signal..." tagClassName="bg-bottleneck-amber/10 text-bottleneck-amber border border-bottleneck-amber/20" />
          </div>
        </div>
      </div>
      <div className="panel">
        <div className="panel-header">
          <TrendingDown className="w-4 h-4 text-thesis-breaker" />
          <span className="data-label">Disconfirming Evidence</span>
        </div>
        <div className="p-4">
          <EditableTagList items={mon.disconfirming_evidence} onChange={(items) => setMon((p) => ({ ...p, disconfirming_evidence: items }))} placeholder="Add disconfirming evidence..." tagClassName="bg-thesis-breaker/10 text-thesis-breaker border border-thesis-breaker/20" />
        </div>
      </div>
    </main>
  );
};

export default MonitorWorkspace;
