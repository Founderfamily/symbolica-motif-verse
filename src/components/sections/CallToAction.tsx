
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/i18n/useTranslation';
import { Link, useNavigate } from 'react-router-dom';

const CallToAction = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  return (
    <section className="bg-gradient-to-r from-amber-50 to-amber-100 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
          {t('callToAction.joinUs')}
        </h2>
        <p className="text-lg text-slate-700 max-w-3xl mx-auto mb-8">
          {t('callToAction.description')}
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button 
            size="lg" 
            className="bg-amber-600 hover:bg-amber-700 shadow-lg shadow-amber-600/20"
            onClick={() => navigate('/auth')}
          >
            {t('callToAction.join')} <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="border-slate-400 text-slate-700 hover:bg-slate-100"
          >
            {t('callToAction.explore')}
          </Button>
        </div>
        <p className="text-sm text-slate-500 mt-8">
          {t('callToAction.support')}
        </p>
      </div>
    </section>
  );
};

export default CallToAction;
