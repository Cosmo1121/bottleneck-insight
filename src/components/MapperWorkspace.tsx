import { useState, useEffect } from "react";
import { GitBranch, Lock, Layers, Wrench, Network, Box, Users, TrendingDown, Save, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import type { ValueChainData, BottleneckAnalysis } from "@/types/analysis";
import EditableTagList from "./EditableTagList";

const layerConfig: { key: keyof ValueChainData; label: string; icon: any; isBottleneck: boolean; description: string }[] = [
  { key: "demand_creators", label: "Demand Creators", icon: Users, isBottleneck: false, description: "Applications, services, and platforms that generate demand." },
  { key: "integrators", label: "Integrators", icon: Network, isBottleneck: false, description: "System builders and assemblers that combine components." },
  { key: "operators", label: "Downstream Operators", icon: Box, isBottleneck: false, description: "The deployment layer — entities that run and maintain systems." },
  { key: "infrastructure", label: "Enabling Infrastructure", icon: Layers, isBottleneck: false, description: "Logistics, connectivity, and utilities that support the system." },
  { key: "picks_and_shovels", label: "Picks & Shovels", icon: Wrench, isBottleneck: false, description: "Tools, equipment, and component suppliers." },
  { key: "bottleneck_owners", label: "Bottleneck Owners", icon: Lock, isBottleneck: true, description: "Scarce assets with pricing power and economic leverage." },
];

interface MapperWorkspaceProps {
  analysis: BottleneckAnalysis;
  onSave: (updates: Partial<BottleneckAnalysis>) => void;
  isSaving: boolean;
}

const MapperWorkspace = ({ analysis, onSave, isSaving }: MapperWorkspaceProps) => {
  const [chain, setChain] = useState<ValueChainData>(analysis.value_chain);
  const [falseFriends, setFalseFriends] = useState<string[]>(analysis.false_friends);

  useEffect(() => {
    setChain(analysis.value_chain);
    setFalseFriends(analysis.false_friends);
  }, [analysis.id]);

  const updateLayer = (key: keyof ValueChainData, items: string[]) => {
    setChain((prev) => ({ ...prev, [key]: items }));
  };

  const handleSave = () => {
    onSave({ value_chain: chain, false_friends: falseFriends });
  };

  return (
    <main className="flex-1 h-screen overflow-y-auto p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <GitBranch className="w-4 h-4 text-primary" />
            <span className="data-label">Value Chain Mapper</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground">Map Value Capture Layers</h1>
          <p className="text-sm text-muted-foreground mt-1">Add actors to each layer of the value chain. The lower the layer, the stronger the structural advantage.</p>
        </div>
        <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono bg-primary text-primary-foreground rounded-sm hover:opacity-90 disabled:opacity-50">
          {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
          Save
        </button>
      </div>

      <div className="flex items-center gap-2 text-xs text-muted-foreground px-1">
        <span className="font-mono">↑ NARRATIVE ATTENTION</span>
        <div className="flex-1 border-t border-dashed border-panel-border" />
        <span className="font-mono">STRUCTURAL SCARCITY ↓</span>
      </div>

      <div className="space-y-2">
        {layerConfig.map((layer, i) => {
          const Icon = layer.icon;
          return (
            <motion.div
              key={layer.key}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05, duration: 0.25 }}
              className={`panel ${layer.isBottleneck ? "border-evidence-green/40 bg-evidence-green/5" : ""}`}
            >
              <div className="p-4 flex gap-4">
                <div className={`w-9 h-9 rounded-sm flex items-center justify-center shrink-0 ${layer.isBottleneck ? "bg-evidence-green" : "bg-accent"}`}>
                  <Icon className={`w-4 h-4 ${layer.isBottleneck ? "text-background" : "text-muted-foreground"}`} />
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-display font-semibold mb-0.5 ${layer.isBottleneck ? "text-evidence-green" : "text-foreground"}`}>
                    {layer.label}
                  </p>
                  <p className="text-xs text-muted-foreground mb-2">{layer.description}</p>
                  <EditableTagList
                    items={chain[layer.key]}
                    onChange={(items) => updateLayer(layer.key, items)}
                    placeholder={`Add ${layer.label.toLowerCase()}...`}
                    tagClassName={layer.isBottleneck
                      ? "bg-evidence-green/10 text-evidence-green border border-evidence-green/20"
                      : "bg-accent text-muted-foreground"
                    }
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="panel border-thesis-breaker/30">
        <div className="panel-header">
          <TrendingDown className="w-4 h-4 text-thesis-breaker" />
          <span className="data-label">Likely Losers / False Friends</span>
        </div>
        <div className="p-4">
          <EditableTagList
            items={falseFriends}
            onChange={setFalseFriends}
            placeholder="Add false friend..."
            tagClassName="bg-thesis-breaker/10 text-thesis-breaker border border-thesis-breaker/20"
          />
        </div>
      </div>
    </main>
  );
};

export default MapperWorkspace;
