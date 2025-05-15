export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      analysis_examples: {
        Row: {
          classification_image_url: string | null
          created_at: string | null
          description: string | null
          detection_image_url: string | null
          extraction_image_url: string | null
          id: string
          original_image_url: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          classification_image_url?: string | null
          created_at?: string | null
          description?: string | null
          detection_image_url?: string | null
          extraction_image_url?: string | null
          id?: string
          original_image_url?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          classification_image_url?: string | null
          created_at?: string | null
          description?: string | null
          detection_image_url?: string | null
          extraction_image_url?: string | null
          id?: string
          original_image_url?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      content_sections: {
        Row: {
          content: Json | null
          created_at: string | null
          id: string
          section_key: string
          subtitle: Json | null
          title: Json | null
          updated_at: string | null
        }
        Insert: {
          content?: Json | null
          created_at?: string | null
          id?: string
          section_key: string
          subtitle?: Json | null
          title?: Json | null
          updated_at?: string | null
        }
        Update: {
          content?: Json | null
          created_at?: string | null
          id?: string
          section_key?: string
          subtitle?: Json | null
          title?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      partners: {
        Row: {
          created_at: string | null
          description: Json | null
          display_order: number | null
          id: string
          is_active: boolean | null
          logo_url: string | null
          name: string
          updated_at: string | null
          website_url: string | null
        }
        Insert: {
          created_at?: string | null
          description?: Json | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name: string
          updated_at?: string | null
          website_url?: string | null
        }
        Update: {
          created_at?: string | null
          description?: Json | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name?: string
          updated_at?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          full_name: string | null
          id: string
          is_admin: boolean | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          created_at?: string | null
          full_name?: string | null
          id: string
          is_admin?: boolean | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          created_at?: string | null
          full_name?: string | null
          id?: string
          is_admin?: boolean | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      roadmap_items: {
        Row: {
          created_at: string | null
          description: Json | null
          display_order: number | null
          id: string
          is_completed: boolean | null
          is_current: boolean | null
          phase: string
          title: Json | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: Json | null
          display_order?: number | null
          id?: string
          is_completed?: boolean | null
          is_current?: boolean | null
          phase: string
          title?: Json | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: Json | null
          display_order?: number | null
          id?: string
          is_completed?: boolean | null
          is_current?: boolean | null
          phase?: string
          title?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      symbol_images: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          image_type: Database["public"]["Enums"]["image_type"]
          image_url: string
          location: string | null
          source: string | null
          symbol_id: string
          tags: string[] | null
          title: string | null
          translations: Json | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_type: Database["public"]["Enums"]["image_type"]
          image_url: string
          location?: string | null
          source?: string | null
          symbol_id: string
          tags?: string[] | null
          title?: string | null
          translations?: Json | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_type?: Database["public"]["Enums"]["image_type"]
          image_url?: string
          location?: string | null
          source?: string | null
          symbol_id?: string
          tags?: string[] | null
          title?: string | null
          translations?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "symbol_images_symbol_id_fkey"
            columns: ["symbol_id"]
            isOneToOne: false
            referencedRelation: "symbols"
            referencedColumns: ["id"]
          },
        ]
      }
      symbols: {
        Row: {
          created_at: string | null
          culture: string
          description: string | null
          id: string
          name: string
          period: string
          translations: Json | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          culture: string
          description?: string | null
          id?: string
          name: string
          period: string
          translations?: Json | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          culture?: string
          description?: string | null
          id?: string
          name?: string
          period?: string
          translations?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          created_at: string | null
          display_order: number | null
          id: string
          image_url: string | null
          initials: string | null
          is_active: boolean | null
          name: string
          quote: Json | null
          role: Json | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          initials?: string | null
          is_active?: boolean | null
          name: string
          quote?: Json | null
          role?: Json | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          initials?: string | null
          is_active?: boolean | null
          name?: string
          quote?: Json | null
          role?: Json | null
          updated_at?: string | null
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
      image_type: "original" | "pattern" | "reuse"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      image_type: ["original", "pattern", "reuse"],
    },
  },
} as const
