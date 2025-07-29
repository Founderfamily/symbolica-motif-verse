import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface AIAnalysisRequest {
  questId: string;
  analysisType?: 'general' | 'theory';
}

interface AIAnalysisResponse {
  success: boolean;
  analysis: string;
  context: any;
  error?: string;
}

export const useAIAnalysis = () => {
  return useMutation({
    mutationFn: async ({ questId, analysisType = 'general' }: AIAnalysisRequest): Promise<AIAnalysisResponse> => {
      try {
        const { data, error } = await supabase.functions.invoke('ai-quest-analysis', {
          body: { questId, analysisType }
        });

        if (error) {
          console.error('Edge function error:', error);
          throw new Error(error.message || 'Erreur lors de l\'analyse IA');
        }

        if (!data || !data.success) {
          throw new Error(data?.error || 'Erreur lors de l\'analyse IA');
        }

        return data;
      } catch (error: any) {
        console.error('AI Analysis error:', error);
        throw new Error(error.message || 'Erreur lors de l\'analyse IA');
      }
    },
    onSuccess: (data) => {
      toast({
        title: "Analyse IA générée",
        description: "L'analyse a été générée avec succès",
      });
    },
    onError: (error) => {
      console.error('AI Analysis error:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de générer l'analyse IA",
        variant: "destructive",
      });
    },
  });
};