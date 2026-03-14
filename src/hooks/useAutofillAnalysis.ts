import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { BottleneckAnalysis } from "@/types/analysis";
import type { AISettings } from "@/hooks/useAISettings";
import { AUTOFILL_SYSTEM_PROMPT } from "@/lib/prompts";

async function callOllamaAutofill(theme: string, settings: AISettings): Promise<any> {
  const resp = await fetch(`${settings.ollamaUrl}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: settings.ollamaModel,
      messages: [
        { role: "system", content: AUTOFILL_SYSTEM_PROMPT },
        { role: "user", content: `Analyze this bottleneck investing theme: "${theme}"` },
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
  return JSON.parse(cleaned);
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
