export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
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
      ai_pattern_suggestions: {
        Row: {
          ai_model_version: string | null
          created_at: string
          error_message: string | null
          id: string
          image_id: string
          image_type: string
          processed_at: string | null
          processing_status: string
          processing_time_ms: number | null
          suggested_patterns: Json
        }
        Insert: {
          ai_model_version?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          image_id: string
          image_type?: string
          processed_at?: string | null
          processing_status?: string
          processing_time_ms?: number | null
          suggested_patterns: Json
        }
        Update: {
          ai_model_version?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          image_id?: string
          image_type?: string
          processed_at?: string | null
          processing_status?: string
          processing_time_ms?: number | null
          suggested_patterns?: Json
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
      collection_symbols: {
        Row: {
          collection_id: string
          position: number | null
          symbol_id: string
        }
        Insert: {
          collection_id: string
          position?: number | null
          symbol_id: string
        }
        Update: {
          collection_id?: string
          position?: number | null
          symbol_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "collection_symbols_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collection_symbols_symbol_id_fkey"
            columns: ["symbol_id"]
            isOneToOne: false
            referencedRelation: "symbols"
            referencedColumns: ["id"]
          },
        ]
      }
      collection_translations: {
        Row: {
          collection_id: string | null
          description: string | null
          id: number
          language: string
          title: string
        }
        Insert: {
          collection_id?: string | null
          description?: string | null
          id?: number
          language: string
          title: string
        }
        Update: {
          collection_id?: string | null
          description?: string | null
          id?: number
          language?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "collection_translations_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
        ]
      }
      collections: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          is_featured: boolean | null
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_featured?: boolean | null
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_featured?: boolean | null
          slug?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "collections_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collections_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_profiles_with_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      comment_likes: {
        Row: {
          comment_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          comment_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          comment_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comment_likes_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "post_comments"
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
      discovery_comment_likes: {
        Row: {
          comment_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          comment_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          comment_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "discovery_comment_likes_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "discovery_comments"
            referencedColumns: ["id"]
          },
        ]
      }
      discovery_comments: {
        Row: {
          content: string
          created_at: string
          discovery_id: string
          id: string
          likes_count: number
          parent_comment_id: string | null
          translations: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          discovery_id: string
          id?: string
          likes_count?: number
          parent_comment_id?: string | null
          translations?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          discovery_id?: string
          id?: string
          likes_count?: number
          parent_comment_id?: string | null
          translations?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "discovery_comments_discovery_id_fkey"
            columns: ["discovery_id"]
            isOneToOne: false
            referencedRelation: "group_discoveries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discovery_comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "discovery_comments"
            referencedColumns: ["id"]
          },
        ]
      }
      discovery_likes: {
        Row: {
          created_at: string
          discovery_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          discovery_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          discovery_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "discovery_likes_discovery_id_fkey"
            columns: ["discovery_id"]
            isOneToOne: false
            referencedRelation: "group_discoveries"
            referencedColumns: ["id"]
          },
        ]
      }
      evidence_validations: {
        Row: {
          comment: string | null
          confidence_score: number | null
          created_at: string | null
          evidence_id: string
          expertise_level: string | null
          id: string
          validator_id: string
          vote_type: string
        }
        Insert: {
          comment?: string | null
          confidence_score?: number | null
          created_at?: string | null
          evidence_id: string
          expertise_level?: string | null
          id?: string
          validator_id: string
          vote_type: string
        }
        Update: {
          comment?: string | null
          confidence_score?: number | null
          created_at?: string | null
          evidence_id?: string
          expertise_level?: string | null
          id?: string
          validator_id?: string
          vote_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "evidence_validations_evidence_id_fkey"
            columns: ["evidence_id"]
            isOneToOne: false
            referencedRelation: "quest_evidence"
            referencedColumns: ["id"]
          },
        ]
      }
      group_discoveries: {
        Row: {
          comments_count: number
          created_at: string
          description: string | null
          entity_id: string
          entity_type: string
          group_id: string
          id: string
          likes_count: number
          shared_by: string
          title: string
        }
        Insert: {
          comments_count?: number
          created_at?: string
          description?: string | null
          entity_id: string
          entity_type: string
          group_id: string
          id?: string
          likes_count?: number
          shared_by: string
          title: string
        }
        Update: {
          comments_count?: number
          created_at?: string
          description?: string | null
          entity_id?: string
          entity_type?: string
          group_id?: string
          id?: string
          likes_count?: number
          shared_by?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_discoveries_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "interest_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      group_invitations: {
        Row: {
          created_at: string
          email: string | null
          expires_at: string
          group_id: string
          id: string
          invited_by: string
          invited_user_id: string | null
          message: string | null
          responded_at: string | null
          status: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          expires_at?: string
          group_id: string
          id?: string
          invited_by: string
          invited_user_id?: string | null
          message?: string | null
          responded_at?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          expires_at?: string
          group_id?: string
          id?: string
          invited_by?: string
          invited_user_id?: string | null
          message?: string | null
          responded_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_invitations_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "interest_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      group_join_requests: {
        Row: {
          created_at: string
          group_id: string
          id: string
          message: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          group_id: string
          id?: string
          message?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string
          group_id?: string
          id?: string
          message?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_join_requests_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "interest_groups"
            referencedColumns: ["id"]
          },
        ]
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
      group_notifications: {
        Row: {
          created_at: string
          created_by: string | null
          entity_id: string | null
          group_id: string
          id: string
          message: string
          notification_type: string
          read: boolean
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          entity_id?: string | null
          group_id: string
          id?: string
          message: string
          notification_type: string
          read?: boolean
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          entity_id?: string | null
          group_id?: string
          id?: string
          message?: string
          notification_type?: string
          read?: boolean
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_notifications_group_id_fkey"
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
      group_symbols: {
        Row: {
          added_by: string
          created_at: string
          group_id: string
          id: string
          notes: string | null
          symbol_id: string
        }
        Insert: {
          added_by: string
          created_at?: string
          group_id: string
          id?: string
          notes?: string | null
          symbol_id: string
        }
        Update: {
          added_by?: string
          created_at?: string
          group_id?: string
          id?: string
          notes?: string | null
          symbol_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_group_symbols_added_by"
            columns: ["added_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_group_symbols_added_by"
            columns: ["added_by"]
            isOneToOne: false
            referencedRelation: "user_profiles_with_roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_group_symbols_group_id"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "interest_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_group_symbols_symbol_id"
            columns: ["symbol_id"]
            isOneToOne: false
            referencedRelation: "symbols"
            referencedColumns: ["id"]
          },
        ]
      }
      image_annotations: {
        Row: {
          annotation_data: Json
          confidence_score: number | null
          created_at: string
          created_by: string | null
          id: string
          image_id: string
          image_type: string
          notes: string | null
          pattern_id: string | null
          translations: Json | null
          updated_at: string
          validated_by: string | null
          validation_status: string
        }
        Insert: {
          annotation_data: Json
          confidence_score?: number | null
          created_at?: string
          created_by?: string | null
          id?: string
          image_id: string
          image_type?: string
          notes?: string | null
          pattern_id?: string | null
          translations?: Json | null
          updated_at?: string
          validated_by?: string | null
          validation_status?: string
        }
        Update: {
          annotation_data?: Json
          confidence_score?: number | null
          created_at?: string
          created_by?: string | null
          id?: string
          image_id?: string
          image_type?: string
          notes?: string | null
          pattern_id?: string | null
          translations?: Json | null
          updated_at?: string
          validated_by?: string | null
          validation_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "image_annotations_pattern_id_fkey"
            columns: ["pattern_id"]
            isOneToOne: false
            referencedRelation: "patterns"
            referencedColumns: ["id"]
          },
        ]
      }
      interest_groups: {
        Row: {
          banner_image: string | null
          created_at: string
          created_by: string | null
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
          created_by?: string | null
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
          created_by?: string | null
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
      master_explorer_permissions: {
        Row: {
          expires_at: string | null
          granted_at: string | null
          granted_by: string | null
          id: string
          is_active: boolean | null
          permission_type: string
          quest_id: string | null
          user_id: string
        }
        Insert: {
          expires_at?: string | null
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          is_active?: boolean | null
          permission_type: string
          quest_id?: string | null
          user_id: string
        }
        Update: {
          expires_at?: string | null
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          is_active?: boolean | null
          permission_type?: string
          quest_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "master_explorer_permissions_quest_id_fkey"
            columns: ["quest_id"]
            isOneToOne: false
            referencedRelation: "treasure_quests"
            referencedColumns: ["id"]
          },
        ]
      }
      mobile_cache_data: {
        Row: {
          cache_key: string
          cache_type: string
          created_at: string | null
          data: Json
          expires_at: string | null
          id: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          cache_key: string
          cache_type: string
          created_at?: string | null
          data: Json
          expires_at?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          cache_key?: string
          cache_type?: string
          created_at?: string | null
          data?: Json
          expires_at?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      mobile_field_notes: {
        Row: {
          audio_url: string | null
          content: string
          created_at: string | null
          id: string
          images: Json
          location: Json | null
          synced: boolean
          timestamp: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          audio_url?: string | null
          content: string
          created_at?: string | null
          id?: string
          images?: Json
          location?: Json | null
          synced?: boolean
          timestamp: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          audio_url?: string | null
          content?: string
          created_at?: string | null
          id?: string
          images?: Json
          location?: Json | null
          synced?: boolean
          timestamp?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      mobile_sync_queue: {
        Row: {
          action_type: string
          created_at: string | null
          entity_data: Json
          entity_type: string
          error_message: string | null
          id: string
          local_id: string | null
          processed: boolean
          processed_at: string | null
          retry_count: number
          server_id: string | null
          user_id: string
        }
        Insert: {
          action_type: string
          created_at?: string | null
          entity_data: Json
          entity_type: string
          error_message?: string | null
          id?: string
          local_id?: string | null
          processed?: boolean
          processed_at?: string | null
          retry_count?: number
          server_id?: string | null
          user_id: string
        }
        Update: {
          action_type?: string
          created_at?: string | null
          entity_data?: Json
          entity_type?: string
          error_message?: string | null
          id?: string
          local_id?: string | null
          processed?: boolean
          processed_at?: string | null
          retry_count?: number
          server_id?: string | null
          user_id?: string
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
      patterns: {
        Row: {
          complexity_level: string
          created_at: string
          created_by: string | null
          cultural_significance: string | null
          description: string | null
          historical_context: string | null
          id: string
          name: string
          pattern_type: string
          symbol_id: string | null
          translations: Json | null
          updated_at: string
        }
        Insert: {
          complexity_level?: string
          created_at?: string
          created_by?: string | null
          cultural_significance?: string | null
          description?: string | null
          historical_context?: string | null
          id?: string
          name: string
          pattern_type?: string
          symbol_id?: string | null
          translations?: Json | null
          updated_at?: string
        }
        Update: {
          complexity_level?: string
          created_at?: string
          created_by?: string | null
          cultural_significance?: string | null
          description?: string | null
          historical_context?: string | null
          id?: string
          name?: string
          pattern_type?: string
          symbol_id?: string | null
          translations?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "patterns_symbol_id_fkey"
            columns: ["symbol_id"]
            isOneToOne: false
            referencedRelation: "symbols"
            referencedColumns: ["id"]
          },
        ]
      }
      post_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          likes_count: number
          parent_comment_id: string | null
          post_id: string
          translations: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          likes_count?: number
          parent_comment_id?: string | null
          post_id: string
          translations?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          likes_count?: number
          parent_comment_id?: string | null
          post_id?: string
          translations?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "post_comments"
            referencedColumns: ["id"]
          },
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
          bio: string | null
          created_at: string | null
          credentials: string | null
          expertise_areas: string[] | null
          full_name: string | null
          id: string
          is_admin: boolean | null
          is_banned: boolean | null
          specialization: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          credentials?: string | null
          expertise_areas?: string[] | null
          full_name?: string | null
          id: string
          is_admin?: boolean | null
          is_banned?: boolean | null
          specialization?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          credentials?: string | null
          expertise_areas?: string[] | null
          full_name?: string | null
          id?: string
          is_admin?: boolean | null
          is_banned?: boolean | null
          specialization?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      quest_discussion_replies: {
        Row: {
          author_id: string
          content: string
          created_at: string | null
          discussion_id: string
          id: string
          likes_count: number | null
          reply_to_id: string | null
          updated_at: string | null
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string | null
          discussion_id: string
          id?: string
          likes_count?: number | null
          reply_to_id?: string | null
          updated_at?: string | null
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string | null
          discussion_id?: string
          id?: string
          likes_count?: number | null
          reply_to_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quest_discussion_replies_discussion_id_fkey"
            columns: ["discussion_id"]
            isOneToOne: false
            referencedRelation: "quest_discussions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quest_discussion_replies_reply_to_id_fkey"
            columns: ["reply_to_id"]
            isOneToOne: false
            referencedRelation: "quest_discussion_replies"
            referencedColumns: ["id"]
          },
        ]
      }
      quest_discussions: {
        Row: {
          clue_index: number | null
          created_at: string | null
          created_by: string
          id: string
          last_activity_at: string | null
          location_id: string | null
          locked: boolean | null
          pinned: boolean | null
          quest_id: string
          replies_count: number | null
          title: string
          topic_type: string
          updated_at: string | null
        }
        Insert: {
          clue_index?: number | null
          created_at?: string | null
          created_by: string
          id?: string
          last_activity_at?: string | null
          location_id?: string | null
          locked?: boolean | null
          pinned?: boolean | null
          quest_id: string
          replies_count?: number | null
          title: string
          topic_type: string
          updated_at?: string | null
        }
        Update: {
          clue_index?: number | null
          created_at?: string | null
          created_by?: string
          id?: string
          last_activity_at?: string | null
          location_id?: string | null
          locked?: boolean | null
          pinned?: boolean | null
          quest_id?: string
          replies_count?: number | null
          title?: string
          topic_type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quest_discussions_quest_id_fkey"
            columns: ["quest_id"]
            isOneToOne: false
            referencedRelation: "treasure_quests"
            referencedColumns: ["id"]
          },
        ]
      }
      quest_documents: {
        Row: {
          author: string | null
          created_at: string | null
          credibility_score: number | null
          date_created: string | null
          description: string | null
          document_type: string
          document_url: string | null
          id: string
          quest_id: string
          source: string | null
          title: string
          translations: Json | null
          updated_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          author?: string | null
          created_at?: string | null
          credibility_score?: number | null
          date_created?: string | null
          description?: string | null
          document_type: string
          document_url?: string | null
          id?: string
          quest_id: string
          source?: string | null
          title: string
          translations?: Json | null
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          author?: string | null
          created_at?: string | null
          credibility_score?: number | null
          date_created?: string | null
          description?: string | null
          document_type?: string
          document_url?: string | null
          id?: string
          quest_id?: string
          source?: string | null
          title?: string
          translations?: Json | null
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quest_documents_quest_id_fkey"
            columns: ["quest_id"]
            isOneToOne: false
            referencedRelation: "treasure_quests"
            referencedColumns: ["id"]
          },
        ]
      }
      quest_evidence: {
        Row: {
          clue_index: number | null
          created_at: string | null
          description: string | null
          evidence_type: string
          id: string
          image_url: string | null
          latitude: number | null
          location_name: string | null
          longitude: number | null
          metadata: Json | null
          quest_id: string
          submitted_by: string
          title: string
          updated_at: string | null
          validation_count: number | null
          validation_score: number | null
          validation_status: string | null
        }
        Insert: {
          clue_index?: number | null
          created_at?: string | null
          description?: string | null
          evidence_type: string
          id?: string
          image_url?: string | null
          latitude?: number | null
          location_name?: string | null
          longitude?: number | null
          metadata?: Json | null
          quest_id: string
          submitted_by: string
          title: string
          updated_at?: string | null
          validation_count?: number | null
          validation_score?: number | null
          validation_status?: string | null
        }
        Update: {
          clue_index?: number | null
          created_at?: string | null
          description?: string | null
          evidence_type?: string
          id?: string
          image_url?: string | null
          latitude?: number | null
          location_name?: string | null
          longitude?: number | null
          metadata?: Json | null
          quest_id?: string
          submitted_by?: string
          title?: string
          updated_at?: string | null
          validation_count?: number | null
          validation_score?: number | null
          validation_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quest_evidence_quest_id_fkey"
            columns: ["quest_id"]
            isOneToOne: false
            referencedRelation: "treasure_quests"
            referencedColumns: ["id"]
          },
        ]
      }
      quest_locations: {
        Row: {
          added_by: string | null
          created_at: string | null
          current_status: string | null
          description: string | null
          historical_significance: string | null
          id: string
          images: Json | null
          latitude: number
          location_type: string
          longitude: number
          name: string
          quest_id: string
          sources: Json | null
          updated_at: string | null
          verified: boolean | null
          verified_by: string | null
        }
        Insert: {
          added_by?: string | null
          created_at?: string | null
          current_status?: string | null
          description?: string | null
          historical_significance?: string | null
          id?: string
          images?: Json | null
          latitude: number
          location_type: string
          longitude: number
          name: string
          quest_id: string
          sources?: Json | null
          updated_at?: string | null
          verified?: boolean | null
          verified_by?: string | null
        }
        Update: {
          added_by?: string | null
          created_at?: string | null
          current_status?: string | null
          description?: string | null
          historical_significance?: string | null
          id?: string
          images?: Json | null
          latitude?: number
          location_type?: string
          longitude?: number
          name?: string
          quest_id?: string
          sources?: Json | null
          updated_at?: string | null
          verified?: boolean | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quest_locations_quest_id_fkey"
            columns: ["quest_id"]
            isOneToOne: false
            referencedRelation: "treasure_quests"
            referencedColumns: ["id"]
          },
        ]
      }
      quest_participants: {
        Row: {
          id: string
          joined_at: string | null
          quest_id: string
          role: string | null
          status: string | null
          team_name: string | null
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string | null
          quest_id: string
          role?: string | null
          status?: string | null
          team_name?: string | null
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string | null
          quest_id?: string
          role?: string | null
          status?: string | null
          team_name?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quest_participants_quest_id_fkey"
            columns: ["quest_id"]
            isOneToOne: false
            referencedRelation: "treasure_quests"
            referencedColumns: ["id"]
          },
        ]
      }
      quest_progress: {
        Row: {
          clue_index: number
          discovered_at: string | null
          discovery_data: Json | null
          id: string
          points_earned: number | null
          quest_id: string
          user_id: string
          validated: boolean | null
          validated_by: string | null
        }
        Insert: {
          clue_index: number
          discovered_at?: string | null
          discovery_data?: Json | null
          id?: string
          points_earned?: number | null
          quest_id: string
          user_id: string
          validated?: boolean | null
          validated_by?: string | null
        }
        Update: {
          clue_index?: number
          discovered_at?: string | null
          discovery_data?: Json | null
          id?: string
          points_earned?: number | null
          quest_id?: string
          user_id?: string
          validated?: boolean | null
          validated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quest_progress_quest_id_fkey"
            columns: ["quest_id"]
            isOneToOne: false
            referencedRelation: "treasure_quests"
            referencedColumns: ["id"]
          },
        ]
      }
      quest_rewards: {
        Row: {
          awarded_at: string | null
          claimed: boolean | null
          id: string
          quest_id: string
          reward_data: Json
          reward_type: string
          user_id: string
        }
        Insert: {
          awarded_at?: string | null
          claimed?: boolean | null
          id?: string
          quest_id: string
          reward_data: Json
          reward_type: string
          user_id: string
        }
        Update: {
          awarded_at?: string | null
          claimed?: boolean | null
          id?: string
          quest_id?: string
          reward_data?: Json
          reward_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quest_rewards_quest_id_fkey"
            columns: ["quest_id"]
            isOneToOne: false
            referencedRelation: "treasure_quests"
            referencedColumns: ["id"]
          },
        ]
      }
      quest_team_messages: {
        Row: {
          created_at: string | null
          id: string
          message: string
          message_type: string | null
          team_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          message_type?: string | null
          team_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          message_type?: string | null
          team_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quest_team_messages_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "quest_teams"
            referencedColumns: ["id"]
          },
        ]
      }
      quest_teams: {
        Row: {
          created_at: string | null
          id: string
          leader_id: string
          quest_id: string
          team_color: string | null
          team_motto: string | null
          team_name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          leader_id: string
          quest_id: string
          team_color?: string | null
          team_motto?: string | null
          team_name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          leader_id?: string
          quest_id?: string
          team_color?: string | null
          team_motto?: string | null
          team_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "quest_teams_quest_id_fkey"
            columns: ["quest_id"]
            isOneToOne: false
            referencedRelation: "treasure_quests"
            referencedColumns: ["id"]
          },
        ]
      }
      quest_theories: {
        Row: {
          author_id: string
          community_score: number | null
          confidence_level: number | null
          created_at: string | null
          description: string
          id: string
          quest_id: string
          status: string | null
          supporting_evidence: Json | null
          theory_type: string | null
          title: string
          updated_at: string | null
          votes_count: number | null
        }
        Insert: {
          author_id: string
          community_score?: number | null
          confidence_level?: number | null
          created_at?: string | null
          description: string
          id?: string
          quest_id: string
          status?: string | null
          supporting_evidence?: Json | null
          theory_type?: string | null
          title: string
          updated_at?: string | null
          votes_count?: number | null
        }
        Update: {
          author_id?: string
          community_score?: number | null
          confidence_level?: number | null
          created_at?: string | null
          description?: string
          id?: string
          quest_id?: string
          status?: string | null
          supporting_evidence?: Json | null
          theory_type?: string | null
          title?: string
          updated_at?: string | null
          votes_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "quest_theories_quest_id_fkey"
            columns: ["quest_id"]
            isOneToOne: false
            referencedRelation: "treasure_quests"
            referencedColumns: ["id"]
          },
        ]
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
          is_primary: boolean | null
          location: string | null
          source: string | null
          symbol_id: string
          tags: string[] | null
          title: string | null
          translations: Json | null
          updated_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_type: Database["public"]["Enums"]["image_type"]
          image_url: string
          is_primary?: boolean | null
          location?: string | null
          source?: string | null
          symbol_id: string
          tags?: string[] | null
          title?: string | null
          translations?: Json | null
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_type?: Database["public"]["Enums"]["image_type"]
          image_url?: string
          is_primary?: boolean | null
          location?: string | null
          source?: string | null
          symbol_id?: string
          tags?: string[] | null
          title?: string | null
          translations?: Json | null
          updated_at?: string | null
          uploaded_by?: string | null
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
      symbol_verifications: {
        Row: {
          api: string
          confidence: number
          created_at: string
          details: string | null
          id: string
          sources: Json | null
          status: string
          summary: string | null
          symbol_id: string
          updated_at: string
          verified_by: string | null
        }
        Insert: {
          api: string
          confidence?: number
          created_at?: string
          details?: string | null
          id?: string
          sources?: Json | null
          status: string
          summary?: string | null
          symbol_id: string
          updated_at?: string
          verified_by?: string | null
        }
        Update: {
          api?: string
          confidence?: number
          created_at?: string
          details?: string | null
          id?: string
          sources?: Json | null
          status?: string
          summary?: string | null
          symbol_id?: string
          updated_at?: string
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "symbol_verifications_symbol_id_fkey"
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
          function: string[] | null
          historical_context: string | null
          id: string
          medium: string[] | null
          name: string
          period: string
          related_symbols: string[] | null
          significance: string | null
          tags: string[] | null
          technique: string[] | null
          translations: Json | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          culture: string
          description?: string | null
          function?: string[] | null
          historical_context?: string | null
          id?: string
          medium?: string[] | null
          name: string
          period: string
          related_symbols?: string[] | null
          significance?: string | null
          tags?: string[] | null
          technique?: string[] | null
          translations?: Json | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          culture?: string
          description?: string | null
          function?: string[] | null
          historical_context?: string | null
          id?: string
          medium?: string[] | null
          name?: string
          period?: string
          related_symbols?: string[] | null
          significance?: string | null
          tags?: string[] | null
          technique?: string[] | null
          translations?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      system_alerts: {
        Row: {
          alert_key: string
          created_at: string
          id: string
          message: string
          metadata: Json | null
          resolved: boolean
          resolved_at: string | null
          resolved_by: string | null
          source: string
          title: string
          type: string
        }
        Insert: {
          alert_key: string
          created_at?: string
          id?: string
          message: string
          metadata?: Json | null
          resolved?: boolean
          resolved_at?: string | null
          resolved_by?: string | null
          source?: string
          title: string
          type: string
        }
        Update: {
          alert_key?: string
          created_at?: string
          id?: string
          message?: string
          metadata?: Json | null
          resolved?: boolean
          resolved_at?: string | null
          resolved_by?: string | null
          source?: string
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "system_alerts_resolved_by_fkey"
            columns: ["resolved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "system_alerts_resolved_by_fkey"
            columns: ["resolved_by"]
            isOneToOne: false
            referencedRelation: "user_profiles_with_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      system_backups: {
        Row: {
          backup_data: Json | null
          backup_key: string
          completed_at: string | null
          config: Json
          created_at: string
          errors: string[] | null
          id: string
          size_bytes: number
          status: string
          tables_backed_up: string[]
        }
        Insert: {
          backup_data?: Json | null
          backup_key: string
          completed_at?: string | null
          config?: Json
          created_at?: string
          errors?: string[] | null
          id?: string
          size_bytes?: number
          status: string
          tables_backed_up?: string[]
        }
        Update: {
          backup_data?: Json | null
          backup_key?: string
          completed_at?: string | null
          config?: Json
          created_at?: string
          errors?: string[] | null
          id?: string
          size_bytes?: number
          status?: string
          tables_backed_up?: string[]
        }
        Relationships: []
      }
      system_health_checks: {
        Row: {
          auth_status: string
          checked_at: string
          database_status: string
          details: Json | null
          id: string
          issues: string[] | null
          overall_status: string
          storage_status: string
        }
        Insert: {
          auth_status: string
          checked_at?: string
          database_status: string
          details?: Json | null
          id?: string
          issues?: string[] | null
          overall_status: string
          storage_status: string
        }
        Update: {
          auth_status?: string
          checked_at?: string
          database_status?: string
          details?: Json | null
          id?: string
          issues?: string[] | null
          overall_status?: string
          storage_status?: string
        }
        Relationships: []
      }
      system_metrics: {
        Row: {
          collected_at: string
          id: string
          metric_type: string
          values: Json
        }
        Insert: {
          collected_at?: string
          id?: string
          metric_type: string
          values: Json
        }
        Update: {
          collected_at?: string
          id?: string
          metric_type?: string
          values?: Json
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
      theory_votes: {
        Row: {
          created_at: string | null
          id: string
          reasoning: string | null
          theory_id: string
          vote_type: string
          voter_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          reasoning?: string | null
          theory_id: string
          vote_type: string
          voter_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          reasoning?: string | null
          theory_id?: string
          vote_type?: string
          voter_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "theory_votes_theory_id_fkey"
            columns: ["theory_id"]
            isOneToOne: false
            referencedRelation: "quest_theories"
            referencedColumns: ["id"]
          },
        ]
      }
      treasure_quests: {
        Row: {
          clues: Json | null
          created_at: string | null
          created_by: string | null
          description: string | null
          difficulty_level: string
          end_date: string | null
          id: string
          max_participants: number | null
          min_participants: number | null
          quest_type: string
          reward_points: number | null
          special_rewards: Json | null
          start_date: string | null
          status: string
          story_background: string | null
          target_symbols: string[] | null
          title: string
          translations: Json | null
          updated_at: string | null
        }
        Insert: {
          clues?: Json | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          difficulty_level?: string
          end_date?: string | null
          id?: string
          max_participants?: number | null
          min_participants?: number | null
          quest_type?: string
          reward_points?: number | null
          special_rewards?: Json | null
          start_date?: string | null
          status?: string
          story_background?: string | null
          target_symbols?: string[] | null
          title: string
          translations?: Json | null
          updated_at?: string | null
        }
        Update: {
          clues?: Json | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          difficulty_level?: string
          end_date?: string | null
          id?: string
          max_participants?: number | null
          min_participants?: number | null
          quest_type?: string
          reward_points?: number | null
          special_rewards?: Json | null
          start_date?: string | null
          status?: string
          story_background?: string | null
          target_symbols?: string[] | null
          title?: string
          translations?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      trending_metrics: {
        Row: {
          created_at: string | null
          entity_id: string
          entity_type: string
          id: string
          metric_type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          entity_id: string
          entity_type: string
          id?: string
          metric_type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          entity_id?: string
          entity_type?: string
          id?: string
          metric_type?: string
          user_id?: string | null
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
      user_expertise: {
        Row: {
          created_at: string | null
          credentials: string | null
          expertise_area: string
          id: string
          level: string
          user_id: string
          verified: boolean | null
          verified_by: string | null
        }
        Insert: {
          created_at?: string | null
          credentials?: string | null
          expertise_area: string
          id?: string
          level: string
          user_id: string
          verified?: boolean | null
          verified_by?: string | null
        }
        Update: {
          created_at?: string | null
          credentials?: string | null
          expertise_area?: string
          id?: string
          level?: string
          user_id?: string
          verified?: boolean | null
          verified_by?: string | null
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
      user_roles: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      validation_votes: {
        Row: {
          annotation_id: string | null
          comment: string | null
          created_at: string
          id: string
          user_id: string | null
          vote_type: string
        }
        Insert: {
          annotation_id?: string | null
          comment?: string | null
          created_at?: string
          id?: string
          user_id?: string | null
          vote_type: string
        }
        Update: {
          annotation_id?: string | null
          comment?: string | null
          created_at?: string
          id?: string
          user_id?: string | null
          vote_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "validation_votes_annotation_id_fkey"
            columns: ["annotation_id"]
            isOneToOne: false
            referencedRelation: "image_annotations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      user_profiles_with_roles: {
        Row: {
          bio: string | null
          created_at: string | null
          credentials: string | null
          expertise_areas: string[] | null
          full_name: string | null
          highest_role: Database["public"]["Enums"]["app_role"] | null
          id: string | null
          is_admin: boolean | null
          is_banned: boolean | null
          is_master_explorer: boolean | null
          roles: Database["public"]["Enums"]["app_role"][] | null
          specialization: string | null
          updated_at: string | null
          username: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      assign_master_explorer_role: {
        Args: {
          _target_user_id: string
          _admin_user_id: string
          _quest_ids?: string[]
        }
        Returns: undefined
      }
      award_achievement_points: {
        Args: { p_user_id: string; p_achievement_id: string; p_points: number }
        Returns: undefined
      }
      award_user_points: {
        Args: {
          p_user_id: string
          p_activity_type: string
          p_points: number
          p_entity_id?: string
          p_details?: Json
        }
        Returns: undefined
      }
      calculate_annotation_validation_score: {
        Args: { p_annotation_id: string }
        Returns: number
      }
      calculate_evidence_validation_score: {
        Args: { p_evidence_id: string }
        Returns: number
      }
      calculate_quest_completion: {
        Args: { p_quest_id: string; p_user_id: string }
        Returns: number
      }
      calculate_trending_score: {
        Args: {
          p_entity_type: string
          p_entity_id: string
          p_timeframe_hours?: number
        }
        Returns: number
      }
      check_user_achievements: {
        Args: { p_user_id: string }
        Returns: {
          id: string
          name: string
          description: string
          icon: string
          points: number
          type: string
          level: string
          requirement: number
          created_at: string
          updated_at: string
          translations: Json
        }[]
      }
      cleanup_old_system_data: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      convert_contribution_to_symbol: {
        Args: { p_contribution_id: string }
        Returns: string
      }
      create_user_as_admin: {
        Args: {
          p_admin_id: string
          p_email: string
          p_password: string
          p_username?: string
          p_full_name?: string
          p_is_admin?: boolean
        }
        Returns: string
      }
      delete_user_as_admin: {
        Args: { p_admin_id: string; p_user_id: string }
        Returns: undefined
      }
      get_admin_logs_with_profiles: {
        Args: { p_limit?: number }
        Returns: {
          id: string
          admin_id: string
          action: string
          entity_type: string
          entity_id: string
          details: Json
          created_at: string
          admin_name: string
        }[]
      }
      get_contribution_management_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          total_contributions: number
          pending_contributions: number
          approved_contributions: number
          rejected_contributions: number
          contributions_today: number
          contributions_week: number
        }[]
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_entity_admin_logs: {
        Args: { p_entity_type: string; p_entity_id: string }
        Returns: {
          id: string
          admin_id: string
          action: string
          entity_type: string
          entity_id: string
          details: Json
          created_at: string
          admin_name: string
        }[]
      }
      get_leaderboard: {
        Args: { p_limit?: number }
        Returns: {
          user_id: string
          username: string
          full_name: string
          avatar_url: string
          level: number
          total_points: number
          contribution_points: number
          exploration_points: number
          validation_points: number
          community_points: number
        }[]
      }
      get_top_contributors: {
        Args: { p_limit?: number }
        Returns: {
          user_id: string
          username: string
          full_name: string
          contributions_count: number
          total_points: number
        }[]
      }
      get_trending_symbols: {
        Args: { p_limit?: number; p_timeframe_hours?: number }
        Returns: {
          id: string
          name: string
          culture: string
          period: string
          description: string
          created_at: string
          trending_score: number
          view_count: number
          like_count: number
        }[]
      }
      get_user_details_for_admin: {
        Args: { p_user_id: string }
        Returns: {
          id: string
          username: string
          full_name: string
          is_admin: boolean
          is_banned: boolean
          created_at: string
          updated_at: string
          last_activity: string
          contributions_count: number
          total_points: number
          followers_count: number
          following_count: number
          achievements_count: number
        }[]
      }
      get_user_highest_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      get_user_management_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          total_users: number
          active_users_30d: number
          banned_users: number
          admin_users: number
          new_users_today: number
          new_users_week: number
        }[]
      }
      get_user_roles: {
        Args: { _user_id: string }
        Returns: {
          role: Database["public"]["Enums"]["app_role"]
          assigned_at: string
        }[]
      }
      get_users_for_admin: {
        Args: {
          p_limit?: number
          p_offset?: number
          p_search?: string
          p_role_filter?: string
        }
        Returns: {
          id: string
          username: string
          full_name: string
          is_admin: boolean
          is_banned: boolean
          created_at: string
          last_activity: string
          contributions_count: number
          total_points: number
        }[]
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      insert_admin_log: {
        Args: {
          p_admin_id: string
          p_action: string
          p_entity_type: string
          p_entity_id?: string
          p_details?: Json
        }
        Returns: undefined
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_banned: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      moderate_contribution: {
        Args: {
          p_contribution_id: string
          p_admin_id: string
          p_status: string
          p_reason?: string
        }
        Returns: undefined
      }
      process_ai_pattern_suggestions: {
        Args: { p_image_id: string; p_image_type?: string }
        Returns: string
      }
      process_existing_approved_contributions: {
        Args: Record<PropertyKey, never>
        Returns: {
          contribution_id: string
          symbol_id: string
          collection_found: boolean
        }[]
      }
      toggle_user_ban: {
        Args: { p_user_id: string; p_admin_id: string; p_banned: boolean }
        Returns: undefined
      }
      update_user_as_admin: {
        Args: {
          p_admin_id: string
          p_user_id: string
          p_username?: string
          p_full_name?: string
          p_is_admin?: boolean
        }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "user" | "admin" | "master_explorer" | "banned"
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
      app_role: ["user", "admin", "master_explorer", "banned"],
      image_type: ["original", "pattern", "reuse"],
      symbol_location_verification_status: [
        "unverified",
        "verified",
        "disputed",
      ],
    },
  },
} as const
