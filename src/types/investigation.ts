
export interface QuestDocument {
  id: string;
  quest_id: string;
  title: string;
  description?: string;
  document_type: 'historical' | 'map' | 'manuscript' | 'archaeological' | 'photograph';
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
  evidence_type: 'photo' | 'document' | 'location' | 'testimony' | 'artifact';
  title: string;
  description?: string;
  image_url?: string;
  latitude?: number;
  longitude?: number;
  location_name?: string;
  validation_status: 'pending' | 'validated' | 'disputed' | 'rejected';
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
  vote_type: 'validate' | 'dispute' | 'reject';
  expertise_level: 'amateur' | 'enthusiast' | 'expert' | 'academic';
  comment?: string;
  confidence_score: number;
  created_at: string;
}

export interface QuestDiscussion {
  id: string;
  quest_id: string;
  clue_index?: number;
  location_id?: string;
  topic_type: 'clue_analysis' | 'location_theory' | 'evidence_review' | 'general';
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
  theory_type: 'hypothesis' | 'interpretation' | 'connection' | 'solution';
  supporting_evidence: string[];
  confidence_level: number;
  community_score: number;
  votes_count: number;
  status: 'active' | 'archived' | 'debunked' | 'validated';
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
  location_type: 'historical_site' | 'archaeological' | 'landmark' | 'clue_location' | 'discovery_site';
  historical_significance?: string;
  current_status: 'accessible' | 'restricted' | 'private' | 'destroyed' | 'lost';
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
  level: 'amateur' | 'enthusiast' | 'student' | 'professional' | 'expert' | 'academic';
  credentials?: string;
  verified: boolean;
  verified_by?: string;
  created_at: string;
}
