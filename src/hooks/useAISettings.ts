import { useState, useEffect, useCallback } from "react";

export interface AISettings {
  model: string;
  customProvider: "" | "openai" | "anthropic" | "ollama";
  customApiKey: string;
  ollamaUrl: string;
  ollamaModel: string;
}

const STORAGE_KEY = "bottleneck-ai-settings";

const defaults: AISettings = {
  model: "",
  customProvider: "ollama",
  customApiKey: "",
  ollamaUrl: "http://localhost:11434",
  ollamaModel: "llama3.2",
};

export const useAISettings = () => {
  const [settings, setSettings] = useState<AISettings>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? { ...defaults, ...JSON.parse(stored) } : defaults;
    } catch {
      return defaults;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const updateSettings = useCallback((updates: Partial<AISettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(defaults);
  }, []);

  return { settings, updateSettings, resetSettings };
};
