
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

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
