
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar } from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';
import { WorldMap } from '@/components/ui/WorldMap';

interface FilteredCollectionGridProps {
  collections: any[];
  getCollectionTitle: (collection: any) => string;
  getCollectionDescription: (collection: any) => string;
}

export const FilteredCollectionGrid: React.FC<FilteredCollectionGridProps> = ({
  collections,
  getCollectionTitle,
  getCollectionDescription
}) => {
  if (collections.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-slate-400 text-lg mb-4">
          <I18nText translationKey="collections.noResults">Aucune collection trouvée</I18nText>
        </div>
        <p className="text-slate-500">
          <I18nText translationKey="collections.noResultsMessage">
            Essayez de modifier vos critères de recherche ou de filtrage.
          </I18nText>
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Carte du Monde Interactive Mapbox */}
      <div className="mb-12">
        <WorldMap 
          onRegionClick={(region) => {
            console.log('Région sélectionnée:', region);
            // TODO: Filtrer les collections par région
          }}
          className="w-full"
        />
      </div>

      {/* Grille des Collections */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {collections.map((collection) => (
          <Card key={collection.id} className="h-full hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start mb-2">
                <CardTitle className="text-lg font-bold text-gray-900">
                  {getCollectionTitle(collection)}
                </CardTitle>
                {collection.is_featured && (
                  <Badge className="bg-blue-600 text-white px-3 py-1">
                    <I18nText translationKey="collections.featuredBadge">Vedette</I18nText>
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm line-clamp-3 mb-6 leading-relaxed">
                {getCollectionDescription(collection)}
              </p>
              
              {/* Boutons d'action améliorés */}
              <div className="space-y-2">
                <Link to={`/collections/${collection.slug}`} className="block">
                  <Button variant="outline" size="sm" className="w-full group hover:bg-gray-50 border-gray-300">
                    <I18nText translationKey="collections.explore">explorer</I18nText>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to={`/collections/${collection.slug}/timeline`} className="block">
                  <Button size="sm" className="w-full group bg-blue-600 hover:bg-blue-700">
                    <I18nText translationKey="collections.timeline">timeline</I18nText>
                    <Calendar className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
};
