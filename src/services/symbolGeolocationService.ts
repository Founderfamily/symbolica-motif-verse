
import { supabase } from '@/integrations/supabase/client';

export interface SymbolLocation {
  id: string;
  symbol_id: string;
  name: string;
  culture: string;
  latitude: number;
  longitude: number;
  description?: string;
  source?: string;
  historical_period?: string;
  is_verified: boolean;
  verification_status: 'unverified' | 'verified' | 'disputed';
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  verified_by?: string;
  translations?: Record<string, any>;
}

export const symbolGeolocationService = {
  /**
   * Get all symbol locations
   */
  getAllLocations: async (): Promise<SymbolLocation[]> => {
    try {
      const { data, error } = await supabase
        .from('symbol_locations')
        .select('*');
        
      if (error) throw error;
      return data as SymbolLocation[];
    } catch (error) {
      console.error("Error fetching symbol locations:", error);
      return [];
    }
  },
  
  /**
   * Get locations for a specific symbol
   */
  getLocationsForSymbol: async (symbolId: string): Promise<SymbolLocation[]> => {
    try {
      const { data, error } = await supabase
        .from('symbol_locations')
        .select('*')
        .eq('symbol_id', symbolId);
        
      if (error) throw error;
      return data as SymbolLocation[];
    } catch (error) {
      console.error(`Error fetching locations for symbol ${symbolId}:`, error);
      return [];
    }
  },
  
  /**
   * Add a new location for a symbol
   */
  addSymbolLocation: async (location: Omit<SymbolLocation, 'id' | 'created_at' | 'updated_at'>): Promise<SymbolLocation | null> => {
    try {
      const { data, error } = await supabase
        .from('symbol_locations')
        .insert(location)
        .select()
        .single();
        
      if (error) throw error;
      return data as SymbolLocation;
    } catch (error) {
      console.error("Error adding symbol location:", error);
      return null;
    }
  },
  
  /**
   * Update a symbol location
   */
  updateSymbolLocation: async (id: string, updates: Partial<SymbolLocation>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('symbol_locations')
        .update(updates)
        .eq('id', id);
        
      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Error updating symbol location ${id}:`, error);
      return false;
    }
  },
  
  /**
   * Delete a symbol location
   */
  deleteSymbolLocation: async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('symbol_locations')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Error deleting symbol location ${id}:`, error);
      return false;
    }
  },

  /**
   * Get locations grouped by region
   */
  getLocationsByRegion: async (): Promise<Record<string, SymbolLocation[]>> => {
    try {
      // Get all locations
      const { data, error } = await supabase
        .from('symbol_locations')
        .select('*')
        .order('culture');
        
      if (error) throw error;
      
      // Group by culture (as region)
      const groupedLocations: Record<string, SymbolLocation[]> = {};
      
      (data as SymbolLocation[]).forEach(location => {
        if (!groupedLocations[location.culture]) {
          groupedLocations[location.culture] = [];
        }
        groupedLocations[location.culture].push(location);
      });
      
      return groupedLocations;
    } catch (error) {
      console.error("Error fetching locations by region:", error);
      return {};
    }
  }
};
