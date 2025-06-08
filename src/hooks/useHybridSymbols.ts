
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SymbolData } from '@/types/supabase';
import { STATIC_SYMBOLS, STATIC_FILTER_VALUES } from '@/data/staticSymbols';

export type DataSource = 'static' | 'api' | 'hybrid';

interface UseHybridSymbolsReturn {
  symbols: SymbolData[];
  isLoading: boolean;
  error: Error | null;
  dataSource: DataSource;
  filterValues: typeof STATIC_FILTER_VALUES;
}

export const useHybridSymbols = (): UseHybridSymbolsReturn => {
  const [dataSource, setDataSource] = useState<DataSource>('static');
  const [symbols, setSymbols] = useState<SymbolData[]>([]);

  console.log('🔧 useHybridSymbols - État initial:', { dataSource, symbolsCount: symbols.length });

  // Chargement des données API (optionnel)
  const { data: apiSymbols, isLoading: apiLoading, error: apiError, isSuccess } = useQuery({
    queryKey: ['symbols-api'],
    queryFn: async () => {
      console.log('🔄 Chargement des symboles via API...');
      const { data, error } = await supabase
        .from('symbols')
        .select('*')
        .order('updated_at', { ascending: false });
        
      if (error) {
        console.error('❌ Erreur API symboles:', error);
        throw error;
      }
      
      console.log('✅ Symboles API chargés:', data?.length || 0);
      return (data as unknown) as SymbolData[];
    },
    retry: 1, // Moins de tentatives pour éviter les délais
    staleTime: 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  // Logique de fusion simplifiée - toujours commencer par les données statiques
  useEffect(() => {
    console.log('🔄 useHybridSymbols - Update logic:', { 
      isSuccess, 
      apiSymbolsCount: apiSymbols?.length || 0, 
      apiError: !!apiError,
      apiLoading 
    });

    // Toujours utiliser les symboles statiques avec leurs indices comme IDs
    const staticSymbolsWithIndex = STATIC_SYMBOLS.map((symbol, index) => ({
      ...symbol,
      id: index.toString(), // Utiliser l'index comme ID principal
      staticIndex: index // Garder une référence à l'index original
    }));

    if (isSuccess && apiSymbols && apiSymbols.length > 0) {
      console.log('✅ Fusion des données statiques et API');
      
      // Ajouter les symboles de l'API qui ne sont pas déjà dans les statiques
      const additionalSymbols = apiSymbols.filter(apiSymbol => 
        !STATIC_SYMBOLS.some(staticSymbol => 
          staticSymbol.name.toLowerCase() === apiSymbol.name.toLowerCase()
        )
      );
      
      const mergedSymbols = [...staticSymbolsWithIndex, ...additionalSymbols];
      setSymbols(mergedSymbols);
      setDataSource('hybrid');
      
      console.log('✅ Données fusionnées:', mergedSymbols.length, 'symboles');
    } else {
      console.log('🚀 Utilisation des données statiques uniquement');
      setSymbols(staticSymbolsWithIndex);
      setDataSource('static');
    }
  }, [apiSymbols, apiError, apiLoading, isSuccess]);

  // Calcul des valeurs de filtres dynamiques basées sur les données actuelles
  const filterValues = {
    cultures: [...new Set([
      ...STATIC_FILTER_VALUES.cultures,
      ...symbols.map(s => s.culture).filter(Boolean)
    ])].sort(),
    periods: [...new Set([
      ...STATIC_FILTER_VALUES.periods,
      ...symbols.map(s => s.period).filter(Boolean)
    ])].sort(),
    functions: [...new Set([
      ...STATIC_FILTER_VALUES.functions,
      ...symbols.flatMap(s => s.function || []).filter(Boolean)
    ])].sort(),
    techniques: [...new Set([
      ...STATIC_FILTER_VALUES.techniques,
      ...symbols.flatMap(s => s.technique || []).filter(Boolean)
    ])].sort(),
    mediums: [...new Set([
      ...STATIC_FILTER_VALUES.mediums,
      ...symbols.flatMap(s => s.medium || []).filter(Boolean)
    ])].sort(),
  };

  // isLoading est true seulement pendant le chargement initial si on n'a pas encore de données
  const isLoading = apiLoading && symbols.length === 0;

  console.log('📊 useHybridSymbols - État final:', { 
    isLoading, 
    dataSource, 
    symbolsCount: symbols.length,
    apiLoading,
    hasApiData: !!apiSymbols?.length
  });

  return {
    symbols,
    isLoading,
    error: apiError,
    dataSource,
    filterValues
  };
};
