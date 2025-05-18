
import React from 'react';
import { useTranslation } from '@/i18n/useTranslation';
import { I18nText } from '@/components/ui/i18n-text';
import Layout from '@/components/layout/Layout';

const ContributionsPage = () => {
  const { t } = useTranslation();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">
          <I18nText translationKey="contributions.title" />
        </h1>
        
        <p className="text-lg mb-8">
          <I18nText translationKey="contributions.description" />
        </p>
      </div>
    </Layout>
  );
};

export default ContributionsPage;
