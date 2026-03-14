import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, serviceKey);

  const url = new URL(req.url);
  // Path: /api or /api/{id}
  const pathParts = url.pathname.replace(/^\/api\/?/, "").split("/").filter(Boolean);
  const analysisId = pathParts[0] || null;

  try {
    // LIST all analyses
    if (req.method === "GET" && !analysisId) {
      const { data, error } = await supabase
        .from("bottleneck_analyses")
        .select("id, theme, status, created_at, updated_at, overall_confidence, scarcity_strength, investment_priority")
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return jsonResponse({ analyses: data });
    }

    // GET single analysis
    if (req.method === "GET" && analysisId) {
      const { data, error } = await supabase
        .from("bottleneck_analyses")
        .select("*")
        .eq("id", analysisId)
        .single();
      if (error) return jsonResponse({ error: "Analysis not found" }, 404);
      return jsonResponse(data);
    }

    // CREATE analysis
    if (req.method === "POST") {
      const body = await req.json();
      if (!body.theme) return jsonResponse({ error: "theme is required" }, 400);
      const { data, error } = await supabase
        .from("bottleneck_analyses")
        .insert(body)
        .select()
        .single();
      if (error) throw error;
      return jsonResponse(data, 201);
    }

    // UPDATE analysis
    if (req.method === "PUT" || req.method === "PATCH") {
      if (!analysisId) return jsonResponse({ error: "id required in path" }, 400);
      const body = await req.json();
      delete body.id;
      delete body.created_at;
      const { data, error } = await supabase
        .from("bottleneck_analyses")
        .update(body)
        .eq("id", analysisId)
        .select()
        .single();
      if (error) return jsonResponse({ error: "Analysis not found or update failed" }, 404);
      return jsonResponse(data);
    }

    // DELETE analysis
    if (req.method === "DELETE" && analysisId) {
      const { error } = await supabase
        .from("bottleneck_analyses")
        .delete()
        .eq("id", analysisId);
      if (error) throw error;
      return jsonResponse({ success: true });
    }

    return jsonResponse({ error: "Not found" }, 404);
  } catch (e) {
    console.error("API error:", e);
    return jsonResponse({ error: e instanceof Error ? e.message : "Unknown error" }, 500);
  }
});
