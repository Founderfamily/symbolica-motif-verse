import { useState, useEffect, useCallback } from 'react';
import { aiDataExtractionService, AIExtractedData } from '@/services/AIDataExtractionService';
import { getMockHistoricalFigures, getMockAIInsights } from './useQuestMockData';

export const useAIData = (questId: string) => {
  const [data, setData] = useState<AIExtractedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const aiData = await aiDataExtractionService.extractAIData(questId);
        
        // Enrichir avec des données réalistes si les données IA sont vides
        if (aiData.historicalFigures.length === 0) {
          aiData.historicalFigures = getMockHistoricalFigures(questId);
        }
        if (aiData.insights.length === 0) {
          aiData.insights = getMockAIInsights(questId);
        }
        
        if (mounted) {
          setData(aiData);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Erreur lors du chargement des données IA');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    if (questId) {
      loadData();
    }

    return () => {
      mounted = false;
    };
  }, [questId]);

  const refetch = useCallback(async () => {
    if (questId) {
      setLoading(true);
      try {
        const aiData = await aiDataExtractionService.extractAIData(questId);
        
        // Enrichir avec des données réalistes si les données IA sont vides
        if (aiData.historicalFigures.length === 0) {
          aiData.historicalFigures = getMockHistoricalFigures(questId);
        }
        if (aiData.insights.length === 0) {
          aiData.insights = getMockAIInsights(questId);
        }
        
        setData(aiData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors du rechargement');
      } finally {
        setLoading(false);
      }
    }
  }, [questId]);

  return {
    data,
    loading,
    error,
    refetch,
    historicalFigures: data?.historicalFigures || [],
    locations: data?.locations || [],
    connections: data?.connections || [],
    theories: data?.theories || [],
    sources: data?.sources || [],
    insights: data?.insights || []
  };
};