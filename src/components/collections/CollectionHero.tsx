
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CollectionWithTranslations } from '@/types/collections';
import { useTranslation } from '@/i18n/useTranslation';

interface CollectionHeroProps {
  collection: CollectionWithTranslations;
}

const CollectionHero: React.FC<CollectionHeroProps> = ({ collection }) => {
  const { currentLanguage } = useTranslation();

  const getTranslation = (field: string) => {
    const translation = collection.collection_translations?.find(
      (t: any) => t.language === currentLanguage
    );
    return translation?.[field] || '';
  };

  return (
    <div className="relative bg-gradient-to-br from-amber-50 to-slate-100 rounded-2xl p-8 mb-8">
      <div className="max-w-3xl">
        <div className="flex items-center gap-4 mb-4">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900">
            {getTranslation('title')}
          </h1>
          {collection.is_featured && (
            <Badge variant="default" className="bg-amber-600 hover:bg-amber-700">
              En vedette
            </Badge>
          )}
        </div>
        
        <p className="text-xl text-slate-700 leading-relaxed">
          {getTranslation('description')}
        </p>
        
        <div className="mt-6 flex items-center gap-4 text-sm text-slate-600">
          <span className="flex items-center gap-1">
            📚 Collection thématique
          </span>
          <span className="flex items-center gap-1">
            🌍 Symboles du monde entier
          </span>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-4 right-4 text-6xl opacity-10">
        🔮
      </div>
      <div className="absolute bottom-4 right-8 text-4xl opacity-10">
        ✨
      </div>
    </div>
  );
};

export default CollectionHero;
