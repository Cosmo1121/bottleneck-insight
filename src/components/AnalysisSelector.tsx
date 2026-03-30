import { useState } from "react";
import { Plus, FileText, Trash2, Loader2 } from "lucide-react";
import type { BottleneckAnalysis } from "@/types/analysis";

interface AnalysisSelectorProps {
  analyses: BottleneckAnalysis[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onCreate: (theme: string) => void;
  onDelete: (id: string) => void;
  isCreating: boolean;
}

const AnalysisSelector = ({ analyses, activeId, onSelect, onCreate, onDelete, isCreating }: AnalysisSelectorProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTheme, setNewTheme] = useState("");

  const handleCreate = () => {
    if (!newTheme.trim()) return;
    onCreate(newTheme.trim());
    setNewTheme("");
    setIsAdding(false);
  };

  return (
    <div className="border-b border-sidebar-border">
      <div className="px-4 py-2 flex items-center justify-between">
        <span className="text-[11px] font-display font-semibold uppercase tracking-wider text-primary">Analyses</span>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="w-6 h-6 flex items-center justify-center rounded-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {isAdding && (
        <div className="px-3 pb-2">
          <input
            autoFocus
            value={newTheme}
            onChange={(e) => setNewTheme(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            placeholder="Theme name..."
            className="w-full bg-accent text-foreground text-xs px-2 py-1.5 rounded-sm border border-panel-border focus:outline-none focus:border-primary placeholder:text-muted-foreground font-mono"
          />
          <div className="flex gap-1 mt-1">
            <button
              onClick={handleCreate}
              disabled={!newTheme.trim() || isCreating}
              className="flex-1 text-xs bg-primary text-primary-foreground py-1 rounded-sm hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-1"
            >
              {isCreating ? <Loader2 className="w-3 h-3 animate-spin" /> : "Create"}
            </button>
            <button
              onClick={() => { setIsAdding(false); setNewTheme(""); }}
              className="text-xs text-muted-foreground px-2 py-1 rounded-sm hover:bg-accent"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="max-h-40 overflow-y-auto px-2 pb-2 space-y-0.5">
        {analyses.map((a) => (
          <div
            key={a.id}
            className={`group flex items-center gap-2 px-2 py-1.5 rounded-sm cursor-pointer text-xs transition-colors ${
              activeId === a.id
                ? "bg-accent text-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
            }`}
            onClick={() => onSelect(a.id)}
          >
            <FileText className="w-3 h-3 shrink-0" />
            <span className="truncate flex-1 font-mono">{a.theme}</span>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(a.id); }}
              className="opacity-0 group-hover:opacity-100 w-5 h-5 flex items-center justify-center rounded-sm hover:bg-thesis-breaker/20 text-thesis-breaker transition-opacity"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        ))}
        {analyses.length === 0 && (
          <p className="text-xs text-muted-foreground px-2 py-2 text-center">No analyses yet</p>
        )}
      </div>
    </div>
  );
};

export default AnalysisSelector;
