
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Quest {
  id: string;
  title: string;
  description?: string;
  quest_type: 'templar' | 'grail' | 'civilization';
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  status: 'upcoming' | 'active' | 'completed';
  clues?: any[];
  created_at?: string;
  updated_at?: string;
}

export const useQuests = () => {
  return useQuery({
    queryKey: ['quests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('treasure_quests')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Quest[];
    }
  });
};

export const useSubmitEvidence = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({
      questId,
      evidenceType,
      title,
      description,
      imageUrl,
      location
    }: {
      questId: string;
      evidenceType: string;
      title: string;
      description?: string;
      imageUrl?: string;
      location?: {
        latitude: number;
        longitude: number;
        name?: string;
      };
    }) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('quest_evidence')
        .insert({
          quest_id: questId,
          evidence_type: evidenceType,
          title,
          description,
          image_url: imageUrl,
          latitude: location?.latitude,
          longitude: location?.longitude,
          location_name: location?.name,
          submitted_by: user.user.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quest-evidence'] });
      toast.success('Contribution soumise avec succès !');
    },
    onError: (error) => {
      console.error('Error submitting evidence:', error);
      toast.error('Erreur lors de la soumission');
    }
  });
};
