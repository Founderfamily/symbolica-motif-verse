
import { Json } from '@/integrations/supabase/types';

// Basic interface for interest group data
export interface InterestGroup {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  banner_image?: string | null;
  theme_color?: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  created_by: string;
  members_count: number;
  discoveries_count: number;
  translations?: {
    en?: {
      name?: string;
      description?: string;
    };
    fr?: {
      name?: string;
      description?: string;
    };
  };
}

// Interface for group members
export interface GroupMember {
  id: string;
  group_id: string;
  user_id: string;
  joined_at: string;
  role: 'member' | 'admin' | 'moderator';
  profiles: {
    id: string;
    username: string;
    full_name: string;
  };
}

// Interface for group posts - updated to match actual data structure
export interface GroupPost {
  id: string;
  group_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  likes_count: number;
  comments_count: number;
  user_profile?: {
    username: string;
    full_name: string;
  };
}

// Interface for collections within groups
export interface GroupCollection {
  id: string;
  group_id: string;
  name: string;
  description?: string | null;
  created_at: string;
  updated_at: string;
  created_by: string;
  translations?: {
    en?: {
      name?: string;
      description?: string;
    };
    fr?: {
      name?: string;
      description?: string;
    };
  };
}
