
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface CommunityVerificationComment {
  id: string;
  symbol_id: string;
  user_id: string;
  comment: string;
  verification_rating: 'very_confident' | 'somewhat_confident' | 'not_confident';
  expertise_level: 'expert' | 'knowledgeable' | 'amateur';
  created_at: string;
  profiles?: {
    username: string;
    full_name: string;
    is_admin: boolean;
  };
}

export const useSymbolCommunityVerification = (symbolId: string | null) => {
  return useQuery({
    queryKey: ['symbol-community-verification', symbolId],
    queryFn: async (): Promise<CommunityVerificationComment[]> => {
      if (!symbolId) return [];
      
      const { data, error } = await supabase
        .rpc('get_community_verification_comments', { p_symbol_id: symbolId });

      if (error) throw error;
      return data || [];
    },
    enabled: !!symbolId,
  });
};

export const useAddCommunityVerificationComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      symbolId,
      comment,
      verificationRating,
      expertiseLevel
    }: {
      symbolId: string;
      comment: string;
      verificationRating: string;
      expertiseLevel: string;
    }) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .rpc('add_community_verification_comment', {
          p_symbol_id: symbolId,
          p_user_id: user.user.id,
          p_comment: comment,
          p_verification_rating: verificationRating,
          p_expertise_level: expertiseLevel
        });

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['symbol-community-verification', variables.symbolId] });
      queryClient.invalidateQueries({ queryKey: ['symbol-verification', variables.symbolId] });
      toast.success('Commentaire de vérification ajouté avec succès');
    },
    onError: (error) => {
      console.error('Error adding verification comment:', error);
      toast.error('Erreur lors de l\'ajout du commentaire');
    }
  });
};
