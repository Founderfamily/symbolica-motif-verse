
export interface QuestDocument {
  id: string;
  quest_id: string;
  title: string;
  description?: string;
  document_type: string; // Changed from union type to string to match DB
  document_url?: string;
  source?: string;
  date_created?: string;
  author?: string;
  credibility_score: number;
  uploaded_by?: string;
  created_at: string;
  updated_at: string;
  translations: {
    en: any;
    fr: any;
  };
}

export interface QuestEvidence {
  id: string;
  quest_id: string;
  clue_index?: number;
  submitted_by: string;
  evidence_type: string; // Changed from union type to string to match DB
  title: string;
  description?: string;
  image_url?: string;
  latitude?: number;
  longitude?: number;
  location_name?: string;
  validation_status: string; // Changed from union type to string to match DB
  validation_score: number;
  validation_count: number;
  created_at: string;
  updated_at: string;
  metadata: any;
}

export interface EvidenceValidation {
  id: string;
  evidence_id: string;
  validator_id: string;
  vote_type: string; // Changed from union type to string to match DB
  expertise_level: string; // Changed from union type to string to match DB
  comment?: string;
  confidence_score: number;
  created_at: string;
}

export interface QuestDiscussion {
  id: string;
  quest_id: string;
  clue_index?: number;
  location_id?: string;
  topic_type: string; // Changed from union type to string to match DB
  title: string;
  created_by: string;
  pinned: boolean;
  locked: boolean;
  replies_count: number;
  last_activity_at: string;
  created_at: string;
  updated_at: string;
}

export interface QuestDiscussionReply {
  id: string;
  discussion_id: string;
  author_id: string;
  content: string;
  reply_to_id?: string;
  likes_count: number;
  created_at: string;
  updated_at: string;
}

export interface QuestTheory {
  id: string;
  quest_id: string;
  author_id: string;
  title: string;
  description: string;
  theory_type: string; // Changed from union type to string to match DB
  supporting_evidence: string[];
  confidence_level: number;
  community_score: number;
  votes_count: number;
  status: string; // Changed from union type to string to match DB
  created_at: string;
  updated_at: string;
}

export interface QuestLocation {
  id: string;
  quest_id: string;
  name: string;
  description?: string;
  latitude: number;
  longitude: number;
  location_type: string; // Changed from union type to string to match DB
  historical_significance?: string;
  current_status: string; // Changed from union type to string to match DB
  images: string[];
  sources: any[];
  added_by?: string;
  verified: boolean;
  verified_by?: string;
  created_at: string;
  updated_at: string;
}

export interface UserExpertise {
  id: string;
  user_id: string;
  expertise_area: string;
  level: string; // Changed from union type to string to match DB
  credentials?: string;
  verified: boolean;
  verified_by?: string;
  created_at: string;
}
