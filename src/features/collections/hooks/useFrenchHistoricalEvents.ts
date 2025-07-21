import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface FrenchHistoricalEvent {
  id: string;
  year: number;
  date_text: string;
  event_name: string;
  description?: string;
  period_category: string;
  importance_level: number;
  created_at: string;
  updated_at: string;
}

export const useFrenchHistoricalEvents = () => {
  return useQuery<FrenchHistoricalEvent[]>({
    queryKey: ['french-historical-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('french_historical_events')
        .select('*')
        .order('year');

      if (error) throw error;

      return data || [];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};