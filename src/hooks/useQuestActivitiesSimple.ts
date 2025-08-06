import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface QuestActivity {
  id: string;
  quest_id: string;
  user_id: string;
  activity_type: string;
  activity_data: any;
  created_at: string;
  profiles?: {
    username?: string;
    full_name?: string;
    avatar_url?: string;
  };
}

export const useQuestActivitiesSimple = (questId: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: activities = [], isLoading } = useQuery({
    queryKey: ['quest-activities', questId],
    queryFn: async () => {
      // Données réalistes pour la quête témoin Fontainebleau
      if (questId && questId.includes('fontainebleau')) {
        return [
          {
            id: '1',
            quest_id: questId,
            user_id: 'marie-dubois',
            activity_type: 'quest_started',
            activity_data: { message: 'Équipe formée pour explorer les mystères de Fontainebleau' },
            created_at: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
            profiles: { username: 'marie_historienne', full_name: 'Marie Dubois, Historienne' }
          },
          {
            id: '2',
            quest_id: questId,
            user_id: 'marie-dubois',
            activity_type: 'clue_discovered',
            activity_data: { 
              clue_index: 0, 
              title: 'Les archives secrètes de François Ier', 
              method: 'Recherche historique approfondie',
              location: 'Bibliothèque du château'
            },
            created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
            profiles: { username: 'marie_historienne', full_name: 'Marie Dubois, Historienne' }
          },
          {
            id: '3',
            quest_id: questId,
            user_id: 'jean-moreau',
            activity_type: 'clue_discovered',
            activity_data: { 
              clue_index: 1, 
              title: 'La salamandre royale', 
              method: 'Analyse archéologique des symboles',
              location: 'Galerie François Ier'
            },
            created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
            profiles: { username: 'jean_archeologue', full_name: 'Jean Moreau, Archéologue' }
          },
          {
            id: '4',
            quest_id: questId,
            user_id: 'pierre-fontaine',
            activity_type: 'ai_assistance',
            activity_data: { 
              type: 'historical_context', 
              suggestion: 'Analyser les jardins Renaissance pour comprendre la symbolique'
            },
            created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            profiles: { username: 'pierre_guide', full_name: 'Pierre Fontaine, Guide local' }
          },
          {
            id: '5',
            quest_id: questId,
            user_id: 'pierre-fontaine',
            activity_type: 'clue_discovered',
            activity_data: { 
              clue_index: 2, 
              title: 'Le jardin secret de Diane', 
              method: 'Connaissance locale et intuition',
              location: 'Jardin de Diane'
            },
            created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            profiles: { username: 'pierre_guide', full_name: 'Pierre Fontaine, Guide local' }
          },
          {
            id: '6',
            quest_id: questId,
            user_id: 'marie-dubois',
            activity_type: 'quest_completed',
            activity_data: { 
              completion_time: '3 semaines', 
              team_effort: true, 
              total_points: 600 
            },
            created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            profiles: { username: 'marie_historienne', full_name: 'Marie Dubois, Historienne' }
          }
        ];
      }
      return [];
    },
    enabled: !!questId,
  });

  const addActivity = useMutation({
    mutationFn: async ({ type, data }: { type: string; data: any }) => {
      if (!user) throw new Error('User not authenticated');

      const newActivity: QuestActivity = {
        id: Date.now().toString(),
        quest_id: questId,
        user_id: user.id,
        activity_type: type,
        activity_data: data,
        created_at: new Date().toISOString(),
        profiles: {
          username: user.email?.split('@')[0] || 'Utilisateur',
          full_name: user.user_metadata?.full_name || 'Utilisateur',
          avatar_url: user.user_metadata?.avatar_url
        }
      };

      return newActivity;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quest-activities', questId] });
    },
  });

  return {
    activities,
    isLoading,
    addActivity: addActivity.mutate,
  };
};