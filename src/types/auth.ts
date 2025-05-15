
export interface UserProfile {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  is_admin: boolean | null;
  created_at: string | null;
  updated_at: string | null;
  contributions_count: number;
  symbols_count: number;
  verified_uploads: number;
  favorite_cultures: string[] | null;
}

export interface AuthState {
  isLoading: boolean;
  user: UserProfile | null;
  error: string | null;
}
