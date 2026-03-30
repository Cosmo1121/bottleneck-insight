import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const spec = {
  openapi: "3.1.0",
  info: {
    title: "Scarcity Scout API",
    version: "1.0.0",
    description: "Machine-readable API for managing bottleneck analyses in Scarcity Scout. Supports CRUD, batch operations, and webhook subscriptions.",
    license: { name: "MIT", identifier: "MIT" },
  },
  servers: [
    {
      url: `https://uwqtizxvbdgkxjhswgpf.supabase.co/functions/v1`,
      description: "Production",
    },
  ],
  paths: {
    "/api": {
      get: {
        operationId: "listAnalyses",
        summary: "List all analyses",
        responses: {
          "200": {
            description: "Array of analysis summaries",
            content: { "application/json": { schema: { $ref: "#/components/schemas/AnalysisList" } } },
          },
        },
      },
      post: {
        operationId: "createAnalysis",
        summary: "Create a new analysis",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/AnalysisInput" } } },
        },
        responses: {
          "201": { description: "Created analysis", content: { "application/json": { schema: { $ref: "#/components/schemas/Analysis" } } } },
        },
      },
    },
    "/api/{id}": {
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
      get: {
        operationId: "getAnalysis",
        summary: "Get full analysis by ID",
        responses: {
          "200": { description: "Full analysis", content: { "application/json": { schema: { $ref: "#/components/schemas/Analysis" } } } },
          "404": { description: "Not found" },
        },
      },
      patch: {
        operationId: "updateAnalysis",
        summary: "Update an analysis",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/AnalysisInput" } } },
        },
        responses: {
          "200": { description: "Updated analysis", content: { "application/json": { schema: { $ref: "#/components/schemas/Analysis" } } } },
        },
      },
      delete: {
        operationId: "deleteAnalysis",
        summary: "Delete an analysis",
        responses: { "200": { description: "Deleted" } },
      },
    },
    "/api/batch": {
      post: {
        operationId: "batchOperations",
        summary: "Execute multiple create/update/delete operations in one call",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/BatchRequest" },
              example: {
                operations: [
                  { action: "create", data: { theme: "Uranium supply gap" } },
                  { action: "update", id: "uuid-here", data: { status: "active" } },
                  { action: "delete", id: "uuid-here" },
                ],
              },
            },
          },
        },
        responses: {
          "200": { description: "Results for each operation", content: { "application/json": { schema: { $ref: "#/components/schemas/BatchResponse" } } } },
        },
      },
    },
    "/webhooks": {
      get: {
        operationId: "listWebhooks",
        summary: "List webhook subscriptions",
        responses: { "200": { description: "Array of webhook subscriptions" } },
      },
      post: {
        operationId: "createWebhook",
        summary: "Subscribe to analysis change events",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/WebhookInput" },
              example: {
                url: "https://example.com/hook",
                events: ["analysis.updated"],
                conditions: { field: "overall_confidence", operator: "lt", value: 0.5 },
              },
            },
          },
        },
        responses: { "201": { description: "Created subscription" } },
      },
    },
    "/webhooks/{id}": {
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
      delete: {
        operationId: "deleteWebhook",
        summary: "Unsubscribe a webhook",
        responses: { "200": { description: "Deleted" } },
      },
    },
  },
  components: {
    schemas: {
      AnalysisList: {
        type: "object",
        properties: {
          analyses: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string", format: "uuid" },
                theme: { type: "string" },
                status: { type: "string", enum: ["draft", "active", "monitoring", "closed"] },
                overall_confidence: { type: "number" },
                scarcity_strength: { type: "string" },
                investment_priority: { type: "string" },
                created_at: { type: "string", format: "date-time" },
                updated_at: { type: "string", format: "date-time" },
              },
            },
          },
        },
      },
      Analysis: {
        type: "object",
        description: "Full bottleneck analysis object with all fields",
        properties: {
          id: { type: "string", format: "uuid" },
          theme: { type: "string" },
          thesis: { type: "string" },
          primary_bottleneck: { type: "string" },
          status: { type: "string" },
          overall_confidence: { type: "number", minimum: 0, maximum: 1 },
          scores: { type: "object", description: "Nine-factor heatmap scores (1-5 each)" },
          heatmap_rationale: { type: "object" },
          scarcity_evidence: { type: "object" },
          value_chain: { type: "object" },
          opportunities: { type: "object" },
          portfolio: { type: "object" },
          monitoring: { type: "object" },
          thesis_breakers_structured: { type: "object" },
        },
      },
      AnalysisInput: {
        type: "object",
        properties: {
          theme: { type: "string" },
          thesis: { type: "string" },
          primary_bottleneck: { type: "string" },
          status: { type: "string" },
          risk_level: { type: "string" },
          overall_confidence: { type: "number" },
          scores: { type: "object" },
        },
        required: ["theme"],
      },
      BatchRequest: {
        type: "object",
        required: ["operations"],
        properties: {
          operations: {
            type: "array",
            maxItems: 50,
            items: {
              type: "object",
              required: ["action"],
              properties: {
                action: { type: "string", enum: ["create", "update", "delete"] },
                id: { type: "string", format: "uuid", description: "Required for update/delete" },
                data: { type: "object", description: "Required for create/update" },
              },
            },
          },
        },
      },
      BatchResponse: {
        type: "object",
        properties: {
          results: {
            type: "array",
            items: {
              type: "object",
              properties: {
                index: { type: "integer" },
                success: { type: "boolean" },
                id: { type: "string", format: "uuid" },
                error: { type: "string" },
              },
            },
          },
        },
      },
      WebhookInput: {
        type: "object",
        required: ["url", "events"],
        properties: {
          url: { type: "string", format: "uri" },
          events: {
            type: "array",
            items: { type: "string", enum: ["analysis.created", "analysis.updated", "analysis.deleted"] },
          },
          conditions: {
            type: "object",
            description: "Optional condition filter",
            properties: {
              field: { type: "string" },
              operator: { type: "string", enum: ["eq", "neq", "gt", "lt", "gte", "lte"] },
              value: {},
            },
          },
          secret: { type: "string", description: "Optional shared secret for HMAC signature verification" },
        },
      },
    },
  },
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  return new Response(JSON.stringify(spec, null, 2), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
