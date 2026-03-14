import { Settings, RotateCcw, Eye, EyeOff, Cpu, Key, Info, Server, Plug, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { useState, useCallback } from "react";
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
  const [connStatus, setConnStatus] = useState<"idle" | "testing" | "ok" | "error">("idle");
  const [connError, setConnError] = useState("");
  const [ollamaModels, setOllamaModels] = useState<string[]>([]);

  const activeModel = lovableModels.find((m) => m.value === settings.model);

  const providerLabel = () => {
    if (settings.customProvider === "ollama") return "Ollama";
    if (settings.customProvider) return settings.customProvider.charAt(0).toUpperCase() + settings.customProvider.slice(1);
    return "Lovable AI";
  };

  const modelLabel = () => {
    if (settings.customProvider === "ollama") return settings.ollamaModel;
    return activeModel?.label ?? settings.model;
  };

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
            Choose your AI model, bring your own key, or connect to a local Ollama instance.
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

      {/* Model Selector — only shown when not using Ollama */}
      {settings.customProvider !== "ollama" && (
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
      )}

      {/* Provider Selection */}
      <div className="panel">
        <div className="panel-header">
          <Key className="w-4 h-4 text-bottleneck-amber" />
          <span className="data-label">AI Provider</span>
        </div>
        <div className="p-4 space-y-4">
          <div className="flex items-start gap-2 p-3 rounded-sm bg-accent border border-panel-border">
            <Info className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              By default, all AI features use <span className="text-foreground font-medium">Lovable AI</span> with no setup required.
              You can also use your own OpenAI/Anthropic key, or connect to a local <span className="text-foreground font-medium">Ollama</span> instance for fully private, open-source models.
            </p>
          </div>

          <div className="space-y-2">
            <label className="data-label">Provider</label>
            <div className="flex flex-wrap gap-2">
              {[
                { value: "" as const, label: "Lovable AI" },
                { value: "openai" as const, label: "OpenAI" },
                { value: "anthropic" as const, label: "Anthropic" },
                { value: "ollama" as const, label: "Ollama (Local)" },
              ].map((opt) => {
                const isActive = settings.customProvider === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => onUpdate({
                      customProvider: opt.value,
                      customApiKey: opt.value && opt.value !== "ollama" ? settings.customApiKey : "",
                    })}
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

          {/* OpenAI / Anthropic key input */}
          {(settings.customProvider === "openai" || settings.customProvider === "anthropic") && (
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
                Stored in localStorage. Sent to backend functions for AI calls — not stored server-side.
              </p>
            </motion.div>
          )}

          {/* Ollama config */}
          {settings.customProvider === "ollama" && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-4">
              <div className="flex items-start gap-2 p-3 rounded-sm bg-evidence-green/5 border border-evidence-green/20">
                <Server className="w-4 h-4 text-evidence-green shrink-0 mt-0.5" />
                <div className="text-xs text-muted-foreground leading-relaxed">
                  <p className="text-foreground font-medium mb-1">Local Ollama Mode</p>
                  <p>AI calls go directly from your browser to your local Ollama instance. Fully private — no data leaves your machine.</p>
                  <p className="mt-1">Make sure Ollama is running with CORS enabled:</p>
                  <code className="block mt-1 text-[10px] bg-background/50 px-2 py-1 rounded-sm text-evidence-green">
                    OLLAMA_ORIGINS="*" ollama serve
                  </code>
                </div>
              </div>

              <div className="space-y-2">
                <label className="data-label">Ollama URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={settings.ollamaUrl}
                    onChange={(e) => { onUpdate({ ollamaUrl: e.target.value }); setConnStatus("idle"); setOllamaModels([]); }}
                    placeholder="http://localhost:11434"
                    className="flex-1 bg-accent text-foreground text-xs px-3 py-2 rounded-sm border border-panel-border font-mono placeholder:text-muted-foreground"
                  />
                  <button
                    onClick={async () => {
                      setConnStatus("testing");
                      setConnError("");
                      try {
                        const url = settings.ollamaUrl.replace(/\/+$/, "");
                        const resp = await fetch(`${url}/api/tags`);
                        const contentType = resp.headers.get("content-type") || "";
                        if (!contentType.includes("application/json")) {
                          throw new Error(
                            "Received HTML instead of JSON. If using the Lovable preview, Ollama on localhost is unreachable — run the app locally (npm run dev) to connect."
                          );
                        }
                        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
                        const data = await resp.json();
                        const models = (data.models || []).map((m: any) => m.name as string);
                        setOllamaModels(models);
                        setConnStatus("ok");
                        if (models.length > 0 && !models.includes(settings.ollamaModel)) {
                          onUpdate({ ollamaModel: models[0] });
                        }
                      } catch (err: any) {
                        setConnStatus("error");
                        const msg = err?.message || "Cannot reach Ollama";
                        if (msg.includes("Unexpected token") || msg.includes("<!doctype")) {
                          setConnError("Received HTML instead of JSON. If using the Lovable preview, Ollama on localhost is unreachable — run the app locally to connect.");
                        } else if (msg.includes("Failed to fetch") || msg.includes("NetworkError")) {
                          setConnError("Cannot reach Ollama. Ensure it's running with: OLLAMA_ORIGINS=\"*\" ollama serve");
                        } else {
                          setConnError(msg);
                        }
                        setOllamaModels([]);
                      }
                    }}
                    disabled={connStatus === "testing"}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-mono rounded-sm border border-panel-border bg-accent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30 transition-colors disabled:opacity-50"
                  >
                    {connStatus === "testing" ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plug className="w-3 h-3" />}
                    Test
                  </button>
                </div>
                {connStatus === "ok" && (
                  <p className="flex items-center gap-1 text-[10px] text-evidence-green">
                    <CheckCircle2 className="w-3 h-3" /> Connected — {ollamaModels.length} model{ollamaModels.length !== 1 ? "s" : ""} available
                  </p>
                )}
                {connStatus === "error" && (
                  <p className="flex items-center gap-1 text-[10px] text-destructive leading-relaxed">
                    <XCircle className="w-3 h-3 shrink-0" /> {connError}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="data-label">Model</label>
                {ollamaModels.length > 0 ? (
                  <select
                    value={settings.ollamaModel}
                    onChange={(e) => onUpdate({ ollamaModel: e.target.value })}
                    className="w-full bg-accent text-foreground text-xs px-3 py-2 rounded-sm border border-panel-border font-mono"
                  >
                    {ollamaModels.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={settings.ollamaModel}
                    onChange={(e) => onUpdate({ ollamaModel: e.target.value })}
                    placeholder="llama3.2"
                    className="w-full bg-accent text-foreground text-xs px-3 py-2 rounded-sm border border-panel-border font-mono placeholder:text-muted-foreground"
                  />
                )}
                <p className="text-[10px] text-muted-foreground">
                  {ollamaModels.length > 0
                    ? "Select from your locally available models"
                    : "Click Test to discover models, or type a model name manually"}
                </p>
              </div>
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
              <p className="font-mono text-foreground">{modelLabel()}</p>
            </div>
            <div>
              <p className="data-label mb-1">Provider</p>
              <p className="font-mono text-foreground">{providerLabel()}</p>
            </div>
            <div>
              <p className="data-label mb-1">Endpoint</p>
              <p className="font-mono text-foreground truncate">
                {settings.customProvider === "ollama"
                  ? settings.ollamaUrl
                  : settings.customProvider && settings.customApiKey
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
