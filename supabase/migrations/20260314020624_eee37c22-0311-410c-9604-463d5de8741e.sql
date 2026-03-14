
CREATE TABLE public.bottleneck_analyses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  theme TEXT NOT NULL,
  geography TEXT DEFAULT '',
  time_horizon TEXT DEFAULT '',
  thesis TEXT DEFAULT '',
  primary_bottleneck TEXT DEFAULT '',
  scarcity_types TEXT[] DEFAULT '{}',
  evidence_notes TEXT[] DEFAULT '{}',
  scores JSONB NOT NULL DEFAULT '{"scarcity_severity":3,"supply_response_speed":3,"time_to_add_capacity":3,"capital_intensity":3,"regulatory_friction":3,"demand_growth":3,"pricing_power":3,"barriers_to_entry":3,"market_crowding":3}',
  value_chain JSONB NOT NULL DEFAULT '{"demand_creators":[],"integrators":[],"operators":[],"infrastructure":[],"picks_and_shovels":[],"bottleneck_owners":[]}',
  false_friends TEXT[] DEFAULT '{}',
  thesis_breakers TEXT[] DEFAULT '{}',
  disconfirming_signals TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.bottleneck_analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view analyses" ON public.bottleneck_analyses FOR SELECT USING (true);
CREATE POLICY "Anyone can create analyses" ON public.bottleneck_analyses FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update analyses" ON public.bottleneck_analyses FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete analyses" ON public.bottleneck_analyses FOR DELETE USING (true);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_bottleneck_analyses_updated_at
  BEFORE UPDATE ON public.bottleneck_analyses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
