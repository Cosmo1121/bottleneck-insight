import yaml from "js-yaml";
import type { BottleneckAnalysis } from "@/types/analysis";
import {
  defaultScores, defaultRationale, defaultValueChain, defaultPortfolio,
  defaultScarcityEvidence, defaultOpportunities, defaultThesisBreakersStructured, defaultMonitoring,
} from "@/types/analysis";

const buildSchemaObject = (a: BottleneckAnalysis) => ({
  schema_version: "1.0.0",
  title: "Bottleneck Investing Data Schema",
  meta: {
    id: a.id,
    created_at: a.created_at,
    updated_at: a.updated_at,
    analyst: a.analyst,
    agent_name: a.agent_name,
    source_context: a.source_context,
    status: a.status,
    tags: a.tags,
  },
  subject: {
    type: a.subject_type,
    name: a.theme,
    description: a.subject_description,
    geography: a.geography_list,
    time_horizon: a.time_horizon,
    public_markets_only: a.public_markets_only,
    risk_level: a.risk_level,
  },
  thesis: {
    one_sentence_thesis: a.thesis,
    worldview_assumption: a.worldview_assumption,
    structural_shift: a.structural_shift,
    demand_wave: a.demand_wave,
    thesis_stage: a.thesis_stage,
  },
  constraints: {
    primary_bottleneck: a.primary_bottleneck,
    scarcity_types: a.scarcity_types,
    constraint_description: a.constraint_description,
    measurable: a.constraint_measurable,
    why_now: a.why_now,
    time_to_resolve: a.time_to_resolve,
  },
  scarcity_evidence: {
    supply_shortages: a.scarcity_evidence.supply_shortages,
    long_lead_times: a.scarcity_evidence.long_lead_times,
    regulatory_backlog: a.scarcity_evidence.regulatory_backlog,
    capacity_constraints: a.scarcity_evidence.capacity_constraints,
    rising_prices: a.scarcity_evidence.rising_prices,
    industry_warnings: a.scarcity_evidence.industry_warnings,
    capex_surge: a.scarcity_evidence.capex_surge,
    utilization_pressure: a.scarcity_evidence.utilization_pressure,
    notes: a.scarcity_evidence.notes,
    evidence_items: a.scarcity_evidence.evidence_items,
  },
  heatmap: {
    scoring_scale: { min: 1, mid: 3, max: 5 },
    scores: a.scores,
    total_score: Object.values(a.scores).reduce((s, v) => s + v, 0),
    classification: getClassification(Object.values(a.scores).reduce((s, v) => s + v, 0)),
    rationale: a.heatmap_rationale,
  },
  value_chain: {
    demand_creators: a.value_chain.demand_creators,
    bottleneck_owners: a.value_chain.bottleneck_owners,
    picks_and_shovels: a.value_chain.picks_and_shovels,
    enabling_infrastructure: a.value_chain.infrastructure,
    integrators: a.value_chain.integrators,
    downstream_operators: a.value_chain.operators,
    second_order_beneficiaries: a.second_order_beneficiaries,
    likely_losers: a.likely_losers,
    value_capture_layer: a.value_capture_layer,
    transmission_mechanism: a.transmission_mechanism,
  },
  opportunities: {
    ranked_areas: a.opportunities.ranked_areas,
    optional_public_market_examples: a.opportunities.public_market_examples,
  },
  false_friends: {
    assets: a.false_friends,
    notes: "",
  },
  portfolio_translation: {
    core_bottleneck_layer: a.portfolio.layers[0]?.items ?? [],
    supporting_infrastructure: a.portfolio.layers[1]?.items ?? [],
    picks_and_shovels: a.portfolio.layers[2]?.items ?? [],
    speculative_satellite: a.portfolio.layers[3]?.items ?? [],
    hedges_or_offsets: a.portfolio.layers[4]?.items ?? [],
    concentration_risk: a.concentration_risk,
    crowding_risk: a.crowding_risk,
    correlation_risk: a.correlation_risk,
    implementation_notes: a.implementation_notes,
  },
  thesis_breakers: {
    technology_disruption: a.thesis_breakers_structured.technology_disruption,
    regulatory_change: a.thesis_breakers_structured.regulatory_change,
    supply_expansion: a.thesis_breakers_structured.supply_expansion,
    demand_decline: a.thesis_breakers_structured.demand_decline,
    capital_flood: a.thesis_breakers_structured.capital_flood,
    substitution: a.thesis_breakers_structured.substitution,
    timing_mismatch: a.thesis_breakers_structured.timing_mismatch,
    valuation_crowding: a.thesis_breakers_structured.valuation_crowding,
    notes: a.thesis_breakers_structured.notes,
  },
  monitoring: {
    key_indicators: a.monitoring.key_indicators,
    confirming_evidence: a.monitoring.confirming_evidence,
    weakening_signals: a.monitoring.weakening_signals,
    disconfirming_evidence: a.monitoring.disconfirming_evidence,
    thesis_status: a.monitoring.thesis_status,
  },
  confidence: {
    overall_confidence: a.overall_confidence,
    confidence_notes: a.confidence_notes,
    major_unknowns: a.major_unknowns,
  },
  summary: {
    scarcity_strength: a.scarcity_strength,
    investment_priority: a.investment_priority,
    final_assessment: a.final_assessment,
    principle: "Do not invest in the story. Invest in what the story cannot proceed without.",
  },
});

function getClassification(total: number): string {
  if (total >= 30) return "structural_bottleneck";
  if (total >= 20) return "moderate_constraint";
  if (total >= 10) return "narrative_theme";
  return "weak_thesis";
}

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportAsYaml(analysis: BottleneckAnalysis) {
  const obj = buildSchemaObject(analysis);
  const content = yaml.dump(obj, { lineWidth: 120, noRefs: true, sortKeys: false });
  const slug = analysis.theme.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40);
  downloadFile(content, `${slug}.yaml`, "text/yaml");
}

export function exportAsMarkdown(analysis: BottleneckAnalysis) {
  const obj = buildSchemaObject(analysis);
  const total = obj.heatmap.total_score;
  const lines: string[] = [];

  lines.push(`# ${analysis.theme}`);
  lines.push(`> ${obj.summary.principle}`);
  lines.push("");

  lines.push("## Meta");
  lines.push(`- **Status:** ${obj.meta.status}`);
  lines.push(`- **Analyst:** ${obj.meta.analyst || "—"}`);
  lines.push(`- **Created:** ${new Date(obj.meta.created_at).toLocaleDateString()}`);
  if (obj.meta.tags.length) lines.push(`- **Tags:** ${obj.meta.tags.join(", ")}`);
  lines.push("");

  lines.push("## Subject");
  lines.push(`- **Type:** ${obj.subject.type || "—"}`);
  lines.push(`- **Description:** ${obj.subject.description || "—"}`);
  lines.push(`- **Geography:** ${obj.subject.geography.join(", ") || "—"}`);
  lines.push(`- **Time Horizon:** ${obj.subject.time_horizon || "—"}`);
  lines.push(`- **Risk Level:** ${obj.subject.risk_level || "—"}`);
  lines.push("");

  lines.push("## Thesis");
  lines.push(obj.thesis.one_sentence_thesis || "*No thesis defined.*");
  lines.push("");
  if (obj.thesis.worldview_assumption) lines.push(`**Worldview:** ${obj.thesis.worldview_assumption}`);
  if (obj.thesis.structural_shift.length) lines.push(`**Structural Shifts:** ${obj.thesis.structural_shift.join(", ")}`);
  if (obj.thesis.demand_wave) lines.push(`**Demand Wave:** ${obj.thesis.demand_wave}`);
  if (obj.thesis.thesis_stage) lines.push(`**Stage:** ${obj.thesis.thesis_stage}`);
  lines.push("");

  lines.push("## Constraints");
  lines.push(`- **Primary Bottleneck:** ${obj.constraints.primary_bottleneck || "—"}`);
  if (obj.constraints.scarcity_types.length) lines.push(`- **Scarcity Types:** ${obj.constraints.scarcity_types.join(", ")}`);
  if (obj.constraints.constraint_description) lines.push(`- **Description:** ${obj.constraints.constraint_description}`);
  if (obj.constraints.why_now) lines.push(`- **Why Now:** ${obj.constraints.why_now}`);
  if (obj.constraints.time_to_resolve) lines.push(`- **Time to Resolve:** ${obj.constraints.time_to_resolve}`);
  lines.push("");

  lines.push("## Heatmap Scores");
  lines.push(`**Total: ${total}/45 — ${obj.heatmap.classification.replace(/_/g, " ")}**`);
  lines.push("");
  lines.push("| Factor | Score |");
  lines.push("|--------|-------|");
  for (const [k, v] of Object.entries(obj.heatmap.scores)) {
    lines.push(`| ${k.replace(/_/g, " ")} | ${v}/5 |`);
  }
  lines.push("");

  lines.push("## Value Chain");
  for (const [k, v] of Object.entries(obj.value_chain)) {
    if (Array.isArray(v) && v.length) lines.push(`- **${k.replace(/_/g, " ")}:** ${v.join(", ")}`);
    else if (typeof v === "string" && v) lines.push(`- **${k.replace(/_/g, " ")}:** ${v}`);
  }
  lines.push("");

  if (obj.opportunities.ranked_areas.length) {
    lines.push("## Opportunities");
    for (const area of obj.opportunities.ranked_areas) {
      lines.push(`${area.rank}. **${area.area_name}** (${area.area_type}) — Scarcity: ${area.scarcity}, Pricing Power: ${area.pricing_power}`);
    }
    lines.push("");
  }

  if (obj.opportunities.optional_public_market_examples.length) {
    lines.push("### Public Market Examples");
    lines.push("| Ticker | Name | Role | Fit |");
    lines.push("|--------|------|------|-----|");
    for (const t of obj.opportunities.optional_public_market_examples) {
      lines.push(`| ${t.ticker} | ${t.name} | ${t.role_in_thesis} | ${t.fit_strength} |`);
    }
    lines.push("");
  }

  lines.push("## Thesis Breakers");
  const activeBreakers = Object.entries(obj.thesis_breakers)
    .filter(([k, v]) => k !== "notes" && v === true)
    .map(([k]) => k.replace(/_/g, " "));
  lines.push(activeBreakers.length ? activeBreakers.map((b) => `- ⚠️ ${b}`).join("\n") : "*No active thesis breakers.*");
  lines.push("");

  lines.push("## Confidence");
  lines.push(`**Overall: ${obj.confidence.overall_confidence}%**`);
  if (obj.confidence.confidence_notes) lines.push(obj.confidence.confidence_notes);
  if (obj.confidence.major_unknowns.length) {
    lines.push("\n**Major Unknowns:**");
    obj.confidence.major_unknowns.forEach((u) => lines.push(`- ${u}`));
  }
  lines.push("");

  lines.push("## Summary");
  if (obj.summary.scarcity_strength) lines.push(`- **Scarcity Strength:** ${obj.summary.scarcity_strength}`);
  if (obj.summary.investment_priority) lines.push(`- **Investment Priority:** ${obj.summary.investment_priority}`);
  if (obj.summary.final_assessment) lines.push(`\n${obj.summary.final_assessment}`);
  lines.push("");

  const slug = analysis.theme.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40);
  downloadFile(lines.join("\n"), `${slug}.md`, "text/markdown");
}
