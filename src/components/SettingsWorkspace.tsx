import { Settings, RotateCcw, Eye, EyeOff, Cpu, Key, Info } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import type { AISettings } from "@/hooks/useAISettings";

const lovableModels = [
  { value: "google/gemini-3-flash-preview", label: "Gemini 3 Flash (Fast)", desc: "Default — balanced speed & capability" },
  { value: "google/gemini-2.5-flash", label: "Gemini 2.5 Flash", desc: "Good multimodal, lower cost" },
  { value: "google/gemini-2.5-flash-lite", label: "Gemini 2.5 Flash Lite", desc: "Fastest, cheapest — simple tasks" },
  { value: "google/gemini-2.5-pro", label: "Gemini 2.5 Pro", desc: "Top-tier reasoning & context" },
  { value: "google/gemini-3.1-pro-preview", label: "Gemini 3.1 Pro", desc: "Latest next-gen reasoning" },
  { value: "openai/gpt-5", label: "GPT-5", desc: "Powerful all-rounder, higher cost" },
  { value: "openai/gpt-5-mini", label: "GPT-5 Mini", desc: "Strong performance, lower cost" },
  { value: "openai/gpt-5-nano", label: "GPT-5 Nano", desc: "Speed & cost optimized" },
  { value: "openai/gpt-5.2", label: "GPT-5.2", desc: "Latest, enhanced reasoning" },
];

interface SettingsWorkspaceProps {
  settings: AISettings;
  onUpdate: (updates: Partial<AISettings>) => void;
  onReset: () => void;
}

const SettingsWorkspace = ({ settings, onUpdate, onReset }: SettingsWorkspaceProps) => {
  const [showKey, setShowKey] = useState(false);

  const activeModel = lovableModels.find((m) => m.value === settings.model);

  return (
    <main className="flex-1 h-screen overflow-y-auto p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Settings className="w-4 h-4 text-primary" />
            <span className="data-label">Settings</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground">AI Configuration</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Choose your AI model and optionally bring your own API key.
          </p>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono bg-accent text-muted-foreground rounded-sm hover:text-foreground transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          Reset Defaults
        </button>
      </div>

      {/* Model Selector */}
      <div className="panel">
        <div className="panel-header">
          <Cpu className="w-4 h-4 text-primary" />
          <span className="data-label">AI Model</span>
        </div>
        <div className="p-4 space-y-3">
          <p className="text-xs text-muted-foreground">
            Select which model powers auto-fill and chat. All models are available via Lovable AI — no API key needed.
          </p>
          <div className="grid gap-2">
            {lovableModels.map((model) => {
              const isActive = settings.model === model.value;
              return (
                <motion.button
                  key={model.value}
                  onClick={() => onUpdate({ model: model.value })}
                  className={`text-left p-3 rounded-sm border transition-colors ${
                    isActive
                      ? "bg-primary/10 border-primary/40 text-foreground"
                      : "bg-accent border-panel-border text-muted-foreground hover:text-foreground hover:border-muted-foreground/30"
                  }`}
                  whileTap={{ scale: 0.995 }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-display font-semibold">{model.label}</span>
                    {isActive && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-sm bg-primary/20 text-primary">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <p className="text-xs mt-0.5 opacity-70">{model.desc}</p>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* BYO Key */}
      <div className="panel">
        <div className="panel-header">
          <Key className="w-4 h-4 text-bottleneck-amber" />
          <span className="data-label">Bring Your Own Key</span>
          <span className="ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded-sm bg-bottleneck-amber/10 text-bottleneck-amber border border-bottleneck-amber/20">
            OPTIONAL
          </span>
        </div>
        <div className="p-4 space-y-4">
          <div className="flex items-start gap-2 p-3 rounded-sm bg-accent border border-panel-border">
            <Info className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              By default, all AI features use <span className="text-foreground font-medium">Lovable AI</span> with no setup required.
              If you'd prefer to use your own OpenAI or Anthropic key, configure it below. Your key is stored locally in your browser only.
            </p>
          </div>

          <div className="space-y-2">
            <label className="data-label">Provider</label>
            <div className="flex gap-2">
              {[
                { value: "" as const, label: "Lovable AI (default)" },
                { value: "openai" as const, label: "OpenAI" },
                { value: "anthropic" as const, label: "Anthropic" },
              ].map((opt) => {
                const isActive = settings.customProvider === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => onUpdate({ customProvider: opt.value, customApiKey: opt.value ? settings.customApiKey : "" })}
                    className={`text-xs font-mono px-3 py-2 rounded-sm border transition-colors ${
                      isActive
                        ? "bg-primary/10 border-primary/40 text-primary"
                        : "bg-accent border-panel-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {settings.customProvider && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-2">
              <label className="data-label">
                {settings.customProvider === "openai" ? "OpenAI" : "Anthropic"} API Key
              </label>
              <div className="relative">
                <input
                  type={showKey ? "text" : "password"}
                  value={settings.customApiKey}
                  onChange={(e) => onUpdate({ customApiKey: e.target.value })}
                  placeholder={settings.customProvider === "openai" ? "sk-..." : "sk-ant-..."}
                  className="w-full bg-accent text-foreground text-xs px-3 py-2 pr-10 rounded-sm border border-panel-border font-mono placeholder:text-muted-foreground"
                />
                <button
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="text-[10px] text-muted-foreground">
                Stored in browser localStorage only — never sent to our servers.
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Current Config Summary */}
      <div className="panel">
        <div className="panel-header">
          <span className="data-label">Active Configuration</span>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-3 gap-4 text-xs">
            <div>
              <p className="data-label mb-1">Model</p>
              <p className="font-mono text-foreground">{activeModel?.label ?? settings.model}</p>
            </div>
            <div>
              <p className="data-label mb-1">Provider</p>
              <p className="font-mono text-foreground">
                {settings.customProvider ? settings.customProvider.charAt(0).toUpperCase() + settings.customProvider.slice(1) : "Lovable AI"}
              </p>
            </div>
            <div>
              <p className="data-label mb-1">API Key</p>
              <p className="font-mono text-foreground">
                {settings.customProvider && settings.customApiKey
                  ? `${settings.customApiKey.slice(0, 7)}...`
                  : "Built-in"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SettingsWorkspace;
