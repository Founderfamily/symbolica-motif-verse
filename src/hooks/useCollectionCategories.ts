
import { useMemo } from 'react';
import { CollectionWithTranslations } from '@/types/collections';

export const useCollectionCategories = (collections: CollectionWithTranslations[] | undefined) => {
  const categorizedCollections = useMemo(() => {
    if (!collections) {
      return {
        featured: [],
        cultures: [],
        periods: [],
        sciences: [],
        others: []
      };
    }

    const featured = collections.filter(c => c.is_featured);
    
    // Logique de catégorisation basée sur les vrais slugs de la BDD
    const cultures = collections.filter(c => {
      const slug = c.slug.toLowerCase();
      return slug.includes('culture-') || 
             slug.includes('egyptienne') || 
             slug.includes('chinoise') || 
             slug.includes('celtique') || 
             slug.includes('maya') || 
             slug.includes('grecque') ||
             slug.includes('romaine') ||
             slug.includes('japonaise') ||
             slug.includes('africaine') ||
             slug.includes('nordique') ||
             slug.includes('viking');
    });
    
    const periods = collections.filter(c => {
      const slug = c.slug.toLowerCase();
      return slug.includes('medieval') || 
             slug.includes('renaissance') || 
             slug.includes('ancien') || 
             slug.includes('moderne') ||
             slug.includes('antique') ||
             slug.includes('epoque');
    });
    
    // Sciences et ésotérisme
    const sciences = collections.filter(c => {
      const slug = c.slug.toLowerCase();
      return slug.includes('alchimie') || 
             slug.includes('geometrie') || 
             slug.includes('sacre') || 
             slug.includes('fibonacci') ||
             slug.includes('mandala') ||
             slug.includes('chakra') ||
             slug.includes('astro') ||
             slug.includes('mathematique') ||
             slug.includes('science');
    });
    
    // Autres collections qui ne rentrent pas dans les catégories précédentes
    const others = collections.filter(c => 
      !c.is_featured && 
      !cultures.some(culture => culture.id === c.id) &&
      !periods.some(period => period.id === c.id) &&
      !sciences.some(science => science.id === c.id)
    );

    console.log('Categorization results:', {
      total: collections.length,
      featured: featured.length,
      cultures: cultures.length,
      periods: periods.length,
      sciences: sciences.length,
      others: others.length,
      cultureSlugs: cultures.map(c => c.slug),
      featuredSlugs: featured.map(c => c.slug)
    });

    return { featured, cultures, periods, sciences, others };
  }, [collections]);

  return categorizedCollections;
};
