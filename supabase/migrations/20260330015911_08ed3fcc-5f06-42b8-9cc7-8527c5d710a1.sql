
-- Add owner_id column (nullable so existing rows are preserved)
ALTER TABLE public.bottleneck_analyses ADD COLUMN owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Drop old permissive policies
DROP POLICY IF EXISTS "Anyone can create analyses" ON public.bottleneck_analyses;
DROP POLICY IF EXISTS "Anyone can update analyses" ON public.bottleneck_analyses;
DROP POLICY IF EXISTS "Anyone can delete analyses" ON public.bottleneck_analyses;
DROP POLICY IF EXISTS "Anyone can view analyses" ON public.bottleneck_analyses;

-- SELECT: public read (existing unowned rows + your own)
CREATE POLICY "Anyone can view analyses" ON public.bottleneck_analyses
FOR SELECT USING (true);

-- INSERT: authenticated only, must set owner_id = self
CREATE POLICY "Authenticated users can create analyses" ON public.bottleneck_analyses
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = owner_id);

-- UPDATE: authenticated, only own rows
CREATE POLICY "Users can update own analyses" ON public.bottleneck_analyses
FOR UPDATE TO authenticated
USING (auth.uid() = owner_id)
WITH CHECK (auth.uid() = owner_id);

-- DELETE: authenticated, only own rows
CREATE POLICY "Users can delete own analyses" ON public.bottleneck_analyses
FOR DELETE TO authenticated
USING (auth.uid() = owner_id);
