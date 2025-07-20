
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/i18n/useTranslation';
import { useFeaturedCollections } from '@/hooks/useCollections';
import { useCollectionTranslations } from '@/hooks/useCollectionTranslations';
import { BookOpen, Map, Clock, Star, Users, Eye } from 'lucide-react';

const EnhancedFeaturedCollections: React.FC = () => {
  const { t } = useTranslation();
  const { data: collections, isLoading } = useFeaturedCollections();
  const { getTranslation } = useCollectionTranslations();

  // Catégoriser les collections par thème
  const categorizeCollections = () => {
    if (!collections) return { historical: [], cultural: [], mystical: [], others: [] };

    return collections.reduce((acc, collection) => {
      const slug = collection.slug.toLowerCase();
      const title = getTranslation(collection, 'title').toLowerCase();
      
      if (slug.includes('periode-') || title.includes('antique') || title.includes('médiéval') || title.includes('moderne')) {
        acc.historical.push(collection);
      } else if (slug.includes('culture-') || title.includes('celtique') || title.includes('byzantin') || title.includes('nordique')) {
        acc.cultural.push(collection);
      } else if (title.includes('mystère') || title.includes('sacré') || title.includes('magie') || title.includes('occult')) {
        acc.mystical.push(collection);
      } else {
        acc.others.push(collection);
      }
      return acc;
    }, { historical: [], cultural: [], mystical: [], others: [] });
  };

  const getThemeIcon = (category: string) => {
    switch (category) {
      case 'historical': return Clock;
      case 'cultural': return Users;
      case 'mystical': return Star;
      default: return BookOpen;
    }
  };

  const getThemeColor = (category: string) => {
    switch (category) {
      case 'historical': return 'from-amber-500/20 to-orange-500/20';
      case 'cultural': return 'from-blue-500/20 to-indigo-500/20';
      case 'mystical': return 'from-purple-500/20 to-pink-500/20';
      default: return 'from-slate-500/20 to-gray-500/20';
    }
  };

  const getThemeTitle = (category: string) => {
    switch (category) {
      case 'historical': return t('collections.categories.historical', 'Périodes Historiques');
      case 'cultural': return t('collections.categories.cultural', 'Cultures du Monde');
      case 'mystical': return t('collections.categories.mystical', 'Mystères & Sacré');
      default: return t('collections.categories.others', 'Autres Collections');
    }
  };

  if (isLoading) {
    return (
      <section className="relative px-4 md:px-8 max-w-7xl mx-auto py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-64 mb-4"></div>
          <div className="h-4 bg-slate-200 rounded w-96 mb-8"></div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-slate-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const categorizedCollections = categorizeCollections();
  const allCategories = Object.entries(categorizedCollections).filter(([_, collections]) => collections.length > 0);

  return (
    <section className="relative px-4 md:px-8 max-w-7xl mx-auto">
      <div className="relative">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t('collections.featured.title', 'Collections en Vedette')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('collections.featured.subtitle', 'Explorez notre sélection de symboles organisés par thèmes et époques')}
          </p>
        </div>

        <div className="space-y-12">
          {allCategories.map(([category, categoryCollections]) => {
            const IconComponent = getThemeIcon(category);
            return (
              <div key={category} className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${getThemeColor(category)}`}>
                    <IconComponent className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-foreground">
                      {getThemeTitle(category)}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {categoryCollections.length} collection{categoryCollections.length > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryCollections.map((collection) => {
                    const title = getTranslation(collection, 'title');
                    const description = getTranslation(collection, 'description');
                    
                    return (
                      <Link
                        key={collection.id}
                        to={`/collections/${collection.slug}`}
                        className="block transition-all duration-300 hover:scale-105 group"
                      >
                        <Card className="h-full hover:shadow-lg transition-shadow bg-gradient-to-br from-white to-slate-50/50">
                          <CardHeader className="pb-3">
                            <div className="flex justify-between items-start mb-2">
                              <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
                                {title}
                              </CardTitle>
                              {collection.is_featured && (
                                <Badge className="bg-amber-600 hover:bg-amber-700 flex-shrink-0 ml-2">
                                  <Star className="h-3 w-3 mr-1" />
                                  Vedette
                                </Badge>
                              )}
                            </div>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                              {description}
                            </p>
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                <span>Explorer</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Map className="h-3 w-3" />
                                <span>Symboles</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {collections && collections.length > 0 && (
          <div className="text-center mt-12">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
              <Link to="/collections">
                <BookOpen className="h-4 w-4 mr-2" />
                {t('collections.featured.exploreAll', 'Voir toutes les collections')}
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default EnhancedFeaturedCollections;
