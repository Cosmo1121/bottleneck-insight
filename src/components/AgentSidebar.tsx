import { Search, BarChart3, GitBranch, Briefcase, Activity, Settings, Zap, TreeDeciduous, Crosshair, CheckCircle2, Target, XCircle, FileCheck, Download } from "lucide-react";
import AnalysisSelector from "./AnalysisSelector";
import type { BottleneckAnalysis } from "@/types/analysis";

const tools = [
  { id: "scanner", label: "Scanner", icon: Search },
  { id: "decision-tree", label: "Decision Tree", icon: TreeDeciduous },
  { id: "evidence", label: "Evidence", icon: CheckCircle2 },
  { id: "heatmap", label: "Heatmap", icon: BarChart3 },
  { id: "mapper", label: "Value Chain", icon: GitBranch },
  { id: "opportunities", label: "Opportunities", icon: Target },
  { id: "bottleneck-map", label: "Bottleneck Map", icon: Crosshair },
  { id: "portfolio", label: "Portfolio", icon: Briefcase },
  { id: "thesis-breakers", label: "Thesis Breakers", icon: XCircle },
  { id: "monitor", label: "Monitor", icon: Activity },
  { id: "summary", label: "Summary", icon: FileCheck },
];

interface AgentSidebarProps {
  activeToolId: string;
  onToolSelect: (id: string) => void;
  analyses: BottleneckAnalysis[];
  activeAnalysisId: string | null;
  onSelectAnalysis: (id: string) => void;
  onCreateAnalysis: (theme: string) => void;
  onDeleteAnalysis: (id: string) => void;
  isCreating: boolean;
  onExportYaml?: () => void;
  onExportMarkdown?: () => void;
}

const AgentSidebar = ({
  activeToolId, onToolSelect,
  analyses, activeAnalysisId, onSelectAnalysis, onCreateAnalysis, onDeleteAnalysis, isCreating,
  onExportYaml, onExportMarkdown,
}: AgentSidebarProps) => {
  return (
    <aside className="w-48 shrink-0 bg-sidebar border-r border-sidebar-border flex flex-col h-screen">
      <div className="px-3 py-3 border-b border-sidebar-border flex items-center gap-2">
        <Zap className="w-4 h-4 text-primary" />
        <span className="font-display font-bold text-xs tracking-wide text-foreground">BOTTLENECK</span>
      </div>

      <AnalysisSelector
        analyses={analyses}
        activeId={activeAnalysisId}
        onSelect={onSelectAnalysis}
        onCreate={onCreateAnalysis}
        onDelete={onDeleteAnalysis}
        isCreating={isCreating}
      />

      <nav className="flex-1 p-1.5 space-y-0.5 overflow-y-auto">
        <p className="data-label px-2 py-1.5 text-[10px]">Agent Toolkit</p>
        {tools.map((tool) => {
          const Icon = tool.icon;
          const isActive = activeToolId === tool.id;
          return (
            <button
              key={tool.id}
              onClick={() => onToolSelect(tool.id)}
              className={`nav-item w-full text-left text-xs py-1.5 ${isActive ? "nav-item-active" : ""}`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{tool.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-1.5 border-t border-sidebar-border">
        <button className="nav-item w-full text-left text-xs py-1.5">
          <Settings className="w-3.5 h-3.5 shrink-0" />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
};

export default AgentSidebar;
