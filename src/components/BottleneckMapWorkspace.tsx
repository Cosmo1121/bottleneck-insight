import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Crosshair, Plus, X, GripVertical } from "lucide-react";
import type { BottleneckAnalysis } from "@/types/analysis";

interface BottleneckMapWorkspaceProps {
  analyses: BottleneckAnalysis[];
  activeAnalysisId: string | null;
}

interface PlotPoint {
  id: string;
  theme: string;
  scarcityDuration: number; // 0-100
  marketMispricing: number; // 0-100
  totalScore: number;
}

// Derive positioning from scores
const analysisToPoint = (a: BottleneckAnalysis): PlotPoint => {
  const s = a.scores;
  // Scarcity Duration: driven by time_to_add_capacity, barriers_to_entry, capital_intensity
  const scarcityDuration = ((s.time_to_add_capacity + s.barriers_to_entry + s.capital_intensity) / 15) * 100;
  // Market Mispricing: inverse of market_crowding, boosted by scarcity_severity
  const mispricing = (((5 - s.market_crowding) + s.scarcity_severity + s.pricing_power) / 15) * 100;
  const totalScore = Object.values(s).reduce((a, b) => a + b, 0);
  return { id: a.id, theme: a.theme, scarcityDuration, marketMispricing: mispricing, totalScore };
};

const getQuadrant = (x: number, y: number) => {
  if (x >= 50 && y >= 50) return { label: "Structural Bottleneck", color: "text-evidence-green" };
  if (x < 50 && y >= 50) return { label: "Hidden Gem", color: "text-primary" };
  if (x >= 50 && y < 50) return { label: "Crowded Trade", color: "text-bottleneck-amber" };
  return { label: "Weak Bottleneck", color: "text-thesis-breaker" };
};

const getDotColor = (totalScore: number) => {
  if (totalScore >= 30) return "bg-evidence-green";
  if (totalScore >= 20) return "bg-bottleneck-amber";
  return "bg-thesis-breaker";
};

const CHART_SIZE = 520;
const PADDING = 40;

const BottleneckMapWorkspace = ({ analyses, activeAnalysisId }: BottleneckMapWorkspaceProps) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const points = useMemo(() => analyses.map(analysisToPoint), [analyses]);

  const toPixel = (val: number, axis: "x" | "y") => {
    const range = CHART_SIZE - PADDING * 2;
    if (axis === "x") return PADDING + (val / 100) * range;
    return CHART_SIZE - PADDING - (val / 100) * range; // invert Y
  };

  return (
    <main className="flex-1 h-screen overflow-y-auto p-6 space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Crosshair className="w-4 h-4 text-primary" />
          <span className="data-label">Bottleneck Map</span>
        </div>
        <h1 className="font-display text-2xl font-bold text-foreground">
          Scarcity Duration vs Market Mispricing
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Best opportunities appear in the upper-right quadrant: high scarcity duration + high market mispricing.
        </p>
      </div>

      <div className="panel">
        <div className="panel-header">
          <span className="data-label">Quadrant Chart</span>
          <span className="ml-auto text-xs font-mono text-muted-foreground">{points.length} analyses plotted</span>
        </div>
        <div className="p-6 flex justify-center">
          {points.length === 0 ? (
            <div className="flex items-center justify-center h-80 text-muted-foreground text-sm">
              Create analyses with scored heatmaps to plot them here
            </div>
          ) : (
            <svg
              width={CHART_SIZE}
              height={CHART_SIZE}
              viewBox={`0 0 ${CHART_SIZE} ${CHART_SIZE}`}
              className="overflow-visible"
            >
              {/* Quadrant backgrounds */}
              <rect x={PADDING} y={PADDING} width={(CHART_SIZE - PADDING * 2) / 2} height={(CHART_SIZE - PADDING * 2) / 2} fill="hsl(160 60% 40% / 0.03)" />
              <rect x={PADDING + (CHART_SIZE - PADDING * 2) / 2} y={PADDING} width={(CHART_SIZE - PADDING * 2) / 2} height={(CHART_SIZE - PADDING * 2) / 2} fill="hsl(160 60% 40% / 0.08)" />
              <rect x={PADDING} y={PADDING + (CHART_SIZE - PADDING * 2) / 2} width={(CHART_SIZE - PADDING * 2) / 2} height={(CHART_SIZE - PADDING * 2) / 2} fill="hsl(0 72% 51% / 0.04)" />
              <rect x={PADDING + (CHART_SIZE - PADDING * 2) / 2} y={PADDING + (CHART_SIZE - PADDING * 2) / 2} width={(CHART_SIZE - PADDING * 2) / 2} height={(CHART_SIZE - PADDING * 2) / 2} fill="hsl(38 92% 50% / 0.04)" />

              {/* Grid lines */}
              <line x1={toPixel(50, "x")} y1={PADDING} x2={toPixel(50, "x")} y2={CHART_SIZE - PADDING} stroke="hsl(217 20% 20%)" strokeDasharray="4 4" />
              <line x1={PADDING} y1={toPixel(50, "y")} x2={CHART_SIZE - PADDING} y2={toPixel(50, "y")} stroke="hsl(217 20% 20%)" strokeDasharray="4 4" />

              {/* Border */}
              <rect x={PADDING} y={PADDING} width={CHART_SIZE - PADDING * 2} height={CHART_SIZE - PADDING * 2} fill="none" stroke="hsl(217 20% 20%)" strokeWidth="1" />

              {/* Quadrant labels */}
              <text x={PADDING + 8} y={PADDING + 18} fill="hsl(160 60% 40% / 0.5)" fontSize="10" fontFamily="'Space Grotesk', sans-serif" fontWeight="600">Hidden Gem</text>
              <text x={CHART_SIZE - PADDING - 8} y={PADDING + 18} fill="hsl(160 60% 40% / 0.8)" fontSize="10" fontFamily="'Space Grotesk', sans-serif" fontWeight="600" textAnchor="end">Structural Bottleneck</text>
              <text x={PADDING + 8} y={CHART_SIZE - PADDING - 8} fill="hsl(0 72% 51% / 0.5)" fontSize="10" fontFamily="'Space Grotesk', sans-serif" fontWeight="600">Weak Bottleneck</text>
              <text x={CHART_SIZE - PADDING - 8} y={CHART_SIZE - PADDING - 8} fill="hsl(38 92% 50% / 0.5)" fontSize="10" fontFamily="'Space Grotesk', sans-serif" fontWeight="600" textAnchor="end">Crowded Trade</text>

              {/* Axis labels */}
              <text x={CHART_SIZE / 2} y={CHART_SIZE - 6} fill="hsl(215 20% 55%)" fontSize="11" fontFamily="'JetBrains Mono', monospace" textAnchor="middle">SCARCITY DURATION →</text>
              <text x={10} y={CHART_SIZE / 2} fill="hsl(215 20% 55%)" fontSize="11" fontFamily="'JetBrains Mono', monospace" textAnchor="middle" transform={`rotate(-90, 10, ${CHART_SIZE / 2})`}>MARKET MISPRICING →</text>

              {/* Data points */}
              {points.map((point) => {
                const cx = toPixel(point.scarcityDuration, "x");
                const cy = toPixel(point.marketMispricing, "y");
                const isActive = point.id === activeAnalysisId;
                const isHovered = point.id === hoveredId;
                const r = isActive ? 10 : 7;
                const fillColor = point.totalScore >= 30
                  ? "hsl(160 60% 40%)"
                  : point.totalScore >= 20
                  ? "hsl(38 92% 50%)"
                  : "hsl(0 72% 51%)";

                return (
                  <g
                    key={point.id}
                    onMouseEnter={() => setHoveredId(point.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    style={{ cursor: "pointer" }}
                  >
                    {/* Glow ring for active */}
                    {isActive && (
                      <circle cx={cx} cy={cy} r={r + 4} fill="none" stroke={fillColor} strokeWidth="1.5" opacity="0.4" />
                    )}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isHovered ? r + 2 : r}
                      fill={fillColor}
                      opacity={isActive || isHovered ? 1 : 0.7}
                      style={{ transition: "r 0.15s ease, opacity 0.15s ease" }}
                    />
                    {/* Label */}
                    {(isHovered || isActive) && (
                      <g>
                        <rect
                          x={cx + 14}
                          y={cy - 12}
                          width={point.theme.length * 6.5 + 16}
                          height={22}
                          rx={2}
                          fill="hsl(215 28% 14%)"
                          stroke="hsl(217 20% 20%)"
                          strokeWidth="1"
                        />
                        <text
                          x={cx + 22}
                          y={cy + 2}
                          fill="hsl(210 40% 98%)"
                          fontSize="11"
                          fontFamily="'JetBrains Mono', monospace"
                        >
                          {point.theme}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>
          )}
        </div>
      </div>

      {/* Analysis table */}
      {points.length > 0 && (
        <div className="panel">
          <div className="panel-header">
            <span className="data-label">Plotted Analyses</span>
          </div>
          <div className="divide-y divide-panel-border">
            {points.map((p) => {
              const quadrant = getQuadrant(p.scarcityDuration, p.marketMispricing);
              const isActive = p.id === activeAnalysisId;
              return (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`px-4 py-3 flex items-center gap-4 ${isActive ? "bg-accent/50" : ""}`}
                  onMouseEnter={() => setHoveredId(p.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <div className={`w-3 h-3 rounded-full shrink-0 ${getDotColor(p.totalScore)}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-display font-medium text-foreground truncate">{p.theme}</p>
                    <p className={`text-xs font-mono ${quadrant.color}`}>{quadrant.label}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Duration: <span className="font-mono text-foreground">{Math.round(p.scarcityDuration)}%</span></p>
                    <p className="text-xs text-muted-foreground">Mispricing: <span className="font-mono text-foreground">{Math.round(p.marketMispricing)}%</span></p>
                  </div>
                  <div className="font-mono text-sm font-semibold text-foreground w-12 text-right">
                    {p.totalScore}/45
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </main>
  );
};

export default BottleneckMapWorkspace;
