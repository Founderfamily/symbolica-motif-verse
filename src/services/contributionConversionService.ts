
import { supabase } from '@/integrations/supabase/client';

export interface ConversionResult {
  contribution_id: string;
  symbol_id: string;
  collection_found: boolean;
}

/**
 * Service pour gérer la conversion des contributions en symboles
 */
export const contributionConversionService = {
  /**
   * Convertit manuellement une contribution approuvée en symbole
   */
  convertContributionToSymbol: async (contributionId: string): Promise<string | null> => {
    console.log('🔄 [ConversionService] Converting contribution:', contributionId);
    
    try {
      const { data, error } = await supabase.rpc('convert_contribution_to_symbol', {
        p_contribution_id: contributionId
      });

      if (error) {
        console.error('❌ [ConversionService] Error converting contribution:', error);
        throw error;
      }

      console.log('✅ [ConversionService] Contribution converted to symbol:', data);
      return data;
    } catch (error) {
      console.error('💥 [ConversionService] Failed to convert contribution:', error);
      throw error;
    }
  },

  /**
   * Traite toutes les contributions approuvées existantes qui n'ont pas encore été converties
   */
  processExistingApprovedContributions: async (): Promise<ConversionResult[]> => {
    console.log('🔄 [ConversionService] Processing existing approved contributions...');
    
    try {
      const { data, error } = await supabase.rpc('process_existing_approved_contributions');

      if (error) {
        console.error('❌ [ConversionService] Error processing existing contributions:', error);
        throw error;
      }

      console.log('✅ [ConversionService] Processed contributions:', data);
      return data || [];
    } catch (error) {
      console.error('💥 [ConversionService] Failed to process existing contributions:', error);
      throw error;
    }
  },

  /**
   * Récupère les contributions approuvées qui n'ont pas encore été converties
   */
  getApprovedContributionsNotConverted: async () => {
    console.log('📋 [ConversionService] Getting approved contributions not converted...');
    
    try {
      const { data, error } = await supabase
        .from('user_contributions')
        .select(`
          id,
          title,
          cultural_context,
          period,
          description,
          created_at,
          reviewed_at,
          profiles:user_id (
            username,
            full_name
          )
        `)
        .eq('status', 'approved');

      if (error) {
        console.error('❌ [ConversionService] Error fetching contributions:', error);
        throw error;
      }

      // Filtrer celles qui n'ont pas encore été converties (côté client car plus flexible)
      const notConvertedContributions = [];
      
      for (const contribution of data || []) {
        const { data: existingSymbol } = await supabase
          .from('symbols')
          .select('id')
          .eq('name', contribution.title)
          .eq('culture', contribution.cultural_context)
          .single();
          
        if (!existingSymbol) {
          notConvertedContributions.push(contribution);
        }
      }

      console.log('✅ [ConversionService] Found non-converted contributions:', notConvertedContributions.length);
      return notConvertedContributions;
    } catch (error) {
      console.error('💥 [ConversionService] Failed to get non-converted contributions:', error);
      throw error;
    }
  }
};
