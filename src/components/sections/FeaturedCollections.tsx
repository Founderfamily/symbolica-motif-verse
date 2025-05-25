
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import FeaturedCollectionsGrid from '@/components/collections/FeaturedCollectionsGrid';
import { I18nText } from '@/components/ui/i18n-text';

const FeaturedCollections: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            <I18nText translationKey="collections.featured.title" />
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
            <I18nText translationKey="collections.featured.description" />
          </p>
        </div>

        <FeaturedCollectionsGrid />
        
        <div className="text-center mt-12">
          <Link to="/collections">
            <Button size="lg" className="bg-amber-600 hover:bg-amber-700">
              <I18nText translationKey="collections.featured.discoverAll" />
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollections;
