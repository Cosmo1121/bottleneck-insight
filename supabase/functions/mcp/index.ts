import { Hono } from "hono";
import { McpServer, StreamableHttpTransport } from "mcp-lite";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const app = new Hono();

const mcpServer = new McpServer({
  name: "bottleneck-analysis",
  version: "1.0.0",
});

function getSupabase() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );
}

mcpServer.tool({
  name: "list_analyses",
  description: "List all bottleneck analyses with summary info (id, theme, status, confidence, priority)",
  inputSchema: {
    type: "object",
    properties: {
      limit: { type: "number", description: "Max results (default 20)" },
    },
  },
  handler: async ({ limit }) => {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("bottleneck_analyses")
      .select("id, theme, status, overall_confidence, scarcity_strength, investment_priority, created_at, updated_at")
      .order("updated_at", { ascending: false })
      .limit(limit || 20);
    if (error) return { content: [{ type: "text", text: `Error: ${error.message}` }] };
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  },
});

mcpServer.tool({
  name: "get_analysis",
  description: "Get full details of a bottleneck analysis by ID",
  inputSchema: {
    type: "object",
    properties: {
      id: { type: "string", description: "Analysis UUID" },
    },
    required: ["id"],
  },
  handler: async ({ id }) => {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("bottleneck_analyses")
      .select("*")
      .eq("id", id)
      .single();
    if (error) return { content: [{ type: "text", text: `Error: ${error.message}` }] };
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  },
});

mcpServer.tool({
  name: "create_analysis",
  description: "Create a new bottleneck analysis. At minimum provide a theme. Optionally include thesis, primary_bottleneck, subject_type, risk_level, and other fields.",
  inputSchema: {
    type: "object",
    properties: {
      theme: { type: "string", description: "The bottleneck theme (required)" },
      thesis: { type: "string", description: "One-sentence investment thesis" },
      primary_bottleneck: { type: "string", description: "Primary supply constraint" },
      subject_type: { type: "string", description: "macro_theme|sector|industry|commodity|geography|technology|policy" },
      risk_level: { type: "string", description: "low|medium|high|very-high" },
      status: { type: "string", description: "draft|active|monitoring|closed" },
      analyst: { type: "string", description: "Analyst name" },
    },
    required: ["theme"],
  },
  handler: async (args) => {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("bottleneck_analyses")
      .insert(args)
      .select("id, theme")
      .single();
    if (error) return { content: [{ type: "text", text: `Error: ${error.message}` }] };
    return { content: [{ type: "text", text: `Created analysis "${data.theme}" with ID: ${data.id}` }] };
  },
});

mcpServer.tool({
  name: "update_analysis",
  description: "Update fields of an existing analysis. Provide the id and any fields to update.",
  inputSchema: {
    type: "object",
    properties: {
      id: { type: "string", description: "Analysis UUID" },
      theme: { type: "string" },
      thesis: { type: "string" },
      status: { type: "string" },
      primary_bottleneck: { type: "string" },
      risk_level: { type: "string" },
      overall_confidence: { type: "number" },
      final_assessment: { type: "string" },
    },
    required: ["id"],
  },
  handler: async ({ id, ...updates }) => {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("bottleneck_analyses")
      .update(updates)
      .eq("id", id)
      .select("id, theme")
      .single();
    if (error) return { content: [{ type: "text", text: `Error: ${error.message}` }] };
    return { content: [{ type: "text", text: `Updated analysis "${data.theme}" (${data.id})` }] };
  },
});

mcpServer.tool({
  name: "delete_analysis",
  description: "Delete a bottleneck analysis by ID",
  inputSchema: {
    type: "object",
    properties: {
      id: { type: "string", description: "Analysis UUID to delete" },
    },
    required: ["id"],
  },
  handler: async ({ id }) => {
    const supabase = getSupabase();
    const { error } = await supabase
      .from("bottleneck_analyses")
      .delete()
      .eq("id", id);
    if (error) return { content: [{ type: "text", text: `Error: ${error.message}` }] };
    return { content: [{ type: "text", text: `Deleted analysis ${id}` }] };
  },
});

mcpServer.tool({
  name: "autofill_analysis",
  description: "Use AI to auto-populate a bottleneck analysis from just a theme name. Creates the analysis and fills all fields using LLM.",
  inputSchema: {
    type: "object",
    properties: {
      theme: { type: "string", description: "Theme to analyze" },
    },
    required: ["theme"],
  },
  handler: async ({ theme }) => {
    const supabase = getSupabase();
    // Create the analysis first
    const { data: created, error: createErr } = await supabase
      .from("bottleneck_analyses")
      .insert({ theme })
      .select("id")
      .single();
    if (createErr) return { content: [{ type: "text", text: `Error creating: ${createErr.message}` }] };

    // Call autofill function
    try {
      const baseUrl = Deno.env.get("SUPABASE_URL")!;
      const resp = await fetch(`${baseUrl}/functions/v1/autofill-analysis`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
        },
        body: JSON.stringify({ theme }),
      });
      if (resp.ok) {
        const aiData = await resp.json();
        await supabase.from("bottleneck_analyses").update(aiData).eq("id", created.id);
        return { content: [{ type: "text", text: `Created and auto-filled analysis "${theme}" with ID: ${created.id}` }] };
      }
      return { content: [{ type: "text", text: `Created analysis ${created.id} but auto-fill failed. You can fill it manually.` }] };
    } catch {
      return { content: [{ type: "text", text: `Created analysis ${created.id} but auto-fill failed.` }] };
    }
  },
});

const transport = new StreamableHttpTransport();

app.all("/*", async (c) => {
  return await transport.handleRequest(c.req.raw, mcpServer);
});

Deno.serve(app.fetch);
