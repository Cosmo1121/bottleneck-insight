import { AlertTriangle, CheckCircle2, XCircle, FileText } from "lucide-react";
import ValueChainLadder from "./ValueChainLadder";

const BottleneckWorkspace = () => {
  return (
    <main className="flex-1 h-screen overflow-y-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="status-dot bg-evidence-green" />
          <span className="data-label">Active Analysis</span>
        </div>
        <h1 className="font-display text-2xl font-bold text-foreground">
          AI Infrastructure Power Bottleneck
        </h1>
        <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
          The explosive growth in AI compute demand has created a structural bottleneck in power generation,
          grid infrastructure, and transformer manufacturing capacity.
        </p>
      </div>

      {/* Thesis Card */}
      <div className="panel">
        <div className="panel-header">
          <FileText className="w-4 h-4 text-primary" />
          <span className="data-label">Thesis</span>
        </div>
        <div className="p-4">
          <p className="font-mono text-sm text-foreground leading-relaxed">
            "AI demand growth requires 2-5x current power infrastructure buildout.
            Power generation, grid transformers, and cooling systems are the structural
            bottleneck with 3-7 year lead times. Invest in constrained power assets,
            not the AI narrative layer."
          </p>
        </div>
      </div>

      {/* Constraint + Evidence */}
      <div className="grid grid-cols-2 gap-4">
        <div className="panel">
          <div className="panel-header">
            <AlertTriangle className="w-4 h-4 text-bottleneck-amber" />
            <span className="data-label">Primary Constraint</span>
          </div>
          <div className="p-4 space-y-2">
            <p className="font-display font-semibold text-foreground">Power & Grid Capacity</p>
            <div className="flex flex-wrap gap-1.5">
              {["energy", "infrastructure capacity", "manufacturing capability", "time-to-build"].map((t) => (
                <span key={t} className="text-xs font-mono px-2 py-0.5 rounded-sm bg-bottleneck-amber/10 text-bottleneck-amber border border-bottleneck-amber/20">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <CheckCircle2 className="w-4 h-4 text-evidence-green" />
            <span className="data-label">Scarcity Evidence</span>
          </div>
          <div className="p-4 space-y-1.5">
            {[
              "Transformer lead times extended to 3-4 years",
              "Grid interconnection queues at record levels",
              "Natural gas power plant permits up 300% YoY",
              "Utility capex guidance raised 40-60%",
            ].map((e) => (
              <div key={e} className="flex items-start gap-2">
                <CheckCircle2 className="w-3 h-3 text-evidence-green mt-0.5 shrink-0" />
                <span className="text-xs text-muted-foreground">{e}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Value Chain */}
      <div className="panel">
        <div className="panel-header">
          <span className="data-label">Value Chain Analysis</span>
        </div>
        <div className="p-4">
          <ValueChainLadder />
        </div>
      </div>

      {/* False Friends + Thesis Breakers */}
      <div className="grid grid-cols-2 gap-4">
        <div className="panel">
          <div className="panel-header">
            <AlertTriangle className="w-4 h-4 text-bottleneck-amber" />
            <span className="data-label">False Friends</span>
          </div>
          <div className="p-4 space-y-1.5">
            {[
              "Pure-play AI software companies (no scarcity moat)",
              "Commoditized cloud resellers",
              "Generic data center REITs without power assets",
            ].map((f) => (
              <div key={f} className="flex items-start gap-2">
                <AlertTriangle className="w-3 h-3 text-bottleneck-amber mt-0.5 shrink-0" />
                <span className="text-xs text-muted-foreground">{f}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <XCircle className="w-4 h-4 text-thesis-breaker" />
            <span className="data-label">Thesis Breakers</span>
          </div>
          <div className="p-4 space-y-1.5">
            {[
              "Breakthrough in energy-efficient AI chips reducing power need 10x",
              "Regulatory fast-tracking of nuclear/grid permits",
              "Massive demand collapse in AI workloads",
              "Substitute technologies eliminating need for centralized compute",
            ].map((t) => (
              <div key={t} className="flex items-start gap-2">
                <XCircle className="w-3 h-3 text-thesis-breaker mt-0.5 shrink-0" />
                <span className="text-xs text-muted-foreground">{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default BottleneckWorkspace;
