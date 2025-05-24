
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCollection } from '@/hooks/useCollections';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin, Calendar } from 'lucide-react';
import { useTranslation } from '@/i18n/useTranslation';

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
        {/* Header */}
        <div className="mb-8">
          <Link to="/collections">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour aux collections
            </Button>
          </Link>
          
          <div className="flex items-center gap-4 mb-4">
            <h1 className="text-4xl font-bold text-slate-900">
              {getTranslation('title')}
            </h1>
            {collection.is_featured && (
              <Badge variant="default">En vedette</Badge>
            )}
          </div>
          
          <p className="text-xl text-slate-600 max-w-3xl">
            {getTranslation('description')}
          </p>
        </div>

        {/* Symbols Timeline */}
        <section>
          <h2 className="text-2xl font-bold mb-6">
            Symboles de cette collection ({symbols.length})
          </h2>
          
          <div className="grid gap-6">
            {symbols.map((symbol, index) => (
              <Card key={symbol.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{index + 1}</Badge>
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
                  <p className="text-slate-700 line-clamp-3">
                    {symbol.description}
                  </p>
                  <Link
                    to={`/symbols/${symbol.id}`}
                    className="inline-block mt-4 text-amber-600 hover:text-amber-700 font-medium"
                  >
                    En savoir plus →
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          {symbols.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <h3 className="text-lg font-medium mb-2">Aucun symbole dans cette collection</h3>
                <p className="text-slate-600">
                  Cette collection sera bientôt enrichie avec des symboles fascinants.
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
