
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

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

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

// Utility function to wait
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Retry wrapper function
const withRetry = async <T>(fn: () => Promise<T>, retries = MAX_RETRIES, delay = RETRY_DELAY): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) throw error;
    console.log(`Operation failed, retrying... (${MAX_RETRIES - retries + 1}/${MAX_RETRIES})`);
    await wait(delay);
    return withRetry(fn, retries - 1, delay * 1.5); // Exponential backoff
  }
};

export const symbolGeolocationService = {
  /**
   * Get all symbol locations
   */
  getAllLocations: async (): Promise<SymbolLocation[]> => {
    try {
      console.log("Fetching all symbol locations from database");
      const result = await withRetry(async () => {
        const { data, error } = await supabase
          .from('symbol_locations')
          .select('*');
          
        if (error) {
          console.error("Supabase error:", error);
          throw error;
        }
        
        return data as SymbolLocation[];
      });
      
      console.log(`Successfully retrieved ${result.length} symbol locations`);
      return result;
    } catch (error) {
      console.error("Error fetching symbol locations:", error);
      toast({
        title: "Error",
        description: "Failed to load map data. Please try again later.",
        variant: "destructive",
      });
      return [];
    }
  },
  
  /**
   * Get locations for a specific symbol
   */
  getLocationsForSymbol: async (symbolId: string): Promise<SymbolLocation[]> => {
    try {
      console.log(`Fetching locations for symbol ${symbolId}`);
      return await withRetry(async () => {
        const { data, error } = await supabase
          .from('symbol_locations')
          .select('*')
          .eq('symbol_id', symbolId);
          
        if (error) throw error;
        return data as SymbolLocation[];
      });
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
      return await withRetry(async () => {
        const { data, error } = await supabase
          .from('symbol_locations')
          .insert(location)
          .select()
          .single();
          
        if (error) throw error;
        return data as SymbolLocation;
      });
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
      return await withRetry(async () => {
        const { error } = await supabase
          .from('symbol_locations')
          .update(updates)
          .eq('id', id);
          
        if (error) throw error;
        return true;
      });
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
      return await withRetry(async () => {
        const { error } = await supabase
          .from('symbol_locations')
          .delete()
          .eq('id', id);
          
        if (error) throw error;
        return true;
      });
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
      console.log("Fetching locations grouped by region");
      // Get all locations
      const locations = await symbolGeolocationService.getAllLocations();
      
      // Group by culture (as region)
      const groupedLocations: Record<string, SymbolLocation[]> = {};
      
      locations.forEach(location => {
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
