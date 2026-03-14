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

export interface BottleneckAnalysis {
  id: string;
  theme: string;
  geography: string;
  time_horizon: string;
  thesis: string;
  primary_bottleneck: string;
  scarcity_types: string[];
  evidence_notes: string[];
  scores: HeatmapScores;
  value_chain: ValueChainData;
  portfolio: PortfolioData;
  false_friends: string[];
  thesis_breakers: string[];
  disconfirming_signals: string[];
  created_at: string;
  updated_at: string;
}

export const defaultScores: HeatmapScores = {
  scarcity_severity: 3,
  supply_response_speed: 3,
  time_to_add_capacity: 3,
  capital_intensity: 3,
  regulatory_friction: 3,
  demand_growth: 3,
  pricing_power: 3,
  barriers_to_entry: 3,
  market_crowding: 3,
};

export const defaultValueChain: ValueChainData = {
  demand_creators: [],
  integrators: [],
  operators: [],
  infrastructure: [],
  picks_and_shovels: [],
  bottleneck_owners: [],
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
