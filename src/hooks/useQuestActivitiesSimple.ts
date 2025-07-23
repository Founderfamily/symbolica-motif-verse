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
  const [localActivities, setLocalActivities] = useState<QuestActivity[]>([]);

  const { data: activities = [], isLoading } = useQuery({
    queryKey: ['quest-activities', questId],
    queryFn: async () => {
      // Pour l'instant, retourner les activités locales
      return localActivities;
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

      // Ajouter localement
      setLocalActivities(prev => [newActivity, ...prev]);
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