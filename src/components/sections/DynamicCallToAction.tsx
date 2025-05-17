
import React from 'react';
import { ArrowRight, Library } from 'lucide-react';
import { useTranslation } from '@/i18n/useTranslation';
import { I18nText } from '@/components/ui/i18n-text';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const DynamicCallToAction = () => {
  const { t } = useTranslation();
  
  return (
    <section className="py-16 bg-gradient-to-r from-amber-50 to-amber-100 px-4">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-5 gap-8 items-center">
          <div className="md:col-span-3 space-y-6">
            <span className="px-4 py-1 rounded-full text-sm font-medium bg-white text-amber-800 inline-block mb-2">
              <I18nText translationKey="dynamicCta.joinToday" />
            </span>
            
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              <I18nText translationKey="dynamicCta.title" />
            </h2>
            
            <p className="text-lg text-slate-700">
              <I18nText translationKey="dynamicCta.description" />
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/auth">
                <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white shadow-lg shadow-amber-600/20">
                  <I18nText translationKey="dynamicCta.createAccount" />
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/explore">
                <Button size="lg" variant="outline" className="border-amber-300 bg-white text-amber-800 hover:bg-white/80">
                  <I18nText translationKey="dynamicCta.browseCollection" />
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="md:col-span-2 relative h-40 md:h-64">
            <div className="absolute top-0 right-0 w-24 h-24 md:w-36 md:h-36 bg-white rounded-2xl shadow-xl transform rotate-12 flex items-center justify-center">
              <img 
                src="/images/symbols/fleur-de-lys.png" 
                alt="Symbol" 
                className="w-16 h-16 md:w-24 md:h-24 object-contain"
              />
            </div>
            <div className="absolute bottom-0 left-0 w-24 h-24 md:w-36 md:h-36 bg-white rounded-2xl shadow-xl transform -rotate-12 flex items-center justify-center">
              <img 
                src="/images/symbols/mandala.png" 
                alt="Symbol" 
                className="w-16 h-16 md:w-24 md:h-24 object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DynamicCallToAction;
