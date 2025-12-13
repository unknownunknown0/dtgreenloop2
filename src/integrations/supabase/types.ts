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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      art_items: {
        Row: {
          created_at: string | null
          creator_name: string | null
          description: string | null
          id: string
          image_url: string | null
          is_for_sale: boolean | null
          materials_used: string[] | null
          price: number | null
          title: string
        }
        Insert: {
          created_at?: string | null
          creator_name?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_for_sale?: boolean | null
          materials_used?: string[] | null
          price?: number | null
          title: string
        }
        Update: {
          created_at?: string | null
          creator_name?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_for_sale?: boolean | null
          materials_used?: string[] | null
          price?: number | null
          title?: string
        }
        Relationships: []
      }
      need_things: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          is_available: boolean | null
          price: number | null
          quantity: number | null
          title: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean | null
          price?: number | null
          quantity?: number | null
          title: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean | null
          price?: number | null
          quantity?: number | null
          title?: string
        }
        Relationships: []
      }
      pickups: {
        Row: {
          actual_weight_kg: number | null
          address: string
          ai_identified_type: string | null
          created_at: string | null
          estimated_price: number | null
          estimated_weight_kg: number | null
          final_price: number | null
          id: string
          image_url: string | null
          latitude: number | null
          longitude: number | null
          notes: string | null
          pickup_date: string
          pickup_time_slot: string | null
          recycling_company_id: string | null
          status: string | null
          updated_at: string | null
          user_id: string
          waste_type: string
        }
        Insert: {
          actual_weight_kg?: number | null
          address: string
          ai_identified_type?: string | null
          created_at?: string | null
          estimated_price?: number | null
          estimated_weight_kg?: number | null
          final_price?: number | null
          id?: string
          image_url?: string | null
          latitude?: number | null
          longitude?: number | null
          notes?: string | null
          pickup_date: string
          pickup_time_slot?: string | null
          recycling_company_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
          waste_type: string
        }
        Update: {
          actual_weight_kg?: number | null
          address?: string
          ai_identified_type?: string | null
          created_at?: string | null
          estimated_price?: number | null
          estimated_weight_kg?: number | null
          final_price?: number | null
          id?: string
          image_url?: string | null
          latitude?: number | null
          longitude?: number | null
          notes?: string | null
          pickup_date?: string
          pickup_time_slot?: string | null
          recycling_company_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
          waste_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "pickups_recycling_company_id_fkey"
            columns: ["recycling_company_id"]
            isOneToOne: false
            referencedRelation: "recycling_companies"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          created_at: string | null
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          reward_points: number | null
          total_co2_saved_kg: number | null
          total_recycled_kg: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          created_at?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          reward_points?: number | null
          total_co2_saved_kg?: number | null
          total_recycled_kg?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          created_at?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          reward_points?: number | null
          total_co2_saved_kg?: number | null
          total_recycled_kg?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      recycling_companies: {
        Row: {
          address: string | null
          capacity_kg: number | null
          created_at: string | null
          current_load_kg: number | null
          email: string | null
          id: string
          is_active: boolean | null
          latitude: number | null
          longitude: number | null
          name: string
          phone: string | null
          waste_types: string[] | null
        }
        Insert: {
          address?: string | null
          capacity_kg?: number | null
          created_at?: string | null
          current_load_kg?: number | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name: string
          phone?: string | null
          waste_types?: string[] | null
        }
        Update: {
          address?: string | null
          capacity_kg?: number | null
          created_at?: string | null
          current_load_kg?: number | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name?: string
          phone?: string | null
          waste_types?: string[] | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      waste_prices: {
        Row: {
          co2_saved_per_kg: number | null
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          price_per_kg: number
          reward_points_per_kg: number | null
          waste_type: string
        }
        Insert: {
          co2_saved_per_kg?: number | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          price_per_kg: number
          reward_points_per_kg?: number | null
          waste_type: string
        }
        Update: {
          co2_saved_per_kg?: number | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          price_per_kg?: number
          reward_points_per_kg?: number | null
          waste_type?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
