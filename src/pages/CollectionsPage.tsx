
import React from 'react';
import { useTranslation } from '@/i18n/useTranslation';
import FeaturedCollectionsGrid from '@/components/collections/FeaturedCollectionsGrid';
import CollectionGrid from '@/components/collections/CollectionGrid';
import { Badge } from '@/components/ui/badge';

const CollectionsPage = () => {
  const { currentLanguage } = useTranslation();

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900">
              Collections Culturelles
            </h1>
            <Badge variant="outline" className="text-amber-600 border-amber-600">
              12 collections
            </Badge>
          </div>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
            Explorez des parcours thématiques à travers les symboles du monde entier.
            Découvrez les connexions fascinantes entre cultures et époques.
          </p>
          
          <div className="flex items-center justify-center gap-6 text-sm text-slate-600">
            <span className="flex items-center gap-2">
              🏛️ Mystères & Secrets
            </span>
            <span className="flex items-center gap-2">
              📐 Géométrie Sacrée
            </span>
            <span className="flex items-center gap-2">
              🏺 Mythologies
            </span>
            <span className="flex items-center gap-2">
              💻 Ère Numérique
            </span>
          </div>
        </section>

        {/* Featured Collections */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <h2 className="text-3xl font-bold text-slate-900">
              Collections en Vedette
            </h2>
            <Badge className="bg-amber-600 hover:bg-amber-700">
              Les Plus Populaires
            </Badge>
          </div>
          <FeaturedCollectionsGrid />
        </section>

        {/* All Collections */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-slate-900">
              Toutes les Collections
            </h2>
            <div className="text-sm text-slate-600">
              12 parcours thématiques disponibles
            </div>
          </div>
          <CollectionGrid />
        </section>
      </div>
    </div>
  );
};

export default CollectionsPage;
