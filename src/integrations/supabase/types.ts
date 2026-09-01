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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          subject: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          subject: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          subject?: string
        }
        Relationships: []
      }
      guide_requests: {
        Row: {
          city: string
          country: string
          created_at: string
          destination: string
          draft: Json | null
          error_message: string | null
          generated_at: string | null
          id: string
          origin: string
          published_at: string | null
          route_slug: string
          slug: string
          status: string
          updated_at: string
        }
        Insert: {
          city: string
          country: string
          created_at?: string
          destination: string
          draft?: Json | null
          error_message?: string | null
          generated_at?: string | null
          id?: string
          origin?: string
          published_at?: string | null
          route_slug: string
          slug: string
          status?: string
          updated_at?: string
        }
        Update: {
          city?: string
          country?: string
          created_at?: string
          destination?: string
          draft?: Json | null
          error_message?: string | null
          generated_at?: string | null
          id?: string
          origin?: string
          published_at?: string | null
          route_slug?: string
          slug?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      job_secrets: {
        Row: {
          name: string
          secret: string
          updated_at: string
        }
        Insert: {
          name: string
          secret: string
          updated_at?: string
        }
        Update: {
          name?: string
          secret?: string
          updated_at?: string
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          active: boolean
          created_at: string
          email: string
          id: string
          source: string | null
        }
        Insert: {
          active?: boolean
          created_at?: string
          email: string
          id?: string
          source?: string | null
        }
        Update: {
          active?: boolean
          created_at?: string
          email?: string
          id?: string
          source?: string | null
        }
        Relationships: []
      }
      ops_logs: {
        Row: {
          context: Json
          created_at: string
          duration_ms: number | null
          id: string
          kind: string
          label: string
          message: string | null
          ok: boolean
          result_count: number | null
          status: number | null
        }
        Insert: {
          context?: Json
          created_at?: string
          duration_ms?: number | null
          id?: string
          kind: string
          label: string
          message?: string | null
          ok?: boolean
          result_count?: number | null
          status?: number | null
        }
        Update: {
          context?: Json
          created_at?: string
          duration_ms?: number | null
          id?: string
          kind?: string
          label?: string
          message?: string | null
          ok?: boolean
          result_count?: number | null
          status?: number | null
        }
        Relationships: []
      }
      price_alerts: {
        Row: {
          active: boolean
          created_at: string
          currency: string
          depart_date: string | null
          destination: string
          email: string
          id: string
          initial_price: number
          last_checked_at: string | null
          last_price: number
          origin: string
          return_date: string | null
          unsubscribe_token: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          currency?: string
          depart_date?: string | null
          destination: string
          email: string
          id?: string
          initial_price: number
          last_checked_at?: string | null
          last_price: number
          origin: string
          return_date?: string | null
          unsubscribe_token?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          currency?: string
          depart_date?: string | null
          destination?: string
          email?: string
          id?: string
          initial_price?: number
          last_checked_at?: string | null
          last_price?: number
          origin?: string
          return_date?: string | null
          unsubscribe_token?: string
        }
        Relationships: []
      }
      price_cache: {
        Row: {
          cache_key: string
          created_at: string
          expires_at: string
          payload: Json
        }
        Insert: {
          cache_key: string
          created_at?: string
          expires_at: string
          payload: Json
        }
        Update: {
          cache_key?: string
          created_at?: string
          expires_at?: string
          payload?: Json
        }
        Relationships: []
      }
      price_history: {
        Row: {
          currency: string
          destination: string
          id: string
          lowest_price: number
          month: string
          observed_at: string | null
          origin: string
          updated_at: string
        }
        Insert: {
          currency?: string
          destination: string
          id?: string
          lowest_price: number
          month: string
          observed_at?: string | null
          origin: string
          updated_at?: string
        }
        Update: {
          currency?: string
          destination?: string
          id?: string
          lowest_price?: number
          month?: string
          observed_at?: string | null
          origin?: string
          updated_at?: string
        }
        Relationships: []
      }
      price_observations: {
        Row: {
          currency: string
          departure_month: string
          destination: string
          id: string
          lowest_price: number
          observed_at: string
          observed_on: string
          origin: string
        }
        Insert: {
          currency?: string
          departure_month: string
          destination: string
          id?: string
          lowest_price: number
          observed_at?: string
          observed_on?: string
          origin: string
        }
        Update: {
          currency?: string
          departure_month?: string
          destination?: string
          id?: string
          lowest_price?: number
          observed_at?: string
          observed_on?: string
          origin?: string
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
