
export interface Collection {
  id: string;
  slug: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
  is_featured: boolean;
}

export interface CollectionTranslation {
  id: number;
  collection_id: string;
  language: string;
  title: string;
  description?: string;
}

export interface CollectionSymbol {
  collection_id: string;
  symbol_id: string;
  position: number;
}

export interface CollectionWithTranslations extends Collection {
  collection_translations: CollectionTranslation[];
}

export interface CollectionDetails extends CollectionWithTranslations {
  collection_symbols: {
    position: number;
    symbol_id: string;
    symbols: {
      id: string;
      name: string;
      culture: string;
      period: string;
      description?: string;
      created_at?: string;
      updated_at?: string;
      medium?: string[] | null;
      technique?: string[] | null;
      function?: string[] | null;
      translations?: any;
    };
  }[];
}

export interface CreateCollectionData {
  slug: string;
  is_featured?: boolean;
  translations: {
    fr: { title: string; description?: string };
    en: { title: string; description?: string };
  };
  symbol_ids?: string[];
}
