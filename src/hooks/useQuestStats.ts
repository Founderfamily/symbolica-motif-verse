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
  // Nouvelles propriétés pour la quête témoin
  completionRate: number;
  averageTime: string;
  totalPoints: number;
  cluesFound: number;
  totalClues: number;
}

export const useQuestStats = (questId: string, questCluesCount: number = 0) => {
  const [stats, setStats] = useState<QuestStats>({
    participantsCount: 0,
    cluesCount: 0,
    evidenceCount: 0,
    discussionsCount: 0,
    loading: true,
    completionRate: 0,
    averageTime: 'En cours',
    totalPoints: 0,
    cluesFound: 0,
    totalClues: 0
  });

  const { participants, loading: participantsLoading } = useQuestParticipantsSimple(questId);
  const { sources, loading: aiLoading } = useAIData(questId);

  useEffect(() => {
    const fetchStats = async () => {
      if (!questId) return;

      try {
        // Données spécifiques pour la quête témoin Fontainebleau
        if (questId.includes('fontainebleau')) {
          setStats({
            participantsCount: 4,
            cluesCount: questCluesCount,
            evidenceCount: 12,
            discussionsCount: 8,
            loading: false,
            completionRate: 100,
            averageTime: '3 semaines',
            totalPoints: 600,
            cluesFound: 3,
            totalClues: 3
          });
          return;
        }

        // Pour les autres quêtes, utiliser les vraies données
        const { count: discussionsCount } = await supabase
          .from('quest_discussions')
          .select('*', { count: 'exact', head: true })
          .eq('quest_id', questId);

        const { count: investigationsCount } = await supabase
          .from('ai_investigations')
          .select('*', { count: 'exact', head: true })
          .eq('quest_id', questId);

        setStats({
          participantsCount: participants.length,
          cluesCount: questCluesCount,
          evidenceCount: sources.length || investigationsCount || 0,
          discussionsCount: discussionsCount || 0,
          loading: false,
          completionRate: 0,
          averageTime: 'En cours',
          totalPoints: 0,
          cluesFound: 0,
          totalClues: questCluesCount
        });
      } catch (error) {
        console.error('Erreur lors du chargement des stats:', error);
        setStats({
          participantsCount: participants.length,
          cluesCount: questCluesCount,
          evidenceCount: sources.length,
          discussionsCount: 0,
          loading: false,
          completionRate: 0,
          averageTime: 'En cours',
          totalPoints: 0,
          cluesFound: 0,
          totalClues: questCluesCount
        });
      }
    };

    if (!participantsLoading && !aiLoading) {
      fetchStats();
    }
  }, [questId, questCluesCount, participants.length, sources.length, participantsLoading, aiLoading]);

  return stats;
};