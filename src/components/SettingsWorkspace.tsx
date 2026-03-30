import { Settings, RotateCcw, Eye, EyeOff, Cpu, Key, Info, Server, Plug, Loader2, CheckCircle2, XCircle, Rss, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import type { AISettings, CustomRssFeed } from "@/hooks/useAISettings";

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

  const providerLabel = () => {
    if (settings.customProvider === "ollama") return "Ollama (Local)";
    if (settings.customProvider === "openai") return "OpenAI";
    if (settings.customProvider === "anthropic") return "Anthropic";
    return "Not configured";
  };

  const modelLabel = () => {
    if (settings.customProvider === "ollama") return settings.ollamaModel;
    if (settings.customProvider === "openai") return settings.model || "gpt-4o";
    if (settings.customProvider === "anthropic") return settings.model || "claude-sonnet-4-20250514";
    return "None";
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
            Connect to a local Ollama instance or bring your own OpenAI / Anthropic API key.
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
              <span className="text-foreground font-medium">Ollama (local)</span> is the default — fully private, no API key needed.
              You can also use your own <span className="text-foreground font-medium">OpenAI</span> or <span className="text-foreground font-medium">Anthropic</span> API key for cloud models.
            </p>
          </div>

          <div className="space-y-2">
            <label className="data-label">Provider</label>
            <div className="flex flex-wrap gap-2">
              {[
                { value: "ollama" as const, label: "Ollama (Local)" },
                { value: "openai" as const, label: "OpenAI" },
                { value: "anthropic" as const, label: "Anthropic" },
              ].map((opt) => {
                const isActive = settings.customProvider === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => onUpdate({
                      customProvider: opt.value,
                      customApiKey: opt.value !== "ollama" ? settings.customApiKey : "",
                      model: "",
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
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-4">
              <div className="space-y-2">
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
                  Stored in localStorage only. Sent to backend for AI calls — never stored server-side.
                </p>
              </div>

              <div className="space-y-2">
                <label className="data-label">Model (optional)</label>
                <input
                  type="text"
                  value={settings.model}
                  onChange={(e) => onUpdate({ model: e.target.value })}
                  placeholder={settings.customProvider === "openai" ? "gpt-4o" : "claude-sonnet-4-20250514"}
                  className="w-full bg-accent text-foreground text-xs px-3 py-2 rounded-sm border border-panel-border font-mono placeholder:text-muted-foreground"
                />
                <p className="text-[10px] text-muted-foreground">
                  Leave blank for the default model, or specify any model your API key supports.
                </p>
              </div>
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
                            "Received HTML instead of JSON. If using a hosted preview, Ollama on localhost is unreachable — run the app locally (npm run dev) to connect."
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
                          setConnError("Received HTML instead of JSON. If using a hosted preview, Ollama on localhost is unreachable — run the app locally to connect.");
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

      {/* Custom RSS Feeds */}
      <CustomRssPanel feeds={settings.customRssFeeds || []} onUpdate={(feeds) => onUpdate({ customRssFeeds: feeds })} />

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
              <p className="data-label mb-1">Status</p>
              <p className="font-mono text-foreground">
                {settings.customProvider === "ollama"
                  ? "Local"
                  : settings.customApiKey
                    ? "Key configured"
                    : "⚠️ No API key"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SettingsWorkspace;
