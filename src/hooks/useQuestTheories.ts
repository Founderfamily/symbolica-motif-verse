import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { investigationService } from '@/services/investigationService';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useQuestTheories = (questId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const {
    data: theories,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['quest-theories', questId],
    queryFn: () => investigationService.getQuestTheories(questId),
    enabled: !!questId,
  });

  const createTheoryMutation = useMutation({
    mutationFn: async (theoryData: {
      title: string;
      description: string;
      theory_type: string;
      supporting_evidence: string[];
      confidence_level: number;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utilisateur non connecté');

      return investigationService.createTheory({
        quest_id: questId,
        author_id: user.id,
        status: 'active',
        ...theoryData,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quest-theories', questId] });
      toast({
        title: "Théorie créée",
        description: "Votre théorie a été soumise avec succès",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur lors de la création",
        variant: "destructive",
      });
    },
  });

  return {
    theories: theories?.success ? theories.data : [],
    isLoading,
    error,
    refetch,
    createTheory: createTheoryMutation.mutate,
    isCreating: createTheoryMutation.isPending,
  };
};