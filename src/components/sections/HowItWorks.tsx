
import React from 'react';
import { Camera, Tag, Compass, Palette } from 'lucide-react';
import { useTranslation } from '@/i18n/useTranslation';
import { I18nText } from '@/components/ui/i18n-text';

const HowItWorks = () => {
  const { t } = useTranslation();
  
  const steps = [
    { 
      step: "1", 
      titleKey: "howItWorks.steps.1.title", 
      descKey: "howItWorks.steps.1.desc",
      icon: Camera,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50"
    },
    { 
      step: "2", 
      titleKey: "howItWorks.steps.2.title", 
      descKey: "howItWorks.steps.2.desc",
      icon: Tag,
      color: "from-amber-500 to-amber-600", 
      bgColor: "bg-amber-50"
    },
    { 
      step: "3", 
      titleKey: "howItWorks.steps.3.title", 
      descKey: "howItWorks.steps.3.desc",
      icon: Compass,
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50"
    },
    { 
      step: "4", 
      titleKey: "howItWorks.steps.4.title", 
      descKey: "howItWorks.steps.4.desc",
      icon: Palette,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50"
    }
  ];

  return (
    <section className="py-16 px-4 md:px-8 bg-slate-50 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-200/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-200/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <span className="px-4 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-slate-200 to-slate-300 text-slate-800 inline-block mb-2">
            <I18nText translationKey="howItWorks.process" />
          </span>
          <h2 className="text-3xl font-bold mb-4 text-center bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            <I18nText translationKey="sections.howItWorks" />
          </h2>
          <p className="text-center text-slate-600 mb-10 max-w-2xl mx-auto">
            <I18nText translationKey="howItWorks.intro" />
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item, i) => (
            <div 
              key={i} 
              className="bg-white p-6 rounded-xl border border-slate-200 relative shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-1"
            >
              <div className={`absolute -top-3 -left-3 w-12 h-12 bg-gradient-to-br ${item.color} rounded-full flex items-center justify-center text-white font-bold shadow-lg shadow-${item.color}/20`}>
                {item.step}
              </div>
              <div className={`w-16 h-16 ${item.bgColor} rounded-2xl flex items-center justify-center mb-4 mt-2 group-hover:scale-110 transition-transform`}>
                <item.icon className={`h-8 w-8 text-gradient-to-r ${item.color} bg-clip-text`} />
              </div>
              <h3 className="text-xl font-semibold mb-2 mt-2 text-slate-800">
                <I18nText translationKey={item.titleKey} />
              </h3>
              <p className="text-slate-600">
                <I18nText translationKey={item.descKey} />
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
