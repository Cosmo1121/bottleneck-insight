import jsPDF from "jspdf";
import type { BottleneckAnalysis, HeatmapScores, ThesisBreakersStructured } from "@/types/analysis";

const factorLabels: Record<keyof HeatmapScores, { label: string; positive: boolean }> = {
  scarcity_severity: { label: "Scarcity Severity", positive: true },
  supply_response_speed: { label: "Supply Response", positive: true },
  time_to_add_capacity: { label: "Capacity Build Time", positive: true },
  capital_intensity: { label: "Capital Intensity", positive: true },
  regulatory_friction: { label: "Regulatory Friction", positive: true },
  demand_growth: { label: "Demand Growth", positive: true },
  pricing_power: { label: "Pricing Power", positive: true },
  barriers_to_entry: { label: "Barriers to Entry", positive: true },
  market_crowding: { label: "Market Crowding", positive: false },
};

const breakerLabels: Record<keyof Omit<ThesisBreakersStructured, "notes">, string> = {
  technology_disruption: "Tech Disruption",
  regulatory_change: "Regulatory Change",
  supply_expansion: "Supply Expansion",
  demand_decline: "Demand Decline",
  capital_flood: "Capital Flood",
  substitution: "Substitution",
  timing_mismatch: "Timing Mismatch",
  valuation_crowding: "Valuation Crowding",
};

const getClassification = (total: number) => {
  if (total >= 30) return "STRUCTURAL BOTTLENECK";
  if (total >= 20) return "MODERATE CONSTRAINT";
  if (total >= 10) return "NARRATIVE THEME";
  return "WEAK THESIS";
};

const getTrafficLabel = (score: number, positive: boolean) => {
  if (!positive) {
    if (score <= 2) return "Low Risk";
    if (score <= 3) return "Moderate";
    return "High Risk";
  }
  if (score >= 4) return "Strong";
  if (score >= 3) return "Moderate";
  return "Weak";
};

const getColor = (score: number, positive: boolean): [number, number, number] => {
  if (!positive) {
    if (score <= 2) return [46, 160, 120]; // green
    if (score <= 3) return [217, 160, 20]; // amber
    return [200, 60, 60]; // red
  }
  if (score >= 4) return [46, 160, 120];
  if (score >= 3) return [217, 160, 20];
  return [120, 120, 120];
};

export function exportScorecardPdf(analysis: BottleneckAnalysis) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pw = 210;
  const margin = 15;
  const cw = pw - margin * 2;
  let y = margin;

  const bg: [number, number, number] = [18, 18, 18];
  const fg: [number, number, number] = [237, 237, 237];
  const mutedFg: [number, number, number] = [128, 128, 128];
  const primary: [number, number, number] = [46, 160, 120];
  const cardBg: [number, number, number] = [28, 28, 28];
  const barBg: [number, number, number] = [38, 38, 38];

  // Full page background
  doc.setFillColor(...bg);
  doc.rect(0, 0, 210, 297, "F");

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(...fg);
  doc.text("SCARCITY SCOUT", margin, y + 6);
  doc.setFontSize(10);
  doc.setTextColor(...primary);
  doc.text("VISUAL SCORECARD", margin + 58, y + 6);
  y += 12;

  // Theme
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...mutedFg);
  doc.text(analysis.theme.toUpperCase(), margin, y);
  doc.text(new Date().toLocaleDateString(), pw - margin, y, { align: "right" });
  y += 8;

  // Divider
  doc.setDrawColor(50, 50, 50);
  doc.line(margin, y, pw - margin, y);
  y += 6;

  // === Score & Confidence row ===
  const scores = analysis.scores;
  const total = Object.values(scores).reduce((a, b) => a + b, 0);
  const classLabel = getClassification(total);

  // Score box
  doc.setFillColor(...cardBg);
  doc.roundedRect(margin, y, cw / 3 - 3, 32, 2, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.setTextColor(...fg);
  doc.text(`${total}`, margin + (cw / 3 - 3) / 2, y + 16, { align: "center" });
  doc.setFontSize(9);
  doc.setTextColor(...mutedFg);
  doc.text("/45", margin + (cw / 3 - 3) / 2 + 12, y + 16);
  const clColor = total >= 30 ? primary : total >= 20 ? [217, 160, 20] as [number, number, number] : [200, 60, 60] as [number, number, number];
  doc.setTextColor(...clColor);
  doc.setFontSize(7);
  doc.text(classLabel, margin + (cw / 3 - 3) / 2, y + 24, { align: "center" });

  // Confidence box
  const cx = margin + cw / 3 + 1;
  doc.setFillColor(...cardBg);
  doc.roundedRect(cx, y, cw / 3 - 3, 32, 2, 2, "F");
  const conf = analysis.overall_confidence;
  const confColor = conf >= 70 ? primary : conf >= 40 ? [217, 160, 20] as [number, number, number] : [200, 60, 60] as [number, number, number];
  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.setTextColor(...confColor);
  doc.text(`${conf}%`, cx + (cw / 3 - 3) / 2, y + 16, { align: "center" });
  doc.setFontSize(7);
  doc.setTextColor(...mutedFg);
  doc.text("CONFIDENCE", cx + (cw / 3 - 3) / 2, y + 24, { align: "center" });

  // Quick stats box
  const sx = margin + (cw / 3) * 2 + 2;
  const sw = cw / 3 - 1;
  doc.setFillColor(...cardBg);
  doc.roundedRect(sx, y, sw, 32, 2, 2, "F");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  const evidenceFlags = analysis.scarcity_evidence;
  const evidenceCount = [
    evidenceFlags.supply_shortages, evidenceFlags.long_lead_times, evidenceFlags.regulatory_backlog,
    evidenceFlags.capacity_constraints, evidenceFlags.rising_prices, evidenceFlags.industry_warnings,
    evidenceFlags.capex_surge, evidenceFlags.utilization_pressure,
  ].filter(Boolean).length;
  const activeBreakers = (Object.keys(breakerLabels) as (keyof Omit<ThesisBreakersStructured, "notes">)[]).filter((k) => analysis.thesis_breakers_structured[k]);

  const stats = [
    ["Status", (analysis.status || "draft").toUpperCase()],
    ["Evidence", `${evidenceCount}/8`],
    ["Breakers", `${activeBreakers.length} active`],
    ["Portfolio", `${analysis.portfolio.layers.reduce((s, l) => s + l.weight, 0)}%`],
  ];
  stats.forEach(([label, val], i) => {
    doc.setTextColor(...mutedFg);
    doc.text(label, sx + 3, y + 7 + i * 6.5);
    doc.setTextColor(...fg);
    doc.text(val, sx + sw - 3, y + 7 + i * 6.5, { align: "right" });
  });

  y += 38;

  // === Factor Breakdown ===
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...mutedFg);
  doc.text("FACTOR BREAKDOWN", margin, y);
  y += 5;

  const keys = Object.keys(scores) as (keyof HeatmapScores)[];
  const colW = cw / 3 - 2;
  keys.forEach((key, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const fx = margin + col * (colW + 3);
    const fy = y + row * 18;

    const score = scores[key];
    const cfg = factorLabels[key];
    const color = getColor(score, cfg.positive);
    const traffic = getTrafficLabel(score, cfg.positive);

    doc.setFillColor(...cardBg);
    doc.roundedRect(fx, fy, colW, 15, 1, 1, "F");

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(...mutedFg);
    doc.text(cfg.label, fx + 2, fy + 5);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...color);
    doc.text(`${score}`, fx + colW - 12, fy + 5);
    doc.setFontSize(6);
    doc.setTextColor(...mutedFg);
    doc.text("/5", fx + colW - 6, fy + 5);

    // Bar
    doc.setFillColor(...barBg);
    doc.roundedRect(fx + 2, fy + 8, colW - 4, 2, 1, 1, "F");
    doc.setFillColor(...color);
    doc.roundedRect(fx + 2, fy + 8, (colW - 4) * (score / 5), 2, 1, 1, "F");

    // Traffic label
    doc.setFont("helvetica", "normal");
    doc.setFontSize(5.5);
    doc.setTextColor(...color);
    doc.text(traffic, fx + 2, fy + 13.5);
  });

  y += Math.ceil(keys.length / 3) * 18 + 4;

  // === Bottom panels: Breakers + Evidence + Portfolio ===
  const panelW = cw / 3 - 2;

  // Thesis Breakers
  doc.setFillColor(...cardBg);
  doc.roundedRect(margin, y, panelW, 52, 2, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(...mutedFg);
  doc.text("THESIS BREAKERS", margin + 3, y + 5);
  (Object.keys(breakerLabels) as (keyof Omit<ThesisBreakersStructured, "notes">)[]).forEach((key, i) => {
    const active = analysis.thesis_breakers_structured[key];
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6);
    doc.setTextColor(...mutedFg);
    doc.text(breakerLabels[key], margin + 3, y + 12 + i * 5);
    const dotColor: [number, number, number] = active ? [200, 60, 60] : [46, 160, 120];
    doc.setFillColor(...dotColor);
    doc.circle(margin + panelW - 5, y + 11 + i * 5, 1.2, "F");
  });

  // Evidence Signals
  const ex = margin + panelW + 3;
  doc.setFillColor(...cardBg);
  doc.roundedRect(ex, y, panelW, 52, 2, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(...mutedFg);
  doc.text("EVIDENCE SIGNALS", ex + 3, y + 5);
  const evidenceItems = [
    { key: "supply_shortages", label: "Supply Shortages" },
    { key: "long_lead_times", label: "Long Lead Times" },
    { key: "regulatory_backlog", label: "Regulatory Backlog" },
    { key: "capacity_constraints", label: "Capacity Constraints" },
    { key: "rising_prices", label: "Rising Prices" },
    { key: "industry_warnings", label: "Industry Warnings" },
    { key: "capex_surge", label: "Capex Surge" },
    { key: "utilization_pressure", label: "Utilization Pressure" },
  ];
  evidenceItems.forEach(({ key, label }, i) => {
    const active = (evidenceFlags as any)[key];
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6);
    doc.setTextColor(...mutedFg);
    doc.text(label, ex + 3, y + 12 + i * 5);
    doc.setFillColor(...(active ? primary : barBg));
    doc.circle(ex + panelW - 5, y + 11 + i * 5, 1.2, "F");
  });

  // Portfolio Allocation
  const px = margin + (panelW + 3) * 2;
  doc.setFillColor(...cardBg);
  doc.roundedRect(px, y, panelW, 52, 2, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(...mutedFg);
  doc.text("PORTFOLIO ALLOCATION", px + 3, y + 5);
  analysis.portfolio.layers.forEach((layer, i) => {
    const ly = y + 12 + i * 8;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6);
    doc.setTextColor(...mutedFg);
    doc.text(layer.label, px + 3, ly);
    doc.setTextColor(...fg);
    doc.text(`${layer.weight}%`, px + panelW - 3, ly, { align: "right" });
    // Bar
    doc.setFillColor(...barBg);
    doc.roundedRect(px + 3, ly + 1.5, panelW - 6, 1.5, 0.5, 0.5, "F");
    doc.setFillColor(...primary);
    doc.roundedRect(px + 3, ly + 1.5, (panelW - 6) * (layer.weight / 100), 1.5, 0.5, 0.5, "F");
  });

  y += 58;

  // === Thesis & Assessment ===
  if (analysis.thesis || analysis.final_assessment) {
    const textPanelW = analysis.thesis && analysis.final_assessment ? cw / 2 - 2 : cw;
    if (analysis.thesis) {
      doc.setFillColor(...cardBg);
      doc.roundedRect(margin, y, textPanelW, 30, 2, 2, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      doc.setTextColor(...mutedFg);
      doc.text("THESIS", margin + 3, y + 5);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(6.5);
      doc.setTextColor(...fg);
      const thesisLines = doc.splitTextToSize(analysis.thesis, textPanelW - 6);
      doc.text(thesisLines.slice(0, 5), margin + 3, y + 10);
    }
    if (analysis.final_assessment) {
      const ax = analysis.thesis ? margin + textPanelW + 4 : margin;
      doc.setFillColor(...cardBg);
      doc.roundedRect(ax, y, textPanelW, 30, 2, 2, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      doc.setTextColor(...mutedFg);
      doc.text("FINAL ASSESSMENT", ax + 3, y + 5);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(6.5);
      doc.setTextColor(...fg);
      const assessLines = doc.splitTextToSize(analysis.final_assessment, textPanelW - 6);
      doc.text(assessLines.slice(0, 5), ax + 3, y + 10);
    }
  }

  // Footer
  doc.setFont("helvetica", "normal");
  doc.setFontSize(5.5);
  doc.setTextColor(...mutedFg);
  doc.text("Generated by Scarcity Scout", margin, 292);
  doc.text(`${analysis.theme} — ${new Date().toLocaleString()}`, pw - margin, 292, { align: "right" });

  doc.save(`scorecard-${analysis.theme.replace(/\s+/g, "-").toLowerCase()}.pdf`);
}
