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

function getSupabase() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const supabase = getSupabase();
  const url = new URL(req.url);
  const pathParts = url.pathname.replace(/^\/webhooks\/?/, "").split("/").filter(Boolean);
  const subId = pathParts[0] || null;

  try {
    // Internal trigger endpoint — called by the DB webhook trigger function
    if (req.method === "POST" && subId === "_trigger") {
      const { event, record, old_record } = await req.json();
      
      const { data: subs } = await supabase
        .from("webhook_subscriptions")
        .select("*")
        .eq("active", true)
        .contains("events", [event]);

      if (!subs || subs.length === 0) return jsonResponse({ delivered: 0 });

      let delivered = 0;
      for (const sub of subs) {
        // Check conditions
        if (sub.conditions && record) {
          const { field, operator, value } = sub.conditions;
          const actual = record[field];
          let pass = true;
          switch (operator) {
            case "eq": pass = actual === value; break;
            case "neq": pass = actual !== value; break;
            case "gt": pass = actual > value; break;
            case "lt": pass = actual < value; break;
            case "gte": pass = actual >= value; break;
            case "lte": pass = actual <= value; break;
          }
          if (!pass) continue;
        }

        const payload = {
          event,
          timestamp: new Date().toISOString(),
          data: record,
          previous_data: old_record || null,
        };

        const headers: Record<string, string> = { "Content-Type": "application/json" };
        
        // HMAC signature if secret provided
        if (sub.secret) {
          const encoder = new TextEncoder();
          const key = await crypto.subtle.importKey(
            "raw", encoder.encode(sub.secret),
            { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
          );
          const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(JSON.stringify(payload)));
          const hex = [...new Uint8Array(sig)].map(b => b.toString(16).padStart(2, "0")).join("");
          headers["X-Webhook-Signature"] = `sha256=${hex}`;
        }

        try {
          const resp = await fetch(sub.url, {
            method: "POST",
            headers,
            body: JSON.stringify(payload),
          });
          if (resp.ok) delivered++;
        } catch (e) {
          console.error(`Webhook delivery failed to ${sub.url}:`, e);
        }
      }

      return jsonResponse({ delivered });
    }

    // LIST subscriptions
    if (req.method === "GET" && !subId) {
      const { data, error } = await supabase
        .from("webhook_subscriptions")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return jsonResponse({ subscriptions: data });
    }

    // CREATE subscription
    if (req.method === "POST" && !subId) {
      const body = await req.json();
      if (!body.url || !body.events || !Array.isArray(body.events)) {
        return jsonResponse({ error: "url and events[] are required" }, 400);
      }
      const validEvents = ["analysis.created", "analysis.updated", "analysis.deleted"];
      const invalid = body.events.filter((e: string) => !validEvents.includes(e));
      if (invalid.length > 0) {
        return jsonResponse({ error: `Invalid events: ${invalid.join(", ")}. Valid: ${validEvents.join(", ")}` }, 400);
      }
      const row = {
        url: body.url,
        events: body.events,
        conditions: body.conditions || null,
        secret: body.secret || null,
        active: true,
      };
      const { data, error } = await supabase
        .from("webhook_subscriptions")
        .insert(row)
        .select()
        .single();
      if (error) throw error;
      return jsonResponse(data, 201);
    }

    // DELETE subscription
    if (req.method === "DELETE" && subId) {
      const { error } = await supabase
        .from("webhook_subscriptions")
        .delete()
        .eq("id", subId);
      if (error) throw error;
      return jsonResponse({ success: true });
    }

    return jsonResponse({ error: "Not found" }, 404);
  } catch (e) {
    console.error("Webhook error:", e);
    return jsonResponse({ error: e instanceof Error ? e.message : "Unknown error" }, 500);
  }
});
