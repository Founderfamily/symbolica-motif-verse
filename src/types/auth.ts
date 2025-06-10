
export interface UserProfile {
  id: string;
  username?: string;
  full_name?: string;
  is_admin?: boolean;
  is_banned?: boolean;
  created_at?: string;
  updated_at?: string;
  last_activity?: string;
  contributions_count?: number;
  verified_uploads?: number;
  bio?: string;
  location?: string;
  website?: string;
  favorite_cultures?: string[];
  total_points?: number;
  followers_count?: number;
  following_count?: number;
  avatar_url?: string;
  
  // Extended fields for Master Explorer system
  roles?: string[];
  highest_role?: string;
  is_master_explorer?: boolean;
  expertise_areas?: string[];
  specialization?: string;
  credentials?: string;
}
