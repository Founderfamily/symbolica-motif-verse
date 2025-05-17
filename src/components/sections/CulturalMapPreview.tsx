
import React from 'react';
import { MapPin, Globe } from 'lucide-react';
import { useTranslation } from '@/i18n/useTranslation';
import { I18nText } from '@/components/ui/i18n-text';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const regions = [
  { id: 'europe', name: 'Europe', symbolCount: 245 },
  { id: 'asia', name: 'Asia', symbolCount: 312 },
  { id: 'africa', name: 'Africa', symbolCount: 178 },
  { id: 'americas', name: 'Americas', symbolCount: 203 },
  { id: 'oceania', name: 'Oceania', symbolCount: 94 },
];

const CulturalMapPreview = () => {
  const { t } = useTranslation();
  
  return (
    <section className="py-16 bg-gradient-to-b from-slate-50 to-white px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <span className="px-4 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-green-100 to-emerald-100 text-emerald-800 inline-block mb-2">
            <I18nText translationKey="culturalMap.interactive" />
          </span>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            <I18nText translationKey="culturalMap.title" />
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            <I18nText translationKey="culturalMap.description" />
          </p>
        </div>
        
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">
                <I18nText translationKey="culturalMap.popularRegions" />
              </h3>
              <div className="space-y-2">
                {regions.map((region) => (
                  <div 
                    key={region.id} 
                    className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-slate-400 mr-2" />
                      <span className="text-slate-700">{region.name}</span>
                    </div>
                    <span className="text-xs text-slate-500">{region.symbolCount}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Map preview */}
          <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden">
            <div className="aspect-[16/9] relative bg-slate-100 flex items-center justify-center">
              {/* Placeholder for actual map */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-blue-50">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Globe className="h-24 w-24 text-emerald-200" />
                </div>
              </div>
              
              {/* Map overlay with sample points */}
              <div className="absolute inset-0">
                <div className="absolute top-1/3 left-1/4 w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                <div className="absolute top-1/2 left-2/3 w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                <div className="absolute top-1/4 left-1/2 w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                <div className="absolute top-2/3 left-1/3 w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
              </div>
              
              {/* Coming soon overlay */}
              <div className="absolute inset-0 bg-slate-900/20 flex items-center justify-center">
                <div className="bg-white/90 px-6 py-4 rounded-lg text-center shadow-lg">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    <I18nText translationKey="culturalMap.comingSoon" />
                  </h3>
                  <p className="text-slate-600">
                    <I18nText translationKey="culturalMap.comingSoonDescription" />
                  </p>
                </div>
              </div>
            </div>
            
            {/* Map controls */}
            <div className="p-4 bg-white border-t border-slate-100 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" className="text-slate-700">
                  <MapPin className="h-4 w-4 mr-1" /> 
                  <I18nText translationKey="culturalMap.viewSymbols" />
                </Button>
              </div>
              <Link to="/map">
                <Button size="sm">
                  <I18nText translationKey="culturalMap.fullMap" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CulturalMapPreview;
