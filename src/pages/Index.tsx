import { useState, useEffect, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import AgentSidebar from "@/components/AgentSidebar";
import ChatPanel from "@/components/ChatPanel";
import { exportAsYaml, exportAsMarkdown, parseYamlImport } from "@/lib/exportAnalysis";
import { useAutofillAnalysis } from "@/hooks/useAutofillAnalysis";
import BottleneckWorkspace from "@/components/BottleneckWorkspace";
import DecisionTreeWorkspace from "@/components/DecisionTreeWorkspace";
import EvidenceWorkspace from "@/components/EvidenceWorkspace";
import HeatmapWorkspace from "@/components/HeatmapWorkspace";
import MapperWorkspace from "@/components/MapperWorkspace";
import OpportunitiesWorkspace from "@/components/OpportunitiesWorkspace";
import BottleneckMapWorkspace from "@/components/BottleneckMapWorkspace";
import PortfolioWorkspace from "@/components/PortfolioWorkspace";
import ThesisBreakersWorkspace from "@/components/ThesisBreakersWorkspace";
import MonitorWorkspace from "@/components/MonitorWorkspace";
import SummaryWorkspace from "@/components/SummaryWorkspace";
import SettingsWorkspace from "@/components/SettingsWorkspace";
import ScarcityScorecard from "@/components/ScarcityScorecard";
import { useAnalyses, useCreateAnalysis, useUpdateAnalysis, useDeleteAnalysis } from "@/hooks/useAnalyses";
import { useAISettings } from "@/hooks/useAISettings";
import { defaultScores, defaultRationale } from "@/types/analysis";
import type { BottleneckAnalysis, HeatmapScores, HeatmapRationale } from "@/types/analysis";
import { supabase } from "@/integrations/supabase/client";
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
  const [localRationale, setLocalRationale] = useState<HeatmapRationale>(defaultRationale);

  const { data: analyses = [], isLoading } = useAnalyses();
  const createMutation = useCreateAnalysis();
  const updateMutation = useUpdateAnalysis();
  const deleteMutation = useDeleteAnalysis();
  const { autofill, isAutofilling } = useAutofillAnalysis();

  const activeAnalysis = analyses.find((a) => a.id === activeAnalysisId) ?? null;

  useEffect(() => {
    if (!activeAnalysisId && analyses.length > 0) setActiveAnalysisId(analyses[0].id);
  }, [analyses, activeAnalysisId]);

  useEffect(() => {
    if (activeAnalysis) {
      setLocalScores(activeAnalysis.scores);
      setLocalRationale(activeAnalysis.heatmap_rationale);
    }
  }, [activeAnalysis?.id]);

  const handleCreate = useCallback((theme: string) => {
    createMutation.mutate(theme, {
      onSuccess: (a) => { setActiveAnalysisId(a.id); toast.success("Analysis created"); },
    });
  }, [createMutation]);

  const handleDelete = useCallback((id: string) => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        if (activeAnalysisId === id) setActiveAnalysisId(analyses.find((a) => a.id !== id)?.id ?? null);
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
    updateMutation.mutate({ id: activeAnalysisId, scores: localScores, heatmap_rationale: localRationale }, {
      onSuccess: () => toast.success("Scores saved"),
    });
  }, [activeAnalysisId, localScores, localRationale, updateMutation]);

  const queryClient = useQueryClient();

  const handleImportYaml = useCallback(async (content: string) => {
    try {
      const parsed = parseYamlImport(content);
      const { theme, ...rest } = parsed;
      const { data, error } = await supabase
        .from("bottleneck_analyses")
        .insert({ theme, ...rest } as any)
        .select("id")
        .single();
      if (error) throw error;
      setActiveAnalysisId(data.id);
      await queryClient.invalidateQueries({ queryKey: ["analyses"] });
      toast.success(`Imported "${theme}"`);
    } catch (e: any) {
      toast.error(`Import failed: ${e.message}`);
    }
  }, [queryClient]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  const renderWorkspace = () => {
    if (!activeAnalysis) return <EmptyState />;
    const shared = { analysis: activeAnalysis, onSave: handleSave, isSaving: updateMutation.isPending };
    switch (activeTool) {
      case "scanner": return <BottleneckWorkspace {...shared} onAutofill={() => activeAnalysis && autofill(activeAnalysis.theme, handleSave)} isAutofilling={isAutofilling} />;
      case "decision-tree": return <DecisionTreeWorkspace onNavigate={setActiveTool} />;
      case "evidence": return <EvidenceWorkspace {...shared} />;
      case "heatmap": return <HeatmapWorkspace scores={localScores} rationale={localRationale} onScoresChange={setLocalScores} onRationaleChange={setLocalRationale} onSave={handleSaveScores} isSaving={updateMutation.isPending} />;
      case "mapper": return <MapperWorkspace {...shared} />;
      case "opportunities": return <OpportunitiesWorkspace {...shared} onNavigate={setActiveTool} />;
      case "bottleneck-map": return <BottleneckMapWorkspace analyses={analyses} activeAnalysisId={activeAnalysisId} />;
      case "portfolio": return <PortfolioWorkspace {...shared} />;
      case "thesis-breakers": return <ThesisBreakersWorkspace {...shared} />;
      case "monitor": return <MonitorWorkspace {...shared} />;
      case "summary": return <SummaryWorkspace {...shared} />;
      default: return <BottleneckWorkspace {...shared} />;
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
        onExportYaml={() => activeAnalysis && exportAsYaml(activeAnalysis)}
        onExportMarkdown={() => activeAnalysis && exportAsMarkdown(activeAnalysis)}
        onImportYaml={handleImportYaml}
      />
      {renderWorkspace()}
      <ScarcityScorecard scores={activeAnalysis?.scores ?? localScores} theme={activeAnalysis?.theme} />
      <ChatPanel />
    </div>
  );
};

export default Index;
