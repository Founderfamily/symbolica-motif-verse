
import { SymbolData } from '@/types/supabase';

export type Proposal = {
  suggestion: Partial<SymbolData> | null;
  collection: any | null;
  isLoading: boolean;
  error: string | null;
};

export type ResultState = {
  symbol: Partial<SymbolData>;
  collection: any;
  error?: string;
};

export type Provider = 'deepseek' | 'openai' | 'anthropic';

