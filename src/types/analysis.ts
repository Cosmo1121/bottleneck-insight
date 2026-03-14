export interface HeatmapScores {
  scarcity_severity: number;
  supply_response_speed: number;
  time_to_add_capacity: number;
  capital_intensity: number;
  regulatory_friction: number;
  demand_growth: number;
  pricing_power: number;
  barriers_to_entry: number;
  market_crowding: number;
}

export interface HeatmapRationale {
  scarcity_severity: string;
  supply_response_speed: string;
  time_to_add_capacity: string;
  capital_intensity: string;
  regulatory_friction: string;
  demand_growth: string;
  pricing_power: string;
  barriers_to_entry: string;
  market_crowding: string;
}

export interface ValueChainData {
  demand_creators: string[];
  integrators: string[];
  operators: string[];
  infrastructure: string[];
  picks_and_shovels: string[];
  bottleneck_owners: string[];
}

export interface PortfolioLayer {
  label: string;
  weight: number;
  items: string[];
}

export interface PortfolioRisk {
  label: string;
  level: "Low" | "Medium" | "High";
  description: string;
}

export interface PortfolioData {
  layers: PortfolioLayer[];
  risks: PortfolioRisk[];
}

export interface EvidenceItem {
  source_name: string;
  source_type: string;
  date: string;
  signal: string;
  summary: string;
  confidence: number;
}

export interface ScarcityEvidence {
  supply_shortages: boolean;
  long_lead_times: boolean;
  regulatory_backlog: boolean;
  capacity_constraints: boolean;
  rising_prices: boolean;
  industry_warnings: boolean;
  capex_surge: boolean;
  utilization_pressure: boolean;
  notes: string;
  evidence_items: EvidenceItem[];
}

export interface RankedArea {
  rank: number;
  area_name: string;
  area_type: string;
  scarcity: string;
  pricing_power: string;
  duration: string;
  crowding: string;
  barriers_to_entry: string;
  value_capture: string;
  notes: string;
}

export interface PublicMarketExample {
  ticker: string;
  name: string;
  role_in_thesis: string;
  fit_strength: string;
  notes: string;
}

export interface Opportunities {
  ranked_areas: RankedArea[];
  public_market_examples: PublicMarketExample[];
}

export interface ThesisBreakersStructured {
  technology_disruption: boolean;
  regulatory_change: boolean;
  supply_expansion: boolean;
  demand_decline: boolean;
  capital_flood: boolean;
  substitution: boolean;
  timing_mismatch: boolean;
  valuation_crowding: boolean;
  notes: string;
}

export interface MonitoringIndicator {
  indicator: string;
  category: string;
  current_signal: string;
  desired_direction: string;
  frequency: string;
  notes: string;
}

export interface MonitoringData {
  key_indicators: MonitoringIndicator[];
  confirming_evidence: string[];
  weakening_signals: string[];
  disconfirming_evidence: string[];
  thesis_status: string;
}

export interface BottleneckAnalysis {
  id: string;
  theme: string;
  created_at: string;
  updated_at: string;
  // Meta
  analyst: string;
  agent_name: string;
  source_context: string;
  status: string;
  tags: string[];
  // Subject
  subject_type: string;
  subject_description: string;
  geography: string;
  geography_list: string[];
  time_horizon: string;
  public_markets_only: boolean;
  risk_level: string;
  // Thesis
  thesis: string;
  worldview_assumption: string;
  structural_shift: string[];
  demand_wave: string;
  thesis_stage: string;
  // Constraints
  primary_bottleneck: string;
  scarcity_types: string[];
  constraint_description: string;
  constraint_measurable: boolean;
  why_now: string;
  time_to_resolve: string;
  // Scarcity Evidence
  scarcity_evidence: ScarcityEvidence;
  evidence_notes: string[];
  // Heatmap
  scores: HeatmapScores;
  heatmap_rationale: HeatmapRationale;
  // Value Chain
  value_chain: ValueChainData;
  second_order_beneficiaries: string[];
  likely_losers: string[];
  value_capture_layer: string;
  transmission_mechanism: string;
  // Opportunities
  opportunities: Opportunities;
  // False Friends
  false_friends: string[];
  // Portfolio
  portfolio: PortfolioData;
  concentration_risk: string;
  crowding_risk: string;
  correlation_risk: string;
  implementation_notes: string;
  // Thesis Breakers
  thesis_breakers: string[];
  thesis_breakers_structured: ThesisBreakersStructured;
  // Monitoring
  disconfirming_signals: string[];
  monitoring: MonitoringData;
  // Confidence
  overall_confidence: number;
  confidence_notes: string;
  major_unknowns: string[];
  // Summary
  scarcity_strength: string;
  investment_priority: string;
  final_assessment: string;
}

export const defaultScores: HeatmapScores = {
  scarcity_severity: 3, supply_response_speed: 3, time_to_add_capacity: 3,
  capital_intensity: 3, regulatory_friction: 3, demand_growth: 3,
  pricing_power: 3, barriers_to_entry: 3, market_crowding: 3,
};

export const defaultRationale: HeatmapRationale = {
  scarcity_severity: "", supply_response_speed: "", time_to_add_capacity: "",
  capital_intensity: "", regulatory_friction: "", demand_growth: "",
  pricing_power: "", barriers_to_entry: "", market_crowding: "",
};

export const defaultValueChain: ValueChainData = {
  demand_creators: [], integrators: [], operators: [],
  infrastructure: [], picks_and_shovels: [], bottleneck_owners: [],
};

export const defaultPortfolio: PortfolioData = {
  layers: [
    { label: "Core Bottleneck", weight: 40, items: [] },
    { label: "Supporting Infrastructure", weight: 25, items: [] },
    { label: "Picks & Shovels", weight: 20, items: [] },
    { label: "Speculative Satellite", weight: 10, items: [] },
    { label: "Risk Hedges", weight: 5, items: [] },
  ],
  risks: [],
};

export const defaultScarcityEvidence: ScarcityEvidence = {
  supply_shortages: false, long_lead_times: false, regulatory_backlog: false,
  capacity_constraints: false, rising_prices: false, industry_warnings: false,
  capex_surge: false, utilization_pressure: false, notes: "", evidence_items: [],
};

export const defaultOpportunities: Opportunities = { ranked_areas: [], public_market_examples: [] };

export const defaultThesisBreakersStructured: ThesisBreakersStructured = {
  technology_disruption: false, regulatory_change: false, supply_expansion: false,
  demand_decline: false, capital_flood: false, substitution: false,
  timing_mismatch: false, valuation_crowding: false, notes: "",
};

export const defaultMonitoring: MonitoringData = {
  key_indicators: [], confirming_evidence: [], weakening_signals: [],
  disconfirming_evidence: [], thesis_status: "",
};
