
import React from 'react';
import { Book, Users, Brain, Star } from 'lucide-react';
import { useTranslation } from '@/i18n/useTranslation';
import { I18nText } from '@/components/ui/i18n-text';
import { Badge } from '@/components/ui/badge';

const MuseumCommunityHub = () => {
  const { t } = useTranslation();
  
  return (
    <section className="py-16 bg-gradient-to-b from-slate-50 to-white px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <span className="px-4 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-slate-100 to-slate-200 text-slate-800 inline-block mb-2">
            <I18nText translationKey="museumHub.dualExperience" />
          </span>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            <I18nText translationKey="museumHub.title" />
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
            <I18nText translationKey="museumHub.description" />
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 lg:gap-12">
          {/* Museum Experience */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-xl p-6 md:p-8">
            <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mb-6">
              <Book className="h-8 w-8 text-amber-600" />
            </div>
            
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              <I18nText translationKey="museumHub.museum.title" />
            </h3>
            
            <p className="text-slate-600 mb-6">
              <I18nText translationKey="museumHub.museum.description" />
            </p>
            
            <ul className="space-y-3">
              {[1, 2, 3].map((i) => (
                <li key={i} className="flex items-start">
                  <span className="bg-amber-100 p-1 rounded mr-3 mt-0.5">
                    <Star className="h-4 w-4 text-amber-600" />
                  </span>
                  <span className="text-slate-700">
                    <I18nText translationKey={`museumHub.museum.feature${i}`} />
                  </span>
                </li>
              ))}
            </ul>
            
            <div className="mt-6 pt-6 border-t border-slate-100">
              <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">
                <I18nText translationKey="museumHub.museum.label" />
              </Badge>
            </div>
          </div>
          
          {/* Community Platform */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-xl p-6 md:p-8">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              <I18nText translationKey="museumHub.community.title" />
            </h3>
            
            <p className="text-slate-600 mb-6">
              <I18nText translationKey="museumHub.community.description" />
            </p>
            
            <ul className="space-y-3">
              {[1, 2, 3].map((i) => (
                <li key={i} className="flex items-start">
                  <span className="bg-blue-100 p-1 rounded mr-3 mt-0.5">
                    <Star className="h-4 w-4 text-blue-600" />
                  </span>
                  <span className="text-slate-700">
                    <I18nText translationKey={`museumHub.community.feature${i}`} />
                  </span>
                </li>
              ))}
            </ul>
            
            <div className="mt-6 pt-6 border-t border-slate-100">
              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                <I18nText translationKey="museumHub.community.label" />
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MuseumCommunityHub;
