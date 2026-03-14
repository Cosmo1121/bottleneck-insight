import { AlertTriangle, CheckCircle2, XCircle, FileText, Save, Loader2, Tag, Sparkles } from "lucide-react";
import type { BottleneckAnalysis } from "@/types/analysis";
import { useState, useEffect } from "react";
import EditableTagList from "./EditableTagList";

interface BottleneckWorkspaceProps {
  analysis: BottleneckAnalysis;
  onSave: (updates: Partial<BottleneckAnalysis>) => void;
  isSaving: boolean;
  onAutofill?: () => void;
  isAutofilling?: boolean;
}

const statusOptions = ["draft", "active", "monitoring", "closed"];
const stageOptions = ["", "hypothesis", "evidence-gathering", "confirmed", "monitoring", "degrading"];
const riskOptions = ["", "low", "medium", "high", "very-high"];
const subjectTypes = ["", "macro_theme", "sector", "industry", "commodity", "geography", "technology", "policy"];

const BottleneckWorkspace = ({ analysis, onSave, isSaving, onAutofill, isAutofilling }: BottleneckWorkspaceProps) => {
  const [local, setLocal] = useState({
    thesis: analysis.thesis,
    worldview_assumption: analysis.worldview_assumption,
    demand_wave: analysis.demand_wave,
    thesis_stage: analysis.thesis_stage,
    primary_bottleneck: analysis.primary_bottleneck,
    constraint_description: analysis.constraint_description,
    constraint_measurable: analysis.constraint_measurable,
    why_now: analysis.why_now,
    time_to_resolve: analysis.time_to_resolve,
    subject_type: analysis.subject_type,
    subject_description: analysis.subject_description,
    risk_level: analysis.risk_level,
    public_markets_only: analysis.public_markets_only,
    status: analysis.status,
    analyst: analysis.analyst,
    source_context: analysis.source_context,
    time_horizon: analysis.time_horizon,
  });
  const [structuralShift, setStructuralShift] = useState(analysis.structural_shift);
  const [scarcityTypes, setScarcityTypes] = useState(analysis.scarcity_types);
  const [tags, setTags] = useState(analysis.tags);
  const [geoList, setGeoList] = useState(analysis.geography_list);

  useEffect(() => {
    setLocal({
      thesis: analysis.thesis,
      worldview_assumption: analysis.worldview_assumption,
      demand_wave: analysis.demand_wave,
      thesis_stage: analysis.thesis_stage,
      primary_bottleneck: analysis.primary_bottleneck,
      constraint_description: analysis.constraint_description,
      constraint_measurable: analysis.constraint_measurable,
      why_now: analysis.why_now,
      time_to_resolve: analysis.time_to_resolve,
      subject_type: analysis.subject_type,
      subject_description: analysis.subject_description,
      risk_level: analysis.risk_level,
      public_markets_only: analysis.public_markets_only,
      status: analysis.status,
      analyst: analysis.analyst,
      source_context: analysis.source_context,
      time_horizon: analysis.time_horizon,
    });
    setStructuralShift(analysis.structural_shift);
    setScarcityTypes(analysis.scarcity_types);
    setTags(analysis.tags);
    setGeoList(analysis.geography_list);
  }, [analysis.id, analysis.updated_at]);

  const handleSave = () => {
    onSave({
      ...local,
      structural_shift: structuralShift,
      scarcity_types: scarcityTypes,
      tags,
      geography_list: geoList,
    });
  };

  const field = (key: keyof typeof local, value: string) => setLocal((p) => ({ ...p, [key]: value }));

  return (
    <main className="flex-1 h-screen overflow-y-auto p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="status-dot bg-evidence-green" />
            <span className="data-label">Active Analysis</span>
            <select value={local.status} onChange={(e) => field("status", e.target.value)} className="bg-accent text-foreground text-xs px-2 py-0.5 rounded-sm border border-panel-border font-mono ml-2">
              {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground">{analysis.theme}</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onAutofill}
            disabled={isAutofilling || isSaving}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono bg-accent text-foreground border border-primary/40 rounded-sm hover:bg-primary/10 disabled:opacity-50 transition-colors"
          >
            {isAutofilling ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3 text-primary" />}
            {isAutofilling ? "Generating..." : "AI Auto-fill"}
          </button>
          <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono bg-primary text-primary-foreground rounded-sm hover:opacity-90 disabled:opacity-50">
            {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
            Save
          </button>
        </div>
      </div>

      {/* Meta */}
      <div className="panel">
        <div className="panel-header">
          <Tag className="w-4 h-4 text-muted-foreground" />
          <span className="data-label">Meta & Subject</span>
        </div>
        <div className="p-4 grid grid-cols-2 gap-3">
          <div>
            <label className="data-label mb-1 block">Subject Type</label>
            <select value={local.subject_type} onChange={(e) => field("subject_type", e.target.value)} className="w-full bg-accent text-foreground text-xs px-2 py-1.5 rounded-sm border border-panel-border font-mono">
              {subjectTypes.map((t) => <option key={t} value={t}>{t || "Select..."}</option>)}
            </select>
          </div>
          <div>
            <label className="data-label mb-1 block">Risk Level</label>
            <select value={local.risk_level} onChange={(e) => field("risk_level", e.target.value)} className="w-full bg-accent text-foreground text-xs px-2 py-1.5 rounded-sm border border-panel-border font-mono">
              {riskOptions.map((r) => <option key={r} value={r}>{r || "Select..."}</option>)}
            </select>
          </div>
          <div>
            <label className="data-label mb-1 block">Analyst</label>
            <input value={local.analyst} onChange={(e) => field("analyst", e.target.value)} placeholder="Analyst name..." className="w-full bg-accent text-foreground text-xs px-2 py-1.5 rounded-sm border border-panel-border font-mono placeholder:text-muted-foreground" />
          </div>
          <div>
            <label className="data-label mb-1 block">Time Horizon</label>
            <input value={local.time_horizon} onChange={(e) => field("time_horizon", e.target.value)} placeholder="e.g. 3-5 years" className="w-full bg-accent text-foreground text-xs px-2 py-1.5 rounded-sm border border-panel-border font-mono placeholder:text-muted-foreground" />
          </div>
          <div className="col-span-2">
            <label className="data-label mb-1 block">Subject Description</label>
            <input value={local.subject_description} onChange={(e) => field("subject_description", e.target.value)} placeholder="Describe the subject..." className="w-full bg-accent text-foreground text-xs px-2 py-1.5 rounded-sm border border-panel-border font-mono placeholder:text-muted-foreground" />
          </div>
          <div className="col-span-2 flex items-center gap-3">
            <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
              <input type="checkbox" checked={local.public_markets_only} onChange={(e) => setLocal((p) => ({ ...p, public_markets_only: e.target.checked }))} className="rounded-sm" />
              Public markets only
            </label>
          </div>
          <div className="col-span-2">
            <label className="data-label mb-1 block">Geography</label>
            <EditableTagList items={geoList} onChange={setGeoList} placeholder="Add geography..." />
          </div>
          <div className="col-span-2">
            <label className="data-label mb-1 block">Tags</label>
            <EditableTagList items={tags} onChange={setTags} placeholder="Add tag..." />
          </div>
        </div>
      </div>

      {/* Thesis */}
      <div className="panel">
        <div className="panel-header">
          <FileText className="w-4 h-4 text-primary" />
          <span className="data-label">Thesis</span>
        </div>
        <div className="p-4 space-y-3">
          <div>
            <label className="data-label mb-1 block">One-Sentence Thesis</label>
            <textarea value={local.thesis} onChange={(e) => field("thesis", e.target.value)} placeholder="What is the core investment thesis?" rows={2} className="w-full bg-accent text-foreground font-mono text-sm p-3 rounded-sm border border-panel-border focus:outline-none focus:border-primary placeholder:text-muted-foreground resize-none" />
          </div>
          <div>
            <label className="data-label mb-1 block">Worldview Assumption</label>
            <input value={local.worldview_assumption} onChange={(e) => field("worldview_assumption", e.target.value)} placeholder="What structural change drives this thesis?" className="w-full bg-accent text-foreground text-xs px-2 py-1.5 rounded-sm border border-panel-border font-mono placeholder:text-muted-foreground" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="data-label mb-1 block">Demand Wave</label>
              <input value={local.demand_wave} onChange={(e) => field("demand_wave", e.target.value)} placeholder="Source of demand..." className="w-full bg-accent text-foreground text-xs px-2 py-1.5 rounded-sm border border-panel-border font-mono placeholder:text-muted-foreground" />
            </div>
            <div>
              <label className="data-label mb-1 block">Thesis Stage</label>
              <select value={local.thesis_stage} onChange={(e) => field("thesis_stage", e.target.value)} className="w-full bg-accent text-foreground text-xs px-2 py-1.5 rounded-sm border border-panel-border font-mono">
                {stageOptions.map((s) => <option key={s} value={s}>{s || "Select..."}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="data-label mb-1 block">Structural Shifts</label>
            <EditableTagList items={structuralShift} onChange={setStructuralShift} placeholder="Add structural shift..." />
          </div>
        </div>
      </div>

      {/* Constraints */}
      <div className="panel">
        <div className="panel-header">
          <AlertTriangle className="w-4 h-4 text-bottleneck-amber" />
          <span className="data-label">Constraints</span>
        </div>
        <div className="p-4 space-y-3">
          <div>
            <label className="data-label mb-1 block">Primary Bottleneck</label>
            <input value={local.primary_bottleneck} onChange={(e) => field("primary_bottleneck", e.target.value)} placeholder="What is the primary constraint?" className="w-full bg-accent text-foreground font-mono text-sm px-3 py-2 rounded-sm border border-panel-border focus:outline-none focus:border-primary placeholder:text-muted-foreground" />
          </div>
          <div>
            <label className="data-label mb-1 block">Constraint Description</label>
            <textarea value={local.constraint_description} onChange={(e) => field("constraint_description", e.target.value)} placeholder="Describe the constraint in detail..." rows={2} className="w-full bg-accent text-foreground font-mono text-xs p-3 rounded-sm border border-panel-border focus:outline-none focus:border-primary placeholder:text-muted-foreground resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="data-label mb-1 block">Why Now?</label>
              <input value={local.why_now} onChange={(e) => field("why_now", e.target.value)} placeholder="Why is this constraint binding now?" className="w-full bg-accent text-foreground text-xs px-2 py-1.5 rounded-sm border border-panel-border font-mono placeholder:text-muted-foreground" />
            </div>
            <div>
              <label className="data-label mb-1 block">Time to Resolve</label>
              <input value={local.time_to_resolve} onChange={(e) => field("time_to_resolve", e.target.value)} placeholder="e.g. 3-7 years" className="w-full bg-accent text-foreground text-xs px-2 py-1.5 rounded-sm border border-panel-border font-mono placeholder:text-muted-foreground" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
              <input type="checkbox" checked={local.constraint_measurable} onChange={(e) => setLocal((p) => ({ ...p, constraint_measurable: e.target.checked }))} className="rounded-sm" />
              Constraint is measurable
            </label>
          </div>
          <div>
            <label className="data-label mb-1 block">Scarcity Types</label>
            <EditableTagList items={scarcityTypes} onChange={setScarcityTypes} placeholder="Add scarcity type..." tagClassName="bg-bottleneck-amber/10 text-bottleneck-amber border border-bottleneck-amber/20" />
          </div>
        </div>
      </div>
    </main>
  );
};

export default BottleneckWorkspace;
