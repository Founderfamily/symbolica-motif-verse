
import React from 'react';
import { I18nText } from '@/components/ui/i18n-text';

export const TrendingHeader: React.FC = () => {
  return (
    <div className="text-center mb-12">
      <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
        <I18nText translationKey="title" ns="trending">Tendances</I18nText>
      </h1>
      <p className="text-xl text-slate-600 max-w-3xl mx-auto">
        <I18nText translationKey="description" ns="trending">
          Découvrez les symboles, collections et découvertes les plus populaires de la communauté
        </I18nText>
      </p>
    </div>
  );
};
