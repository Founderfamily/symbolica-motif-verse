


export interface UserProfile {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url?: string | null;
  is_admin?: boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
  contributions_count?: number;
  symbols_count?: number;
  verified_uploads?: number;
  favorite_cultures?: string[] | null;
  bio?: string | null;
  location?: string | null;
  website?: string | null;
  email_verified?: boolean | null;
  // Add missing properties for compatibility
  email?: string | null;
  user_metadata?: Record<string, any> | null;
  is_banned?: boolean;
  // Social features from userService
  followers_count?: number;
  following_count?: number;
  // Admin features
  total_points?: number;
  last_activity?: string | null;
}

export interface AuthState {
  isLoading: boolean;
  user: UserProfile | null;
  error: string | null;
}


