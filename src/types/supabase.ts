
import { Json } from '@/integrations/supabase/types';

// Custom type definitions for Supabase data
export interface SymbolData {
  id: string;
  name: string;
  culture: string;
  period: string;
  description: string | null;
  created_at: string | null;
  updated_at: string | null;
  medium?: string[] | null;
  technique?: string[] | null;
  function?: string[] | null;
  // Nouvelles colonnes ajoutées
  significance?: string | null;
  historical_context?: string | null;
  related_symbols?: string[] | null;
  tags?: string[] | null;
  // Champs taxonomiques UNESCO
  cultural_taxonomy_code?: string | null;
  temporal_taxonomy_code?: string | null;
  thematic_taxonomy_codes?: string[] | null;
  sources?: Array<{
    title: string;
    url: string;
    type: string;
  }> | Json | null;
  translations?: {
    [language: string]: {
      name: string;
      culture: string;
      period: string;
      description?: string;
    };
  } | Json | null;
}

export interface SymbolImage {
  id: string;
  symbol_id: string;
  image_url: string;
  image_type: 'original' | 'pattern' | 'reuse';
  title: string | null;
  description: string | null;
  created_at: string | null;
  updated_at: string | null;
  uploaded_by: string | null;
  // New fields
  location: string | null;
  source: string | null;
  tags: string[] | null;
  is_primary?: boolean | null;
  translations?: {
    [language: string]: {
      title?: string;
      description?: string;
    };
  } | Json | null;
}

export interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
  is_admin: boolean | null;
  created_at: string | null;
  updated_at: string | null;
  avatar_url: string | null;
  location: string | null;
  website: string | null;
  bio: string | null;
  profession: string | null;
  company: string | null;
}
