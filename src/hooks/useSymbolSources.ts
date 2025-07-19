
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface SymbolSource {
  id: string;
  symbol_id: string;
  title: string;
  url: string;
  source_type: string;
  description?: string;
  upvotes: number;
  downvotes: number;
  created_at: string;
  created_by: string;
}

export const useSymbolSources = (symbolId: string | null) => {
  return useQuery({
    queryKey: ['symbol-sources', symbolId],
    queryFn: async (): Promise<SymbolSource[]> => {
      if (!symbolId) return [];
      
      const { data, error } = await supabase
        .from('symbol_sources')
        .select('*')
        .eq('symbol_id', symbolId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!symbolId,
  });
};

export const useAddSymbolSource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (source: Omit<SymbolSource, 'id' | 'created_at' | 'upvotes' | 'downvotes'>) => {
      const { data, error } = await supabase
        .from('symbol_sources')
        .insert([source])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['symbol-sources', variables.symbol_id] });
      toast.success('Source ajoutée avec succès');
    },
    onError: (error) => {
      console.error('Error adding source:', error);
      toast.error('Erreur lors de l\'ajout de la source');
    }
  });
};

export const useDeleteSymbolSource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, symbolId }: { id: string; symbolId: string }) => {
      const { error } = await supabase
        .from('symbol_sources')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['symbol-sources', variables.symbolId] });
      toast.success('Source supprimée avec succès');
    },
    onError: (error) => {
      console.error('Error deleting source:', error);
      toast.error('Erreur lors de la suppression de la source');
    }
  });
};
