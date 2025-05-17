
import React from 'react';
import { Search, Wand } from 'lucide-react';
import { useTranslation } from '@/i18n/useTranslation';
import { I18nText } from '@/components/ui/i18n-text';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const AIDiscoveryTools = () => {
  const { t } = useTranslation();
  
  return (
    <section className="py-16 bg-gradient-to-b from-white to-slate-50 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <span className="px-4 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 inline-block mb-2">
            <I18nText translationKey="aiTools.powered" />
          </span>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            <I18nText translationKey="aiTools.title" />
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            <I18nText translationKey="aiTools.description" />
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left side: Image showcase */}
          <div className="relative">
            <div className="bg-gradient-to-br from-purple-100 to-indigo-100 rounded-2xl p-4 md:p-6 shadow-lg">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <Card className="overflow-hidden bg-white">
                    <CardContent className="p-0">
                      <img 
                        src="/images/symbols/arabesque.png" 
                        alt="Original Pattern" 
                        className="w-full h-auto"
                      />
                    </CardContent>
                  </Card>
                  <Card className="overflow-hidden bg-white">
                    <CardContent className="p-0">
                      <div className="bg-purple-800/10 p-4">
                        <div className="h-32 flex items-center justify-center">
                          <Wand className="h-12 w-12 text-purple-300" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className="space-y-4 mt-8">
                  <Card className="overflow-hidden bg-white">
                    <CardContent className="p-0">
                      <div className="bg-purple-800/5 p-3">
                        <div className="flex items-center">
                          <div className="h-4 w-4 rounded-full bg-purple-200 mr-2"></div>
                          <div className="h-3 w-24 bg-purple-100 rounded"></div>
                        </div>
                        <div className="mt-3 h-2 w-full bg-purple-50 rounded"></div>
                        <div className="mt-2 h-2 w-3/4 bg-purple-50 rounded"></div>
                        <div className="mt-2 h-2 w-5/6 bg-purple-50 rounded"></div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="overflow-hidden bg-white">
                    <CardContent className="p-0">
                      <img 
                        src="/images/symbols/arabesque.png" 
                        alt="Extracted Pattern"
                        className="w-full h-auto opacity-70"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-white/80 px-3 py-1 rounded text-sm text-purple-800 font-medium">
                          <I18nText translationKey="aiTools.patternIdentified" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
            
            {/* Overlay decorative elements */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-purple-200 to-indigo-200 rounded-xl -z-10 transform rotate-6"></div>
            <div className="absolute -top-4 -left-4 w-16 h-16 bg-gradient-to-br from-amber-200 to-amber-100 rounded-xl -z-10 transform -rotate-12"></div>
          </div>
          
          {/* Right side: Feature highlights */}
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start">
                <div className="bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl p-3 mr-4 shadow">
                  {i === 1 && <Search className="h-6 w-6 text-purple-600" />}
                  {i === 2 && <Wand className="h-6 w-6 text-indigo-600" />}
                  {i === 3 && <Search className="h-6 w-6 text-amber-600" />}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">
                    <I18nText translationKey={`aiTools.feature${i}.title`} />
                  </h3>
                  <p className="text-slate-600">
                    <I18nText translationKey={`aiTools.feature${i}.description`} />
                  </p>
                </div>
              </div>
            ))}
            
            <Button size="lg" className="mt-4 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 shadow-md">
              <I18nText translationKey="aiTools.tryIt" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIDiscoveryTools;
