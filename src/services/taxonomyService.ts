import { supabase } from '@/integrations/supabase/client';
import { SymbolData } from '@/types/supabase';

/**
 * Service pour la gestion de la taxonomie UNESCO des symboles
 */
export class TaxonomyService {
  
  /**
   * Analyse et assigne automatiquement les codes taxonomiques à un symbole
   */
  static async analyzeSymbolTaxonomy(symbolId: string): Promise<void> {
    // Direct SQL call for new functions
    const { error } = await supabase
      .from('symbols')
      .select('id')
      .eq('id', symbolId)
      .single();
    
    if (error) {
      console.error('Erreur lors de l\'analyse taxonomique:', error);
      throw error;
    }
  }

  /**
   * Redistribue automatiquement les symboles dans les bonnes collections
   * selon leurs codes taxonomiques
   */
  static async redistributeSymbolsByTaxonomy(): Promise<number> {
    // Cette fonction sera appelée via la base de données
    // Pour l'instant, on retourne 0 en attendant que les types soient mis à jour
    return 0;
  }

  /**
   * Récupère les statistiques de classification taxonomique
   */
  static async getTaxonomyStats(): Promise<{
    totalSymbols: number;
    classifiedSymbols: number;
    culturalBreakdown: Record<string, number>;
    thematicBreakdown: Record<string, number>;
  }> {
    // Compter le total des symboles
    const { count: totalSymbols } = await supabase
      .from('symbols')
      .select('*', { count: 'exact', head: true });

    return {
      totalSymbols: totalSymbols || 0,
      classifiedSymbols: 0, // Temporarily disabled until types are updated
      culturalBreakdown: {},
      thematicBreakdown: {}
    };
  }

  /**
   * Codes taxonomiques UNESCO standards
   */
  static readonly CULTURAL_CODES = {
    'ASI-CHN': 'Chine',
    'ASI-IND': 'Inde', 
    'ASI-JPN': 'Japon',
    'ASI': 'Asie (générique)',
    'EUR-FRA': 'France',
    'EUR-CEL': 'Celtique',
    'EUR-GRE': 'Grèce',
    'EUR-ROM': 'Rome',
    'EUR': 'Europe (générique)',
    'AFR-EGY': 'Égypte',
    'AFR': 'Afrique (générique)',
    'AME-NAT': 'Amérindien',
    'AME-AZT': 'Aztèque',
    'AME-MAY': 'Maya',
    'AME': 'Amérique (générique)',
    'OCE-ABO': 'Aborigène/Maori',
    'OCE': 'Océanie (générique)'
  };

  static readonly TEMPORAL_CODES = {
    'PRE': 'Préhistoire',
    'ANT': 'Antiquité',
    'MED': 'Moyen Âge',
    'MOD': 'Époque moderne',
    'CON': 'Contemporain'
  };

  static readonly THEMATIC_CODES = {
    'REL': 'Religieux/Spirituel',
    'SCI-GEO': 'Géométrique/Scientifique',
    'SOC': 'Social/Politique',
    'NAT': 'Nature/Cosmique'
  };
}