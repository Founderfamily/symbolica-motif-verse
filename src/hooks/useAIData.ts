import { useState, useEffect } from 'react';
import { aiDataExtractionService, AIExtractedData } from '@/services/AIDataExtractionService';

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

  const refetch = async () => {
    if (questId) {
      setLoading(true);
      try {
        const aiData = await aiDataExtractionService.extractAIData(questId);
        setData(aiData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors du rechargement');
      } finally {
        setLoading(false);
      }
    }
  };

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