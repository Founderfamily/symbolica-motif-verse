
// Define the Symbol type for the application
export interface SymbolFormData {
  id?: string;
  name: string;
  description: string;
  culture: string;
  period: string;
  images?: File[];
  techniques?: string[];
  functions?: string[];
  mediums?: string[];
  location?: {
    latitude: number;
    longitude: number;
    name: string;
  } | null;
  translations?: Record<string, Partial<{
    name: string;
    description: string;
    culture: string;
    period: string;
    medium: string[];
    technique: string[];
    function: string[];
  }>>;
}

export interface Symbol extends SymbolFormData {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  translations?: Record<string, Partial<{
    name: string;
    description: string;
    culture: string;
    period: string;
    medium: string[];
    technique: string[];
    function: string[];
  }>>;
}
