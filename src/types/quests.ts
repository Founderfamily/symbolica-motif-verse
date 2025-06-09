
export interface TreasureQuest {
  id: string;
  title: string;
  description?: string;
  story_background?: string;
  quest_type: 'templar' | 'lost_civilization' | 'grail' | 'custom';
  difficulty_level: 'beginner' | 'intermediate' | 'expert' | 'master';
  max_participants: number;
  min_participants: number;
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  start_date?: string;
  end_date?: string;
  reward_points: number;
  special_rewards: any[];
  clues: QuestClue[];
  target_symbols: string[];
  created_by?: string;
  created_at: string;
  updated_at: string;
  translations: {
    en: any;
    fr: any;
  };
}

export interface QuestClue {
  id: number;
  title: string;
  description: string;
  hint: string;
  location?: {
    latitude: number;
    longitude: number;
    radius: number;
  };
  symbol_reference?: string;
  validation_type: 'location' | 'symbol' | 'photo' | 'code';
  validation_data: any;
  points: number;
  unlock_condition?: string;
}

export interface QuestParticipant {
  id: string;
  quest_id: string;
  user_id: string;
  team_name?: string;
  role: 'leader' | 'member' | 'observer';
  joined_at: string;
  status: 'active' | 'left' | 'completed';
}

export interface QuestProgress {
  id: string;
  quest_id: string;
  user_id: string;
  clue_index: number;
  discovered_at: string;
  discovery_data: any;
  validated: boolean;
  validated_by?: string;
  points_earned: number;
}

export interface QuestTeam {
  id: string;
  quest_id: string;
  team_name: string;
  leader_id: string;
  created_at: string;
  team_color: string;
  team_motto?: string;
  members?: QuestParticipant[];
}

export interface QuestReward {
  id: string;
  quest_id: string;
  user_id: string;
  reward_type: 'points' | 'badge' | 'title' | 'item';
  reward_data: any;
  awarded_at: string;
  claimed: boolean;
}
