
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

// Interface for post comments
export interface PostComment {
  id: string;
  post_id: string;
  user_id: string;
  parent_comment_id?: string | null;
  content: string;
  created_at: string;
  updated_at: string;
  likes_count: number;
  translations?: Json;
  user_profile?: {
    username: string;
    full_name: string;
  };
  replies?: PostComment[];
}

// Interface for group invitations
export interface GroupInvitation {
  id: string;
  group_id: string;
  invited_by: string;
  invited_user_id?: string | null;
  email?: string | null;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  message?: string | null;
  created_at: string;
  expires_at: string;
  responded_at?: string | null;
  group?: {
    name: string;
    slug: string;
  };
  inviter_profile?: {
    username: string;
    full_name: string;
  };
}

// Interface for group notifications
export interface GroupNotification {
  id: string;
  user_id: string;
  group_id: string;
  notification_type: 'new_post' | 'new_comment' | 'new_member' | 'invitation' | 'mention' | 'like' | 'reply';
  entity_id?: string | null;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  created_by?: string | null;
  group?: {
    name: string;
    slug: string;
  };
  creator_profile?: {
    username: string;
    full_name: string;
  };
}

// Interface for group discoveries
export interface GroupDiscovery {
  id: string;
  group_id: string;
  shared_by: string;
  entity_type: 'symbol' | 'collection' | 'contribution';
  entity_id: string;
  title: string;
  description?: string | null;
  created_at: string;
  likes_count: number;
  comments_count: number;
  sharer_profile?: {
    username: string;
    full_name: string;
  };
}

// Interface for group join requests
export interface GroupJoinRequest {
  id: string;
  group_id: string;
  user_id: string;
  message?: string | null;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  reviewed_at?: string | null;
  reviewed_by?: string | null;
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
