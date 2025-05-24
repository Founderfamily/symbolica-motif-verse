
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCollection } from '@/hooks/useCollections';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin, Calendar, Sparkles } from 'lucide-react';
import { useTranslation } from '@/i18n/useTranslation';
import CollectionHero from '@/components/collections/CollectionHero';

const CollectionDetailPage = () => {
  const { slug } = useParams();
  const { data: collection, isLoading } = useCollection(slug || '');
  const { currentLanguage } = useTranslation();

  const getTranslation = (field: string) => {
    const translation = collection?.collection_translations?.find(
      (t: any) => t.language === currentLanguage
    );
    return translation?.[field] || '';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Collection non trouvée</h1>
            <Link to="/collections">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour aux collections
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const symbols = collection.collection_symbols
    ?.sort((a, b) => a.position - b.position)
    ?.map(cs => cs.symbols) || [];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="mb-6">
          <Link to="/collections">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour aux collections
            </Button>
          </Link>
        </div>

        {/* Hero Section */}
        <CollectionHero collection={collection} />

        {/* Collection Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-amber-600 mb-2">
                {symbols.length}
              </div>
              <div className="text-sm text-slate-600">
                Symboles dans cette collection
              </div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {symbols.length > 0 ? symbols.map(s => s.culture).filter((v, i, a) => a.indexOf(v) === i).length : 0}
              </div>
              <div className="text-sm text-slate-600">
                Cultures représentées
              </div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <div className="text-3xl font-bold text-purple-600">
                  25
                </div>
              </div>
              <div className="text-sm text-slate-600">
                Points de réalisation
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Symbols Timeline */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-slate-900">
              Parcours de la Collection
            </h2>
            <Badge variant="outline" className="text-slate-600">
              {symbols.length} étapes
            </Badge>
          </div>
          
          {symbols.length > 0 ? (
            <div className="space-y-6">
              {symbols.map((symbol, index) => (
                <Card key={symbol.id} className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-amber-500">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-300">
                            Étape {index + 1}
                          </Badge>
                          <CardTitle className="text-xl">{symbol.name}</CardTitle>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-600">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {symbol.culture}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {symbol.period}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-700 line-clamp-3 mb-4">
                      {symbol.description}
                    </p>
                    <Link
                      to={`/symbols/${symbol.id}`}
                      className="inline-flex items-center gap-1 text-amber-600 hover:text-amber-700 font-medium transition-colors"
                    >
                      Découvrir ce symbole
                      <ArrowLeft className="w-4 h-4 rotate-180" />
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-dashed border-2 border-slate-300">
              <CardContent className="text-center py-16">
                <div className="text-6xl mb-4">🚧</div>
                <h3 className="text-lg font-medium mb-2 text-slate-700">
                  Collection en cours de création
                </h3>
                <p className="text-slate-600">
                  Cette collection sera bientôt enrichie avec des symboles fascinants.
                  Revenez plus tard pour découvrir ce parcours thématique !
                </p>
              </CardContent>
            </Card>
          )}
        </section>
      </div>
    </div>
  );
};

export default CollectionDetailPage;
