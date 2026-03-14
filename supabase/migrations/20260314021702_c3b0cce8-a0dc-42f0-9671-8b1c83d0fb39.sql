
ALTER TABLE public.bottleneck_analyses 
ADD COLUMN portfolio JSONB NOT NULL DEFAULT '{"layers":[{"label":"Core Bottleneck","weight":40,"items":[]},{"label":"Supporting Infrastructure","weight":25,"items":[]},{"label":"Picks & Shovels","weight":20,"items":[]},{"label":"Speculative Satellite","weight":10,"items":[]},{"label":"Risk Hedges","weight":5,"items":[]}],"risks":[]}';
