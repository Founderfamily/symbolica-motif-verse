
import { useQuery } from '@tanstack/react-query';
import { supabaseSymbolService } from '@/services/supabaseSymbolService';
import { SymbolData, SymbolImage } from '@/types/supabase';

/**
 * Hook pour récupérer un symbole par son ID
 */
export const useSymbolById = (id: string | undefined) => {
  return useQuery({
    queryKey: ['symbol', id],
    queryFn: () => id ? supabaseSymbolService.getSymbolById(id) : null,
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook pour récupérer tous les symboles
 */
export const useAllSymbols = () => {
  return useQuery({
    queryKey: ['symbols', 'all'],
    queryFn: () => supabaseSymbolService.getAllSymbols(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 20 * 60 * 1000, // 20 minutes
  });
};

/**
 * Hook pour récupérer les images d'un symbole
 */
export const useSymbolImages = (symbolId: string | undefined) => {
  return useQuery({
    queryKey: ['symbol-images', symbolId],
    queryFn: () => symbolId ? supabaseSymbolService.getSymbolImages(symbolId) : [],
    enabled: !!symbolId,
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

/**
 * Hook pour la recherche de symboles
 */
export const useSearchSymbols = (
  query?: string,
  culture?: string,
  period?: string,
  tags?: string[],
  country?: string
) => {
  return useQuery({
    queryKey: ['symbols', 'search', { query, culture, period, tags, country }],
    queryFn: () => supabaseSymbolService.searchSymbols(query, culture, period, tags, country),
    enabled: !!(query || culture || period || tags?.length || country),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
