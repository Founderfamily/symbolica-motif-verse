
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { generateSymbolSuggestion } from '@/services/aiSymbolGeneratorService';
import { SymbolData } from '@/types/supabase';
import { Loader2, Sparkle } from 'lucide-react';

const SymbolMCPGenerator: React.FC = () => {
  const { toast } = useToast();
  const [theme, setTheme] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resultState, setResultState] = useState<{symbol: Partial<SymbolData>; collection: any;} | null>(null);

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

  const handleGenerateAuto = async () => {
    setIsLoading(true);
    setResultState(null);
    try {
      // 1. Générer le symbole authentique
      const suggestion = await generateSymbolSuggestion(theme.trim());
      if (!suggestion?.culture) {
        throw new Error("La génération IA n'a pas renvoyé de culture.");
      }

      // 2. Chercher/créer la collection associée
      const collection = await findOrCreateCollection(suggestion.culture);

      // 3. Créer le symbole dans la DB
      const dataToInsert = {
        name: suggestion.name,
        culture: suggestion.culture,
        period: suggestion.period,
        description: suggestion.description ?? null,
        function: suggestion.function ?? null,
        tags: suggestion.tags ?? null,
        medium: suggestion.medium ?? null,
        technique: suggestion.technique ?? null,
        significance: suggestion.significance ?? null,
        historical_context: suggestion.historical_context ?? null
      };
      const { data: symbolResp, error: insertError } = await supabase
        .from('symbols')
        .insert([dataToInsert])
        .select();

      if (insertError || !symbolResp?.[0]?.id) {
        throw new Error("Erreur à la création du symbole : " + (insertError?.message || 'inconnue'));
      }

      // 4. Associer à la collection
      await supabase.from('collection_symbols').insert([
        {
          collection_id: collection.id,
          symbol_id: symbolResp[0].id,
        }
      ]);

      setResultState({
        symbol: symbolResp[0],
        collection,
      });

      toast({
        title: 'Symbole authentique créé 🎉',
        description: (
          <div>
            <div>
              <b>{symbolResp[0].name}</b> ({symbolResp[0].culture}, {symbolResp[0].period})
            </div>
            <div>
              <span className="italic">Ajouté à la collection :</span> <b>{collection.collection_translations?.find((tr: any) => tr.language === 'fr')?.title || collection.slug}</b>
            </div>
          </div>
        ),
      });
      setTheme('');
    } catch (e: any) {
      toast({
        title: 'Erreur de génération ou d’insertion',
        description: e.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
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
            Génère, crée et rattache automatiquement un symbole à la bonne collection, tout authentique et vérifié&nbsp;!
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-5">
            <Input
              placeholder="Thème ou culture (optionnel)"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              disabled={isLoading}
            />
            <Button 
              onClick={handleGenerateAuto} 
              variant="default" 
              className="gap-2"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkle className="w-4 h-4" />}
              Générer et Créer
            </Button>
          </div>

          {isLoading && (
            <div className="text-center text-stone-500 py-8">
              Génération et création en cours… Veuillez patienter.
            </div>
          )}

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
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SymbolMCPGenerator;
