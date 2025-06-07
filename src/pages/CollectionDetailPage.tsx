
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCollection } from '@/hooks/useCollections';
import { useCollectionTranslations } from '@/hooks/useCollectionTranslations';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Map, Grid, Share2, BookOpen } from 'lucide-react';
import { useTranslation } from '@/i18n/useTranslation';
import { I18nText } from '@/components/ui/i18n-text';
import { Skeleton } from '@/components/ui/skeleton';
import { SymbolGrid } from '@/components/search/SymbolGrid';
import { SymbolData } from '@/types/supabase';

const CollectionDetailPage = React.memo(() => {
  const { slug } = useParams<{ slug: string }>();
  const { currentLanguage } = useTranslation();
  const { data: collection, isLoading } = useCollection(slug || '');
  const { getTranslation } = useCollectionTranslations();

  console.log('CollectionDetailPage - slug:', slug, 'collection:', collection);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-6">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-24 w-full" />
            <div className="grid md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-64 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">
            <I18nText translationKey="collections.notFound">Collection non trouvée</I18nText>
          </h1>
          <p className="text-slate-600 mb-4">
            Le slug recherché : "{slug}"
          </p>
          <Link to="/collections">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              <I18nText translationKey="collections.backToCollections">Retour aux collections</I18nText>
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Convert collection symbols to SymbolData format
  const symbols: SymbolData[] = collection.collection_symbols?.map(cs => ({
    id: cs.symbols.id,
    name: cs.symbols.name,
    culture: cs.symbols.culture,
    period: cs.symbols.period,
    description: cs.symbols.description || null,
    created_at: cs.symbols.created_at || null,
    updated_at: cs.symbols.updated_at || null,
    medium: cs.symbols.medium || null,
    technique: cs.symbols.technique || null,
    function: cs.symbols.function || null,
    translations: cs.symbols.translations || null
  })) || [];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="mb-6">
          <Link to="/collections">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              <I18nText translationKey="collections.backToCollections">Retour aux collections</I18nText>
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
                  {getTranslation(collection, 'title')}
                </h1>
                {collection.is_featured && (
                  <Badge className="bg-amber-600">
                    <I18nText translationKey="collections.featuredBadge">En vedette</I18nText>
                  </Badge>
                )}
              </div>
              
              <p className="text-lg text-slate-600 mb-6 max-w-3xl">
                {getTranslation(collection, 'description')}
              </p>
              
              <div className="flex items-center gap-4 text-sm text-slate-500">
                <span className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  {symbols.length} <I18nText translationKey="collections.symbolsCount">symboles</I18nText>
                </span>
                <span>•</span>
                <span>
                  <I18nText translationKey="collections.createdOn">Créée le</I18nText> {new Date(collection.created_at).toLocaleDateString(currentLanguage === 'fr' ? 'fr-FR' : 'en-US')}
                </span>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                <I18nText translationKey="collections.share">Partager</I18nText>
              </Button>
              <Button variant="outline" size="sm">
                <Map className="w-4 h-4 mr-2" />
                <I18nText translationKey="collections.viewOnMap">Voir sur la carte</I18nText>
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-slate-900">{symbols.length}</div>
              <div className="text-sm text-slate-600">
                <I18nText translationKey="collections.symbolsCount">Symboles</I18nText>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-slate-900">
                {[...new Set(symbols.map(s => s.culture))].length}
              </div>
              <div className="text-sm text-slate-600">
                <I18nText translationKey="collections.culturesCount">Cultures</I18nText>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-slate-900">
                {[...new Set(symbols.map(s => s.period))].length}
              </div>
              <div className="text-sm text-slate-600">
                <I18nText translationKey="collections.periodsCount">Périodes</I18nText>
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator className="my-8" />

        {/* Symbols Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">
              <I18nText translationKey="collections.symbolsInCollection">Symboles de la collection</I18nText>
            </h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Grid className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Map className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {symbols.length > 0 ? (
            <SymbolGrid symbols={symbols} />
          ) : (
            <Card className="p-8 text-center">
              <p className="text-slate-500">
                <I18nText translationKey="collections.noSymbols">Aucun symbole dans cette collection</I18nText>
              </p>
            </Card>
          )}
        </section>
      </div>
    </div>
  );
});

CollectionDetailPage.displayName = 'CollectionDetailPage';

export default CollectionDetailPage;
