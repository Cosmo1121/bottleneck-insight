import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are a bottleneck investing analyst. Given a theme, produce a comprehensive analysis.

Return ONLY valid JSON (no markdown, no backticks) with this exact structure:

{
  "subject_type": "macro_theme|sector|industry|commodity|geography|technology|policy",
  "subject_description": "...",
  "geography_list": ["..."],
  "time_horizon": "...",
  "risk_level": "low|medium|high|very-high",
  "thesis": "One-sentence investment thesis",
  "worldview_assumption": "...",
  "structural_shift": ["..."],
  "demand_wave": "...",
  "thesis_stage": "hypothesis|evidence-gathering|confirmed|monitoring|degrading",
  "primary_bottleneck": "...",
  "scarcity_types": ["..."],
  "constraint_description": "...",
  "constraint_measurable": true/false,
  "why_now": "...",
  "time_to_resolve": "...",
  "scarcity_evidence": {
    "supply_shortages": true/false,
    "long_lead_times": true/false,
    "regulatory_backlog": true/false,
    "capacity_constraints": true/false,
    "rising_prices": true/false,
    "industry_warnings": true/false,
    "capex_surge": true/false,
    "utilization_pressure": true/false,
    "notes": "...",
    "evidence_items": [
      {"source_name":"...","source_type":"earnings_call|industry_report|government_data|news|research_paper|company_filing","date":"YYYY-MM-DD","signal":"...","summary":"...","confidence":0.0-1.0}
    ]
  },
  "scores": {
    "scarcity_severity": 1-5,
    "supply_response_speed": 1-5,
    "time_to_add_capacity": 1-5,
    "capital_intensity": 1-5,
    "regulatory_friction": 1-5,
    "demand_growth": 1-5,
    "pricing_power": 1-5,
    "barriers_to_entry": 1-5,
    "market_crowding": 1-5
  },
  "heatmap_rationale": {
    "scarcity_severity": "...",
    "supply_response_speed": "...",
    "time_to_add_capacity": "...",
    "capital_intensity": "...",
    "regulatory_friction": "...",
    "demand_growth": "...",
    "pricing_power": "...",
    "barriers_to_entry": "...",
    "market_crowding": "..."
  },
  "value_chain": {
    "demand_creators": ["..."],
    "integrators": ["..."],
    "operators": ["..."],
    "infrastructure": ["..."],
    "picks_and_shovels": ["..."],
    "bottleneck_owners": ["..."]
  },
  "second_order_beneficiaries": ["..."],
  "likely_losers": ["..."],
  "value_capture_layer": "...",
  "transmission_mechanism": "...",
  "opportunities": {
    "ranked_areas": [
      {"rank":1,"area_name":"...","area_type":"...","scarcity":"...","pricing_power":"...","duration":"...","crowding":"...","barriers_to_entry":"...","value_capture":"...","notes":"..."}
    ],
    "public_market_examples": [
      {"ticker":"...","name":"...","role_in_thesis":"...","fit_strength":"Strong|Moderate|Weak","notes":"..."}
    ]
  },
  "false_friends": ["..."],
  "portfolio": {
    "layers": [
      {"label":"Core Bottleneck","weight":40,"items":["..."]},
      {"label":"Supporting Infrastructure","weight":25,"items":["..."]},
      {"label":"Picks & Shovels","weight":20,"items":["..."]},
      {"label":"Speculative Satellite","weight":10,"items":["..."]},
      {"label":"Risk Hedges","weight":5,"items":["..."]}
    ],
    "risks": [{"label":"...","level":"Low|Medium|High","description":"..."}]
  },
  "thesis_breakers_structured": {
    "technology_disruption": true/false,
    "regulatory_change": true/false,
    "supply_expansion": true/false,
    "demand_decline": true/false,
    "capital_flood": true/false,
    "substitution": true/false,
    "timing_mismatch": true/false,
    "valuation_crowding": true/false,
    "notes": "..."
  },
  "monitoring": {
    "key_indicators": [{"indicator":"...","category":"...","current_signal":"...","desired_direction":"...","frequency":"...","notes":"..."}],
    "confirming_evidence": ["..."],
    "weakening_signals": ["..."],
    "disconfirming_evidence": ["..."],
    "thesis_status": "strengthening|stable|weakening"
  },
  "concentration_risk": "...",
  "crowding_risk": "...",
  "correlation_risk": "...",
  "overall_confidence": 0-100,
  "confidence_notes": "...",
  "major_unknowns": ["..."],
  "scarcity_strength": "structural_bottleneck|moderate_constraint|narrative_theme|weak_thesis",
  "investment_priority": "high|medium|low|avoid",
  "final_assessment": "..."
}

IMPORTANT: If the user message includes a "RECENT NEWS & DATA" section with live headlines, you MUST incorporate any relevant headlines as evidence_items in the scarcity_evidence section. Use source_type "news", the headline as the summary, the source name in brackets as source_name, and the publication date. Set confidence to 0.6-0.8 for news headlines. Only include headlines that are genuinely relevant to the theme's scarcity dynamics.

Be specific, data-driven, and opinionated. Use real company names and tickers. Fill every field.`;

/** Fetch recent research context for a theme from the research-context function */
async function fetchResearchContext(theme: string): Promise<string> {
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const resp = await fetch(`${supabaseUrl}/functions/v1/research-context`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${serviceKey}`,
      },
      body: JSON.stringify({ theme }),
    });
    if (!resp.ok) return "";
    const data = await resp.json();
    const headlines = [
      ...(data.relevant_headlines || []),
      ...(data.recent_market_headlines || []),
    ];
    if (headlines.length === 0) return "";
    const lines = headlines.map((h: any) =>
      `- [${h.source}] ${h.title} (${h.date || "recent"})`
    );
    return `\n\nRECENT NEWS & DATA (fetched ${data.fetched_at}):\n${lines.join("\n")}`;
  } catch (e) {
    console.warn("Research context fetch failed (non-fatal):", e);
    return "";
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { theme, model, custom_provider, custom_api_key } = await req.json();
    if (!theme) throw new Error("theme is required");

    // Require user-provided API credentials — no built-in fallback
    if (!custom_provider || !custom_api_key) {
      return new Response(JSON.stringify({ error: "No AI provider configured. Go to Settings and add your OpenAI or Anthropic API key, or use Ollama locally." }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch fresh research context (recent news/data feeds) for the theme
    const researchContext = await fetchResearchContext(theme);

    let apiUrl: string;
    let apiKey = custom_api_key;
    let selectedModel = model || "";

    let response: Response;

    if (custom_provider === "anthropic") {
      selectedModel = selectedModel || "claude-sonnet-4-20250514";
      response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "Content-Type": "application/json",
        },
      body: JSON.stringify({
          model: selectedModel,
          max_tokens: 8192,
          system: SYSTEM_PROMPT,
          messages: [
            { role: "user", content: `Analyze this bottleneck investing theme: "${theme}"${researchContext}` },
          ],
          temperature: 0.3,
        }),
      });
    } else if (custom_provider === "openai") {
      selectedModel = selectedModel || "gpt-4o";
      response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      body: JSON.stringify({
          model: selectedModel,
          max_tokens: 8192,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: `Analyze this bottleneck investing theme: "${theme}"${researchContext}` },
          ],
          temperature: 0.3,
        }),
      });
    } else {
      return new Response(JSON.stringify({ error: `Unsupported provider: ${custom_provider}. Use "openai", "anthropic", or Ollama locally.` }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 401) {
        return new Response(JSON.stringify({ error: "Invalid API key. Check your key in Settings." }), {
          status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const text = await response.text();
      console.error("AI provider error:", response.status, text);
      return new Response(JSON.stringify({ error: "AI service temporarily unavailable" }), {
        status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    let content: string;

    if (custom_provider === "anthropic") {
      content = data.content?.[0]?.text;
    } else {
      content = data.choices?.[0]?.message?.content;
    }
    if (!content) throw new Error("No content returned from AI");

    const cleaned = content.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
    const analysis = JSON.parse(cleaned);

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("autofill error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
