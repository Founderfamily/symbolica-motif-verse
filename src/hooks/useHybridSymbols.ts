
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

  // Chargement prioritaire des données API
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
    retry: 2,
    staleTime: 30 * 1000, // 30 secondes seulement pour avoir des données plus fraîches
    gcTime: 2 * 60 * 1000, // 2 minutes
  });

  // Logique de fusion privilégiant l'API
  useEffect(() => {
    console.log('🔄 useHybridSymbols - Update logic:', { 
      isSuccess, 
      apiSymbolsCount: apiSymbols?.length || 0, 
      apiError: !!apiError,
      apiLoading 
    });

    if (isSuccess && apiSymbols) {
      if (apiSymbols.length > 0) {
        console.log('✅ Utilisation des données API en priorité');
        
        // Créer un Map pour éviter les doublons (priorité à l'API)
        const symbolsMap = new Map<string, SymbolData>();
        
        // D'abord ajouter les symboles API (priorité absolue)
        apiSymbols.forEach(symbol => {
          symbolsMap.set(symbol.id, symbol);
        });
        
        // Ensuite ajouter les symboles statiques SEULEMENT s'ils n'existent pas déjà
        STATIC_SYMBOLS.forEach(symbol => {
          if (!symbolsMap.has(symbol.id)) {
            symbolsMap.set(symbol.id, symbol);
          }
        });
        
        const mergedSymbols = Array.from(symbolsMap.values());
        setSymbols(mergedSymbols);
        setDataSource('hybrid');
        
        console.log('✅ Données fusionnées avec priorité API:', mergedSymbols.length, 'symboles');
      } else {
        console.log('⚠️ API retourne des données vides, utilisation des données statiques');
        setSymbols(STATIC_SYMBOLS);
        setDataSource('static');
      }
    } else if (apiError) {
      console.log('⚠️ API échouée, utilisation des données statiques uniquement');
      setDataSource('static');
      setSymbols(STATIC_SYMBOLS);
    } else if (!apiLoading && !isSuccess && !apiError) {
      // État initial - utiliser les données statiques en attendant
      console.log('🚀 Initialisation avec données statiques en attendant l\'API');
      setSymbols(STATIC_SYMBOLS);
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

  // isLoading est true seulement pendant le chargement initial de l'API
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
