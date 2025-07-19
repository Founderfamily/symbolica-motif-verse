import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface SymbolFilters {
  search?: string;
  culture?: string;
  period?: string;
  has_images?: 'with_images' | 'without_images';
  verified?: 'verified' | 'unverified';
}

export interface SymbolSortConfig {
  column: 'name' | 'culture' | 'period' | 'created_at' | 'updated_at' | 'image_count' | 'verification_count';
  direction: 'ASC' | 'DESC';
}

export interface PaginatedSymbol {
  id: string;
  name: string;
  culture: string;
  period: string;
  description: string;
  created_at: string;
  updated_at: string;
  image_count: number;
  verification_count: number;
  total_count: number;
}

export const useAdminSymbols = (
  page: number = 1,
  limit: number = 50,
  filters: SymbolFilters = {},
  sort: SymbolSortConfig = { column: 'created_at', direction: 'DESC' }
) => {
  return useQuery({
    queryKey: ['admin-symbols', page, limit, filters, sort],
    queryFn: async () => {
      const offset = (page - 1) * limit;
      
      // Construire la requête avec jointures pour les compteurs
      let query = supabase
        .from('symbols')
        .select(`
          id,
          name,
          culture,
          period,
          description,
          created_at,
          updated_at
        `, { count: 'exact' });

      // Appliquer les filtres de base
      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%,culture.ilike.%${filters.search}%`);
      }
      
      if (filters.culture) {
        query = query.eq('culture', filters.culture);
      }
      
      if (filters.period) {
        query = query.eq('period', filters.period);
      }

      // Appliquer le tri
      query = query.order(sort.column, { ascending: sort.direction === 'ASC' });

      // Appliquer la pagination
      query = query.range(offset, offset + limit - 1);

      const { data, error, count } = await query;
      
      if (error) throw error;

      // Récupérer les comptes d'images et de vérifications pour chaque symbole
      const symbolsWithCounts = await Promise.all(
        (data || []).map(async (symbol) => {
          const [imagesResult, verificationsResult] = await Promise.all([
            supabase
              .from('symbol_images')
              .select('id', { count: 'exact', head: true })
              .eq('symbol_id', symbol.id),
            supabase
              .from('symbol_verifications')
              .select('id', { count: 'exact', head: true })
              .eq('symbol_id', symbol.id)
          ]);

          return {
            ...symbol,
            image_count: imagesResult.count || 0,
            verification_count: verificationsResult.count || 0,
            total_count: count || 0
          };
        })
      );

      // Appliquer les filtres avancés après récupération des compteurs
      let filteredSymbols = symbolsWithCounts;

      if (filters.has_images === 'with_images') {
        filteredSymbols = filteredSymbols.filter(s => s.image_count > 0);
      } else if (filters.has_images === 'without_images') {
        filteredSymbols = filteredSymbols.filter(s => s.image_count === 0);
      }

      if (filters.verified === 'verified') {
        filteredSymbols = filteredSymbols.filter(s => s.verification_count > 0);
      } else if (filters.verified === 'unverified') {
        filteredSymbols = filteredSymbols.filter(s => s.verification_count === 0);
      }

      // Tri personnalisé pour les compteurs
      if (sort.column === 'image_count' || sort.column === 'verification_count') {
        filteredSymbols.sort((a, b) => {
          const aVal = a[sort.column as keyof PaginatedSymbol] as number;
          const bVal = b[sort.column as keyof PaginatedSymbol] as number;
          return sort.direction === 'ASC' ? aVal - bVal : bVal - aVal;
        });
      }

      return {
        data: filteredSymbols as PaginatedSymbol[],
        totalCount: filteredSymbols.length
      };
    },
    staleTime: 30 * 1000, // 30 secondes
  });
};

export const useSymbolStats = () => {
  return useQuery({
    queryKey: ['symbol-stats'],
    queryFn: async () => {
      const [
        totalResult,
        culturesResult,
        periodsResult,
        verifiedResult,
        withImagesResult,
        recentResult
      ] = await Promise.all([
        supabase.from('symbols').select('id', { count: 'exact', head: true }),
        supabase.from('symbols').select('culture').not('culture', 'is', null),
        supabase.from('symbols').select('period').not('period', 'is', null),
        supabase.from('symbol_verifications').select('symbol_id'),
        supabase.from('symbol_images').select('symbol_id'),
        supabase.from('symbols').select('id', { count: 'exact', head: true }).gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      ]);

      const uniqueCultures = new Set(culturesResult.data?.map(s => s.culture).filter(Boolean));
      const uniquePeriods = new Set(periodsResult.data?.map(s => s.period).filter(Boolean));
      const uniqueVerifiedSymbols = new Set(verifiedResult.data?.map(v => v.symbol_id));
      const uniqueSymbolsWithImages = new Set(withImagesResult.data?.map(i => i.symbol_id));

      return {
        total_symbols: totalResult.count || 0,
        cultures_count: uniqueCultures.size,
        periods_count: uniquePeriods.size,
        verified_symbols: uniqueVerifiedSymbols.size,
        symbols_with_images: uniqueSymbolsWithImages.size,
        recent_symbols_count: recentResult.count || 0
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useSymbolFilters = () => {
  return useQuery({
    queryKey: ['symbol-filters'],
    queryFn: async () => {
      const [culturesResult, periodsResult] = await Promise.all([
        supabase
          .from('symbols')
          .select('culture')
          .not('culture', 'is', null)
          .not('culture', 'eq', ''),
        supabase
          .from('symbols')
          .select('period')
          .not('period', 'is', null)
          .not('period', 'eq', '')
      ]);

      // Compter les occurrences
      const cultureCount = new Map<string, number>();
      const periodCount = new Map<string, number>();

      culturesResult.data?.forEach(item => {
        if (item.culture) {
          cultureCount.set(item.culture, (cultureCount.get(item.culture) || 0) + 1);
        }
      });

      periodsResult.data?.forEach(item => {
        if (item.period) {
          periodCount.set(item.period, (periodCount.get(item.period) || 0) + 1);
        }
      });

      const cultures = Array.from(cultureCount.entries())
        .map(([value, count]) => ({ filter_value: value, count }))
        .sort((a, b) => b.count - a.count);

      const periods = Array.from(periodCount.entries())
        .map(([value, count]) => ({ filter_value: value, count }))
        .sort((a, b) => b.count - a.count);

      return { cultures, periods };
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useDeleteSymbols = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (symbolIds: string[]) => {
      const { error } = await supabase
        .from('symbols')
        .delete()
        .in('id', symbolIds);
        
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-symbols'] });
      queryClient.invalidateQueries({ queryKey: ['symbol-stats'] });
      toast.success('Symboles supprimés avec succès');
    },
    onError: (error) => {
      toast.error('Erreur lors de la suppression des symboles');
      console.error('Delete symbols error:', error);
    }
  });
};

export const useUpdateSymbol = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { 
      id: string; 
      updates: Partial<{ 
        name: string; 
        culture: string; 
        period: string; 
        description: string;
        significance: string;
        historical_context: string;
        tags: string[];
        medium: string[];
        technique: string[];
        function: string[];
      }> 
    }) => {
      const { error } = await supabase
        .from('symbols')
        .update(updates)
        .eq('id', id);
        
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-symbols'] });
      toast.success('Symbole mis à jour avec succès');
    },
    onError: (error) => {
      toast.error('Erreur lors de la mise à jour du symbole');
      console.error('Update symbol error:', error);
    }
  });
};