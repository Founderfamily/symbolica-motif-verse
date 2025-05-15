
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
export interface CompleteContribution extends UserContribution {
  images: ContributionImage[];
  tags: ContributionTag[];
  comments: ContributionComment[];
  user_profile?: {
    username: string;
    full_name: string;
  };
  profiles?: any; // Pour la compatibilité avec les résultats de Supabase
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
  tags: string[];
}
