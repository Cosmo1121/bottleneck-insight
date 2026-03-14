import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import AgentSidebar from "@/components/AgentSidebar";
import BottleneckWorkspace from "@/components/BottleneckWorkspace";
import DecisionTreeWorkspace from "@/components/DecisionTreeWorkspace";
import HeatmapWorkspace from "@/components/HeatmapWorkspace";
import MapperWorkspace from "@/components/MapperWorkspace";
import BottleneckMapWorkspace from "@/components/BottleneckMapWorkspace";
import PortfolioWorkspace from "@/components/PortfolioWorkspace";
import MonitorWorkspace from "@/components/MonitorWorkspace";
import ScarcityScorecard from "@/components/ScarcityScorecard";
import { useAnalyses, useCreateAnalysis, useUpdateAnalysis, useDeleteAnalysis } from "@/hooks/useAnalyses";
import { defaultScores } from "@/types/analysis";
import type { BottleneckAnalysis, HeatmapScores } from "@/types/analysis";
import { Loader2 } from "lucide-react";

const EmptyState = () => (
  <main className="flex-1 h-screen flex items-center justify-center">
    <div className="text-center space-y-3">
      <p className="font-display text-lg text-foreground">No analysis selected</p>
      <p className="text-sm text-muted-foreground">Create a new analysis from the sidebar to get started.</p>
    </div>
  </main>
);

const Index = () => {
  const [activeTool, setActiveTool] = useState("scanner");
  const [activeAnalysisId, setActiveAnalysisId] = useState<string | null>(null);
  const [localScores, setLocalScores] = useState<HeatmapScores>(defaultScores);

  const { data: analyses = [], isLoading } = useAnalyses();
  const createMutation = useCreateAnalysis();
  const updateMutation = useUpdateAnalysis();
  const deleteMutation = useDeleteAnalysis();

  const activeAnalysis = analyses.find((a) => a.id === activeAnalysisId) ?? null;

  // Auto-select first analysis
  useEffect(() => {
    if (!activeAnalysisId && analyses.length > 0) {
      setActiveAnalysisId(analyses[0].id);
    }
  }, [analyses, activeAnalysisId]);

  // Sync local scores when analysis changes
  useEffect(() => {
    if (activeAnalysis) {
      setLocalScores(activeAnalysis.scores);
    }
  }, [activeAnalysis?.id]);

  const handleCreate = useCallback((theme: string) => {
    createMutation.mutate(theme, {
      onSuccess: (newAnalysis) => {
        setActiveAnalysisId(newAnalysis.id);
        toast.success("Analysis created");
      },
    });
  }, [createMutation]);

  const handleDelete = useCallback((id: string) => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        if (activeAnalysisId === id) {
          setActiveAnalysisId(analyses.find((a) => a.id !== id)?.id ?? null);
        }
        toast.success("Analysis deleted");
      },
    });
  }, [deleteMutation, activeAnalysisId, analyses]);

  const handleSave = useCallback((updates: Partial<BottleneckAnalysis>) => {
    if (!activeAnalysisId) return;
    updateMutation.mutate({ id: activeAnalysisId, ...updates }, {
      onSuccess: () => toast.success("Saved"),
    });
  }, [activeAnalysisId, updateMutation]);

  const handleSaveScores = useCallback(() => {
    if (!activeAnalysisId) return;
    updateMutation.mutate({ id: activeAnalysisId, scores: localScores }, {
      onSuccess: () => toast.success("Scores saved"),
    });
  }, [activeAnalysisId, localScores, updateMutation]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  const renderWorkspace = () => {
    if (!activeAnalysis) return <EmptyState />;
    switch (activeTool) {
      case "scanner":
        return <BottleneckWorkspace analysis={activeAnalysis} onSave={handleSave} isSaving={updateMutation.isPending} />;
      case "decision-tree":
        return <DecisionTreeWorkspace />;
      case "heatmap":
        return <HeatmapWorkspace scores={localScores} onScoresChange={setLocalScores} onSave={handleSaveScores} isSaving={updateMutation.isPending} />;
      case "mapper":
        return <MapperWorkspace />;
      case "bottleneck-map":
        return <BottleneckMapWorkspace analyses={analyses} activeAnalysisId={activeAnalysisId} />;
      case "portfolio":
        return <PortfolioWorkspace />;
      case "monitor":
        return <MonitorWorkspace />;
      default:
        return <BottleneckWorkspace analysis={activeAnalysis} onSave={handleSave} isSaving={updateMutation.isPending} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <AgentSidebar
        activeToolId={activeTool}
        onToolSelect={setActiveTool}
        analyses={analyses}
        activeAnalysisId={activeAnalysisId}
        onSelectAnalysis={setActiveAnalysisId}
        onCreateAnalysis={handleCreate}
        onDeleteAnalysis={handleDelete}
        isCreating={createMutation.isPending}
      />
      {renderWorkspace()}
      <ScarcityScorecard
        scores={activeAnalysis?.scores ?? localScores}
        theme={activeAnalysis?.theme}
      />
    </div>
  );
};

export default Index;
