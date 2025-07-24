import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { investigationService } from '@/services/investigationService';
import { useToast } from '@/components/ui/use-toast';

export const useQuestEvidence = (questId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const {
    data: evidence,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['quest-evidence', questId],
    queryFn: () => investigationService.getQuestEvidence(questId),
    enabled: !!questId,
  });

  const validateEvidenceMutation = useMutation({
    mutationFn: ({ evidenceId, voteType, comment }: {
      evidenceId: string;
      voteType: 'validate' | 'dispute' | 'reject';
      comment?: string;
    }) => investigationService.validateEvidence(evidenceId, voteType, comment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quest-evidence', questId] });
      toast({
        title: "Validation enregistrée",
        description: "Votre validation a été prise en compte",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur lors de la validation",
        variant: "destructive",
      });
    },
  });

  return {
    evidence: evidence?.success ? evidence.data : [],
    isLoading,
    error,
    refetch,
    validateEvidence: validateEvidenceMutation.mutate,
    isValidating: validateEvidenceMutation.isPending,
  };
};