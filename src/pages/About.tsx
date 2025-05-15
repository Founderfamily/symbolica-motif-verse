
import React from 'react';
import { useTranslation } from '@/i18n/useTranslation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const About = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-grow">
        {/* Hero section */}
        <section className="bg-gradient-to-r from-amber-50 to-amber-100 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl md:text-4xl font-bold text-center text-slate-800 mb-4">
              {t('about.title')}
            </h1>
            <p className="text-lg text-slate-700 text-center max-w-3xl mx-auto">
              {t('about.subtitle')}
            </p>
          </div>
        </section>

        {/* Mission section */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">
                  {t('about.mission.title')}
                </h2>
                <p className="text-slate-600 mb-4">
                  {t('about.mission.description1')}
                </p>
                <p className="text-slate-600">
                  {t('about.mission.description2')}
                </p>
              </div>
              <div className="bg-amber-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-slate-800 mb-3">
                  {t('about.vision.title')}
                </h3>
                <p className="text-slate-600 mb-4">
                  {t('about.vision.description')}
                </p>
                <div className="flex items-center gap-2 text-amber-700">
                  <span className="inline-block w-2 h-2 bg-amber-500 rounded-full"></span>
                  <span>{t('about.vision.value1')}</span>
                </div>
                <div className="flex items-center gap-2 text-amber-700 mt-2">
                  <span className="inline-block w-2 h-2 bg-amber-500 rounded-full"></span>
                  <span>{t('about.vision.value2')}</span>
                </div>
                <div className="flex items-center gap-2 text-amber-700 mt-2">
                  <span className="inline-block w-2 h-2 bg-amber-500 rounded-full"></span>
                  <span>{t('about.vision.value3')}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Analysis process section */}
        <section className="py-12 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-8 text-center">
              {t('about.analysisProcess.title')}
            </h2>
            
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <p className="text-slate-600 text-center mb-8">
                  {t('about.analysisProcess.subtitle')}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="overflow-hidden">
                    <div className="aspect-video bg-slate-100 flex items-center justify-center">
                      <div className="text-slate-400">{t('uploadTools.process.original')}</div>
                    </div>
                    <div className="p-4 text-center">{t('uploadTools.process.original')}</div>
                  </Card>
                  
                  <Card className="overflow-hidden">
                    <div className="aspect-video bg-slate-100 flex items-center justify-center">
                      <div className="text-slate-400">{t('uploadTools.process.detection')}</div>
                    </div>
                    <div className="p-4 text-center">{t('uploadTools.process.detection')}</div>
                  </Card>
                  
                  <Card className="overflow-hidden">
                    <div className="aspect-video bg-slate-100 flex items-center justify-center">
                      <div className="text-slate-400">{t('uploadTools.process.extraction')}</div>
                    </div>
                    <div className="p-4 text-center">{t('uploadTools.process.extraction')}</div>
                  </Card>
                  
                  <Card className="overflow-hidden">
                    <div className="aspect-video bg-slate-100 flex items-center justify-center">
                      <div className="text-slate-400">{t('uploadTools.process.classification')}</div>
                    </div>
                    <div className="p-4 text-center">{t('uploadTools.process.classification')}</div>
                  </Card>
                </div>
                
                <div className="mt-8 p-4 bg-amber-50 rounded-lg">
                  <h3 className="font-medium text-slate-800 mb-2">{t('uploadTools.process.result')}</h3>
                  <p className="text-amber-700">{t('uploadTools.process.example')}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Team section */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-8 text-center">
              {t('about.team.title')}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="p-6 text-center">
                <div className="w-24 h-24 bg-amber-100 rounded-full mx-auto mb-4"></div>
                <h3 className="text-lg font-medium text-slate-800">{t('about.team.member1.name')}</h3>
                <p className="text-amber-600 mb-2">{t('about.team.member1.role')}</p>
                <p className="text-slate-600 text-sm">{t('about.team.member1.bio')}</p>
              </Card>
              
              <Card className="p-6 text-center">
                <div className="w-24 h-24 bg-amber-100 rounded-full mx-auto mb-4"></div>
                <h3 className="text-lg font-medium text-slate-800">{t('about.team.member2.name')}</h3>
                <p className="text-amber-600 mb-2">{t('about.team.member2.role')}</p>
                <p className="text-slate-600 text-sm">{t('about.team.member2.bio')}</p>
              </Card>
              
              <Card className="p-6 text-center">
                <div className="w-24 h-24 bg-amber-100 rounded-full mx-auto mb-4"></div>
                <h3 className="text-lg font-medium text-slate-800">{t('about.team.member3.name')}</h3>
                <p className="text-amber-600 mb-2">{t('about.team.member3.role')}</p>
                <p className="text-slate-600 text-sm">{t('about.team.member3.bio')}</p>
              </Card>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
