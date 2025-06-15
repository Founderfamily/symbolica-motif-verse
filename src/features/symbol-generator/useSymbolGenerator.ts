
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { generateSymbolSuggestion } from '@/services/aiSymbolGeneratorService';
import { supabaseSymbolService } from '@/services/supabaseSymbolService';
import { getNextAIProvider, resetAIProviderRotation } from '@/services/aiProviders';
import { DIVERSITY_TIPS, MAX_ATTEMPTS, NB_PROPOSALS, RECENT_NAMES_KEY } from './constants';
import { Provider, Proposal, ResultState } from './types';
import { findOrCreateCollection } from './utils';
import { SymbolData } from '@/types/supabase';

export const useSymbolGenerator = () => {
  const { toast } = useToast();
  const [theme, setTheme] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [resultStates, setResultStates] = useState<ResultState[]>([]);
  const [recentNames, setRecentNames] = useState<string[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(RECENT_NAMES_KEY);
      if (saved) setRecentNames(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(RECENT_NAMES_KEY, JSON.stringify(recentNames));
    } catch {}
  }, [recentNames]);

  const getUniqueSymbolSuggestion = useCallback(async (theme: string, blacklist: string[], pass: number) => {
    let attempt = 0;
    let lastError: Error | null = new Error("La génération a échoué après plusieurs tentatives.");

    while (attempt < MAX_ATTEMPTS) {
      const currentAttempt = attempt + 1;
      const constraint = attempt > 1 ? DIVERSITY_TIPS[(attempt - 2 + pass) % DIVERSITY_TIPS.length] : "";
      const provider = getNextAIProvider(attempt === 0 ? undefined : undefined) as Provider;
      
      try {
        const suggestion = await generateSymbolSuggestion(theme.trim(), blacklist, provider, constraint);
        
        if (!suggestion || !suggestion.name || !suggestion.culture) {
          throw new Error("Réponse de l'IA incomplète (nom ou culture manquant).");
        }
        
        const existingSymbol = await supabaseSymbolService.findSymbolByName(suggestion.name);
        if (existingSymbol && typeof existingSymbol.name === "string" && existingSymbol.name.toLowerCase().trim() === suggestion.name.toLowerCase().trim()) {
          blacklist.push(suggestion.name);
          throw new Error(`Le symbole "${suggestion.name}" existe déjà.`);
        }

        if (blacklist.some(nm => typeof nm === "string" && nm.toLowerCase().trim() === suggestion.name!.toLowerCase().trim())) {
          blacklist.push(suggestion.name);
          throw new Error(`Le symbole "${suggestion.name}" est dans la blacklist.`);
        }
        
        return suggestion;
      } catch (e: any) {
        lastError = e;
        attempt++;
      }
    }
    throw lastError;
  }, []);

  const handlePropose = useCallback(async () => {
    setIsLoading(true);
    setProposals(Array.from({ length: NB_PROPOSALS }).map(() => ({ suggestion: null, collection: null, isLoading: true, error: null })));
    setSelectedIndices([]);
    setResultStates([]);
    resetAIProviderRotation();

    const generationPromises = Array.from({ length: NB_PROPOSALS }).map((_, i) =>
      getUniqueSymbolSuggestion(theme, [...recentNames], i)
        .then(async (suggestion) => {
          if (!suggestion) throw new Error("La suggestion est nulle après la génération.");
          const collection = suggestion.culture ? await findOrCreateCollection(suggestion.culture) : null;
          return { suggestion, collection, isLoading: false, error: null };
        })
        .catch((err: any) => ({ suggestion: null, collection: null, isLoading: false, error: err?.message || "Erreur inattendue" }))
    );

    const results = await Promise.all(generationPromises);
    setProposals(results);
    
    setIsLoading(false);
    const successfulIndices = results.map((r, i) => (r.suggestion ? i : -1)).filter(i => i !== -1);
    setSelectedIndices(successfulIndices);
  }, [theme, recentNames, getUniqueSymbolSuggestion]);

  const handleRegenerate = useCallback(async (index: number) => {
    setProposals(prev => prev.map((prop, i) => i === index ? { suggestion: null, collection: null, isLoading: true, error: null } : prop));
    let blacklist = [...recentNames, ...proposals.filter(p => p.suggestion?.name).map(p => p.suggestion!.name!)];
    try {
      const suggestion = await getUniqueSymbolSuggestion(theme, blacklist, index);
      const collection = suggestion?.culture ? await findOrCreateCollection(suggestion.culture) : null;
      setProposals(prev => prev.map((prop, i) => i === index ? { suggestion, collection, isLoading: false, error: null } : prop));
    } catch (err: any) {
      setProposals(prev => prev.map((prop, i) => i === index ? { suggestion: null, collection: null, isLoading: false, error: err?.message || "Erreur inattendue" } : prop));
    }
  }, [theme, recentNames, proposals, getUniqueSymbolSuggestion]);

  const handleAcceptAndCreateBatch = useCallback(async () => {
    setIsLoading(true);
    setResultStates([]);
    const toCreate = selectedIndices.map(i => proposals[i]).filter(p => p && p.suggestion && p.collection);
    let results: ResultState[] = [];

    await Promise.allSettled(
      toCreate.map(async ({ suggestion, collection }) => {
        try {
          const { data: symbolResp, error: insertError } = await supabase.from('symbols').insert([suggestion as SymbolData]).select();
          if (insertError || !symbolResp?.[0]?.id) throw new Error('Erreur à la création du symbole');
          await supabase.from('collection_symbols').insert([{ collection_id: collection.id, symbol_id: symbolResp[0].id }]);
          results.push({ symbol: symbolResp[0], collection, error: undefined });
        } catch (err: any) {
          results.push({ symbol: suggestion!, collection, error: err?.message || "Erreur inattendue" });
        }
      })
    );
    
    setRecentNames(prev => [...toCreate.map(p => p.suggestion!.name!), ...prev].slice(0, 20));
    setResultStates(results);
    setIsLoading(false);
    setProposals([]);
    setSelectedIndices([]);
  }, [selectedIndices, proposals]);

  const handleResetMemory = useCallback(() => {
    setRecentNames([]);
    resetAIProviderRotation();
    localStorage.removeItem(RECENT_NAMES_KEY);
    setProposals([]);
    setResultStates([]);
    setTheme('');
    toast({ title: "Mémoire effacée", description: "La mémoire des symboles récemment générés a été vidée." });
  }, [toast]);
  
  const handleToggleSelect = useCallback((i: number) => {
    setSelectedIndices(prev => prev.includes(i) ? prev.filter(idx => idx !== i) : [...prev, i]);
  }, []);
  
  const handleSelectAll = useCallback(() => {
    const allSelected = selectedIndices.length === proposals.length && proposals.length > 0;
    if (allSelected) setSelectedIndices([]);
    else setSelectedIndices(proposals.map((_, i) => i));
  }, [proposals, selectedIndices.length]);

  const startOver = useCallback(() => {
    setResultStates([]);
    setProposals([]);
    setSelectedIndices([]);
  }, []);

  const allSelected = selectedIndices.length === proposals.length && proposals.length > 0;

  return {
    theme,
    setTheme,
    isLoading,
    proposals,
    selectedIndices,
    resultStates,
    allSelected,
    handleResetMemory,
    handlePropose,
    handleRegenerate,
    handleToggleSelect,
    handleSelectAll,
    handleAcceptAndCreateBatch,
    startOver,
  };
};

