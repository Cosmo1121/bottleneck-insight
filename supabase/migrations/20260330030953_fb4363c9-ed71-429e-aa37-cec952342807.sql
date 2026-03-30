
CREATE TABLE public.webhook_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url text NOT NULL,
  events text[] NOT NULL DEFAULT '{}',
  conditions jsonb DEFAULT NULL,
  secret text DEFAULT NULL,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.webhook_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read webhooks" ON public.webhook_subscriptions FOR SELECT TO public USING (true);
CREATE POLICY "Public insert webhooks" ON public.webhook_subscriptions FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Public delete webhooks" ON public.webhook_subscriptions FOR DELETE TO public USING (true);
CREATE POLICY "Public update webhooks" ON public.webhook_subscriptions FOR UPDATE TO public USING (true);

-- Function to fire webhooks on analysis changes
CREATE OR REPLACE FUNCTION public.fire_analysis_webhooks()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  event_name text;
  payload jsonb;
  base_url text;
BEGIN
  base_url := current_setting('app.settings.supabase_url', true);
  IF base_url IS NULL OR base_url = '' THEN
    base_url := 'https://uwqtizxvbdgkxjhswgpf.supabase.co';
  END IF;

  IF TG_OP = 'INSERT' THEN
    event_name := 'analysis.created';
  ELSIF TG_OP = 'UPDATE' THEN
    event_name := 'analysis.updated';
  ELSIF TG_OP = 'DELETE' THEN
    event_name := 'analysis.deleted';
  END IF;

  payload := jsonb_build_object(
    'event', event_name,
    'record', CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD)::jsonb ELSE row_to_json(NEW)::jsonb END,
    'old_record', CASE WHEN TG_OP = 'UPDATE' THEN row_to_json(OLD)::jsonb ELSE NULL END
  );

  -- Call the webhooks edge function asynchronously via pg_net if available,
  -- otherwise just log (the edge function will poll if needed)
  PERFORM net.http_post(
    url := base_url || '/functions/v1/webhooks/_trigger',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
    ),
    body := payload
  );

  RETURN COALESCE(NEW, OLD);
EXCEPTION WHEN OTHERS THEN
  -- Don't block the original operation if webhook delivery fails
  RAISE WARNING 'Webhook trigger failed: %', SQLERRM;
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER trg_analysis_webhooks
AFTER INSERT OR UPDATE OR DELETE ON public.bottleneck_analyses
FOR EACH ROW EXECUTE FUNCTION public.fire_analysis_webhooks();
