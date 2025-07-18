
import { useMemo } from 'react';
import { CollectionWithTranslations } from '../types/collections';
import { useStandardizedCategories } from './useStandardizedCategories';

export const useCollectionCategories = (collections: CollectionWithTranslations[] | undefined) => {
  // Utiliser la nouvelle taxonomie standardisée
  const standardizedCategories = useStandardizedCategories(collections);
  
  const categorizedCollections = useMemo(() => {
    console.log('🏷️ Categorizing collections with standardized taxonomy:', collections?.length || 0);
    
    // Guard pour éviter les erreurs si collections est undefined ou null
    if (!collections || !Array.isArray(collections) || collections.length === 0) {
      console.log('⚠️ No collections to categorize');
      return {
        featured: [],
        cultures: [],
        periods: [],
        sciences: [],
        others: []
      };
    }

    // Récupérer les collections featured (avec leur statut réel de la base)
    const featured = collections.filter(c => c?.is_featured === true);
    console.log('✨ Featured collections:', featured.length);
    
    // Utilisation de la taxonomie standardisée mondiale
    const cultures = standardizedCategories.categorizedCollections.geographic.flatMap(g => g.collections);
    const periods = standardizedCategories.categorizedCollections.temporal.flatMap(g => g.collections);
    const sciences = standardizedCategories.categorizedCollections.thematic.flatMap(g => g.collections);
    
    // Collections non catégorisées selon les standards mondiaux
    const others = standardizedCategories.categorizedCollections.uncategorized;

    console.log('📊 Standardized categorization results:', {
      featured: featured.length,
      cultures: cultures.length,
      periods: periods.length,
      sciences: sciences.length,
      others: others.length,
      conformityStats: standardizedCategories.getConformityStats()
    });

    return { 
      featured, 
      cultures, 
      periods, 
      sciences, 
      others,
      // Ajout des données de conformité aux standards mondiaux
      standardizedData: standardizedCategories
    };
  }, [collections, standardizedCategories]);

  return categorizedCollections;
};
