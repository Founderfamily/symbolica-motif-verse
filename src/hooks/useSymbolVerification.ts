import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type VerificationStatus = 'verified' | 'uncertain' | 'unverified';

export interface SymbolVerificationData {
  status: VerificationStatus;
  averageConfidence: number;
  verificationCount: number;
  lastVerified: string | null;
  details: {
    api: string;
    confidence: number;
    status: string;
  }[];
}

export const useSymbolVerification = (symbolId: string) => {
  return useQuery({
    queryKey: ['symbol-verification', symbolId],
    queryFn: async (): Promise<SymbolVerificationData> => {
      const { data: verifications, error } = await supabase
        .from('symbol_verifications')
        .select('api, confidence, status, created_at')
        .eq('symbol_id', symbolId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching symbol verifications:', error);
        throw error;
      }

      if (!verifications || verifications.length === 0) {
        return {
          status: 'unverified',
          averageConfidence: 0,
          verificationCount: 0,
          lastVerified: null,
          details: []
        };
      }

      // Calculer la confiance moyenne
      const avgConfidence = verifications.reduce((sum, v) => sum + v.confidence, 0) / verifications.length;
      
      // Déterminer le statut global basé sur la logique définie
      let status: VerificationStatus = 'unverified';
      
      if (verifications.length >= 2 && avgConfidence >= 70) {
        status = 'verified';
      } else if (avgConfidence >= 40 && avgConfidence < 70) {
        status = 'uncertain';
      } else if (avgConfidence < 40) {
        status = 'unverified';
      }

      return {
        status,
        averageConfidence: Math.round(avgConfidence),
        verificationCount: verifications.length,
        lastVerified: verifications[0]?.created_at || null,
        details: verifications.map(v => ({
          api: v.api,
          confidence: v.confidence,
          status: v.status
        }))
      };
    },
    enabled: !!symbolId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};