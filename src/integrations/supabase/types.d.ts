
export type SymbolData = {
  id: string;
  name: string;
  culture: string;
  period: string;
  description: string | null;
  created_at: string;
  updated_at: string;
};

export type SymbolImage = {
  id: string;
  symbol_id: string;
  image_url: string;
  image_type: 'original' | 'pattern' | 'reuse';
  title: string | null;
  description: string | null;
  created_at: string;
};

export type Profile = {
  id: string;
  username: string | null;
  full_name: string | null;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
};

export type Database = {
  public: {
    Tables: {
      symbols: {
        Row: SymbolData;
        Insert: Omit<SymbolData, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<SymbolData, 'id' | 'created_at' | 'updated_at'>>;
      };
      symbol_images: {
        Row: SymbolImage;
        Insert: Omit<SymbolImage, 'id' | 'created_at'>;
        Update: Partial<Omit<SymbolImage, 'id' | 'created_at'>>;
      };
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
  };
};
