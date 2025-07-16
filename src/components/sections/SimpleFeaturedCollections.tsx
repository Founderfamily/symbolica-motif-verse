import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/i18n/useTranslation';
import { Compass, BookOpen, Map, Star } from 'lucide-react';

const SimpleFeaturedCollections: React.FC = () => {
  const { t } = useTranslation();

  const featuredItems = [
    {
      id: '1',
      title: t('collections.featured.geometry'),
      description: t('collections.featured.geometryDesc'),
      icon: Star,
      href: '/collections'
    },
    {
      id: '2', 
      title: t('collections.featured.mysteries'),
      description: t('collections.featured.mysteriesDesc'),
      icon: Compass,
      href: '/collections'
    },
    {
      id: '3',
      title: t('collections.featured.traditions'),
      description: t('collections.featured.traditionsDesc'),
      icon: BookOpen,
      href: '/collections'
    },
    {
      id: '4',
      title: t('collections.featured.universal'),
      description: t('collections.featured.universalDesc'),
      icon: Map,
      href: '/collections'
    }
  ];

  return (
    <section className="relative px-4 md:px-8 max-w-7xl mx-auto">
      <div className="relative">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t('collections.featured.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('collections.featured.subtitle')}
          </p>
        </div>

        <div className="mb-8">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-stone-200">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.id}
                    to={item.href}
                    className="block transition-all duration-300 hover:scale-105 group"
                  >
                    <div className="bg-white/80 rounded-xl p-6 shadow-md hover:shadow-lg border border-stone-200 group-hover:border-primary/30 transition-all">
                      <div className="flex items-center mb-4">
                        <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors mr-3">
                          <IconComponent className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {item.title}
                        </h3>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {item.description}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        <div className="text-center">
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
            <Link to="/collections">
              {t('collections.featured.exploreAll')}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default SimpleFeaturedCollections;