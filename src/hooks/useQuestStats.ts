import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQuestParticipantsSimple } from './useQuestParticipantsSimple';
import { useAIData } from './useAIData';

export interface QuestStats {
  participantsCount: number;
  cluesCount: number;
  evidenceCount: number;
  discussionsCount: number;
  loading: boolean;
}

export const useQuestStats = (questId: string, questCluesCount: number = 0) => {
  const [stats, setStats] = useState<QuestStats>({
    participantsCount: 0,
    cluesCount: 0,
    evidenceCount: 0,
    discussionsCount: 0,
    loading: true
  });

  const { participants, loading: participantsLoading } = useQuestParticipantsSimple(questId);
  const { sources, loading: aiLoading } = useAIData(questId);

  useEffect(() => {
    const fetchStats = async () => {
      if (!questId) return;

      try {
        // Compter les discussions
        const { count: discussionsCount } = await supabase
          .from('quest_discussions')
          .select('*', { count: 'exact', head: true })
          .eq('quest_id', questId);

        // Compter les investigations IA (qui contiennent les preuves)
        const { count: investigationsCount } = await supabase
          .from('ai_investigations')
          .select('*', { count: 'exact', head: true })
          .eq('quest_id', questId);

        setStats({
          participantsCount: participants.length,
          cluesCount: questCluesCount,
          evidenceCount: sources.length || investigationsCount || 0,
          discussionsCount: discussionsCount || 0,
          loading: false
        });
      } catch (error) {
        console.error('Erreur lors du chargement des stats:', error);
        // Fallback avec les données disponibles
        setStats({
          participantsCount: participants.length,
          cluesCount: questCluesCount,
          evidenceCount: sources.length,
          discussionsCount: 0,
          loading: false
        });
      }
    };

    if (!participantsLoading && !aiLoading) {
      fetchStats();
    }
  }, [questId, questCluesCount, participants.length, sources.length, participantsLoading, aiLoading]);

  return stats;
};