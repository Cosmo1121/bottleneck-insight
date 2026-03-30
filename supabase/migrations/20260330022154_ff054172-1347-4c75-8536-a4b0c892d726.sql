
-- Drop auth-based RLS policies
DROP POLICY IF EXISTS "Anyone can view analyses" ON public.bottleneck_analyses;
DROP POLICY IF EXISTS "Authenticated users can create analyses" ON public.bottleneck_analyses;
DROP POLICY IF EXISTS "Users can update own analyses" ON public.bottleneck_analyses;
DROP POLICY IF EXISTS "Users can delete own analyses" ON public.bottleneck_analyses;

-- Restore public access policies
CREATE POLICY "Public read" ON public.bottleneck_analyses FOR SELECT USING (true);
CREATE POLICY "Public insert" ON public.bottleneck_analyses FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update" ON public.bottleneck_analyses FOR UPDATE USING (true);
CREATE POLICY "Public delete" ON public.bottleneck_analyses FOR DELETE USING (true);

-- Drop owner_id column
ALTER TABLE public.bottleneck_analyses DROP COLUMN IF EXISTS owner_id;
