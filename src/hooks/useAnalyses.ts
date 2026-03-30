import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { BottleneckAnalysis } from "@/types/analysis";
import {
  defaultScores, defaultRationale, defaultValueChain, defaultPortfolio,
  defaultScarcityEvidence, defaultOpportunities, defaultThesisBreakersStructured, defaultMonitoring,
} from "@/types/analysis";
import type { Json } from "@/integrations/supabase/types";

const str = (v: any, fallback = "") => v ?? fallback;
const arr = (v: any) => v ?? [];

const parseRow = (row: any): BottleneckAnalysis => ({
  id: row.id,
  theme: row.theme,
  created_at: row.created_at,
  updated_at: row.updated_at,
  analyst: str(row.analyst),
  agent_name: str(row.agent_name),
  source_context: str(row.source_context),
  status: str(row.status, "draft"),
  tags: arr(row.tags),
  subject_type: str(row.subject_type),
  subject_description: str(row.subject_description),
  geography: str(row.geography),
  geography_list: arr(row.geography_list),
  time_horizon: str(row.time_horizon),
  public_markets_only: row.public_markets_only ?? true,
  risk_level: str(row.risk_level),
  thesis: str(row.thesis),
  worldview_assumption: str(row.worldview_assumption),
  structural_shift: arr(row.structural_shift),
  demand_wave: str(row.demand_wave),
  thesis_stage: str(row.thesis_stage),
  primary_bottleneck: str(row.primary_bottleneck),
  scarcity_types: arr(row.scarcity_types),
  constraint_description: str(row.constraint_description),
  constraint_measurable: row.constraint_measurable ?? false,
  why_now: str(row.why_now),
  time_to_resolve: str(row.time_to_resolve),
  scarcity_evidence: row.scarcity_evidence ?? defaultScarcityEvidence,
  evidence_notes: arr(row.evidence_notes),
  scores: row.scores ?? defaultScores,
  heatmap_rationale: row.heatmap_rationale ?? defaultRationale,
  value_chain: row.value_chain ?? defaultValueChain,
  second_order_beneficiaries: arr(row.second_order_beneficiaries),
  likely_losers: arr(row.likely_losers),
  value_capture_layer: str(row.value_capture_layer),
  transmission_mechanism: str(row.transmission_mechanism),
  opportunities: row.opportunities ?? defaultOpportunities,
  false_friends: arr(row.false_friends),
  portfolio: row.portfolio ?? defaultPortfolio,
  concentration_risk: str(row.concentration_risk),
  crowding_risk: str(row.crowding_risk),
  correlation_risk: str(row.correlation_risk),
  implementation_notes: str(row.implementation_notes),
  thesis_breakers: arr(row.thesis_breakers),
  thesis_breakers_structured: row.thesis_breakers_structured ?? defaultThesisBreakersStructured,
  disconfirming_signals: arr(row.disconfirming_signals),
  monitoring: row.monitoring ?? defaultMonitoring,
  overall_confidence: row.overall_confidence ?? 0,
  confidence_notes: str(row.confidence_notes),
  major_unknowns: arr(row.major_unknowns),
  scarcity_strength: str(row.scarcity_strength),
  investment_priority: str(row.investment_priority),
  final_assessment: str(row.final_assessment),
});

export const useAnalyses = () => {
  return useQuery({
    queryKey: ["analyses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bottleneck_analyses")
        .select("*")
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map(parseRow);
    },
  });
};

export const useCreateAnalysis = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (theme: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("You must be signed in to create an analysis");
      const { data, error } = await supabase
        .from("bottleneck_analyses")
        .insert({ theme, owner_id: user.id })
        .select()
        .single();
      if (error) throw error;
      return parseRow(data);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["analyses"] }),
  });
};

// Build payload dynamically from all possible fields
const buildPayload = (updates: Partial<BottleneckAnalysis>) => {
  const payload: Record<string, any> = {};
  const jsonFields = ["scores", "heatmap_rationale", "value_chain", "portfolio", "scarcity_evidence", "opportunities", "thesis_breakers_structured", "monitoring"];
  const directFields = [
    "theme", "analyst", "agent_name", "source_context", "status", "tags",
    "subject_type", "subject_description", "geography", "geography_list", "time_horizon",
    "public_markets_only", "risk_level", "thesis", "worldview_assumption", "structural_shift",
    "demand_wave", "thesis_stage", "primary_bottleneck", "scarcity_types", "constraint_description",
    "constraint_measurable", "why_now", "time_to_resolve", "evidence_notes",
    "second_order_beneficiaries", "likely_losers", "value_capture_layer", "transmission_mechanism",
    "false_friends", "concentration_risk", "crowding_risk", "correlation_risk", "implementation_notes",
    "thesis_breakers", "disconfirming_signals", "overall_confidence", "confidence_notes",
    "major_unknowns", "scarcity_strength", "investment_priority", "final_assessment",
  ];

  for (const key of directFields) {
    if ((updates as any)[key] !== undefined) payload[key] = (updates as any)[key];
  }
  for (const key of jsonFields) {
    if ((updates as any)[key] !== undefined) payload[key] = (updates as any)[key] as unknown as Json;
  }
  return payload;
};

export const useUpdateAnalysis = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<BottleneckAnalysis> & { id: string }) => {
      const payload = buildPayload(updates);
      const { data, error } = await supabase
        .from("bottleneck_analyses")
        .update(payload)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return parseRow(data);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["analyses"] }),
  });
};

export const useDeleteAnalysis = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("bottleneck_analyses")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["analyses"] }),
  });
};
