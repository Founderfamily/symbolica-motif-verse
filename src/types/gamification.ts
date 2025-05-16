
import { Database } from '@/integrations/supabase/types';

export type AchievementType = 'contribution' | 'exploration' | 'validation' | 'community';
export type AchievementLevel = 'bronze' | 'silver' | 'gold' | 'platinum';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  type: AchievementType;
  level: AchievementLevel;
  requirement: number;
  created_at: string | null;
  updated_at: string | null;
  translations?: {
    [language: string]: {
      name: string;
      description: string;
    };
  } | null;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  earned_at: string;
  progress: number;
  completed: boolean;
  created_at: string | null;
  updated_at: string | null;
  achievement?: Achievement;
}

export interface UserPoints {
  id: string;
  user_id: string;
  total: number;
  contribution_points: number;
  exploration_points: number;
  validation_points: number;
  community_points: number;
  created_at: string | null;
  updated_at: string | null;
}

export interface UserActivity {
  id: string;
  user_id: string;
  activity_type: string;
  entity_id: string | null;
  points_earned: number;
  created_at: string;
  details?: any;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_type: string;
  badge_name: string;
  awarded_at: string;
  created_at: string | null;
}

export interface UserLevel {
  id: string;
  user_id: string;
  level: number;
  xp: number;
  next_level_xp: number;
  created_at: string | null;
  updated_at: string | null;
}
