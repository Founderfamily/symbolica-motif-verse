
import { useMemo } from 'react';
import { useQuests } from '@/hooks/useQuests';
import { geolocationService } from '@/services/geolocationService';
import { TreasureQuest } from '@/types/quests';

export interface EnhancedQuestFilters {
  searchTerm: string;
  filterType: string;
  filterDifficulty: string;
  filterCountry: string;
  filterRegion: string;
  filterCity: string;
  filterZone: string;
}

export const useEnhancedQuests = (filters: EnhancedQuestFilters) => {
  const { data: allQuests, isLoading, error, refetch } = useQuests();

  // Enrichir les quêtes avec les données géographiques
  const enrichedQuests = useMemo(() => {
    if (!allQuests) return [];
    
    console.log('🔍 Enriching quests with location data...');
    return allQuests.map(quest => {
      const enrichedQuest = geolocationService.enrichQuestWithLocation(quest);
      console.log(`📍 Quest "${quest.title}" -> ${enrichedQuest.locationData?.region}, ${enrichedQuest.locationData?.city}`);
      return enrichedQuest;
    });
  }, [allQuests]);

  // Filtrer les quêtes enrichies
  const filteredQuests = useMemo(() => {
    if (!enrichedQuests) return [];

    return enrichedQuests.filter(quest => {
      // Filtre de recherche textuelle amélioré
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const searchableText = [
          quest.title,
          quest.description,
          quest.story_background,
          quest.locationData?.region,
          quest.locationData?.city,
          quest.locationData?.country
        ].join(' ').toLowerCase();
        
        if (!searchableText.includes(searchLower)) {
          return false;
        }
      }

      // Filtre par type
      if (filters.filterType !== 'all' && quest.quest_type !== filters.filterType) {
        return false;
      }

      // Filtre par difficulté
      if (filters.filterDifficulty !== 'all' && quest.difficulty_level !== filters.filterDifficulty) {
        return false;
      }

      // Filtre par pays
      if (filters.filterCountry !== 'all') {
        if (filters.filterCountry === 'france' && quest.locationData?.country !== 'France') {
          return false;
        }
        if (filters.filterCountry === 'multi' && quest.locationData?.country === 'France') {
          return false;
        }
      }

      // Filtre par région
      if (filters.filterRegion !== 'all' && quest.locationData?.region !== filters.filterRegion) {
        return false;
      }

      // Filtre par ville
      if (filters.filterCity !== 'all' && quest.locationData?.city !== filters.filterCity) {
        return false;
      }

      // Filtre par zone historique
      if (filters.filterZone !== 'all' && quest.locationData?.zone !== filters.filterZone) {
        return false;
      }

      return true;
    });
  }, [enrichedQuests, filters]);

  // Statistiques des quêtes filtrées
  const questStats = useMemo(() => {
    if (!filteredQuests) return { total: 0, active: 0, byRegion: {}, byCities: {}, byZones: {} };

    const stats = {
      total: filteredQuests.length,
      active: filteredQuests.filter(q => q.status === 'active').length,
      byRegion: {} as Record<string, number>,
      byCities: {} as Record<string, number>,
      byZones: {} as Record<string, number>
    };

    filteredQuests.forEach(quest => {
      // Statistiques par région
      if (quest.locationData?.region) {
        stats.byRegion[quest.locationData.region] = (stats.byRegion[quest.locationData.region] || 0) + 1;
      }

      // Statistiques par ville
      if (quest.locationData?.city && quest.locationData.city !== 'Non spécifiée') {
        stats.byCities[quest.locationData.city] = (stats.byCities[quest.locationData.city] || 0) + 1;
      }

      // Statistiques par zone
      if (quest.locationData?.zone) {
        stats.byZones[quest.locationData.zone] = (stats.byZones[quest.locationData.zone] || 0) + 1;
      }
    });

    return stats;
  }, [filteredQuests]);

  return {
    quests: filteredQuests,
    isLoading,
    error,
    refetch,
    stats: questStats,
    totalQuests: allQuests?.length || 0,
    activeQuests: allQuests?.filter(q => q.status === 'active') || []
  };
};
