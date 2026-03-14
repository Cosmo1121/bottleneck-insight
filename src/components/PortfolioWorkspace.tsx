import { useState, useEffect } from "react";
import { Briefcase, Shield, Layers, Wrench, Rocket, AlertTriangle, Save, Loader2, Plus, X } from "lucide-react";
import { motion } from "framer-motion";
import type { BottleneckAnalysis, PortfolioData, PortfolioLayer, PortfolioRisk } from "@/types/analysis";
import EditableTagList from "./EditableTagList";
import PortfolioGate from "./PortfolioGate";

const layerIcons = [Shield, Layers, Wrench, Rocket, AlertTriangle];
const layerStyles = [
  { color: "text-evidence-green", bgColor: "bg-evidence-green/10 border-evidence-green/20", barColor: "bg-evidence-green" },
  { color: "text-primary", bgColor: "bg-primary/10 border-primary/20", barColor: "bg-primary" },
  { color: "text-bottleneck-amber", bgColor: "bg-bottleneck-amber/10 border-bottleneck-amber/20", barColor: "bg-bottleneck-amber" },
  { color: "text-muted-foreground", bgColor: "bg-accent", barColor: "bg-muted-foreground" },
  { color: "text-thesis-breaker", bgColor: "bg-thesis-breaker/10 border-thesis-breaker/20", barColor: "bg-thesis-breaker" },
];

interface PortfolioWorkspaceProps {
  analysis: BottleneckAnalysis;
  onSave: (updates: Partial<BottleneckAnalysis>) => void;
  isSaving: boolean;
}

const PortfolioWorkspace = ({ analysis, onSave, isSaving }: PortfolioWorkspaceProps) => {
  const [portfolio, setPortfolio] = useState<PortfolioData>(analysis.portfolio);
  const [newRiskLabel, setNewRiskLabel] = useState("");
  const [newRiskDesc, setNewRiskDesc] = useState("");
  const [newRiskLevel, setNewRiskLevel] = useState<"Low" | "Medium" | "High">("Medium");

  useEffect(() => {
    setPortfolio(analysis.portfolio);
  }, [analysis.id]);

  const updateLayerWeight = (idx: number, weight: number) => {
    setPortfolio((prev) => {
      const layers = [...prev.layers];
      layers[idx] = { ...layers[idx], weight: Math.max(0, Math.min(100, weight)) };
      return { ...prev, layers };
    });
  };

  const updateLayerItems = (idx: number, items: string[]) => {
    setPortfolio((prev) => {
      const layers = [...prev.layers];
      layers[idx] = { ...layers[idx], items };
      return { ...prev, layers };
    });
  };

  const addRisk = () => {
    if (!newRiskLabel.trim()) return;
    setPortfolio((prev) => ({
      ...prev,
      risks: [...prev.risks, { label: newRiskLabel.trim(), level: newRiskLevel, description: newRiskDesc.trim() }],
    }));
    setNewRiskLabel("");
    setNewRiskDesc("");
  };

  const removeRisk = (idx: number) => {
    setPortfolio((prev) => ({ ...prev, risks: prev.risks.filter((_, i) => i !== idx) }));
  };

  const handleSave = () => {
    onSave({ portfolio });
  };

  const totalWeight = portfolio.layers.reduce((a, l) => a + l.weight, 0);

  return (
    <main className="flex-1 h-screen overflow-y-auto p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Briefcase className="w-4 h-4 text-primary" />
            <span className="data-label">Portfolio Builder</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground">Bottleneck Portfolio Construction</h1>
          <p className="text-sm text-muted-foreground mt-1">Set allocation weights and add holdings per layer.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-xs font-mono ${totalWeight === 100 ? "text-evidence-green" : "text-bottleneck-amber"}`}>
            {totalWeight}% allocated
          </span>
          <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono bg-primary text-primary-foreground rounded-sm hover:opacity-90 disabled:opacity-50">
            {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
            Save
          </button>
        </div>
      </div>

      <PortfolioGate analysis={analysis} />

      <div className="space-y-3">
        {portfolio.layers.map((layer, i) => {
          const Icon = layerIcons[i] ?? Briefcase;
          const style = layerStyles[i] ?? layerStyles[0];
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="panel"
            >
              <div className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Icon className={`w-4 h-4 ${style.color}`} />
                  <span className={`font-display font-semibold text-sm ${style.color}`}>{layer.label}</span>
                  <div className="ml-auto flex items-center gap-2">
                    <input
                      type="number"
                      value={layer.weight}
                      onChange={(e) => updateLayerWeight(i, parseInt(e.target.value) || 0)}
                      className="w-14 bg-accent text-foreground font-mono text-sm px-2 py-1 rounded-sm border border-panel-border focus:outline-none focus:border-primary text-right"
                      min={0}
                      max={100}
                    />
                    <span className="font-mono text-sm text-muted-foreground">%</span>
                  </div>
                </div>
                <div className="h-2 bg-accent rounded-sm overflow-hidden mb-3">
                  <motion.div
                    className={`h-full rounded-sm ${style.barColor}`}
                    animate={{ width: `${layer.weight}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <EditableTagList
                  items={layer.items}
                  onChange={(items) => updateLayerItems(i, items)}
                  placeholder={`Add ${layer.label.toLowerCase()} holdings...`}
                  tagClassName={`border ${style.bgColor}`}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Risks */}
      <div className="panel">
        <div className="panel-header">
          <AlertTriangle className="w-4 h-4 text-bottleneck-amber" />
          <span className="data-label">Risk Assessment</span>
        </div>
        <div className="p-4 space-y-3">
          {portfolio.risks.map((r, i) => (
            <div key={i} className="flex items-start gap-3 group">
              <span className={`text-xs font-mono px-1.5 py-0.5 rounded-sm shrink-0 ${
                r.level === "Low" ? "bg-evidence-green/10 text-evidence-green" :
                r.level === "Medium" ? "bg-bottleneck-amber/10 text-bottleneck-amber" :
                "bg-thesis-breaker/10 text-thesis-breaker"
              }`}>{r.level}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground font-medium">{r.label}</p>
                {r.description && <p className="text-xs text-muted-foreground">{r.description}</p>}
              </div>
              <button onClick={() => removeRisk(i)} className="opacity-0 group-hover:opacity-100 text-thesis-breaker transition-opacity">
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}

          {/* Add risk form */}
          <div className="border-t border-panel-border pt-3 space-y-2">
            <div className="flex gap-2">
              <input
                value={newRiskLabel}
                onChange={(e) => setNewRiskLabel(e.target.value)}
                placeholder="Risk label..."
                className="flex-1 bg-accent text-foreground text-xs px-2 py-1.5 rounded-sm border border-panel-border focus:outline-none focus:border-primary placeholder:text-muted-foreground font-mono"
              />
              <select
                value={newRiskLevel}
                onChange={(e) => setNewRiskLevel(e.target.value as "Low" | "Medium" | "High")}
                className="bg-accent text-foreground text-xs px-2 py-1.5 rounded-sm border border-panel-border focus:outline-none focus:border-primary font-mono"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div className="flex gap-2">
              <input
                value={newRiskDesc}
                onChange={(e) => setNewRiskDesc(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addRisk()}
                placeholder="Description (optional)..."
                className="flex-1 bg-accent text-foreground text-xs px-2 py-1.5 rounded-sm border border-panel-border focus:outline-none focus:border-primary placeholder:text-muted-foreground font-mono"
              />
              <button
                onClick={addRisk}
                disabled={!newRiskLabel.trim()}
                className="px-2 py-1.5 bg-accent text-muted-foreground hover:text-foreground rounded-sm disabled:opacity-30 transition-colors"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PortfolioWorkspace;
