
import React, { useEffect } from 'react';
import { useTranslation } from '@/i18n/useTranslation';
import { I18nText } from '@/components/ui/i18n-text';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Layout from '@/components/layout/Layout';

const AboutPage = () => {
  const { t, validateCurrentPageTranslations } = useTranslation();

  // In development mode, automatically validate translations on this page
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // Small delay to ensure all components are rendered
      const timer = setTimeout(() => {
        validateCurrentPageTranslations();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [validateCurrentPageTranslations]);

  return (
    <Layout>
      <div className="min-h-screen flex flex-col bg-white">
        <main className="flex-grow">
          {/* Hero section */}
          <section className="bg-gradient-to-r from-amber-50 to-amber-100 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <I18nText
                translationKey="about.title"
                as="h1"
                className="text-3xl md:text-4xl font-bold text-center text-slate-800 mb-4"
              />
              <I18nText
                translationKey="about.subtitle"
                as="p"
                className="text-lg text-slate-700 text-center max-w-3xl mx-auto"
              />
            </div>
          </section>

          {/* Mission section */}
          <section className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <I18nText
                    translationKey="about.mission.title"
                    as="h2"
                    className="text-2xl font-bold text-slate-800 mb-4"
                  />
                  <I18nText
                    translationKey="about.mission.description1"
                    as="p"
                    className="text-slate-600 mb-4"
                  />
                  <I18nText
                    translationKey="about.mission.description2"
                    as="p"
                    className="text-slate-600"
                  />
                </div>
                <div className="bg-amber-50 p-6 rounded-xl">
                  <I18nText
                    translationKey="about.vision.title"
                    as="h3"
                    className="text-xl font-semibold text-slate-800 mb-3"
                  />
                  <I18nText
                    translationKey="about.vision.description"
                    as="p"
                    className="text-slate-600 mb-4"
                  />
                  <div className="flex items-center gap-2 text-amber-700">
                    <span className="inline-block w-2 h-2 bg-amber-500 rounded-full"></span>
                    <I18nText
                      translationKey="about.vision.value1"
                      as="span"
                    />
                  </div>
                  <div className="flex items-center gap-2 text-amber-700 mt-2">
                    <span className="inline-block w-2 h-2 bg-amber-500 rounded-full"></span>
                    <I18nText
                      translationKey="about.vision.value2" 
                      as="span"
                    />
                  </div>
                  <div className="flex items-center gap-2 text-amber-700 mt-2">
                    <span className="inline-block w-2 h-2 bg-amber-500 rounded-full"></span>
                    <I18nText
                      translationKey="about.vision.value3"
                      as="span"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          {/* Analysis process section */}
          <section className="py-12 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <I18nText
                translationKey="about.analysisProcess.title"
                as="h2"
                className="text-2xl font-bold text-slate-800 mb-8 text-center"
              />
              
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6">
                  <I18nText
                    translationKey="about.analysisProcess.subtitle"
                    as="p"
                    className="text-slate-600 text-center mb-8"
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="overflow-hidden">
                      <div className="aspect-video bg-slate-100 flex items-center justify-center">
                        <div className="text-slate-400">
                          <I18nText translationKey="uploadTools.process.original" as="span" />
                        </div>
                      </div>
                      <div className="p-4 text-center">
                        <I18nText translationKey="uploadTools.process.original" as="div" />
                      </div>
                    </Card>
                    
                    <Card className="overflow-hidden">
                      <div className="aspect-video bg-slate-100 flex items-center justify-center">
                        <div className="text-slate-400">
                          <I18nText translationKey="uploadTools.process.detection" as="span" />
                        </div>
                      </div>
                      <div className="p-4 text-center">
                        <I18nText translationKey="uploadTools.process.detection" as="div" />
                      </div>
                    </Card>
                    
                    <Card className="overflow-hidden">
                      <div className="aspect-video bg-slate-100 flex items-center justify-center">
                        <div className="text-slate-400">
                          <I18nText translationKey="uploadTools.process.extraction" as="span" />
                        </div>
                      </div>
                      <div className="p-4 text-center">
                        <I18nText translationKey="uploadTools.process.extraction" as="div" />
                      </div>
                    </Card>
                    
                    <Card className="overflow-hidden">
                      <div className="aspect-video bg-slate-100 flex items-center justify-center">
                        <div className="text-slate-400">
                          <I18nText translationKey="uploadTools.process.classification" as="span" />
                        </div>
                      </div>
                      <div className="p-4 text-center">
                        <I18nText translationKey="uploadTools.process.classification" as="div" />
                      </div>
                    </Card>
                  </div>
                  
                  <div className="mt-8 p-4 bg-amber-50 rounded-lg">
                    <I18nText
                      translationKey="uploadTools.process.result"
                      as="h3"
                      className="font-medium text-slate-800 mb-2"
                    />
                    <I18nText
                      translationKey="uploadTools.process.example"
                      as="p"
                      className="text-amber-700"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          {/* Team section */}
          <section className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <I18nText
                translationKey="about.team.title"
                as="h2"
                className="text-2xl font-bold text-slate-800 mb-8 text-center"
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <Card className="p-6 text-center">
                  <div className="w-24 h-24 bg-amber-100 rounded-full mx-auto mb-4"></div>
                  <I18nText
                    translationKey="about.team.member1.name"
                    as="h3"
                    className="text-lg font-medium text-slate-800"
                  />
                  <I18nText
                    translationKey="about.team.member1.role"
                    as="p"
                    className="text-amber-600 mb-2"
                  />
                  <I18nText
                    translationKey="about.team.member1.bio"
                    as="p"
                    className="text-slate-600 text-sm"
                  />
                </Card>
                
                <Card className="p-6 text-center">
                  <div className="w-24 h-24 bg-amber-100 rounded-full mx-auto mb-4"></div>
                  <I18nText
                    translationKey="about.team.member2.name"
                    as="h3"
                    className="text-lg font-medium text-slate-800"
                  />
                  <I18nText
                    translationKey="about.team.member2.role"
                    as="p"
                    className="text-amber-600 mb-2"
                  />
                  <I18nText
                    translationKey="about.team.member2.bio"
                    as="p"
                    className="text-slate-600 text-sm"
                  />
                </Card>
                
                <Card className="p-6 text-center">
                  <div className="w-24 h-24 bg-amber-100 rounded-full mx-auto mb-4"></div>
                  <I18nText
                    translationKey="about.team.member3.name"
                    as="h3" 
                    className="text-lg font-medium text-slate-800"
                  />
                  <I18nText
                    translationKey="about.team.member3.role"
                    as="p"
                    className="text-amber-600 mb-2"
                  />
                  <I18nText
                    translationKey="about.team.member3.bio"
                    as="p"
                    className="text-slate-600 text-sm"
                  />
                </Card>
              </div>
            </div>
          </section>
        </main>
      </div>
    </Layout>
  );
};

export default AboutPage;
