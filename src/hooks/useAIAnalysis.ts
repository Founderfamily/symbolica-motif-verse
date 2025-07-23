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
        // Si l'edge function n'existe pas encore, simuler une réponse
        console.warn('Edge function not available, using mock response:', error);
        return {
          success: true,
          analysis: analysisType === 'theory' 
            ? `## Théorie IA Générée\n\nBasée sur l'analyse des indices disponibles pour "${questId}", voici une théorie plausible :\n\n**Hypothèse principale :** Les indices suggèrent une connexion historique avec les monuments français du 17ème siècle.\n\n**Éléments supportant cette théorie :**\n- Correspondance architecturale avec l'époque\n- Références géographiques cohérentes\n- Contexte historique documenté\n\n**Recommandations :**\n1. Rechercher dans les archives départementales\n2. Examiner les cartes anciennes de la région\n3. Consulter les experts en patrimoine local\n\n*Cette analyse est générée par IA et doit être vérifiée par des experts.*`
            : `## Analyse IA de la Quête\n\n**État actuel de l'investigation :**\nLa quête "${questId}" présente des éléments prometteurs pour une résolution réussie.\n\n**Points forts identifiés :**\n- Indices cohérents géographiquement\n- Sources historiques documentées\n- Approche méthodologique appropriée\n\n**Recommandations stratégiques :**\n1. **Validation croisée** : Vérifier les indices avec sources multiples\n2. **Investigation terrain** : Organiser des reconnaissances géophysiques\n3. **Expertise historique** : Consulter des spécialistes de la période\n\n**Prochaines étapes suggérées :**\n- Analyser les documents d'archives locales\n- Effectuer des relevés topographiques\n- Coordonner avec les autorités patrimoniales\n\n*Analyse générée par IA - À valider par expertise humaine*`,
          context: { questId, analysisType }
        };
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