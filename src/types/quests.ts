
export interface TreasureQuest {
  id: string;
  title: string;
  description?: string;
  story_background?: string;
  quest_type: 'myth' | 'found_treasure' | 'unfound_treasure';
  difficulty_level: 'beginner' | 'intermediate' | 'expert' | 'master';
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  start_date?: string;
  end_date?: string;
  special_rewards: any[];
  clues: QuestClue[];
  target_symbols: string[];
  created_by?: string;
  created_at: string;
  updated_at: string;
  // Nouvelles propriétés pour la collaboration IA
  ai_research_enabled?: boolean;
  collaboration_type?: 'open' | 'restricted' | 'expert_only';
  clue_submission_enabled?: boolean;
  ai_clue_suggestions?: any[];
  research_status?: 'active' | 'solved' | 'paused' | 'archived';
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
  unlock_condition?: string;
  // Nouvelles propriétés pour la collaboration
  submitted_by?: string;
  verified_by?: string;
  credibility_score?: number;
  ai_suggested?: boolean;
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
