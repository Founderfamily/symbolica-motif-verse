
import { Json } from '@/integrations/supabase/types';

// Types unifiés pour les collections - utilise maintenant uniquement le nouveau système
export interface CollectionWithTranslations {
  id: string;
  slug: string;
  created_by: string | null;
  is_featured: boolean;
  created_at: string | null;
  updated_at: string | null;
  collection_translations: CollectionTranslation[];
}

export interface CollectionTranslation {
  id: number;
  collection_id: string | null;
  language: string;
  title: string;
  description: string | null;
}

export interface CollectionDetails extends CollectionWithTranslations {
  collection_symbols: CollectionSymbol[];
}

export interface CollectionSymbol {
  position: number;
  symbol_id: string;
  symbols: SymbolData;
}

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
  translations?: {
    [language: string]: {
      name: string;
      culture: string;
      period: string;
      description?: string;
    };
  } | Json | null;
}

export interface CollectionItem {
  id: string;
  collection_id: string;
  symbol_id: string;
  added_by: string;
  notes: string | null;
  created_at: string;
  translations?: {
    [language: string]: {
      notes?: string;
    };
  } | Json | null;
}

// Type pour la création de nouvelles collections
export interface CreateCollectionData {
  slug: string;
  created_by?: string | null;
  is_featured?: boolean;
  translations: {
    language: string;
    title: string;
    description?: string;
  }[];
}

// Type pour la mise à jour des collections
export interface UpdateCollectionData {
  slug?: string;
  is_featured?: boolean;
  translations?: {
    id?: number;
    language: string;
    title: string;
    description?: string;
  }[];
}

// Categories de collections
export interface CollectionCategory {
  key: string;
  titleKey: string;
  descriptionKey: string;
  collections: CollectionWithTranslations[];
}
