import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { BottleneckAnalysis } from "@/types/analysis";
import type { AISettings } from "@/hooks/useAISettings";
import { AUTOFILL_SYSTEM_PROMPT } from "@/lib/prompts";

export interface ResearchContextStats {
  headlineCount: number;
  feedsChecked: number;
  fetchedAt: string;
}

/** Fetch recent news/data context for a theme from the research-context edge function */
async function fetchResearchContext(theme: string): Promise<{ context: string; stats: ResearchContextStats | null }> {
  try {
    const { data, error } = await supabase.functions.invoke("research-context", {
      body: { theme },
    });
    if (error || !data) return { context: "", stats: null };
    const headlines = [
      ...(data.relevant_headlines || []),
      ...(data.recent_market_headlines || []),
    ];
    const stats: ResearchContextStats = {
      headlineCount: headlines.length,
      feedsChecked: data.feeds_checked || 0,
      fetchedAt: data.fetched_at || new Date().toISOString(),
    };
    if (headlines.length === 0) return { context: "", stats };
    const lines = headlines.map((h: any) =>
      `- [${h.source}] ${h.title} (${h.date || "recent"})`
    );
    return {
      context: `\n\nRECENT NEWS & DATA (fetched ${data.fetched_at}):\n${lines.join("\n")}`,
      stats,
    };
  } catch {
    return { context: "", stats: null };
  }
}

async function callOllamaAutofill(theme: string, settings: AISettings): Promise<{ result: any; stats: ResearchContextStats | null }> {
  const { context: researchContext, stats } = await fetchResearchContext(theme);

  const resp = await fetch(`${settings.ollamaUrl}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: settings.ollamaModel,
      messages: [
        { role: "system", content: AUTOFILL_SYSTEM_PROMPT },
        { role: "user", content: `Analyze this bottleneck investing theme: "${theme}"${researchContext}` },
      ],
      stream: false,
      options: { temperature: 0.3 },
    }),
  });

  if (!resp.ok) {
    const text = await resp.text().catch(() => "");
    throw new Error(`Ollama error (${resp.status}): ${text || "Is Ollama running?"}`);
  }

  const data = await resp.json();
  const content = data.message?.content;
  if (!content) throw new Error("No content returned from Ollama");

  const cleaned = content.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
  return { result: JSON.parse(cleaned), stats };
}

export const useAutofillAnalysis = () => {
  const [isAutofilling, setIsAutofilling] = useState(false);

  const autofill = async (
    theme: string,
    onSave: (updates: Partial<BottleneckAnalysis>) => void,
    aiSettings?: AISettings
  ) => {
    setIsAutofilling(true);
    try {
      let data: any;

      if (aiSettings?.customProvider === "ollama") {
        data = await callOllamaAutofill(theme, aiSettings);
      } else {
        const body: Record<string, any> = { theme };
        if (aiSettings?.model) body.model = aiSettings.model;
        if (aiSettings?.customProvider && aiSettings?.customApiKey) {
          body.custom_provider = aiSettings.customProvider;
          body.custom_api_key = aiSettings.customApiKey;
        }

        const { data: fnData, error } = await supabase.functions.invoke("autofill-analysis", { body });
        if (error) throw error;
        if (fnData?.error) throw new Error(fnData.error);
        data = fnData;
      }

      // Normalize AI confidence from 0-100 scale to 0-1
      if (data.overall_confidence != null && data.overall_confidence > 1) {
        data.overall_confidence = data.overall_confidence / 100;
      }

      const updates: Partial<BottleneckAnalysis> = {
        ...data,
        scarcity_evidence: {
          ...data.scarcity_evidence,
          evidence_items: data.scarcity_evidence?.evidence_items ?? [],
        },
        status: "active",
      };

      onSave(updates);
      toast.success("AI auto-fill complete — review and save your analysis");
    } catch (err: any) {
      console.error("Autofill error:", err);
      const msg = err?.message || "Failed to auto-fill analysis";
      toast.error(msg);
    } finally {
      setIsAutofilling(false);
    }
  };

  return { autofill, isAutofilling };
};
