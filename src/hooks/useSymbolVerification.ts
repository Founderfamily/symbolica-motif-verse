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

export const useSymbolVerification = (symbolIdentifier: string) => {
  return useQuery({
    queryKey: ['symbol-verification', symbolIdentifier],
    queryFn: async (): Promise<SymbolVerificationData> => {
      // Try to find by UUID first, then by symbol name
      let query = supabase
        .from('symbol_verifications')
        .select('api, confidence, status, created_at');

      // Check if the identifier looks like a UUID (contains hyphens and is 36 chars)
      if (symbolIdentifier?.includes('-') && symbolIdentifier.length === 36) {
        query = query.eq('symbol_id', symbolIdentifier);
      } else {
        // For static symbols, we need to find the symbol_id by joining with symbols table
        const { data: symbolData, error: symbolError } = await supabase
          .from('symbols')
          .select('id')
          .eq('name', symbolIdentifier)
          .single();
        
        if (symbolError || !symbolData) {
          console.log(`No symbol found for name: ${symbolIdentifier}`);
          return {
            status: 'unverified',
            averageConfidence: 0,
            verificationCount: 0,
            lastVerified: null,
            details: []
          };
        }
        
        query = query.eq('symbol_id', symbolData.id);
      }

      const { data: verifications, error } = await query.order('created_at', { ascending: false });

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
    enabled: !!symbolIdentifier,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};