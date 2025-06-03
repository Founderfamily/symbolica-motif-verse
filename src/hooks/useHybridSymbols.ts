
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
  const [symbols, setSymbols] = useState<SymbolData[]>(STATIC_SYMBOLS);
  const [isInitialized, setIsInitialized] = useState(false);

  console.log('🔧 useHybridSymbols - État initial:', { dataSource, symbolsCount: symbols.length });

  // Tentative de chargement des données API en arrière-plan
  const { data: apiSymbols, isLoading: apiLoading, error: apiError } = useQuery({
    queryKey: ['symbols-api'],
    queryFn: async () => {
      console.log('🔄 Tentative de chargement des symboles via API...');
      const { data, error } = await supabase
        .from('symbols')
        .select('*');
        
      if (error) {
        console.error('❌ Erreur API symboles:', error);
        throw error;
      }
      
      console.log('✅ Symboles API chargés:', data?.length || 0);
      return (data as unknown) as SymbolData[];
    },
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Initialisation immédiate avec les données statiques
  useEffect(() => {
    if (!isInitialized) {
      console.log('🚀 Initialisation avec données statiques');
      setSymbols(STATIC_SYMBOLS);
      setDataSource('static');
      setIsInitialized(true);
    }
  }, [isInitialized]);

  // Fusion des données quand l'API réussit
  useEffect(() => {
    if (apiSymbols && apiSymbols.length > 0) {
      console.log('🔄 Fusion des données statiques et API...');
      
      // Créer un Map pour éviter les doublons (priorité à l'API)
      const symbolsMap = new Map<string, SymbolData>();
      
      // D'abord ajouter les symboles statiques
      STATIC_SYMBOLS.forEach(symbol => {
        symbolsMap.set(symbol.id, symbol);
      });
      
      // Ensuite ajouter/remplacer avec les symboles API
      apiSymbols.forEach(symbol => {
        symbolsMap.set(symbol.id, symbol);
      });
      
      const mergedSymbols = Array.from(symbolsMap.values());
      setSymbols(mergedSymbols);
      setDataSource('hybrid');
      
      console.log('✅ Données fusionnées:', mergedSymbols.length, 'symboles');
    } else if (apiError && isInitialized) {
      console.log('⚠️ API échouée, utilisation des données statiques uniquement');
      setDataSource('static');
      setSymbols(STATIC_SYMBOLS);
    }
  }, [apiSymbols, apiError, isInitialized]);

  // Calcul des valeurs de filtres dynamiques basées sur les données actuelles
  const filterValues = {
    cultures: [...new Set([
      ...STATIC_FILTER_VALUES.cultures,
      ...symbols.map(s => s.culture)
    ])].sort(),
    periods: [...new Set([
      ...STATIC_FILTER_VALUES.periods,
      ...symbols.map(s => s.period)
    ])].sort(),
    functions: [...new Set([
      ...STATIC_FILTER_VALUES.functions,
      ...symbols.flatMap(s => s.function || [])
    ])].sort(),
    techniques: [...new Set([
      ...STATIC_FILTER_VALUES.techniques,
      ...symbols.flatMap(s => s.technique || [])
    ])].sort(),
    mediums: [...new Set([
      ...STATIC_FILTER_VALUES.mediums,
      ...symbols.flatMap(s => s.medium || [])
    ])].sort(),
  };

  // isLoading est true seulement si on n'est pas encore initialisé
  // Une fois initialisé avec les données statiques, on n'est plus en loading
  const isLoading = !isInitialized;

  console.log('📊 useHybridSymbols - État final:', { 
    isLoading, 
    isInitialized, 
    dataSource, 
    symbolsCount: symbols.length,
    apiLoading 
  });

  return {
    symbols,
    isLoading,
    error: dataSource === 'static' && !apiLoading ? apiError : null,
    dataSource,
    filterValues
  };
};
