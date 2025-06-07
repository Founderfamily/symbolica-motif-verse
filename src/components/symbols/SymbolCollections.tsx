
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, BookOpen, ArrowRight } from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';
import { useSymbolCollections } from '@/hooks/useSymbolCollections';
import { useTranslation } from '@/i18n/useTranslation';

interface SymbolCollectionsProps {
  symbolId: string | number;
  symbolName: string;
}

export const SymbolCollections: React.FC<SymbolCollectionsProps> = ({ 
  symbolId, 
  symbolName 
}) => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const { data: collections, isLoading, error } = useSymbolCollections(symbolId);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-amber-600" />
            <I18nText translationKey="symbols.collections.title">
              Collections associées
            </I18nText>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-amber-600" />
            <I18nText translationKey="symbols.collections.title">
              Collections associées
            </I18nText>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-500 text-sm">
            <I18nText translationKey="symbols.collections.error">
              Erreur lors du chargement des collections
            </I18nText>
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!collections || collections.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-amber-600" />
            <I18nText translationKey="symbols.collections.title">
              Collections associées
            </I18nText>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-500 text-sm">
            <I18nText translationKey="symbols.collections.empty">
              Ce symbole n'est dans aucune collection pour le moment.
            </I18nText>
          </p>
        </CardContent>
      </Card>
    );
  }

  const handleCollectionClick = (slug: string) => {
    navigate(`/collections/${slug}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-amber-600" />
          <I18nText translationKey="symbols.collections.title">
            Collections associées
          </I18nText>
          <Badge variant="secondary" className="ml-auto">
            {collections.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {collections.map((collection) => {
            // Find the appropriate translation from collection_translations array
            const currentTranslation = collection.collection_translations.find(
              t => t.language === i18n.language
            ) || collection.collection_translations.find(
              t => t.language === 'fr'
            ) || collection.collection_translations.find(
              t => t.language === 'en'
            ) || collection.collection_translations[0];
            
            return (
              <div
                key={collection.id}
                className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-amber-300 hover:bg-amber-50 transition-colors cursor-pointer"
                onClick={() => handleCollectionClick(collection.slug)}
              >
                <div className="flex-1">
                  <h4 className="font-medium text-slate-900 mb-1">
                    {currentTranslation?.title || 'Collection sans titre'}
                  </h4>
                  {currentTranslation?.description && (
                    <p className="text-sm text-slate-600 line-clamp-2">
                      {currentTranslation.description}
                    </p>
                  )}
                  {collection.is_featured && (
                    <Badge variant="outline" className="mt-2 text-xs">
                      <I18nText translationKey="collections.featured">
                        À la une
                      </I18nText>
                    </Badge>
                  )}
                </div>
                <Button variant="ghost" size="sm">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 pt-4 border-t border-slate-200">
          <Button 
            variant="outline" 
            onClick={() => navigate('/collections')}
            className="w-full"
          >
            <I18nText translationKey="symbols.collections.viewAll">
              Voir toutes les collections
            </I18nText>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
