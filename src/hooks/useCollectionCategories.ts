
import { useMemo } from 'react';
import { CollectionWithTranslations } from '@/types/collections';

export const useCollectionCategories = (collections: CollectionWithTranslations[] | undefined) => {
  const categorizedCollections = useMemo(() => {
    if (!collections) {
      return {
        featured: [],
        cultures: [],
        periods: [],
        others: []
      };
    }

    const featured = collections.filter(c => c.is_featured);
    
    // Logique de catégorisation basée sur les slugs réels de la BDD
    const cultures = collections.filter(c => {
      const slug = c.slug.toLowerCase();
      return slug.includes('viking') || 
             slug.includes('egypt') || 
             slug.includes('celtic') || 
             slug.includes('maya') || 
             slug.includes('chinese') ||
             slug.includes('greek') ||
             slug.includes('roman') ||
             slug.includes('japanese') ||
             slug.includes('african');
    });
    
    const periods = collections.filter(c => {
      const slug = c.slug.toLowerCase();
      return slug.includes('medieval') || 
             slug.includes('renaissance') || 
             slug.includes('ancient') || 
             slug.includes('modern') ||
             slug.includes('da-vinci') ||
             slug.includes('fibonacci') ||
             slug.includes('golden-ratio');
    });
    
    // Sciences et ésotérisme - nouvelle catégorie pour les collections existantes
    const sciences = collections.filter(c => {
      const slug = c.slug.toLowerCase();
      return slug.includes('alchemy') || 
             slug.includes('geometry') || 
             slug.includes('sacred') || 
             slug.includes('fibonacci') ||
             slug.includes('mandala') ||
             slug.includes('chakra') ||
             slug.includes('astro');
    });
    
    // Autres collections qui ne rentrent pas dans les catégories précédentes
    const others = collections.filter(c => 
      !c.is_featured && 
      !cultures.some(culture => culture.id === c.id) &&
      !periods.some(period => period.id === c.id) &&
      !sciences.some(science => science.id === c.id)
    );

    return { featured, cultures, periods, sciences, others };
  }, [collections]);

  return categorizedCollections;
};
