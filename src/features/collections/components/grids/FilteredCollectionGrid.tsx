
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar } from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';

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
      {/* Carte du Monde Interactive */}
      <div className="mb-12 p-8 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl border border-blue-200">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-blue-900 mb-2">
            <I18nText translationKey="collections.worldMap.title">Explorez les cultures du monde</I18nText>
          </h2>
          <p className="text-blue-700">
            <I18nText translationKey="collections.worldMap.subtitle">Cliquez sur une région pour découvrir ses symboles</I18nText>
          </p>
        </div>
        
        {/* Carte simplifiée avec régions cliquables */}
        <div className="relative max-w-4xl mx-auto">
          <svg viewBox="0 0 800 400" className="w-full h-auto border border-blue-300 rounded-lg bg-blue-50">
            {/* Europe */}
            <rect x="320" y="120" width="80" height="60" fill="#3b82f6" fillOpacity="0.7" 
                  className="hover:fillOpacity-90 cursor-pointer transition-all" rx="4"/>
            <text x="360" y="155" textAnchor="middle" className="fill-white text-xs font-medium">Europe</text>
            
            {/* Asie */}
            <rect x="450" y="100" width="120" height="80" fill="#10b981" fillOpacity="0.7" 
                  className="hover:fillOpacity-90 cursor-pointer transition-all" rx="4"/>
            <text x="510" y="145" textAnchor="middle" className="fill-white text-xs font-medium">Asie</text>
            
            {/* Afrique */}
            <rect x="320" y="200" width="90" height="100" fill="#f59e0b" fillOpacity="0.7" 
                  className="hover:fillOpacity-90 cursor-pointer transition-all" rx="4"/>
            <text x="365" y="255" textAnchor="middle" className="fill-white text-xs font-medium">Afrique</text>
            
            {/* Amérique du Nord */}
            <rect x="180" y="80" width="100" height="80" fill="#ef4444" fillOpacity="0.7" 
                  className="hover:fillOpacity-90 cursor-pointer transition-all" rx="4"/>
            <text x="230" y="125" textAnchor="middle" className="fill-white text-xs font-medium">Am. Nord</text>
            
            {/* Amérique du Sud */}
            <rect x="200" y="180" width="80" height="100" fill="#8b5cf6" fillOpacity="0.7" 
                  className="hover:fillOpacity-90 cursor-pointer transition-all" rx="4"/>
            <text x="240" y="235" textAnchor="middle" className="fill-white text-xs font-medium">Am. Sud</text>
            
            {/* Océanie */}
            <rect x="580" y="220" width="70" height="50" fill="#06b6d4" fillOpacity="0.7" 
                  className="hover:fillOpacity-90 cursor-pointer transition-all" rx="4"/>
            <text x="615" y="250" textAnchor="middle" className="fill-white text-xs font-medium">Océanie</text>
          </svg>
        </div>
        
        {/* Légende */}
        <div className="flex flex-wrap justify-center gap-4 mt-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-600 rounded"></div>
            <span>Patrimoine Français</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-emerald-600 rounded"></div>
            <span>Traditions Asiatiques</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-amber-600 rounded"></div>
            <span>Civilisations Africaines</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-600 rounded"></div>
            <span>Cultures Amérindiennes</span>
          </div>
        </div>
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
