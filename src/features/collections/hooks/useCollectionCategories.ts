
import { useMemo } from 'react';
import { CollectionWithTranslations } from '../types/collections';

export const useCollectionCategories = (collections: CollectionWithTranslations[] | undefined) => {
  const categorizedCollections = useMemo(() => {
    console.log('🏷️ Categorizing collections:', collections?.length || 0);
    
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
    
    // Logique de catégorisation améliorée basée sur les slugs de la BDD
    const cultures = collections.filter(c => {
      const slug = c?.slug?.toLowerCase() || '';
      return slug.includes('culture-') ||
             slug.includes('egyptien') || 
             slug.includes('chinois') || 
             slug.includes('celtique') || 
             slug.includes('maya') || 
             slug.includes('grec') ||
             slug.includes('romain') ||
             slug.includes('japonais') ||
             slug.includes('africain') ||
             slug.includes('nordique') ||
             slug.includes('viking') ||
             slug.includes('arabe') ||
             slug.includes('perse') ||
             slug.includes('indien') ||
             slug.includes('azteque') ||
             slug.includes('aborigene');
    });
    
    const periods = collections.filter(c => {
      const slug = c?.slug?.toLowerCase() || '';
      return slug.includes('medieval') || 
             slug.includes('renaissance') || 
             slug.includes('ancien') || 
             slug.includes('moderne') ||
             slug.includes('antique') ||
             slug.includes('epoque') ||
             slug.includes('prehistoire') ||
             slug.includes('contemporain') ||
             slug.includes('baroque') ||
             slug.includes('classique');
    });
    
    // Sciences et ésotérisme
    const sciences = collections.filter(c => {
      const slug = c?.slug?.toLowerCase() || '';
      return slug.includes('alchimie') || 
             slug.includes('geometrie') || 
             slug.includes('sacre') || 
             slug.includes('fibonacci') ||
             slug.includes('mandala') ||
             slug.includes('chakra') ||
             slug.includes('astro') ||
             slug.includes('mathematique') ||
             slug.includes('science') ||
             slug.includes('mystique') ||
             slug.includes('esoter') ||
             slug.includes('spirituel') ||
             slug.includes('mystere') ||
             slug.includes('numerologie');
    });
    
    // Autres collections qui ne rentrent pas dans les catégories précédentes
    const others = collections.filter(c => 
      c?.is_featured !== true && 
      !cultures.some(culture => culture.id === c.id) &&
      !periods.some(period => period.id === c.id) &&
      !sciences.some(science => science.id === c.id)
    );

    console.log('📊 Categorization results:', {
      featured: featured.length,
      cultures: cultures.length,
      periods: periods.length,
      sciences: sciences.length,
      others: others.length
    });

    return { featured, cultures, periods, sciences, others };
  }, [collections]);

  return categorizedCollections;
};
