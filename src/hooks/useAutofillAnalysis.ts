import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { BottleneckAnalysis } from "@/types/analysis";
import type { AISettings } from "@/hooks/useAISettings";

export const useAutofillAnalysis = () => {
  const [isAutofilling, setIsAutofilling] = useState(false);

  const autofill = async (
    theme: string,
    onSave: (updates: Partial<BottleneckAnalysis>) => void,
    aiSettings?: AISettings
  ) => {
    setIsAutofilling(true);
    try {
      const body: Record<string, any> = { theme };
      if (aiSettings?.model) body.model = aiSettings.model;
      if (aiSettings?.customProvider && aiSettings?.customApiKey) {
        body.custom_provider = aiSettings.customProvider;
        body.custom_api_key = aiSettings.customApiKey;
      }

      const { data, error } = await supabase.functions.invoke("autofill-analysis", { body });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

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
