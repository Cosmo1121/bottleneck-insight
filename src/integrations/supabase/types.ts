export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      bottleneck_analyses: {
        Row: {
          agent_name: string | null
          analyst: string | null
          concentration_risk: string | null
          confidence_notes: string | null
          constraint_description: string | null
          constraint_measurable: boolean | null
          correlation_risk: string | null
          created_at: string
          crowding_risk: string | null
          demand_wave: string | null
          disconfirming_signals: string[] | null
          evidence_notes: string[] | null
          false_friends: string[] | null
          final_assessment: string | null
          geography: string | null
          geography_list: string[] | null
          heatmap_rationale: Json
          id: string
          implementation_notes: string | null
          investment_priority: string | null
          likely_losers: string[] | null
          major_unknowns: string[] | null
          monitoring: Json
          opportunities: Json
          overall_confidence: number | null
          portfolio: Json
          primary_bottleneck: string | null
          public_markets_only: boolean | null
          risk_level: string | null
          scarcity_evidence: Json
          scarcity_strength: string | null
          scarcity_types: string[] | null
          scores: Json
          second_order_beneficiaries: string[] | null
          source_context: string | null
          status: string | null
          structural_shift: string[] | null
          subject_description: string | null
          subject_type: string | null
          tags: string[] | null
          theme: string
          thesis: string | null
          thesis_breakers: string[] | null
          thesis_breakers_structured: Json
          thesis_stage: string | null
          time_horizon: string | null
          time_to_resolve: string | null
          transmission_mechanism: string | null
          updated_at: string
          value_capture_layer: string | null
          value_chain: Json
          why_now: string | null
          worldview_assumption: string | null
        }
        Insert: {
          agent_name?: string | null
          analyst?: string | null
          concentration_risk?: string | null
          confidence_notes?: string | null
          constraint_description?: string | null
          constraint_measurable?: boolean | null
          correlation_risk?: string | null
          created_at?: string
          crowding_risk?: string | null
          demand_wave?: string | null
          disconfirming_signals?: string[] | null
          evidence_notes?: string[] | null
          false_friends?: string[] | null
          final_assessment?: string | null
          geography?: string | null
          geography_list?: string[] | null
          heatmap_rationale?: Json
          id?: string
          implementation_notes?: string | null
          investment_priority?: string | null
          likely_losers?: string[] | null
          major_unknowns?: string[] | null
          monitoring?: Json
          opportunities?: Json
          overall_confidence?: number | null
          portfolio?: Json
          primary_bottleneck?: string | null
          public_markets_only?: boolean | null
          risk_level?: string | null
          scarcity_evidence?: Json
          scarcity_strength?: string | null
          scarcity_types?: string[] | null
          scores?: Json
          second_order_beneficiaries?: string[] | null
          source_context?: string | null
          status?: string | null
          structural_shift?: string[] | null
          subject_description?: string | null
          subject_type?: string | null
          tags?: string[] | null
          theme: string
          thesis?: string | null
          thesis_breakers?: string[] | null
          thesis_breakers_structured?: Json
          thesis_stage?: string | null
          time_horizon?: string | null
          time_to_resolve?: string | null
          transmission_mechanism?: string | null
          updated_at?: string
          value_capture_layer?: string | null
          value_chain?: Json
          why_now?: string | null
          worldview_assumption?: string | null
        }
        Update: {
          agent_name?: string | null
          analyst?: string | null
          concentration_risk?: string | null
          confidence_notes?: string | null
          constraint_description?: string | null
          constraint_measurable?: boolean | null
          correlation_risk?: string | null
          created_at?: string
          crowding_risk?: string | null
          demand_wave?: string | null
          disconfirming_signals?: string[] | null
          evidence_notes?: string[] | null
          false_friends?: string[] | null
          final_assessment?: string | null
          geography?: string | null
          geography_list?: string[] | null
          heatmap_rationale?: Json
          id?: string
          implementation_notes?: string | null
          investment_priority?: string | null
          likely_losers?: string[] | null
          major_unknowns?: string[] | null
          monitoring?: Json
          opportunities?: Json
          overall_confidence?: number | null
          portfolio?: Json
          primary_bottleneck?: string | null
          public_markets_only?: boolean | null
          risk_level?: string | null
          scarcity_evidence?: Json
          scarcity_strength?: string | null
          scarcity_types?: string[] | null
          scores?: Json
          second_order_beneficiaries?: string[] | null
          source_context?: string | null
          status?: string | null
          structural_shift?: string[] | null
          subject_description?: string | null
          subject_type?: string | null
          tags?: string[] | null
          theme?: string
          thesis?: string | null
          thesis_breakers?: string[] | null
          thesis_breakers_structured?: Json
          thesis_stage?: string | null
          time_horizon?: string | null
          time_to_resolve?: string | null
          transmission_mechanism?: string | null
          updated_at?: string
          value_capture_layer?: string | null
          value_chain?: Json
          why_now?: string | null
          worldview_assumption?: string | null
        }
        Relationships: []
      }
      webhook_subscriptions: {
        Row: {
          active: boolean
          conditions: Json | null
          created_at: string
          events: string[]
          id: string
          secret: string | null
          url: string
        }
        Insert: {
          active?: boolean
          conditions?: Json | null
          created_at?: string
          events?: string[]
          id?: string
          secret?: string | null
          url: string
        }
        Update: {
          active?: boolean
          conditions?: Json | null
          created_at?: string
          events?: string[]
          id?: string
          secret?: string | null
          url?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
