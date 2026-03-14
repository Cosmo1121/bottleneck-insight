import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are a bottleneck investing analyst. Given a theme, produce a comprehensive bottleneck analysis.

You MUST call the "populate_analysis" function with your analysis. Fill every field thoughtfully based on the theme.

For heatmap scores, use integers 1-5 where:
1 = weak/low, 2 = below average, 3 = moderate, 4 = strong/high, 5 = extreme

For ranked_areas, provide 2-3 ranked investment areas.
For public_market_examples, provide 2-4 real public company tickers relevant to the theme.
For key_indicators, provide 3-5 monitoring indicators.

Be specific, data-driven, and opinionated. This is for professional investment analysis.`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { theme } = await req.json();
    if (!theme) throw new Error("theme is required");

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: `Analyze this bottleneck investing theme and populate all fields: "${theme}"` },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "populate_analysis",
              description: "Populate a bottleneck investing analysis with structured data",
              parameters: {
                type: "object",
                properties: {
                  subject_type: { type: "string", enum: ["macro_theme", "sector", "industry", "commodity", "geography", "technology", "policy"] },
                  subject_description: { type: "string" },
                  geography_list: { type: "array", items: { type: "string" } },
                  time_horizon: { type: "string" },
                  risk_level: { type: "string", enum: ["low", "medium", "high", "very-high"] },
                  thesis: { type: "string", description: "One-sentence investment thesis" },
                  worldview_assumption: { type: "string" },
                  structural_shift: { type: "array", items: { type: "string" } },
                  demand_wave: { type: "string" },
                  thesis_stage: { type: "string", enum: ["hypothesis", "evidence-gathering", "confirmed", "monitoring", "degrading"] },
                  primary_bottleneck: { type: "string" },
                  scarcity_types: { type: "array", items: { type: "string" } },
                  constraint_description: { type: "string" },
                  constraint_measurable: { type: "boolean" },
                  why_now: { type: "string" },
                  time_to_resolve: { type: "string" },
                  scarcity_evidence: {
                    type: "object",
                    properties: {
                      supply_shortages: { type: "boolean" },
                      long_lead_times: { type: "boolean" },
                      regulatory_backlog: { type: "boolean" },
                      capacity_constraints: { type: "boolean" },
                      rising_prices: { type: "boolean" },
                      industry_warnings: { type: "boolean" },
                      capex_surge: { type: "boolean" },
                      utilization_pressure: { type: "boolean" },
                      notes: { type: "string" },
                    },
                    required: ["supply_shortages", "long_lead_times", "regulatory_backlog", "capacity_constraints", "rising_prices", "industry_warnings", "capex_surge", "utilization_pressure", "notes"],
                    additionalProperties: false,
                  },
                  scores: {
                    type: "object",
                    properties: {
                      scarcity_severity: { type: "integer", minimum: 1, maximum: 5 },
                      supply_response_speed: { type: "integer", minimum: 1, maximum: 5 },
                      time_to_add_capacity: { type: "integer", minimum: 1, maximum: 5 },
                      capital_intensity: { type: "integer", minimum: 1, maximum: 5 },
                      regulatory_friction: { type: "integer", minimum: 1, maximum: 5 },
                      demand_growth: { type: "integer", minimum: 1, maximum: 5 },
                      pricing_power: { type: "integer", minimum: 1, maximum: 5 },
                      barriers_to_entry: { type: "integer", minimum: 1, maximum: 5 },
                      market_crowding: { type: "integer", minimum: 1, maximum: 5 },
                    },
                    required: ["scarcity_severity", "supply_response_speed", "time_to_add_capacity", "capital_intensity", "regulatory_friction", "demand_growth", "pricing_power", "barriers_to_entry", "market_crowding"],
                    additionalProperties: false,
                  },
                  heatmap_rationale: {
                    type: "object",
                    properties: {
                      scarcity_severity: { type: "string" },
                      supply_response_speed: { type: "string" },
                      time_to_add_capacity: { type: "string" },
                      capital_intensity: { type: "string" },
                      regulatory_friction: { type: "string" },
                      demand_growth: { type: "string" },
                      pricing_power: { type: "string" },
                      barriers_to_entry: { type: "string" },
                      market_crowding: { type: "string" },
                    },
                    required: ["scarcity_severity", "supply_response_speed", "time_to_add_capacity", "capital_intensity", "regulatory_friction", "demand_growth", "pricing_power", "barriers_to_entry", "market_crowding"],
                    additionalProperties: false,
                  },
                  value_chain: {
                    type: "object",
                    properties: {
                      demand_creators: { type: "array", items: { type: "string" } },
                      integrators: { type: "array", items: { type: "string" } },
                      operators: { type: "array", items: { type: "string" } },
                      infrastructure: { type: "array", items: { type: "string" } },
                      picks_and_shovels: { type: "array", items: { type: "string" } },
                      bottleneck_owners: { type: "array", items: { type: "string" } },
                    },
                    required: ["demand_creators", "integrators", "operators", "infrastructure", "picks_and_shovels", "bottleneck_owners"],
                    additionalProperties: false,
                  },
                  second_order_beneficiaries: { type: "array", items: { type: "string" } },
                  likely_losers: { type: "array", items: { type: "string" } },
                  value_capture_layer: { type: "string" },
                  transmission_mechanism: { type: "string" },
                  opportunities: {
                    type: "object",
                    properties: {
                      ranked_areas: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            rank: { type: "integer" },
                            area_name: { type: "string" },
                            area_type: { type: "string" },
                            scarcity: { type: "string" },
                            pricing_power: { type: "string" },
                            duration: { type: "string" },
                            crowding: { type: "string" },
                            barriers_to_entry: { type: "string" },
                            value_capture: { type: "string" },
                            notes: { type: "string" },
                          },
                          required: ["rank", "area_name", "area_type", "scarcity", "pricing_power", "duration", "crowding", "barriers_to_entry", "value_capture", "notes"],
                          additionalProperties: false,
                        },
                      },
                      public_market_examples: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            ticker: { type: "string" },
                            name: { type: "string" },
                            role_in_thesis: { type: "string" },
                            fit_strength: { type: "string" },
                            notes: { type: "string" },
                          },
                          required: ["ticker", "name", "role_in_thesis", "fit_strength", "notes"],
                          additionalProperties: false,
                        },
                      },
                    },
                    required: ["ranked_areas", "public_market_examples"],
                    additionalProperties: false,
                  },
                  false_friends: { type: "array", items: { type: "string" } },
                  portfolio: {
                    type: "object",
                    properties: {
                      layers: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            label: { type: "string" },
                            weight: { type: "integer" },
                            items: { type: "array", items: { type: "string" } },
                          },
                          required: ["label", "weight", "items"],
                          additionalProperties: false,
                        },
                      },
                      risks: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            label: { type: "string" },
                            level: { type: "string", enum: ["Low", "Medium", "High"] },
                            description: { type: "string" },
                          },
                          required: ["label", "level", "description"],
                          additionalProperties: false,
                        },
                      },
                    },
                    required: ["layers", "risks"],
                    additionalProperties: false,
                  },
                  thesis_breakers_structured: {
                    type: "object",
                    properties: {
                      technology_disruption: { type: "boolean" },
                      regulatory_change: { type: "boolean" },
                      supply_expansion: { type: "boolean" },
                      demand_decline: { type: "boolean" },
                      capital_flood: { type: "boolean" },
                      substitution: { type: "boolean" },
                      timing_mismatch: { type: "boolean" },
                      valuation_crowding: { type: "boolean" },
                      notes: { type: "string" },
                    },
                    required: ["technology_disruption", "regulatory_change", "supply_expansion", "demand_decline", "capital_flood", "substitution", "timing_mismatch", "valuation_crowding", "notes"],
                    additionalProperties: false,
                  },
                  monitoring: {
                    type: "object",
                    properties: {
                      key_indicators: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            indicator: { type: "string" },
                            category: { type: "string" },
                            current_signal: { type: "string" },
                            desired_direction: { type: "string" },
                            frequency: { type: "string" },
                            notes: { type: "string" },
                          },
                          required: ["indicator", "category", "current_signal", "desired_direction", "frequency", "notes"],
                          additionalProperties: false,
                        },
                      },
                      confirming_evidence: { type: "array", items: { type: "string" } },
                      weakening_signals: { type: "array", items: { type: "string" } },
                      disconfirming_evidence: { type: "array", items: { type: "string" } },
                      thesis_status: { type: "string" },
                    },
                    required: ["key_indicators", "confirming_evidence", "weakening_signals", "disconfirming_evidence", "thesis_status"],
                    additionalProperties: false,
                  },
                  concentration_risk: { type: "string" },
                  crowding_risk: { type: "string" },
                  correlation_risk: { type: "string" },
                  overall_confidence: { type: "number", minimum: 0, maximum: 100 },
                  confidence_notes: { type: "string" },
                  major_unknowns: { type: "array", items: { type: "string" } },
                  scarcity_strength: { type: "string", enum: ["structural_bottleneck", "moderate_constraint", "narrative_theme", "weak_thesis"] },
                  investment_priority: { type: "string", enum: ["high", "medium", "low", "avoid"] },
                  final_assessment: { type: "string" },
                },
                required: [
                  "subject_type", "subject_description", "thesis", "primary_bottleneck",
                  "scores", "heatmap_rationale", "scarcity_strength", "final_assessment",
                ],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "populate_analysis" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits in Settings → Workspace → Usage." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall?.function?.arguments) {
      throw new Error("No tool call returned from AI");
    }

    const analysis = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("autofill error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
