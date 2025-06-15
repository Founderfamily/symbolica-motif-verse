import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { generateSymbolSuggestion } from '@/services/aiSymbolGeneratorService';
import { SymbolData } from '@/types/supabase';
import { Loader2, Sparkle, AlertCircle } from 'lucide-react';
import { supabaseSymbolService } from '@/services/supabaseSymbolService';
import { getNextAIProvider, resetAIProviderRotation, providerDisplayNames } from '@/services/aiProviders';

const RECENT_NAMES_KEY = 'symbolRecentNames';

const MAX_ATTEMPTS = 7;
const DIVERSITY_TIPS = [
  "Égypte ancienne", "Inde médiévale", "Amérique précolombienne", "Afrique subsaharienne",
  "Proche-Orient antique", "Renaissance", "civilisation celtique", "culture viking",
  "royaumes africains", "tribus aborigènes", "civilisation chinoise ancienne"
];

type Provider = 'deepseek' | 'openai' | 'anthropic';

const NB_PROPOSALS = 5;

const SymbolMCPGenerator: React.FC = () => {
  const { toast } = useToast();
  const [theme, setTheme] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [duplicateError, setDuplicateError] = useState<React.ReactNode>(null);
  const [attemptLog, setAttemptLog] = useState<{num:number, provider:string, theme:string, constraint:string, error?:string}[]>([]);
  const [recentNames, setRecentNames] = useState<string[]>([]);

  // Pour la fonctionnalité "5 par 5"
  const [proposals, setProposals] = useState<({
    suggestion: Partial<SymbolData> | null,
    collection: any | null,
    isLoading: boolean,
    error: string | null,
  })[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [resultStates, setResultStates] = useState<
    { symbol: Partial<SymbolData>; collection: any; error?: string }[]
  >([]);

  // Utilitaire pour sélectionner tout/désélectionner tout
  const allSelected = selectedIndices.length === proposals.length && proposals.length > 0;
  const noneSelected = selectedIndices.length === 0;

  // Utilitaire pour capitaliser
  const capitalize = (s: string) =>
    s && typeof s === 'string' ? s.charAt(0).toUpperCase() + s.slice(1) : '';

  // Recherche une collection en fonction de la culture (FR, EN, slug)
  const findOrCreateCollection = async (culture: string) => {
    // 1. Recherche d'une collection existante
    let { data: collections, error } = await supabase
      .from('collections')
      .select(`
        id, slug, collection_translations (
          id, language, title, description
        )
      `);

    if (error) collections = [];

    // Si pas de collection, en créer une
    if (collections && collections.length > 0) {
      // priorité : titre FR > slug > titre EN
      const found = collections.find((c: any) => 
        c.collection_translations.some((tr: any) =>
          tr.language === 'fr' && tr.title && tr.title.toLowerCase().includes(culture.toLowerCase())
        ) ||
        (c.slug && c.slug.toLowerCase().includes(culture.toLowerCase())) ||
        c.collection_translations.some((tr: any) =>
          tr.language === 'en' && tr.title && tr.title.toLowerCase().includes(culture.toLowerCase())
        )
      );
      if (found) return found;
    }

    // Création d'une collection
    const slug = culture.toLowerCase().replace(/\s/g, '-').replace(/[^\w\-]+/g, '');
    const { data: newCollection, error: insertError } = await supabase
      .from('collections')
      .insert([
        {
          slug: slug,
          is_featured: false,
        }
      ])
      .select();

    if (insertError || !newCollection?.[0]?.id) {
      throw new Error("Erreur de création de la collection : " + (insertError?.message || 'inconnue'));
    }

    // Ajout des traductions
    await supabase.from('collection_translations').insert([
      {
        collection_id: newCollection[0].id,
        language: 'fr',
        title: capitalize(culture),
        description: `Collection automatique : symboles de la culture ${capitalize(culture)}.`
      },
      {
        collection_id: newCollection[0].id,
        language: 'en',
        title: capitalize(culture),
        description: `Auto collection: symbols of ${capitalize(culture)} culture.`
      }
    ]);

    return {
      id: newCollection[0].id,
      slug,
      collection_translations: [
        { language: 'fr', title: capitalize(culture) },
        { language: 'en', title: capitalize(culture) }
      ]
    };
  };

  // On mount: load persisted recentNames from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(RECENT_NAMES_KEY);
      if (saved) {
        setRecentNames(JSON.parse(saved));
      }
    } catch {}
  }, []);

  // Whenever recentNames changes, save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(RECENT_NAMES_KEY, JSON.stringify(recentNames));
    } catch {}
  }, [recentNames]);

  // Reset "mémoire" des propositions (purge la liste blacklist persistance)
  const handleResetMemory = () => {
    setRecentNames([]);
    resetAIProviderRotation();
    localStorage.removeItem(RECENT_NAMES_KEY);
    setDuplicateError(null);
    setProposals([]);
    setResultStates([]);
    setTheme('');
    setAttemptLog([]);
    toast({
      title: "Mémoire effacée",
      description: "La mémoire des symboles récemment générés a été vidée.",
      variant: "default"
    });
  };

  // Ajoute : suggestions dynamiques lors d'un échec
  function getThemeSuggestion() {
    const set = new Set(recentNames.map(n => n.toLowerCase()));
    for (const tip of DIVERSITY_TIPS) {
      if (!set.has(tip.toLowerCase())) return tip;
    }
    // fallback random
    return DIVERSITY_TIPS[Math.floor(Math.random() * DIVERSITY_TIPS.length)];
  }

  // Handle propose main (génère NB_PROPOSALS en série ou parallélisé)
  const handlePropose = async () => {
    setIsLoading(true);
    setDuplicateError(null);
    setProposals([]);
    setSelectedIndices([]);
    setResultStates([]);
    setAttemptLog([]);

    let generatedProposals: ({
      suggestion: Partial<SymbolData> | null,
      collection: any | null,
      isLoading: boolean,
      error: string | null,
    })[] = [];

    // Blacklist commune, partagée par toutes les propositions, pour garantir diversité
    let globalBlacklist = [...recentNames];

    for (let i = 0; i < NB_PROPOSALS; i++) {
      generatedProposals.push({
        suggestion: null,
        collection: null,
        isLoading: true,
        error: null,
      });
    }
    setProposals(generatedProposals);

    // Génération séquentielle pour garantir la diversité
    for (let i = 0; i < NB_PROPOSALS; i++) {
      try {
        const suggestion = await getUniqueSymbolSuggestion(theme, globalBlacklist, i);
        const collection = suggestion?.culture
          ? await findOrCreateCollection(suggestion.culture)
          : null;
        if (suggestion?.name) {
          // Ajoute à mémoires/blacklist instantanément (cumul)
          globalBlacklist.push(suggestion.name);
        }
        generatedProposals[i] = {
          suggestion,
          collection,
          isLoading: false,
          error: suggestion && suggestion.name ? null : "Erreur de génération",
        };
      } catch (err: any) {
        generatedProposals[i] = {
          suggestion: null,
          collection: null,
          isLoading: false,
          error: err?.message || "Erreur inattendue",
        };
      }
      setProposals([...generatedProposals]);
    }
    setIsLoading(false);
    setSelectedIndices(Array.from({length: NB_PROPOSALS}, (_, i)=>i)); // tout précoché
  };

  // Fonction pour garantir unicité sur chaque proposition
  async function getUniqueSymbolSuggestion(theme: string, blacklist: string[], pass: number) {
    let attempt = 0, suggestion = null, provider: Provider = 'deepseek', constraint = "";
    while (attempt < MAX_ATTEMPTS) {
      constraint = attempt > 1 ? DIVERSITY_TIPS[(attempt-2 + pass) % DIVERSITY_TIPS.length] : "";
      provider = getNextAIProvider(attempt === 0 ? undefined : provider) as Provider;
      try {
        suggestion = await generateSymbolSuggestion(theme.trim(), blacklist, provider, constraint);
        if (!suggestion || !suggestion.name || !suggestion.culture) {
          throw new Error("La génération IA n'a pas renvoyé de nom ou de culture.");
        }
        const existingSymbol = await supabaseSymbolService.findSymbolByName(suggestion.name);
        // Gestion doublon BDD
        if (
          existingSymbol &&
          typeof existingSymbol.name === "string" &&
          existingSymbol.name.toLowerCase().trim() === suggestion.name.toLowerCase().trim()
        ) {
          blacklist.push(suggestion.name);
          attempt++;
          continue;
        }
        // Gestion doublon mémoire/blacklist
        if (
          blacklist.some(nm => typeof nm === "string" && nm.toLowerCase().trim() === suggestion.name.toLowerCase().trim())
        ) {
          blacklist.push(suggestion.name);
          attempt++;
          continue;
        }
        return suggestion;
      } catch (e) {
        attempt++;
        suggestion = null;
        continue;
      }
    }
    return null; // si tout a échoué
  }

  // Régénérer une proposition précise
  const handleRegenerate = async (index: number) => {
    setProposals(prev =>
      prev.map((prop, i) =>
        i === index
          ? { suggestion: null, collection: null, isLoading: true, error: null }
          : prop
      )
    );
    let blacklist = [
      ...recentNames,
      ...proposals.filter(p => p.suggestion?.name).map(p => p.suggestion!.name!),
    ];
    try {
      const suggestion = await getUniqueSymbolSuggestion(theme, blacklist, index);
      const collection = suggestion?.culture
        ? await findOrCreateCollection(suggestion.culture)
        : null;
      setProposals(prev =>
        prev.map((prop, i) =>
          i === index
            ? {
                suggestion,
                collection,
                isLoading: false,
                error: suggestion && suggestion.name ? null : "Erreur de génération",
              }
            : prop
        )
      );
    } catch (err: any) {
      setProposals(prev =>
        prev.map((prop, i) =>
          i === index
            ? {
                suggestion: null,
                collection: null,
                isLoading: false,
                error: err?.message || "Erreur inattendue",
              }
            : prop
        )
      );
    }
  };

  // Sélection batch
  const handleToggleSelect = (i: number) => {
    setSelectedIndices(prev =>
      prev.includes(i)
        ? prev.filter(idx => idx !== i)
        : [...prev, i]
    );
  };
  const handleSelectAll = () => {
    if (allSelected) setSelectedIndices([]);
    else setSelectedIndices(proposals.map((_, i) => i));
  };

  // Création des symboles sélectionnés (en lot)
  const handleAcceptAndCreateBatch = async () => {
    setIsLoading(true);
    setResultStates([]);
    const toCreate = selectedIndices
      .map(i => proposals[i])
      .filter(p => p && p.suggestion && p.collection);

    let results: { symbol: Partial<SymbolData>; collection: any; error?: string }[] = [];

    await Promise.allSettled(
      toCreate.map(async ({ suggestion, collection }) => {
        try {
          const dataToInsert = {
            name: suggestion!.name,
            culture: suggestion!.culture,
            period: suggestion!.period,
            description: suggestion!.description ?? null,
            function: suggestion!.function ?? null,
            tags: suggestion!.tags ?? null,
            medium: suggestion!.medium ?? null,
            technique: suggestion!.technique ?? null,
            significance: suggestion!.significance ?? null,
            historical_context: suggestion!.historical_context ?? null
          };

          const { data: symbolResp, error: insertError } = await supabase
            .from('symbols')
            .insert([dataToInsert])
            .select();

          if (insertError || !symbolResp?.[0]?.id) {
            throw new Error('Erreur à la création du symbole');
          }

          await supabase.from('collection_symbols').insert([
            {
              collection_id: collection.id,
              symbol_id: symbolResp[0].id,
            }
          ]);

          results.push({
            symbol: symbolResp[0],
            collection,
            error: undefined,
          });
        } catch (err: any) {
          results.push({
            symbol: suggestion!,
            collection,
            error: err?.message || "Erreur inattendue",
          });
        }
      })
    );

    // Mise à jour mémoire pour tous les noms nouvellement créés
    setRecentNames(prev => [
      ...toCreate.filter(p => p.suggestion && p.suggestion.name).map(p => p.suggestion!.name!),
      ...prev,
    ].slice(0, 20));

    setResultStates(results);
    setIsLoading(false);
    setProposals([]);
    setSelectedIndices([]);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkle className="w-5 h-5 text-yellow-500" />
            Générateur Automatique de Symbole Authentique
          </CardTitle>
          <div className="text-sm text-stone-600 mt-2">
            5 symboles générés à la fois pour accélérer la découverte !
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={handleResetMemory}>Vider la mémoire</Button>
            <span className="text-xs text-stone-500">Évite les répétitions récentes.</span>
          </div>
        </CardHeader>
        <CardContent>
          {/* Étape 1 : input thème + generate 5 */}
          {proposals.length === 0 && resultStates.length === 0 && (
            <div>
              <div className="flex gap-2 mb-5">
                <Input
                  placeholder="Thème ou culture (optionnel)"
                  value={theme}
                  onChange={e => setTheme(e.target.value)}
                  disabled={isLoading}
                />
                <Button
                  onClick={handlePropose}
                  variant="default"
                  className="gap-2"
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkle className="w-4 h-4" />}
                  Générer 5 symboles
                </Button>
              </div>
              {duplicateError && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded border border-red-200 mb-3">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span className="flex-1">{duplicateError}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-auto"
                    onClick={() => {
                      setDuplicateError(null);
                      setTheme('');
                      setAttemptLog([]);
                    }}
                  >
                    Réessayer
                  </Button>
                </div>
              )}
            </div>
          )}
          {/* Étape 2 : grille de propositions */}
          {!isLoading && proposals.length > 0 && (
            <div>
              <div className="flex gap-2 mb-4">
                <Button size="sm" variant="outline" onClick={handleSelectAll}>
                  {allSelected ? "Tout désélectionner" : "Tout sélectionner"}
                </Button>
                <span className="text-xs text-teal-700">
                  {selectedIndices.length} sur {proposals.length} sélectionné{selectedIndices.length > 1 ? "s" : ""}
                </span>
                <Button
                  size="sm"
                  variant="default"
                  onClick={handleAcceptAndCreateBatch}
                  disabled={selectedIndices.length === 0}
                  className="ml-auto"
                >
                  Créer {selectedIndices.length > 1 ? `${selectedIndices.length} symboles` : "le symbole sélectionné"}
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {proposals.map((proposal, i) => (
                  <div key={i} className={`relative border rounded-lg bg-stone-50 p-4 flex flex-col items-start ${selectedIndices.includes(i) ? "border-teal-400 shadow-md" : "border-stone-200"}`}>
                    <label className="flex gap-2 items-center cursor-pointer mb-2">
                      <input
                        type="checkbox"
                        checked={selectedIndices.includes(i)}
                        onChange={() => handleToggleSelect(i)}
                        className="accent-teal-600"
                        disabled={proposal.isLoading}
                      />
                      <span className="font-medium text-teal-900">Sélectionner</span>
                    </label>
                    {proposal.isLoading ? (
                      <div className="w-full flex items-center justify-center py-5">
                        <Loader2 className="animate-spin w-6 h-6 text-gray-400" />
                      </div>
                    ) : proposal.error ? (
                      <div className="text-red-500 text-sm">
                        {proposal.error}
                        <Button size="sm" variant="outline" className="mt-2" onClick={() => handleRegenerate(i)}>
                          Régénérer
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div>
                          <span className="font-semibold">
                            {proposal.suggestion?.name || "--"}
                          </span>
                          <span className="text-xs text-gray-500">
                            {" "}
                            ({proposal.suggestion?.culture}
                            {proposal.suggestion?.period ? `, ${proposal.suggestion.period}` : ""})
                          </span>
                        </div>
                        {proposal.suggestion?.description && (
                          <div className="text-xs mt-1 text-stone-600 line-clamp-4">
                            {proposal.suggestion.description}
                          </div>
                        )}
                        {proposal.suggestion?.tags && (
                          <div className="text-xs text-stone-400 mt-2">
                            <b>Tags: </b>{Array.isArray(proposal.suggestion.tags) ? proposal.suggestion.tags.join(', ') : proposal.suggestion.tags}
                          </div>
                        )}
                        <div className="text-xs text-teal-700 mt-2">
                          Collection : <b>
                            {proposal.collection?.collection_translations?.find((tr: any) => tr.language === 'fr')?.title || proposal.collection?.slug}
                          </b>
                        </div>
                        <Button size="sm" variant="ghost" className="mt-3" onClick={() => handleRegenerate(i)}>
                          Régénérer ce symbole
                        </Button>
                      </>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-center mt-5">
                <Button variant="outline" size="sm" onClick={handlePropose}>
                  Générer 5 nouveaux symboles
                </Button>
              </div>
            </div>
          )}

          {/* Résultat final (créations multiples) */}
          {!isLoading && resultStates.length > 0 && (
            <div className="space-y-2 mt-6">
              <div className="font-semibold text-teal-700">
                {resultStates.filter(r=>!r.error).length} symbole(s) ajouté(s) avec succès, {resultStates.filter(r=>r.error).length} échec(s)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {resultStates.map((res, idx) => (
                  <div key={idx} className={`border rounded-lg p-3 ${res.error ? "border-red-300 bg-red-50" : "border-green-300 bg-green-50"}`}>
                    <div>
                      <strong>{res.symbol.name}</strong>{" "}
                      <span className="text-xs text-stone-500">
                        ({res.symbol.culture}{res.symbol.period ? `, ${res.symbol.period}` : ""})
                      </span>
                    </div>
                    {res.error ? (
                      <div className="text-xs text-red-700 mt-2">{res.error}</div>
                    ) : (
                      <>
                        {res.symbol.description && (
                          <div className="text-xs text-stone-600 mt-1">{res.symbol.description}</div>
                        )}
                        <div className="text-xs text-stone-700 mt-1">
                          Collection : <span className="font-bold">{res.collection.collection_translations?.find((tr: any) => tr.language === 'fr')?.title || res.collection.slug}</span>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-end mt-3">
                <Button variant="outline" onClick={() => { setResultStates([]); setProposals([]); }}>
                  Générer d'autres symboles
                </Button>
              </div>
            </div>
          )}

          {isLoading && (
            <div className="text-center text-stone-500 py-8">
              Traitement en cours… Veuillez patienter.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SymbolMCPGenerator;
