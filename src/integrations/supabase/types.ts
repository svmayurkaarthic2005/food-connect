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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      food_listings: {
        Row: {
          category: Database["public"]["Enums"]["food_category"]
          cooked_at: string
          created_at: string
          description: string | null
          expires_at: string
          food_name: string
          id: string
          image_url: string | null
          pickup_instructions: string | null
          quantity_kg: number
          restaurant_id: string
          servings: number | null
          status: Database["public"]["Enums"]["food_status"]
          updated_at: string
        }
        Insert: {
          category: Database["public"]["Enums"]["food_category"]
          cooked_at: string
          created_at?: string
          description?: string | null
          expires_at: string
          food_name: string
          id?: string
          image_url?: string | null
          pickup_instructions?: string | null
          quantity_kg: number
          restaurant_id: string
          servings?: number | null
          status?: Database["public"]["Enums"]["food_status"]
          updated_at?: string
        }
        Update: {
          category?: Database["public"]["Enums"]["food_category"]
          cooked_at?: string
          created_at?: string
          description?: string | null
          expires_at?: string
          food_name?: string
          id?: string
          image_url?: string | null
          pickup_instructions?: string | null
          quantity_kg?: number
          restaurant_id?: string
          servings?: number | null
          status?: Database["public"]["Enums"]["food_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "food_listings_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      food_requests: {
        Row: {
          created_at: string
          id: string
          latest_pickup_time: string
          ngo_id: string
          notes: string | null
          preferred_category:
            | Database["public"]["Enums"]["food_category"]
            | null
          quantity_needed_kg: number
          servings_needed: number | null
          status: Database["public"]["Enums"]["request_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          latest_pickup_time: string
          ngo_id: string
          notes?: string | null
          preferred_category?:
            | Database["public"]["Enums"]["food_category"]
            | null
          quantity_needed_kg: number
          servings_needed?: number | null
          status?: Database["public"]["Enums"]["request_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          latest_pickup_time?: string
          ngo_id?: string
          notes?: string | null
          preferred_category?:
            | Database["public"]["Enums"]["food_category"]
            | null
          quantity_needed_kg?: number
          servings_needed?: number | null
          status?: Database["public"]["Enums"]["request_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "food_requests_ngo_id_fkey"
            columns: ["ngo_id"]
            isOneToOne: false
            referencedRelation: "ngos"
            referencedColumns: ["id"]
          },
        ]
      }
      impact_stats: {
        Row: {
          active_ngos: number | null
          active_restaurants: number | null
          created_at: string
          date: string
          id: string
          total_co2_saved_kg: number | null
          total_food_saved_kg: number | null
          total_meals_served: number | null
        }
        Insert: {
          active_ngos?: number | null
          active_restaurants?: number | null
          created_at?: string
          date?: string
          id?: string
          total_co2_saved_kg?: number | null
          total_food_saved_kg?: number | null
          total_meals_served?: number | null
        }
        Update: {
          active_ngos?: number | null
          active_restaurants?: number | null
          created_at?: string
          date?: string
          id?: string
          total_co2_saved_kg?: number | null
          total_food_saved_kg?: number | null
          total_meals_served?: number | null
        }
        Relationships: []
      }
      matches: {
        Row: {
          accepted_at: string | null
          created_at: string
          delivery_confirmed_at: string | null
          distance_km: number | null
          food_listing_id: string
          food_request_id: string | null
          id: string
          match_score: number
          ngo_id: string
          pickup_confirmed_at: string | null
          status: Database["public"]["Enums"]["request_status"]
          updated_at: string
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string
          delivery_confirmed_at?: string | null
          distance_km?: number | null
          food_listing_id: string
          food_request_id?: string | null
          id?: string
          match_score: number
          ngo_id: string
          pickup_confirmed_at?: string | null
          status?: Database["public"]["Enums"]["request_status"]
          updated_at?: string
        }
        Update: {
          accepted_at?: string | null
          created_at?: string
          delivery_confirmed_at?: string | null
          distance_km?: number | null
          food_listing_id?: string
          food_request_id?: string | null
          id?: string
          match_score?: number
          ngo_id?: string
          pickup_confirmed_at?: string | null
          status?: Database["public"]["Enums"]["request_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "matches_food_listing_id_fkey"
            columns: ["food_listing_id"]
            isOneToOne: false
            referencedRelation: "food_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_food_request_id_fkey"
            columns: ["food_request_id"]
            isOneToOne: false
            referencedRelation: "food_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_ngo_id_fkey"
            columns: ["ngo_id"]
            isOneToOne: false
            referencedRelation: "ngos"
            referencedColumns: ["id"]
          },
        ]
      }
      ngos: {
        Row: {
          address: string | null
          created_at: string
          description: string | null
          id: string
          latitude: number | null
          longitude: number | null
          name: string
          people_served: number | null
          total_meals_received: number | null
          updated_at: string
          user_id: string
          verification_status: Database["public"]["Enums"]["verification_status"]
          verified_at: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          description?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name: string
          people_served?: number | null
          total_meals_received?: number | null
          updated_at?: string
          user_id: string
          verification_status?: Database["public"]["Enums"]["verification_status"]
          verified_at?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          description?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name?: string
          people_served?: number | null
          total_meals_received?: number | null
          updated_at?: string
          user_id?: string
          verification_status?: Database["public"]["Enums"]["verification_status"]
          verified_at?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          read: boolean | null
          related_match_id: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          read?: boolean | null
          related_match_id?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          read?: boolean | null
          related_match_id?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_related_match_id_fkey"
            columns: ["related_match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          created_at: string
          email: string
          id: string
          latitude: number | null
          longitude: number | null
          name: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          email: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          name: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          name?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      restaurants: {
        Row: {
          address: string | null
          created_at: string
          cuisine_type: string | null
          description: string | null
          id: string
          latitude: number | null
          longitude: number | null
          name: string
          operating_hours: string | null
          total_donations: number | null
          total_kg_donated: number | null
          updated_at: string
          user_id: string
          verification_status: Database["public"]["Enums"]["verification_status"]
          verified_at: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          cuisine_type?: string | null
          description?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name: string
          operating_hours?: string | null
          total_donations?: number | null
          total_kg_donated?: number | null
          updated_at?: string
          user_id: string
          verification_status?: Database["public"]["Enums"]["verification_status"]
          verified_at?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          cuisine_type?: string | null
          description?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name?: string
          operating_hours?: string | null
          total_donations?: number | null
          total_kg_donated?: number | null
          updated_at?: string
          user_id?: string
          verification_status?: Database["public"]["Enums"]["verification_status"]
          verified_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["user_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["user_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      food_category: "veg" | "non_veg" | "mixed"
      food_status: "available" | "reserved" | "donated" | "expired"
      request_status:
        | "pending"
        | "matched"
        | "accepted"
        | "completed"
        | "cancelled"
      user_role: "restaurant" | "ngo" | "admin"
      verification_status: "pending" | "verified" | "rejected"
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
      food_category: ["veg", "non_veg", "mixed"],
      food_status: ["available", "reserved", "donated", "expired"],
      request_status: [
        "pending",
        "matched",
        "accepted",
        "completed",
        "cancelled",
      ],
      user_role: ["restaurant", "ngo", "admin"],
      verification_status: ["pending", "verified", "rejected"],
    },
  },
} as const
