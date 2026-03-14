import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, model, custom_provider, custom_api_key } = await req.json();
    if (!messages?.length) throw new Error("messages required");

    let apiUrl = "https://ai.gateway.lovable.dev/v1/chat/completions";
    let apiKey = "";
    let selectedModel = model || "google/gemini-3-flash-preview";
    let isAnthropic = false;

    if (custom_provider && custom_api_key) {
      if (custom_provider === "openai") {
        apiUrl = "https://api.openai.com/v1/chat/completions";
        selectedModel = model || "gpt-4o";
      } else if (custom_provider === "anthropic") {
        apiUrl = "https://api.anthropic.com/v1/messages";
        selectedModel = model || "claude-sonnet-4-20250514";
        isAnthropic = true;
      }
      apiKey = custom_api_key;
    } else {
      const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
      if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");
      apiKey = LOVABLE_API_KEY;
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    // Fetch current analyses for context
    const { data: analyses } = await supabase
      .from("bottleneck_analyses")
      .select("id, theme, status, overall_confidence, scarcity_strength, investment_priority, thesis, primary_bottleneck")
      .order("updated_at", { ascending: false })
      .limit(20);

    const analysesSummary = (analyses || []).map(a => 
      `- "${a.theme}" [${a.status}] confidence:${a.overall_confidence}% priority:${a.investment_priority} id:${a.id}`
    ).join("\n");

    const systemPrompt = `You are a bottleneck investing analyst assistant. You help users analyze supply-demand bottlenecks for investment opportunities.

You have access to the following tools via function calling:

CURRENT ANALYSES IN DATABASE:
${analysesSummary || "No analyses yet."}

You can help users:
1. Discuss and analyze bottleneck themes
2. Create new analyses (use the create_analysis tool)
3. Query and compare existing analyses
4. Explain investment thesis details
5. Suggest new themes to analyze

When users want to create a new analysis, use the create_analysis tool with just a theme name. The system will auto-populate it.
When users ask about existing analyses, reference the data above.
Be concise, data-driven, and opinionated. Use markdown formatting.`;

    const tools = [
      {
        type: "function",
        function: {
          name: "create_analysis",
          description: "Create a new bottleneck analysis for a given theme. Returns the created analysis ID.",
          parameters: {
            type: "object",
            properties: {
              theme: { type: "string", description: "The bottleneck theme to analyze, e.g. 'Global Uranium Supply'" }
            },
            required: ["theme"],
            additionalProperties: false,
          },
        },
      },
      {
        type: "function",
        function: {
          name: "get_analysis",
          description: "Get full details of a specific analysis by ID.",
          parameters: {
            type: "object",
            properties: {
              id: { type: "string", description: "The analysis UUID" }
            },
            required: ["id"],
            additionalProperties: false,
          },
        },
      },
      {
        type: "function",
        function: {
          name: "delete_analysis",
          description: "Delete an analysis by ID.",
          parameters: {
            type: "object",
            properties: {
              id: { type: "string", description: "The analysis UUID to delete" }
            },
            required: ["id"],
            additionalProperties: false,
          },
        },
      },
    ];

    const aiHeaders: Record<string, string> = { "Content-Type": "application/json" };
    if (isAnthropic) {
      aiHeaders["x-api-key"] = apiKey;
      aiHeaders["anthropic-version"] = "2023-06-01";
    } else {
      aiHeaders["Authorization"] = `Bearer ${apiKey}`;
    }

    const aiBody = isAnthropic
      ? {
          model: selectedModel,
          max_tokens: 4096,
          system: systemPrompt,
          messages: messages,
          stream: true,
        }
      : {
          model: selectedModel,
          messages: [
            { role: "system", content: systemPrompt },
            ...messages,
          ],
          tools: isAnthropic ? undefined : tools,
          stream: true,
        };

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: aiHeaders,
      body: JSON.stringify(aiBody),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const text = await response.text();
      console.error("AI error:", response.status, text);
      return new Response(JSON.stringify({ error: "AI service unavailable" }), {
        status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // We need to intercept tool calls. Read the full SSE stream, detect tool calls, execute them, then re-stream.
    // For simplicity, we do a non-streaming first pass to check for tool calls.
    // If no tool calls, we stream the response directly.
    
    // Clone isn't available, so we consume and check
    const fullBody = await response.text();
    
    // Parse SSE to check for tool calls
    let toolCalls: any[] = [];
    let contentParts: string[] = [];
    let finishReason = "";
    
    for (const line of fullBody.split("\n")) {
      if (!line.startsWith("data: ") || line.includes("[DONE]")) continue;
      try {
        const parsed = JSON.parse(line.slice(6));
        const choice = parsed.choices?.[0];
        if (choice?.delta?.tool_calls) {
          for (const tc of choice.delta.tool_calls) {
            if (tc.index !== undefined) {
              if (!toolCalls[tc.index]) toolCalls[tc.index] = { id: "", function: { name: "", arguments: "" } };
              if (tc.id) toolCalls[tc.index].id = tc.id;
              if (tc.function?.name) toolCalls[tc.index].function.name = tc.function.name;
              if (tc.function?.arguments) toolCalls[tc.index].function.arguments += tc.function.arguments;
            }
          }
        }
        if (choice?.delta?.content) contentParts.push(choice.delta.content);
        if (choice?.finish_reason) finishReason = choice.finish_reason;
      } catch {}
    }

    // If there are tool calls, execute them and make a follow-up call
    if (toolCalls.length > 0 && finishReason === "tool_calls") {
      const toolResults: any[] = [];
      
      for (const tc of toolCalls) {
        const args = JSON.parse(tc.function.arguments);
        let result: any;

        if (tc.function.name === "create_analysis") {
          const { data, error } = await supabase
            .from("bottleneck_analyses")
            .insert({ theme: args.theme })
            .select("id, theme")
            .single();
          result = error ? { error: error.message } : { success: true, id: data.id, theme: data.theme, message: `Created analysis "${data.theme}" with ID ${data.id}` };
        } else if (tc.function.name === "get_analysis") {
          const { data, error } = await supabase
            .from("bottleneck_analyses")
            .select("*")
            .eq("id", args.id)
            .single();
          result = error ? { error: "Analysis not found" } : data;
        } else if (tc.function.name === "delete_analysis") {
          const { error } = await supabase
            .from("bottleneck_analyses")
            .delete()
            .eq("id", args.id);
          result = error ? { error: error.message } : { success: true, message: `Deleted analysis ${args.id}` };
        }
        
        toolResults.push({
          role: "tool",
          tool_call_id: tc.id,
          content: JSON.stringify(result),
        });
      }

      // Build assistant message with tool calls
      const assistantMsg: any = { role: "assistant", content: contentParts.join("") || null };
      assistantMsg.tool_calls = toolCalls.map(tc => ({
        id: tc.id,
        type: "function",
        function: { name: tc.function.name, arguments: tc.function.arguments },
      }));

      // Follow-up call with tool results, streaming
      const followUp = await fetch(apiUrl, {
        method: "POST",
        headers: aiHeaders,
        body: JSON.stringify({
          model: selectedModel,
          messages: [
            { role: "system", content: systemPrompt },
            ...messages,
            assistantMsg,
            ...toolResults,
          ],
          stream: true,
        }),
      });

      if (!followUp.ok) {
        return new Response(JSON.stringify({ error: "AI follow-up failed" }), {
          status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(followUp.body, {
        headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
      });
    }

    // No tool calls - re-emit the content as SSE
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        for (const line of fullBody.split("\n")) {
          if (line.trim()) {
            controller.enqueue(encoder.encode(line + "\n"));
          }
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
