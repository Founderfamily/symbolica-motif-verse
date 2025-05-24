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
      achievements: {
        Row: {
          created_at: string | null
          description: string
          icon: string
          id: string
          level: string
          name: string
          points: number
          requirement: number
          translations: Json | null
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          icon: string
          id?: string
          level: string
          name: string
          points?: number
          requirement?: number
          translations?: Json | null
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          icon?: string
          id?: string
          level?: string
          name?: string
          points?: number
          requirement?: number
          translations?: Json | null
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      admin_logs: {
        Row: {
          action: string
          admin_id: string
          created_at: string
          details: Json | null
          entity_id: string | null
          entity_type: string
          id: string
        }
        Insert: {
          action: string
          admin_id: string
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type: string
          id?: string
        }
        Update: {
          action?: string
          admin_id?: string
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type?: string
          id?: string
        }
        Relationships: []
      }
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
      collection_items: {
        Row: {
          added_by: string
          collection_id: string
          created_at: string
          id: string
          notes: string | null
          symbol_id: string
          translations: Json | null
        }
        Insert: {
          added_by: string
          collection_id: string
          created_at?: string
          id?: string
          notes?: string | null
          symbol_id: string
          translations?: Json | null
        }
        Update: {
          added_by?: string
          collection_id?: string
          created_at?: string
          id?: string
          notes?: string | null
          symbol_id?: string
          translations?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "collection_items_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "group_symbol_collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collection_items_symbol_id_fkey"
            columns: ["symbol_id"]
            isOneToOne: false
            referencedRelation: "symbols"
            referencedColumns: ["id"]
          },
        ]
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
      contribution_comments: {
        Row: {
          comment: string
          comment_translations: Json | null
          contribution_id: string
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          comment: string
          comment_translations?: Json | null
          contribution_id: string
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          comment?: string
          comment_translations?: Json | null
          contribution_id?: string
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contribution_comments_contribution_id_fkey"
            columns: ["contribution_id"]
            isOneToOne: false
            referencedRelation: "user_contributions"
            referencedColumns: ["id"]
          },
        ]
      }
      contribution_images: {
        Row: {
          annotations: Json | null
          contribution_id: string
          created_at: string | null
          extracted_pattern_url: string | null
          id: string
          image_type: string
          image_url: string
        }
        Insert: {
          annotations?: Json | null
          contribution_id: string
          created_at?: string | null
          extracted_pattern_url?: string | null
          id?: string
          image_type?: string
          image_url: string
        }
        Update: {
          annotations?: Json | null
          contribution_id?: string
          created_at?: string | null
          extracted_pattern_url?: string | null
          id?: string
          image_type?: string
          image_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "contribution_images_contribution_id_fkey"
            columns: ["contribution_id"]
            isOneToOne: false
            referencedRelation: "user_contributions"
            referencedColumns: ["id"]
          },
        ]
      }
      contribution_tags: {
        Row: {
          contribution_id: string
          created_at: string | null
          id: string
          tag: string
          tag_translations: Json | null
        }
        Insert: {
          contribution_id: string
          created_at?: string | null
          id?: string
          tag: string
          tag_translations?: Json | null
        }
        Update: {
          contribution_id?: string
          created_at?: string | null
          id?: string
          tag?: string
          tag_translations?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "contribution_tags_contribution_id_fkey"
            columns: ["contribution_id"]
            isOneToOne: false
            referencedRelation: "user_contributions"
            referencedColumns: ["id"]
          },
        ]
      }
      direct_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          read: boolean
          receiver_id: string
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          read?: boolean
          receiver_id: string
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          read?: boolean
          receiver_id?: string
          sender_id?: string
        }
        Relationships: []
      }
      group_members: {
        Row: {
          group_id: string
          id: string
          joined_at: string
          role: string
          user_id: string
        }
        Insert: {
          group_id: string
          id?: string
          joined_at?: string
          role?: string
          user_id: string
        }
        Update: {
          group_id?: string
          id?: string
          joined_at?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "interest_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      group_posts: {
        Row: {
          comments_count: number
          content: string
          created_at: string
          group_id: string
          id: string
          likes_count: number
          translations: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          comments_count?: number
          content: string
          created_at?: string
          group_id: string
          id?: string
          likes_count?: number
          translations?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          comments_count?: number
          content?: string
          created_at?: string
          group_id?: string
          id?: string
          likes_count?: number
          translations?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_posts_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "interest_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      group_symbol_collections: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          group_id: string
          id: string
          name: string
          translations: Json | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          group_id: string
          id?: string
          name: string
          translations?: Json | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          group_id?: string
          id?: string
          name?: string
          translations?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_symbol_collections_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "interest_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      interest_groups: {
        Row: {
          banner_image: string | null
          created_at: string
          created_by: string
          description: string | null
          discoveries_count: number
          icon: string | null
          id: string
          is_public: boolean
          members_count: number
          name: string
          slug: string
          theme_color: string | null
          translations: Json | null
          updated_at: string
        }
        Insert: {
          banner_image?: string | null
          created_at?: string
          created_by: string
          description?: string | null
          discoveries_count?: number
          icon?: string | null
          id?: string
          is_public?: boolean
          members_count?: number
          name: string
          slug: string
          theme_color?: string | null
          translations?: Json | null
          updated_at?: string
        }
        Update: {
          banner_image?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          discoveries_count?: number
          icon?: string | null
          id?: string
          is_public?: boolean
          members_count?: number
          name?: string
          slug?: string
          theme_color?: string | null
          translations?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          content: Json
          created_at: string
          id: string
          read: boolean
          type: string
          user_id: string
        }
        Insert: {
          content: Json
          created_at?: string
          id?: string
          read?: boolean
          type: string
          user_id: string
        }
        Update: {
          content?: Json
          created_at?: string
          id?: string
          read?: boolean
          type?: string
          user_id?: string
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
      post_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          post_id: string
          translations: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          post_id: string
          translations?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          post_id?: string
          translations?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "group_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_likes: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "group_posts"
            referencedColumns: ["id"]
          },
        ]
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
      symbol_connections: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          relationship_type: string
          symbol_id_1: string
          symbol_id_2: string
          translations: Json | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          relationship_type: string
          symbol_id_1: string
          symbol_id_2: string
          translations?: Json | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          relationship_type?: string
          symbol_id_1?: string
          symbol_id_2?: string
          translations?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "symbol_connections_symbol_id_1_fkey"
            columns: ["symbol_id_1"]
            isOneToOne: false
            referencedRelation: "symbols"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "symbol_connections_symbol_id_2_fkey"
            columns: ["symbol_id_2"]
            isOneToOne: false
            referencedRelation: "symbols"
            referencedColumns: ["id"]
          },
        ]
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
      symbol_locations: {
        Row: {
          created_at: string | null
          created_by: string | null
          culture: string
          description: string | null
          historical_period: string | null
          id: string
          is_verified: boolean | null
          latitude: number
          longitude: number
          name: string
          source: string | null
          symbol_id: string
          translations: Json | null
          updated_at: string | null
          verification_status:
            | Database["public"]["Enums"]["symbol_location_verification_status"]
            | null
          verified_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          culture: string
          description?: string | null
          historical_period?: string | null
          id?: string
          is_verified?: boolean | null
          latitude: number
          longitude: number
          name: string
          source?: string | null
          symbol_id: string
          translations?: Json | null
          updated_at?: string | null
          verification_status?:
            | Database["public"]["Enums"]["symbol_location_verification_status"]
            | null
          verified_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          culture?: string
          description?: string | null
          historical_period?: string | null
          id?: string
          is_verified?: boolean | null
          latitude?: number
          longitude?: number
          name?: string
          source?: string | null
          symbol_id?: string
          translations?: Json | null
          updated_at?: string | null
          verification_status?:
            | Database["public"]["Enums"]["symbol_location_verification_status"]
            | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "symbol_locations_symbol_id_fkey"
            columns: ["symbol_id"]
            isOneToOne: false
            referencedRelation: "symbols"
            referencedColumns: ["id"]
          },
        ]
      }
      symbol_taxonomy: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          level: number | null
          name: string
          parent_id: string | null
          translations: Json | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          level?: number | null
          name: string
          parent_id?: string | null
          translations?: Json | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          level?: number | null
          name?: string
          parent_id?: string | null
          translations?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "symbol_taxonomy_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "symbol_taxonomy"
            referencedColumns: ["id"]
          },
        ]
      }
      symbol_taxonomy_mapping: {
        Row: {
          created_at: string | null
          id: string
          symbol_id: string
          taxonomy_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          symbol_id: string
          taxonomy_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          symbol_id?: string
          taxonomy_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "symbol_taxonomy_mapping_symbol_id_fkey"
            columns: ["symbol_id"]
            isOneToOne: false
            referencedRelation: "symbols"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "symbol_taxonomy_mapping_taxonomy_id_fkey"
            columns: ["taxonomy_id"]
            isOneToOne: false
            referencedRelation: "symbol_taxonomy"
            referencedColumns: ["id"]
          },
        ]
      }
      symbols: {
        Row: {
          created_at: string | null
          culture: string
          description: string | null
          function: string[] | null
          id: string
          medium: string[] | null
          name: string
          period: string
          technique: string[] | null
          translations: Json | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          culture: string
          description?: string | null
          function?: string[] | null
          id?: string
          medium?: string[] | null
          name: string
          period: string
          technique?: string[] | null
          translations?: Json | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          culture?: string
          description?: string | null
          function?: string[] | null
          id?: string
          medium?: string[] | null
          name?: string
          period?: string
          technique?: string[] | null
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
      user_achievements: {
        Row: {
          achievement_id: string
          completed: boolean
          created_at: string | null
          earned_at: string | null
          id: string
          progress: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          achievement_id: string
          completed?: boolean
          created_at?: string | null
          earned_at?: string | null
          id?: string
          progress?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          achievement_id?: string
          completed?: boolean
          created_at?: string | null
          earned_at?: string | null
          id?: string
          progress?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
        ]
      }
      user_activities: {
        Row: {
          activity_type: string
          created_at: string | null
          details: Json | null
          entity_id: string | null
          id: string
          points_earned: number
          user_id: string
        }
        Insert: {
          activity_type: string
          created_at?: string | null
          details?: Json | null
          entity_id?: string | null
          id?: string
          points_earned?: number
          user_id: string
        }
        Update: {
          activity_type?: string
          created_at?: string | null
          details?: Json | null
          entity_id?: string | null
          id?: string
          points_earned?: number
          user_id?: string
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          awarded_at: string
          badge_name: string
          badge_type: string
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          awarded_at?: string
          badge_name: string
          badge_type: string
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          awarded_at?: string
          badge_name?: string
          badge_type?: string
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_contributions: {
        Row: {
          created_at: string | null
          cultural_context: string | null
          cultural_context_translations: Json | null
          description: string | null
          description_translations: Json | null
          id: string
          latitude: number | null
          location_name: string | null
          location_name_translations: Json | null
          longitude: number | null
          period: string | null
          period_translations: Json | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          title: string
          title_translations: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          cultural_context?: string | null
          cultural_context_translations?: Json | null
          description?: string | null
          description_translations?: Json | null
          id?: string
          latitude?: number | null
          location_name?: string | null
          location_name_translations?: Json | null
          longitude?: number | null
          period?: string | null
          period_translations?: Json | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          title: string
          title_translations?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          cultural_context?: string | null
          cultural_context_translations?: Json | null
          description?: string | null
          description_translations?: Json | null
          id?: string
          latitude?: number | null
          location_name?: string | null
          location_name_translations?: Json | null
          longitude?: number | null
          period?: string | null
          period_translations?: Json | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          title?: string
          title_translations?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_follows: {
        Row: {
          created_at: string
          followed_id: string
          follower_id: string
          id: string
        }
        Insert: {
          created_at?: string
          followed_id: string
          follower_id: string
          id?: string
        }
        Update: {
          created_at?: string
          followed_id?: string
          follower_id?: string
          id?: string
        }
        Relationships: []
      }
      user_levels: {
        Row: {
          created_at: string | null
          id: string
          level: number
          next_level_xp: number
          updated_at: string | null
          user_id: string
          xp: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          level?: number
          next_level_xp?: number
          updated_at?: string | null
          user_id: string
          xp?: number
        }
        Update: {
          created_at?: string | null
          id?: string
          level?: number
          next_level_xp?: number
          updated_at?: string | null
          user_id?: string
          xp?: number
        }
        Relationships: []
      }
      user_points: {
        Row: {
          community_points: number
          contribution_points: number
          created_at: string | null
          exploration_points: number
          id: string
          total: number
          updated_at: string | null
          user_id: string
          validation_points: number
        }
        Insert: {
          community_points?: number
          contribution_points?: number
          created_at?: string | null
          exploration_points?: number
          id?: string
          total?: number
          updated_at?: string | null
          user_id: string
          validation_points?: number
        }
        Update: {
          community_points?: number
          contribution_points?: number
          created_at?: string | null
          exploration_points?: number
          id?: string
          total?: number
          updated_at?: string | null
          user_id?: string
          validation_points?: number
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
      symbol_location_verification_status:
        | "unverified"
        | "verified"
        | "disputed"
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
      symbol_location_verification_status: [
        "unverified",
        "verified",
        "disputed",
      ],
    },
  },
} as const
