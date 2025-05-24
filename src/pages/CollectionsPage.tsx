
import React from 'react';
import { Link } from 'react-router-dom';
import { useFeaturedCollections } from '@/hooks/useCollections';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from '@/i18n/useTranslation';

const CollectionsPage = () => {
  const { data: collections, isLoading } = useFeaturedCollections();
  const { currentLanguage } = useTranslation();

  const getTranslation = (collection: any, field: string) => {
    const translation = collection.collection_translations?.find(
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

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Collections Culturelles
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Explorez des parcours thématiques à travers les symboles du monde entier.
            Découvrez les connexions fascinantes entre cultures et époques.
          </p>
        </section>

        {/* Collections Grid */}
        <section>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections?.map((collection) => (
              <Link
                key={collection.id}
                to={`/collections/${collection.slug}`}
                className="block transition-transform hover:scale-105"
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <CardTitle className="text-xl">
                        {getTranslation(collection, 'title')}
                      </CardTitle>
                      {collection.is_featured && (
                        <Badge variant="default">Featured</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 line-clamp-3">
                      {getTranslation(collection, 'description')}
                    </p>
                    <div className="mt-4 text-sm text-amber-600 font-medium">
                      Explorer cette collection →
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {collections?.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium mb-2">Aucune collection disponible</h3>
              <p className="text-slate-600">
                Les collections seront bientôt disponibles. Revenez plus tard !
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default CollectionsPage;
