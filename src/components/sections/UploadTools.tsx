
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, Search, MapPin, Users } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { useTranslation } from '@/i18n/useTranslation';
import { I18nText } from '@/components/ui/i18n-text';

const UploadTools = () => {
  const { t } = useTranslation();
  
  return (
    <section className="py-16 px-4 md:px-8 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-4 text-center">
          <I18nText translationKey="uploadTools.title" />
        </h2>
        <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
          <I18nText translationKey="uploadTools.subtitle" />
        </p>
        
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                  <Upload className="h-5 w-5 text-slate-700" />
                </div>
                <h3 className="text-xl font-semibold">
                  <I18nText translationKey="uploadTools.capture.title" />
                </h3>
              </div>
              <p className="text-slate-600 mb-4">
                <I18nText translationKey="uploadTools.capture.desc" />
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                  <Search className="h-5 w-5 text-slate-700" />
                </div>
                <h3 className="text-xl font-semibold">
                  <I18nText translationKey="uploadTools.analyze.title" />
                </h3>
              </div>
              <p className="text-slate-600 mb-4">
                <I18nText translationKey="uploadTools.analyze.desc" />
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5 text-slate-700" />
                </div>
                <h3 className="text-xl font-semibold">
                  <I18nText translationKey="uploadTools.share.title" />
                </h3>
              </div>
              <p className="text-slate-600 mb-4">
                <I18nText translationKey="uploadTools.share.desc" />
              </p>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <AspectRatio ratio={3/4}>
              <div className="h-full bg-slate-100 rounded-lg p-4 flex flex-col">
                <div className="mb-4 text-left">
                  <h3 className="text-lg font-medium">
                    <I18nText translationKey="uploadTools.process.title" />
                  </h3>
                  <p className="text-sm text-slate-500">
                    <I18nText translationKey="uploadTools.process.subtitle" />
                  </p>
                </div>
                
                <div className="flex-grow grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-md p-2 border border-slate-200 flex flex-col items-center justify-center">
                    <div className="w-full aspect-square bg-slate-200 rounded-md mb-2"></div>
                    <span className="text-xs text-slate-500">
                      <I18nText translationKey="uploadTools.process.original" />
                    </span>
                  </div>
                  
                  <div className="bg-white rounded-md p-2 border border-slate-200 flex flex-col items-center justify-center">
                    <div className="w-full aspect-square bg-slate-200 rounded-md mb-2"></div>
                    <span className="text-xs text-slate-500">
                      <I18nText translationKey="uploadTools.process.detection" />
                    </span>
                  </div>
                  
                  <div className="bg-white rounded-md p-2 border border-slate-200 flex flex-col items-center justify-center">
                    <div className="w-full aspect-square bg-slate-200 rounded-md mb-2"></div>
                    <span className="text-xs text-slate-500">
                      <I18nText translationKey="uploadTools.process.extraction" />
                    </span>
                  </div>
                  
                  <div className="bg-white rounded-md p-2 border border-slate-200 flex flex-col items-center justify-center">
                    <div className="w-full aspect-square bg-slate-200 rounded-md mb-2 flex items-center justify-center">
                      <MapPin className="h-4 w-4 text-slate-400" />
                    </div>
                    <span className="text-xs text-slate-500">
                      <I18nText translationKey="uploadTools.process.classification" />
                    </span>
                  </div>
                </div>
                
                <div className="mt-4 bg-slate-50 p-3 rounded-md border border-slate-200">
                  <div className="text-sm font-medium mb-1">
                    <I18nText translationKey="uploadTools.process.result" />
                  </div>
                  <div className="text-xs text-slate-600">
                    <I18nText translationKey="uploadTools.process.example" />
                  </div>
                  <div className="mt-2 flex gap-1">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-xs rounded">Art Nouveau</span>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-xs rounded">Floral</span>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-xs rounded">Europe</span>
                  </div>
                </div>
              </div>
            </AspectRatio>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UploadTools;
