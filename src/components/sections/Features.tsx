
import React from 'react';
import { MapPin, Book, Search } from 'lucide-react';
import { useTranslation } from '@/i18n/useTranslation';
import { I18nText } from '@/components/ui/i18n-text';

const Features = () => {
  const { t } = useTranslation();
  
  return (
    <section className="py-12 sm:py-16 px-4 md:px-8 bg-gradient-to-b from-white to-amber-50 relative overflow-hidden">
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-5 pattern-grid-lg"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-8 sm:mb-10">
          <span className="px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-medium bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 inline-block mb-2">
            <I18nText translationKey="features.tagline" />
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent">
            <I18nText translationKey="features.title" />
          </h2>
        </div>
        
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 lg:gap-12">
          <div className="bg-white rounded-xl border border-slate-100 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group">
            <div className="h-2 bg-gradient-to-r from-blue-500 to-blue-600 w-full"></div>
            <div className="p-5 sm:p-6">
              <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-blue-100 transition-colors">
                <MapPin className="h-6 sm:h-7 w-6 sm:w-7 text-blue-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-slate-800">
                <I18nText translationKey="features.mapping.title" />
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                <I18nText translationKey="features.mapping.description" />
              </p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-slate-100 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group">
            <div className="h-2 bg-gradient-to-r from-amber-500 to-amber-600 w-full"></div>
            <div className="p-5 sm:p-6">
              <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-2xl bg-amber-50 flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-amber-100 transition-colors">
                <Search className="h-6 sm:h-7 w-6 sm:w-7 text-amber-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-slate-800">
                <I18nText translationKey="features.identification.title" />
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                <I18nText translationKey="features.identification.description" />
              </p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-slate-100 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group sm:col-span-2 md:col-span-1">
            <div className="h-2 bg-gradient-to-r from-emerald-500 to-emerald-600 w-full"></div>
            <div className="p-5 sm:p-6">
              <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-emerald-100 transition-colors">
                <Book className="h-6 sm:h-7 w-6 sm:w-7 text-emerald-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-slate-800">
                <I18nText translationKey="features.documentation.title" />
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                <I18nText translationKey="features.documentation.description" />
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
