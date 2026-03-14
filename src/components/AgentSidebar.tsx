import { Search, BarChart3, GitBranch, Briefcase, Activity, Settings, Zap } from "lucide-react";

const tools = [
  { id: "scanner", label: "Bottleneck Scanner", icon: Search, active: true },
  { id: "heatmap", label: "Scarcity Heatmap", icon: BarChart3 },
  { id: "mapper", label: "Value Chain Mapper", icon: GitBranch },
  { id: "portfolio", label: "Portfolio Builder", icon: Briefcase },
  { id: "monitor", label: "Thesis Monitor", icon: Activity },
];

interface AgentSidebarProps {
  activeToolId: string;
  onToolSelect: (id: string) => void;
}

const AgentSidebar = ({ activeToolId, onToolSelect }: AgentSidebarProps) => {
  return (
    <aside className="w-56 shrink-0 bg-sidebar border-r border-sidebar-border flex flex-col h-screen">
      <div className="px-4 py-4 border-b border-sidebar-border flex items-center gap-2">
        <Zap className="w-5 h-5 text-primary" />
        <span className="font-display font-bold text-sm tracking-wide text-foreground">
          BOTTLENECK
        </span>
        <span className="font-display text-xs text-muted-foreground font-medium">AGENT</span>
      </div>

      <nav className="flex-1 p-2 space-y-0.5">
        <p className="data-label px-3 py-2">Agent Toolkit</p>
        {tools.map((tool) => {
          const Icon = tool.icon;
          const isActive = activeToolId === tool.id;
          return (
            <button
              key={tool.id}
              onClick={() => onToolSelect(tool.id)}
              className={`nav-item w-full text-left ${isActive ? "nav-item-active" : ""}`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{tool.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-2 border-t border-sidebar-border">
        <button className="nav-item w-full text-left">
          <Settings className="w-4 h-4 shrink-0" />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
};

export default AgentSidebar;
