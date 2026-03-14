import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { BottleneckAnalysis, HeatmapScores, ValueChainData, PortfolioData } from "@/types/analysis";
import { defaultPortfolio } from "@/types/analysis";
import type { Json } from "@/integrations/supabase/types";

const parseRow = (row: any): BottleneckAnalysis => ({
  id: row.id,
  theme: row.theme,
  geography: row.geography ?? "",
  time_horizon: row.time_horizon ?? "",
  thesis: row.thesis ?? "",
  primary_bottleneck: row.primary_bottleneck ?? "",
  scarcity_types: row.scarcity_types ?? [],
  evidence_notes: row.evidence_notes ?? [],
  scores: row.scores as unknown as HeatmapScores,
  value_chain: row.value_chain as unknown as ValueChainData,
  portfolio: (row.portfolio as unknown as PortfolioData) ?? defaultPortfolio,
  false_friends: row.false_friends ?? [],
  thesis_breakers: row.thesis_breakers ?? [],
  disconfirming_signals: row.disconfirming_signals ?? [],
  created_at: row.created_at,
  updated_at: row.updated_at,
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
      const { data, error } = await supabase
        .from("bottleneck_analyses")
        .insert({ theme })
        .select()
        .single();
      if (error) throw error;
      return parseRow(data);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["analyses"] }),
  });
};

export const useUpdateAnalysis = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<BottleneckAnalysis> & { id: string }) => {
      const payload: Record<string, any> = {};
      if (updates.theme !== undefined) payload.theme = updates.theme;
      if (updates.geography !== undefined) payload.geography = updates.geography;
      if (updates.time_horizon !== undefined) payload.time_horizon = updates.time_horizon;
      if (updates.thesis !== undefined) payload.thesis = updates.thesis;
      if (updates.primary_bottleneck !== undefined) payload.primary_bottleneck = updates.primary_bottleneck;
      if (updates.scarcity_types !== undefined) payload.scarcity_types = updates.scarcity_types;
      if (updates.evidence_notes !== undefined) payload.evidence_notes = updates.evidence_notes;
      if (updates.scores !== undefined) payload.scores = updates.scores as unknown as Json;
      if (updates.value_chain !== undefined) payload.value_chain = updates.value_chain as unknown as Json;
      if (updates.portfolio !== undefined) payload.portfolio = updates.portfolio as unknown as Json;
      if (updates.false_friends !== undefined) payload.false_friends = updates.false_friends;
      if (updates.thesis_breakers !== undefined) payload.thesis_breakers = updates.thesis_breakers;
      if (updates.disconfirming_signals !== undefined) payload.disconfirming_signals = updates.disconfirming_signals;

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
