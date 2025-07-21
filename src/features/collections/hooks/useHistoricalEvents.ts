import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface HistoricalEvent {
  id: string;
  collection_slug: string;
  culture_region: string;
  year: number;
  date_text: string;
  event_name: string;
  description?: string;
  period_category: string;
  importance_level: number;
  created_at: string;
  updated_at: string;
}

export const useHistoricalEvents = (collectionSlug?: string) => {
  return useQuery({
    queryKey: ['historical-events', collectionSlug],
    queryFn: async (): Promise<HistoricalEvent[]> => {
      let query = supabase
        .from('historical_events')
        .select('*')
        .order('year', { ascending: true });

      if (collectionSlug) {
        query = query.eq('collection_slug', collectionSlug);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Erreur lors du chargement des événements historiques:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!collectionSlug,
  });
};