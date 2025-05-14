
import React from 'react';
import { useTranslation } from '@/i18n/useTranslation';

const Partners = () => {
  const { t } = useTranslation();
  
  return (
    <section className="py-16 px-4 md:px-8 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-4 text-center">{t('sections.partners')}</h2>
        <p className="text-center text-slate-600 mb-10 max-w-2xl mx-auto">
          {t('sections.partnerIntro')}
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl p-6 flex items-center justify-center h-24 border border-slate-200">
              <div className="text-slate-400 font-semibold">Institution {i}</div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-slate-600">
            {t('sections.interested')} <a href="#" className="text-amber-700 hover:underline font-medium">{t('sections.contactUs')}</a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Partners;
