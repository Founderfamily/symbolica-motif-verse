
import React from 'react';
import { GraduationCap, School, Library } from 'lucide-react';
import { useTranslation } from '@/i18n/useTranslation';
import { I18nText } from '@/components/ui/i18n-text';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const ResearchEducationTools = () => {
  const { t } = useTranslation();
  
  const tools = [
    { 
      icon: GraduationCap,
      titleKey: "researchTools.tools.1.title",
      descriptionKey: "researchTools.tools.1.description",
      imageIndex: 1
    },
    { 
      icon: School,
      titleKey: "researchTools.tools.2.title",
      descriptionKey: "researchTools.tools.2.description",
      imageIndex: 2
    },
    { 
      icon: Library,
      titleKey: "researchTools.tools.3.title",
      descriptionKey: "researchTools.tools.3.description",
      imageIndex: 3
    },
  ];
  
  return (
    <section className="py-16 bg-gradient-to-b from-slate-50 to-white px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <span className="px-4 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-blue-100 to-indigo-100 text-indigo-800 inline-block mb-2">
            <I18nText translationKey="researchTools.forEducators" />
          </span>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            <I18nText translationKey="researchTools.title" />
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            <I18nText translationKey="researchTools.description" />
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {tools.map((tool, index) => (
            <div key={index} className="bg-white rounded-xl border border-slate-100 shadow-xl overflow-hidden hover:shadow-2xl transition-shadow group">
              <div className="h-48 bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/5 to-indigo-900/10 opacity-30"></div>
                <tool.icon className="h-16 w-16 text-indigo-400 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  <I18nText translationKey={tool.titleKey} />
                </h3>
                <p className="text-slate-600 mb-4">
                  <I18nText translationKey={tool.descriptionKey} />
                </p>
                <Button variant="outline" size="sm" className="w-full mt-2">
                  <I18nText translationKey="researchTools.learnMore" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 md:p-8 shadow">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-semibold text-slate-900 mb-4">
                <I18nText translationKey="researchTools.caseStudy.title" />
              </h3>
              <p className="text-slate-700 mb-6">
                <I18nText translationKey="researchTools.caseStudy.description" />
              </p>
              <Button>
                <I18nText translationKey="researchTools.caseStudy.button" />
              </Button>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="aspect-video bg-slate-100 rounded flex items-center justify-center">
                <Library className="h-12 w-12 text-slate-300" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResearchEducationTools;
