export interface UserProfile {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url?: string | null;
  bio?: string | null;
  location?: string | null;
  website?: string | null;
  profession?: string | null;
  company?: string | null;
  is_admin?: boolean | null;
  is_banned?: boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
  contributions_count?: number;
  symbols_count?: number;
  total_points?: number;
  followers_count?: number;
  following_count?: number;
  verified_uploads?: number;
  favorite_cultures?: string[] | null;
  email_verified?: boolean | null;
  email?: string | null;
  user_metadata?: Record<string, any> | null;
  last_activity?: string | null;
}

export interface AuthState {
  isLoading: boolean;
  user: UserProfile | null;
  error: string | null;
}