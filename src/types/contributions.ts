
import { Database, Json } from '@/integrations/supabase/types';

// Types pour les contributions utilisateur
export interface UserContribution {
  id: string;
  user_id: string;
  status: 'pending' | 'approved' | 'rejected';
  title: string;
  description: string | null;
  location_name: string | null;
  latitude: number | null;
  longitude: number | null;
  cultural_context: string | null;
  period: string | null;
  created_at: string;
  updated_at: string;
  reviewed_by: string | null;
  reviewed_at: string | null;
  // Nouveaux champs pour la validation avancée
  significance?: string | null;
  historical_context?: string | null;
  sources?: any[] | null;
  tags?: string[] | null;
  validator_id?: string | null;
  validator_comments?: string | null;
  validation_score?: number | null;
  revision_requested?: boolean | null;
  community_score?: number | null;
  // Champs de traduction
  title_translations?: { [key: string]: string | null } | null;
  description_translations?: { [key: string]: string | null } | null;
  location_name_translations?: { [key: string]: string | null } | null;
  cultural_context_translations?: { [key: string]: string | null } | null;
  period_translations?: { [key: string]: string | null } | null;
}

// Types pour les images de contribution
export interface ContributionImage {
  id: string;
  contribution_id: string;
  image_url: string;
  image_type: 'original' | 'pattern' | 'analysis' | 'extract';
  annotations: any | null;
  extracted_pattern_url: string | null;
  created_at: string;
}

// Types pour les tags de contribution
export interface ContributionTag {
  id: string;
  contribution_id: string;
  tag: string;
  created_at: string;
  // Champ de traduction
  tag_translations?: { [key: string]: string | null } | null;
}

// Types pour les commentaires de contribution
export interface ContributionComment {
  id: string;
  contribution_id: string;
  user_id: string;
  comment: string;
  created_at: string;
  // Champ de traduction
  comment_translations?: { [key: string]: string | null } | null;
  profiles?: {
    username: string;
    full_name: string;
  };
}

// Type pour une contribution complète avec ses images, tags et commentaires
export interface CompleteContribution extends Omit<UserContribution, 'tags'> {
  images: ContributionImage[];
  tags: ContributionTag[];
  comments: ContributionComment[];
  user_profile?: {
    username: string;
    full_name: string;
  };
  profiles?: {
    username: string;
    full_name: string;
  };
}

// Additional types for profile components
export interface Report {
  id: string;
  source_id: string;
  user_id: string;
  category_id: string;
  reason: string;
  evidence_url?: string;
  status: string;
  resolution_notes?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  created_at: string;
  profiles?: {
    username: string;
    full_name: string;
  };
  user_contributions?: {
    title: string;
    status: string;
  };
}

export interface ProfileNotification {
  id: string;
  user_id: string;
  group_id?: string;
  notification_type: string;
  entity_id?: string;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  created_by?: string;
  profiles?: {
    username: string;
    full_name: string;
  };
}

export interface CommunityMembership {
  id: string;
  group_id: string;
  user_id: string;
  role: string;
  joined_at: string;
  interest_groups: {
    id: string;
    name: string;
    slug: string;
    description?: string;
    icon?: string;
    members_count: number;
    is_public: boolean;
  };
}

// Type pour le formulaire de création de contribution
export interface ContributionFormData {
  title: string;
  description: string;
  location_name: string;
  latitude: number | null;
  longitude: number | null;
  cultural_context: string;
  period: string;
  contribution_type?: string;
  tags: string[];
  // Nouveaux champs pour la proposition de symboles
  significance?: string;
  historical_context?: string;
  sources?: Array<{
    title: string;
    url: string;
    type: 'book' | 'article' | 'website' | 'museum' | 'other';
    author?: string;
    year?: string;
  }>;
}

// Types pour les nouvelles fonctionnalités
export interface ContributionRevision {
  id: string;
  contribution_id: string;
  validator_id: string;
  revision_type: 'content' | 'sources' | 'images' | 'classification';
  requested_changes: string;
  status: 'pending' | 'addressed' | 'dismissed';
  created_at: string;
  updated_at: string;
}

export interface ContributionVote {
  id: string;
  contribution_id: string;
  user_id: string;
  vote_type: 'approve' | 'reject' | 'needs_work';
  comment?: string;
  created_at: string;
}

// Type pour les rôles utilisateur étendus
export type AppRole = 'admin' | 'symbol_validator' | 'user' | 'banned' | 'master_explorer';
