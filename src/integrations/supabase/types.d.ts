
import { Database } from './types';

export type SymbolData = Database['public']['Tables']['symbols']['Row'];
export type SymbolImage = Database['public']['Tables']['symbol_images']['Row'];
export type Profile = Database['public']['Tables']['profiles']['Row'];
