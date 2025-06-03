
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
  // Add missing properties for static data compatibility
  significance?: string | null;
  historical_context?: string | null;
  related_symbols?: string[] | null;
  tags?: string[] | null;
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
  // New fields
  location: string | null;
  source: string | null;
  tags: string[] | null;
  // Add missing property for static data compatibility
  uploaded_by?: string | null;
  updated_at?: string | null;
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
}
