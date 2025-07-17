
import React from 'react';
import { useTranslation } from '@/i18n/useTranslation';
import { I18nText } from '@/components/ui/i18n-text';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const AboutPage = () => {
  const { t } = useTranslation();

  return (
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
        
        {/* Classification methodology section */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <I18nText
              translationKey="about.methodology.title"
              as="h2"
              className="text-2xl font-bold text-slate-800 mb-8 text-center"
            >
              Classification Internationale
            </I18nText>
            
            <div className="bg-slate-50 rounded-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                <I18nText
                  translationKey="about.methodology.subtitle"
                  as="h3"
                  className="text-lg font-semibold text-slate-800"
                >
                  Standards Académiques UNESCO
                </I18nText>
              </div>
              
              <I18nText
                translationKey="about.methodology.description"
                as="p"
                className="text-slate-600 mb-8"
              >
                Notre plateforme adopte les standards de classification chronologique reconnus 
                internationalement par l'UNESCO et les institutions académiques mondiales.
              </I18nText>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="p-6 border-l-4 border-amber-500">
                  <h4 className="font-semibold text-slate-800 mb-2">Préhistoire</h4>
                  <p className="text-sm text-slate-600 mb-3">Avant 3000 av. J.-C.</p>
                  <p className="text-sm text-slate-500">
                    Paléolithique, Mésolithique, Néolithique, Âge du Bronze initial
                  </p>
                </Card>
                
                <Card className="p-6 border-l-4 border-blue-500">
                  <h4 className="font-semibold text-slate-800 mb-2">Antiquité</h4>
                  <p className="text-sm text-slate-600 mb-3">3000 av. J.-C. - 476 ap. J.-C.</p>
                  <p className="text-sm text-slate-500">
                    Civilisations antiques : Égypte, Grèce, Rome, Mésopotamie
                  </p>
                </Card>
                
                <Card className="p-6 border-l-4 border-green-500">
                  <h4 className="font-semibold text-slate-800 mb-2">Moyen Âge</h4>
                  <p className="text-sm text-slate-600 mb-3">476 - 1453 ap. J.-C.</p>
                  <p className="text-sm text-slate-500">
                    Période médiévale européenne et civilisations contemporaines
                  </p>
                </Card>
                
                <Card className="p-6 border-l-4 border-purple-500">
                  <h4 className="font-semibold text-slate-800 mb-2">Moderne</h4>
                  <p className="text-sm text-slate-600 mb-3">1453 - 1789 ap. J.-C.</p>
                  <p className="text-sm text-slate-500">
                    Renaissance, Baroque, Enlightenment, découvertes
                  </p>
                </Card>
                
                <Card className="p-6 border-l-4 border-red-500">
                  <h4 className="font-semibold text-slate-800 mb-2">Contemporain</h4>
                  <p className="text-sm text-slate-600 mb-3">1789 - Présent</p>
                  <p className="text-sm text-slate-500">
                    Révolutions, industrialisation, époque moderne
                  </p>
                </Card>
              </div>
              
              <Separator className="my-8" />
              
              <div className="bg-white rounded-lg p-6">
                <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Algorithme Intelligent
                </h4>
                <div className="space-y-3 text-sm text-slate-600">
                  <div className="flex items-start gap-3">
                    <span className="font-medium text-amber-600">•</span>
                    <span>Classification automatique des périodes multi-séculaires</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="font-medium text-amber-600">•</span>
                    <span>Analyse des bornes chronologiques précises (av./ap. J.-C.)</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="font-medium text-amber-600">•</span>
                    <span>Respect des spécificités culturelles et régionales</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="font-medium text-amber-600">•</span>
                    <span>Validation par expertise académique internationale</span>
                  </div>
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
  );
};

export default AboutPage;
