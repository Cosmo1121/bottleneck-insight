import { useState, useEffect } from "react";
import { Target, Save, Loader2, Plus, X, TrendingUp, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import type { BottleneckAnalysis, Opportunities, RankedArea, PublicMarketExample } from "@/types/analysis";

const emptyArea: RankedArea = {
  rank: 0, area_name: "", area_type: "", scarcity: "", pricing_power: "",
  duration: "", crowding: "", barriers_to_entry: "", value_capture: "", notes: "",
};

const emptyExample: PublicMarketExample = {
  ticker: "", name: "", role_in_thesis: "", fit_strength: "", notes: "",
};

const fitOptions = ["", "strong", "moderate", "weak", "speculative"];

interface OpportunitiesWorkspaceProps {
  analysis: BottleneckAnalysis;
  onSave: (updates: Partial<BottleneckAnalysis>) => void;
  isSaving: boolean;
  onNavigate?: (toolId: string) => void;
}

const OpportunitiesWorkspace = ({ analysis, onSave, isSaving }: OpportunitiesWorkspaceProps) => {
  const [opps, setOpps] = useState<Opportunities>(analysis.opportunities);

  useEffect(() => {
    setOpps(analysis.opportunities);
  }, [analysis.id]);

  const addArea = () => {
    setOpps((p) => ({
      ...p,
      ranked_areas: [...p.ranked_areas, { ...emptyArea, rank: p.ranked_areas.length + 1 }],
    }));
  };

  const updateArea = (idx: number, field: keyof RankedArea, value: any) => {
    setOpps((p) => {
      const areas = [...p.ranked_areas];
      areas[idx] = { ...areas[idx], [field]: value };
      return { ...p, ranked_areas: areas };
    });
  };

  const removeArea = (idx: number) => {
    setOpps((p) => ({
      ...p,
      ranked_areas: p.ranked_areas.filter((_, i) => i !== idx).map((a, i) => ({ ...a, rank: i + 1 })),
    }));
  };

  const addExample = () => {
    setOpps((p) => ({ ...p, public_market_examples: [...p.public_market_examples, { ...emptyExample }] }));
  };

  const updateExample = (idx: number, field: keyof PublicMarketExample, value: string) => {
    setOpps((p) => {
      const exs = [...p.public_market_examples];
      exs[idx] = { ...exs[idx], [field]: value };
      return { ...p, public_market_examples: exs };
    });
  };

  const removeExample = (idx: number) => {
    setOpps((p) => ({ ...p, public_market_examples: p.public_market_examples.filter((_, i) => i !== idx) }));
  };

  return (
    <main className="flex-1 h-screen overflow-y-auto p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Target className="w-4 h-4 text-primary" />
            <span className="data-label">Opportunities</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground">Ranked Investable Areas</h1>
          <p className="text-sm text-muted-foreground mt-1">Rank opportunities by value capture and add public market examples with tickers.</p>
        </div>
        <button onClick={() => onSave({ opportunities: opps })} disabled={isSaving} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono bg-primary text-primary-foreground rounded-sm hover:opacity-90 disabled:opacity-50">
          {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
          Save
        </button>
      </div>

      {/* Ranked Areas */}
      <div className="panel">
        <div className="panel-header">
          <span className="data-label">Ranked Areas</span>
          <button onClick={addArea} className="ml-auto flex items-center gap-1 text-xs text-primary hover:text-foreground transition-colors">
            <Plus className="w-3 h-3" /> Add Area
          </button>
        </div>
        <div className="divide-y divide-panel-border">
          {opps.ranked_areas.length === 0 && (
            <p className="px-4 py-6 text-xs text-muted-foreground text-center italic">No ranked areas yet.</p>
          )}
          {opps.ranked_areas.map((area, i) => (
            <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-display font-semibold text-sm text-evidence-green">#{area.rank}</span>
                <button onClick={() => removeArea(i)} className="text-thesis-breaker hover:opacity-80"><X className="w-3 h-3" /></button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input value={area.area_name} onChange={(e) => updateArea(i, "area_name", e.target.value)} placeholder="Area name..." className="bg-accent text-foreground text-xs px-2 py-1.5 rounded-sm border border-panel-border font-mono placeholder:text-muted-foreground" />
                <input value={area.area_type} onChange={(e) => updateArea(i, "area_type", e.target.value)} placeholder="Type (sector, commodity)..." className="bg-accent text-foreground text-xs px-2 py-1.5 rounded-sm border border-panel-border font-mono placeholder:text-muted-foreground" />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <input value={area.scarcity} onChange={(e) => updateArea(i, "scarcity", e.target.value)} placeholder="Scarcity..." className="bg-accent text-foreground text-xs px-2 py-1.5 rounded-sm border border-panel-border font-mono placeholder:text-muted-foreground" />
                <input value={area.pricing_power} onChange={(e) => updateArea(i, "pricing_power", e.target.value)} placeholder="Pricing power..." className="bg-accent text-foreground text-xs px-2 py-1.5 rounded-sm border border-panel-border font-mono placeholder:text-muted-foreground" />
                <input value={area.duration} onChange={(e) => updateArea(i, "duration", e.target.value)} placeholder="Duration..." className="bg-accent text-foreground text-xs px-2 py-1.5 rounded-sm border border-panel-border font-mono placeholder:text-muted-foreground" />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <input value={area.crowding} onChange={(e) => updateArea(i, "crowding", e.target.value)} placeholder="Crowding..." className="bg-accent text-foreground text-xs px-2 py-1.5 rounded-sm border border-panel-border font-mono placeholder:text-muted-foreground" />
                <input value={area.barriers_to_entry} onChange={(e) => updateArea(i, "barriers_to_entry", e.target.value)} placeholder="Barriers..." className="bg-accent text-foreground text-xs px-2 py-1.5 rounded-sm border border-panel-border font-mono placeholder:text-muted-foreground" />
                <input value={area.value_capture} onChange={(e) => updateArea(i, "value_capture", e.target.value)} placeholder="Value capture..." className="bg-accent text-foreground text-xs px-2 py-1.5 rounded-sm border border-panel-border font-mono placeholder:text-muted-foreground" />
              </div>
              <input value={area.notes} onChange={(e) => updateArea(i, "notes", e.target.value)} placeholder="Notes..." className="w-full bg-accent text-foreground text-xs px-2 py-1.5 rounded-sm border border-panel-border font-mono placeholder:text-muted-foreground" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Public Market Examples */}
      <div className="panel">
        <div className="panel-header">
          <TrendingUp className="w-4 h-4 text-bottleneck-amber" />
          <span className="data-label">Public Market Examples</span>
          <button onClick={addExample} className="ml-auto flex items-center gap-1 text-xs text-primary hover:text-foreground transition-colors">
            <Plus className="w-3 h-3" /> Add Ticker
          </button>
        </div>
        <div className="divide-y divide-panel-border">
          {opps.public_market_examples.length === 0 && (
            <p className="px-4 py-6 text-xs text-muted-foreground text-center italic">No tickers added yet.</p>
          )}
          {opps.public_market_examples.map((ex, i) => (
            <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs text-bottleneck-amber font-semibold">{ex.ticker || "TICKER"}</span>
                <button onClick={() => removeExample(i)} className="text-thesis-breaker hover:opacity-80"><X className="w-3 h-3" /></button>
              </div>
              <div className="grid grid-cols-4 gap-2">
                <input value={ex.ticker} onChange={(e) => updateExample(i, "ticker", e.target.value.toUpperCase())} placeholder="TICKER" className="bg-accent text-foreground text-xs px-2 py-1.5 rounded-sm border border-panel-border font-mono placeholder:text-muted-foreground uppercase" />
                <input value={ex.name} onChange={(e) => updateExample(i, "name", e.target.value)} placeholder="Company name..." className="bg-accent text-foreground text-xs px-2 py-1.5 rounded-sm border border-panel-border font-mono placeholder:text-muted-foreground" />
                <input value={ex.role_in_thesis} onChange={(e) => updateExample(i, "role_in_thesis", e.target.value)} placeholder="Role in thesis..." className="bg-accent text-foreground text-xs px-2 py-1.5 rounded-sm border border-panel-border font-mono placeholder:text-muted-foreground" />
                <select value={ex.fit_strength} onChange={(e) => updateExample(i, "fit_strength", e.target.value)} className="bg-accent text-foreground text-xs px-2 py-1.5 rounded-sm border border-panel-border font-mono">
                  {fitOptions.map((f) => <option key={f} value={f}>{f || "Fit strength..."}</option>)}
                </select>
              </div>
              <input value={ex.notes} onChange={(e) => updateExample(i, "notes", e.target.value)} placeholder="Notes..." className="w-full mt-2 bg-accent text-foreground text-xs px-2 py-1.5 rounded-sm border border-panel-border font-mono placeholder:text-muted-foreground" />
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default OpportunitiesWorkspace;
