import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TreeDeciduous, CheckCircle2, XCircle, AlertTriangle, ArrowDown, Zap, Search, BarChart3, GitBranch, Layers } from "lucide-react";

type NodeId = "start" | "scarcity_check" | "no_scarcity" | "yes_scarcity" | "verify" | "map_value" | "identify_bottleneck" | "rank";

interface TreeNode {
  id: NodeId;
  label: string;
  description: string;
  icon: any;
  type: "start" | "decision" | "reject" | "action";
  children?: { label: string; targetId: NodeId }[];
}

const nodes: TreeNode[] = [
  {
    id: "start",
    label: "Macro Theme / Idea",
    description: "Begin with a macro theme, technology wave, geopolitical shift, or structural change. Never begin with a ticker.",
    icon: Zap,
    type: "start",
    children: [{ label: "Analyze", targetId: "scarcity_check" }],
  },
  {
    id: "scarcity_check",
    label: "What must become scarce?",
    description: "Identify what physical, regulatory, or capacity constraint emerges if this thesis plays out. This is the core question.",
    icon: Search,
    type: "decision",
    children: [
      { label: "No real scarcity", targetId: "no_scarcity" },
      { label: "Real scarcity detected", targetId: "yes_scarcity" },
    ],
  },
  {
    id: "no_scarcity",
    label: "Narrative / Hype Theme",
    description: "No measurable constraint was identified. This is likely a narrative-driven theme with no structural edge. Avoid or significantly downgrade conviction.",
    icon: XCircle,
    type: "reject",
  },
  {
    id: "yes_scarcity",
    label: "Verify Scarcity Evidence",
    description: "Look for supply shortages, long lead times, regulatory backlogs, rising prices, industry warnings, and capex expansion signals.",
    icon: CheckCircle2,
    type: "action",
    children: [
      { label: "Evidence weak", targetId: "no_scarcity" },
      { label: "Evidence confirmed", targetId: "map_value" },
    ],
  },
  {
    id: "map_value",
    label: "Map Value Capture Layers",
    description: "Trace how demand propagates through the system. Categorize all actors: demand creators, infrastructure, picks & shovels, bottleneck owners, and likely losers.",
    icon: GitBranch,
    type: "action",
    children: [{ label: "Continue", targetId: "identify_bottleneck" }],
  },
  {
    id: "identify_bottleneck",
    label: "Identify Bottleneck Owners",
    description: "Find the constrained assets with pricing power, long time-to-build, and high barriers to entry. These are the structural winners.",
    icon: Layers,
    type: "action",
    children: [{ label: "Continue", targetId: "rank" }],
  },
  {
    id: "rank",
    label: "Rank Investable Areas",
    description: "Score using the Scarcity Heatmap. Prioritize core bottleneck exposure, then supporting infrastructure, then picks & shovels. Flag false friends and thesis breakers.",
    icon: BarChart3,
    type: "action",
  },
];

const nodeColors = {
  start: { bg: "bg-primary/10", border: "border-primary/40", text: "text-primary", icon: "text-primary" },
  decision: { bg: "bg-bottleneck-amber/10", border: "border-bottleneck-amber/40", text: "text-bottleneck-amber", icon: "text-bottleneck-amber" },
  reject: { bg: "bg-thesis-breaker/10", border: "border-thesis-breaker/40", text: "text-thesis-breaker", icon: "text-thesis-breaker" },
  action: { bg: "bg-evidence-green/10", border: "border-evidence-green/40", text: "text-evidence-green", icon: "text-evidence-green" },
};

interface DecisionTreeWorkspaceProps {
  onNavigate?: (toolId: string) => void;
}

const DecisionTreeWorkspace = ({ onNavigate }: DecisionTreeWorkspaceProps) => {
  const [visitedNodes, setVisitedNodes] = useState<NodeId[]>(["start"]);
  const [activeNodeId, setActiveNodeId] = useState<NodeId>("start");

  const activeNode = nodes.find((n) => n.id === activeNodeId)!;

  const handleChoice = (targetId: NodeId) => {
    setVisitedNodes((prev) => [...prev.filter((id) => id !== targetId), targetId]);
    setActiveNodeId(targetId);
  };

  const handleReset = () => {
    setVisitedNodes(["start"]);
    setActiveNodeId("start");
  };

  const isVisited = (id: NodeId) => visitedNodes.includes(id);

  return (
    <main className="flex-1 h-screen overflow-y-auto p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <TreeDeciduous className="w-4 h-4 text-primary" />
            <span className="data-label">Decision Tree</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Bottleneck Decision Tree
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Walk through the decision tree to determine if a theme contains a real structural opportunity.
          </p>
        </div>
        <button
          onClick={handleReset}
          className="text-xs font-mono px-3 py-1.5 rounded-sm bg-accent text-muted-foreground hover:text-foreground transition-colors"
        >
          Reset
        </button>
      </div>

      {/* Tree visualization */}
      <div className="flex gap-6">
        {/* Left: flow path */}
        <div className="flex-1 space-y-2">
          {nodes.map((node) => {
            const visited = isVisited(node.id);
            const isActive = node.id === activeNodeId;
            const colors = nodeColors[node.type];
            const Icon = node.icon;

            if (!visited) return null;

            return (
              <motion.div key={node.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <div
                  className={`panel border ${isActive ? colors.border : "border-panel-border"} ${isActive ? colors.bg : ""} cursor-pointer transition-colors`}
                  onClick={() => setActiveNodeId(node.id)}
                >
                  <div className="p-4 flex gap-3">
                    <div className={`w-8 h-8 rounded-sm flex items-center justify-center shrink-0 ${isActive ? colors.bg : "bg-accent"} border ${isActive ? colors.border : "border-panel-border"}`}>
                      <Icon className={`w-4 h-4 ${isActive ? colors.icon : "text-muted-foreground"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-display font-semibold ${isActive ? colors.text : "text-foreground"}`}>
                        {node.label}
                      </p>
                      {isActive && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="text-xs text-muted-foreground mt-1 leading-relaxed"
                        >
                          {node.description}
                        </motion.p>
                      )}
                    </div>
                    {node.type === "reject" && (
                      <span className="text-xs font-mono px-2 py-0.5 rounded-sm bg-thesis-breaker/10 text-thesis-breaker border border-thesis-breaker/20 self-start">
                        STOP
                      </span>
                    )}
                    {node.id === "rank" && visited && (
                      <span className="text-xs font-mono px-2 py-0.5 rounded-sm bg-evidence-green/10 text-evidence-green border border-evidence-green/20 self-start">
                        INVEST
                      </span>
                    )}
                  </div>

                  {/* Choices */}
                  {isActive && node.children && (
                    <div className="px-4 pb-4 pt-1 flex gap-2">
                      {node.children.map((child) => {
                        const targetNode = nodes.find((n) => n.id === child.targetId);
                        const targetColors = targetNode ? nodeColors[targetNode.type] : nodeColors.action;
                        return (
                          <button
                            key={child.targetId}
                            onClick={(e) => { e.stopPropagation(); handleChoice(child.targetId); }}
                            className={`flex items-center gap-1.5 text-xs font-mono px-3 py-2 rounded-sm border transition-colors hover:opacity-80 ${targetColors.bg} ${targetColors.border} ${targetColors.text}`}
                          >
                            <ArrowDown className="w-3 h-3" />
                            {child.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Connector line */}
                {node.children && visited && node.id !== activeNodeId && (
                  <div className="flex justify-center py-1">
                    <div className="w-px h-4 bg-panel-border" />
                  </div>
                )}
                {isActive && node.children && (
                  <div className="flex justify-center py-1">
                    <div className="w-px h-4 bg-panel-border" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Right: legend */}
        <div className="w-48 shrink-0 space-y-3">
          <p className="data-label">Legend</p>
          {[
            { type: "start" as const, label: "Starting Point" },
            { type: "decision" as const, label: "Decision Gate" },
            { type: "action" as const, label: "Action Step" },
            { type: "reject" as const, label: "Reject / Stop" },
          ].map((item) => {
            const colors = nodeColors[item.type];
            return (
              <div key={item.type} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-sm ${colors.bg} border ${colors.border}`} />
                <span className="text-xs text-muted-foreground">{item.label}</span>
              </div>
            );
          })}

          <div className="border-t border-panel-border pt-3 mt-4">
            <p className="data-label mb-2">Progress</p>
            <p className="font-mono text-sm text-foreground">
              {visitedNodes.length} / {nodes.length - 1}
              <span className="text-muted-foreground ml-1 text-xs">steps</span>
            </p>
            <div className="h-2 bg-accent rounded-sm overflow-hidden mt-2">
              <motion.div
                className="h-full bg-evidence-green rounded-sm"
                animate={{ width: `${(Math.max(0, visitedNodes.length - 1) / (nodes.length - 2)) * 100}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default DecisionTreeWorkspace;
