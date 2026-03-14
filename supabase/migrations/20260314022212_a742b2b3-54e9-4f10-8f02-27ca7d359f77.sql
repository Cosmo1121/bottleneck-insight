
-- Expand meta fields
ALTER TABLE public.bottleneck_analyses
  ADD COLUMN analyst TEXT DEFAULT '',
  ADD COLUMN agent_name TEXT DEFAULT '',
  ADD COLUMN source_context TEXT DEFAULT '',
  ADD COLUMN status TEXT DEFAULT 'draft',
  ADD COLUMN tags TEXT[] DEFAULT '{}';

-- Expand subject fields
ALTER TABLE public.bottleneck_analyses
  ADD COLUMN subject_type TEXT DEFAULT '',
  ADD COLUMN subject_description TEXT DEFAULT '',
  ADD COLUMN geography_list TEXT[] DEFAULT '{}',
  ADD COLUMN public_markets_only BOOLEAN DEFAULT true,
  ADD COLUMN risk_level TEXT DEFAULT '';

-- Expand thesis fields
ALTER TABLE public.bottleneck_analyses
  ADD COLUMN worldview_assumption TEXT DEFAULT '',
  ADD COLUMN structural_shift TEXT[] DEFAULT '{}',
  ADD COLUMN demand_wave TEXT DEFAULT '',
  ADD COLUMN thesis_stage TEXT DEFAULT '';

-- Expand constraint fields
ALTER TABLE public.bottleneck_analyses
  ADD COLUMN constraint_description TEXT DEFAULT '',
  ADD COLUMN constraint_measurable BOOLEAN DEFAULT false,
  ADD COLUMN why_now TEXT DEFAULT '',
  ADD COLUMN time_to_resolve TEXT DEFAULT '';

-- Structured scarcity evidence
ALTER TABLE public.bottleneck_analyses
  ADD COLUMN scarcity_evidence JSONB NOT NULL DEFAULT '{"supply_shortages":false,"long_lead_times":false,"regulatory_backlog":false,"capacity_constraints":false,"rising_prices":false,"industry_warnings":false,"capex_surge":false,"utilization_pressure":false,"notes":"","evidence_items":[]}';

-- Heatmap rationale
ALTER TABLE public.bottleneck_analyses
  ADD COLUMN heatmap_rationale JSONB NOT NULL DEFAULT '{"scarcity_severity":"","supply_response_speed":"","time_to_add_capacity":"","capital_intensity":"","regulatory_friction":"","demand_growth":"","pricing_power":"","barriers_to_entry":"","market_crowding":""}';

-- Extended value chain fields
ALTER TABLE public.bottleneck_analyses
  ADD COLUMN second_order_beneficiaries TEXT[] DEFAULT '{}',
  ADD COLUMN likely_losers TEXT[] DEFAULT '{}',
  ADD COLUMN value_capture_layer TEXT DEFAULT '',
  ADD COLUMN transmission_mechanism TEXT DEFAULT '';

-- Opportunities
ALTER TABLE public.bottleneck_analyses
  ADD COLUMN opportunities JSONB NOT NULL DEFAULT '{"ranked_areas":[],"public_market_examples":[]}';

-- Structured thesis breakers
ALTER TABLE public.bottleneck_analyses
  ADD COLUMN thesis_breakers_structured JSONB NOT NULL DEFAULT '{"technology_disruption":false,"regulatory_change":false,"supply_expansion":false,"demand_decline":false,"capital_flood":false,"substitution":false,"timing_mismatch":false,"valuation_crowding":false,"notes":""}';

-- Structured monitoring
ALTER TABLE public.bottleneck_analyses
  ADD COLUMN monitoring JSONB NOT NULL DEFAULT '{"key_indicators":[],"confirming_evidence":[],"weakening_signals":[],"disconfirming_evidence":[],"thesis_status":""}';

-- Confidence
ALTER TABLE public.bottleneck_analyses
  ADD COLUMN overall_confidence NUMERIC DEFAULT 0.0,
  ADD COLUMN confidence_notes TEXT DEFAULT '',
  ADD COLUMN major_unknowns TEXT[] DEFAULT '{}';

-- Summary
ALTER TABLE public.bottleneck_analyses
  ADD COLUMN scarcity_strength TEXT DEFAULT '',
  ADD COLUMN investment_priority TEXT DEFAULT '',
  ADD COLUMN final_assessment TEXT DEFAULT '';

-- Portfolio structured risk fields
ALTER TABLE public.bottleneck_analyses
  ADD COLUMN concentration_risk TEXT DEFAULT '',
  ADD COLUMN crowding_risk TEXT DEFAULT '',
  ADD COLUMN correlation_risk TEXT DEFAULT '',
  ADD COLUMN implementation_notes TEXT DEFAULT '';
