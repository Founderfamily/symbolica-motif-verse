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

const RECENT_NAMES_KEY = 'symbolRecentNames';

const SymbolMCPGenerator: React.FC = () => {
  const { toast } = useToast();
  const [theme, setTheme] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [proposal, setProposal] = useState<{
    suggestion: Partial<SymbolData>;
    collection: any;
  } | null>(null);
  const [resultState, setResultState] = useState<{
    symbol: Partial<SymbolData>;
    collection: any;
  } | null>(null);
  const [duplicateError, setDuplicateError] = useState<string | null>(null);
  // Memory for recently proposed symbol names to enforce diversity & avoid repeats
  const [recentNames, setRecentNames] = useState<string[]>([]);

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
      throw new Error("Erreur de création de la collection : " + (insertError?.message || 'inconnue'));
    }

    // Ajout des traductions
    await supabase.from('collection_translations').insert([
      {
        collection_id: newCollection[0].id,
        language: 'fr',
        title: capitalize(culture),
        description: `Collection automatique : symboles de la culture ${capitalize(culture)}.`
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

  // Enhanced propose handler to support blacklist & skip repeated names
  const handlePropose = async () => {
    setIsLoading(true);
    setResultState(null);
    setProposal(null);
    setDuplicateError(null);

    let attempt = 0;
    let suggestion: Partial<SymbolData> | null = null;
    let foundDuplicate = false;
    const maxTries = 3;
    // Use local memory and persisted blacklist
    let blacklist = [...recentNames];

    while (attempt < maxTries) {
      foundDuplicate = false;
      try {
        // 1. Générer la suggestion IA (pass blacklist; prompt has a randomizer/nonce in next file)
        suggestion = await generateSymbolSuggestion(theme.trim(), blacklist);

        if (!suggestion?.name || !suggestion?.culture) {
          throw new Error("La génération IA n'a pas renvoyé de nom ou de culture.");
        }

        // Logs for debugging
        console.log("🔁 Nouvelle suggestion IA:", suggestion);

        // 2. Vérifier dans la base si existe déjà (sur nom + culture + période)
        const existingSymbol = await supabaseSymbolService.findSymbolByName(suggestion.name);

        // Notion de vrai doublon : comparer nom et (culture ou période proche)
        if (
          existingSymbol &&
          existingSymbol.name?.toLowerCase().trim() === suggestion.name.toLowerCase().trim() &&
          (
            (!suggestion.culture || (existingSymbol.culture?.toLowerCase() === suggestion.culture.toLowerCase()))
            ||
            (!suggestion.period || (existingSymbol.period?.toLowerCase() === suggestion.period?.toLowerCase()))
          )
        ) {
          foundDuplicate = true;
          // Add proposed name to blacklist for next try, and local session memory
          if (!blacklist.includes(suggestion.name)) {
            blacklist.push(suggestion.name);
          }
          toast({
            title: 'Doublon détecté',
            description: (
              <div>
                <div><b>{suggestion.name}</b> existe déjà dans la base ({existingSymbol.culture}, {existingSymbol.period}).</div>
                <div className="mt-1">Génération d’un autre symbole... (essai {attempt + 1}/{maxTries})</div>
              </div>
            ),
            variant: 'destructive',
          });
          suggestion = null;
          attempt++;
          continue;
        }

        // Also avoid proposing exactly the same name in the blacklist (even if not in DB)
        if (blacklist
          .map(s => s.toLowerCase().trim())
          .includes(suggestion.name.toLowerCase().trim())
        ) {
          foundDuplicate = true;
          toast({
            title: 'Symbole déjà proposé récemment',
            description: (
              <div>
                <div><b>{suggestion.name}</b> a déjà été proposé lors de cette session ou récemment.</div>
                <div className="mt-1">Génération d’un autre symbole... (essai {attempt + 1}/{maxTries})</div>
              </div>
            ),
            variant: 'destructive',
          });
          if (!blacklist.includes(suggestion.name)) {
            blacklist.push(suggestion.name);
          }
          suggestion = null;
          attempt++;
          continue;
        }

        // Aucun doublon : on sort de la boucle
        break;
      } catch (e: any) {
        toast({
          title: 'Erreur IA ou interne',
          description: e.message,
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }
    }

    if (!suggestion) {
      setDuplicateError("Impossible de générer un symbole unique après plusieurs essais. Merci de réessayer avec un autre thème.");
      setIsLoading(false);
      return;
    }

    // 3. Trouver/créer la collection associée
    try {
      const collection = await findOrCreateCollection(suggestion.culture!);

      setProposal({
        suggestion,
        collection,
      });

      // Memorize the new symbol name (keep last 20)
      setRecentNames(prev => {
        const next = [suggestion!.name, ...prev.filter(n => n !== suggestion!.name)];
        return next.slice(0, 20); // ↑ Plus large "mémoire"
      });
    } catch (e: any) {
      toast({
        title: 'Erreur lors de l’association collection',
        description: e.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Étape 2 : Accepter le symbole → création réelle en base
  const handleAcceptAndCreate = async () => {
    if (!proposal?.suggestion || !proposal?.collection) {
      toast({
        title: 'Erreur',
        description: "Aucune proposition active à valider.",
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    setResultState(null);
    try {
      const dataToInsert = {
        name: proposal.suggestion.name,
        culture: proposal.suggestion.culture,
        period: proposal.suggestion.period,
        description: proposal.suggestion.description ?? null,
        function: proposal.suggestion.function ?? null,
        tags: proposal.suggestion.tags ?? null,
        medium: proposal.suggestion.medium ?? null,
        technique: proposal.suggestion.technique ?? null,
        significance: proposal.suggestion.significance ?? null,
        historical_context: proposal.suggestion.historical_context ?? null
      };

      const { data: symbolResp, error: insertError } = await supabase
        .from('symbols')
        .insert([dataToInsert])
        .select();

      if (insertError || !symbolResp?.[0]?.id) {
        throw new Error("Erreur à la création du symbole : " + (insertError?.message || 'inconnue'));
      }

      // Associer à la collection
      await supabase.from('collection_symbols').insert([
        {
          collection_id: proposal.collection.id,
          symbol_id: symbolResp[0].id,
        }
      ]);

      setResultState({
        symbol: symbolResp[0],
        collection: proposal.collection,
      });

      toast({
        title: 'Symbole authentique créé 🎉',
        description: (
          <div>
            <div>
              <b>{symbolResp[0].name}</b> ({symbolResp[0].culture}, {symbolResp[0].period})
            </div>
            <div>
              <span className="italic">Ajouté à la collection :</span>{" "}
              <b>
                {proposal.collection.collection_translations?.find((tr: any) => tr.language === 'fr')?.title ||
                  proposal.collection.slug}
              </b>
            </div>
          </div>
        ),
      });
      setProposal(null);
      setTheme('');
    } catch (e: any) {
      toast({
        title: 'Erreur de création du symbole',
        description: e.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Rejeter la proposition (Recommencer)
  const handleRejectProposal = () => {
    setProposal(null);
    setResultState(null);
    // Reset is *not* necessary; recentNames remains!
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
            1. Propose un symbole vérifié par IA<br />
            2. Vous validez<br />
            3. Il est ajouté à la base relié à la bonne collection
          </div>
        </CardHeader>
        <CardContent>
          {/* Champ de saisie du thème (étape 1) */}
          {!proposal && !resultState && (
            <div>
              <div className="flex gap-2 mb-5">
                <Input
                  placeholder="Thème ou culture (optionnel)"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  disabled={isLoading}
                />
                <Button
                  onClick={handlePropose}
                  variant="default"
                  className="gap-2"
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkle className="w-4 h-4" />}
                  Proposer
                </Button>
              </div>
              {duplicateError && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded border border-red-200 mb-3">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{duplicateError}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-auto"
                    onClick={() => {
                      setDuplicateError(null);
                      setTheme('');
                    }}
                  >
                    Réessayer
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Indication de chargement */}
          {isLoading && (
            <div className="text-center text-stone-500 py-8">
              Traitement en cours… Veuillez patienter.
            </div>
          )}

          {/* Étape 2 : Affichage de la proposition et validation */}
          {!isLoading && proposal && (
            <div className="space-y-3 mt-2 p-4 rounded border bg-stone-50">
              <div className="font-semibold text-stone-800 mb-2">
                Proposition de symbole authentique
              </div>
              <div>
                <span className="font-medium">{proposal.suggestion.name}</span>
                {" "}({proposal.suggestion.culture}, {proposal.suggestion.period})
              </div>
              {proposal.suggestion.description && (
                <div className="text-sm mt-1 text-stone-600">
                  {proposal.suggestion.description}
                </div>
              )}
              {/* Affichage des autres propriétés */}
              {proposal.suggestion.tags && (
                <div className="text-xs text-stone-500">
                  <b>Tags&nbsp;:</b> {Array.isArray(proposal.suggestion.tags) ? proposal.suggestion.tags.join(', ') : proposal.suggestion.tags}
                </div>
              )}
              {proposal.suggestion.significance && (
                <div className="text-xs italic text-stone-500">
                  {proposal.suggestion.significance}
                </div>
              )}
              <div className="mt-3 text-xs text-teal-600">
                Collection cible : <b>
                  {proposal.collection.collection_translations?.find((tr: any) => tr.language === 'fr')?.title ||
                    proposal.collection.slug}
                </b>
              </div>
              <div className="flex gap-2 mt-4 justify-end">
                <Button
                  variant="default"
                  onClick={handleAcceptAndCreate}
                  className="gap-2"
                >
                  <Sparkle className="w-4 h-4" />
                  Accepter et Créer ce Symbole
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleRejectProposal}
                  className="gap-2"
                >
                  Proposer un autre
                </Button>
              </div>
            </div>
          )}

          {/* Résultat final */}
          {!isLoading && resultState && (
            <div className="space-y-2 mt-6 p-4 rounded bg-stone-50 border">
              <div className="font-semibold text-stone-800">
                ✅ Symbole authentique ajouté&nbsp;!
              </div>
              <div>
                <span className="font-medium">{resultState.symbol.name}</span> ({resultState.symbol.culture}, {resultState.symbol.period})
              </div>
              {resultState.symbol.description && (
                <div className="text-sm mt-2 text-stone-600">{resultState.symbol.description}</div>
              )}
              <div className="mt-2 text-xs text-stone-500">
                Collection&nbsp;: <span className="font-bold">{resultState.collection.collection_translations?.find((tr: any) => tr.language === 'fr')?.title || resultState.collection.slug}</span>
              </div>
              <div className="flex justify-end mt-3">
                <Button variant="outline" onClick={() => { setResultState(null); setProposal(null); }}>
                  Ajouter un autre
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SymbolMCPGenerator;
