
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

    // Temporairement, marquer certaines collections comme featured si elles ne le sont pas encore
    const collectionsWithTempFeatured = collections.map(c => {
      if (['culture-egyptienne', 'culture-chinoise', 'culture-celtique'].includes(c.slug)) {
        return { ...c, is_featured: true };
      }
      return c;
    });

    const featured = collectionsWithTempFeatured.filter(c => c.is_featured);
    
    // Logique de catégorisation basée sur les vrais slugs de la BDD
    const cultures = collections.filter(c => {
      const slug = c.slug.toLowerCase();
      return slug.startsWith('culture-') ||
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
      const slug = c.slug.toLowerCase();
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
      const slug = c.slug.toLowerCase();
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
      allSlugs: collections.map(c => c.slug),
      cultureSlugs: cultures.map(c => c.slug),
      featuredSlugs: featured.map(c => c.slug)
    });

    return { featured, cultures, periods, sciences, others };
  }, [collections]);

  return categorizedCollections;
};
