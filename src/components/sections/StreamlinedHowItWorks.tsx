
import React from 'react';
import { Search, BookOpen, Users } from 'lucide-react';
import { useTranslation } from '@/i18n/useTranslation';
import { I18nText } from '@/components/ui/i18n-text';

const StreamlinedHowItWorks = () => {
  const { t } = useTranslation();
  
  const steps = [
    { 
      icon: Search,
      colorClass: "bg-blue-50",
      iconColorClass: "text-blue-600",
      titleKey: "streamlinedHow.steps.1.title",
      descKey: "streamlinedHow.steps.1.description"
    },
    { 
      icon: BookOpen,
      colorClass: "bg-amber-50",
      iconColorClass: "text-amber-600",
      titleKey: "streamlinedHow.steps.2.title",
      descKey: "streamlinedHow.steps.2.description"
    },
    { 
      icon: Users,
      colorClass: "bg-emerald-50",
      iconColorClass: "text-emerald-600",
      titleKey: "streamlinedHow.steps.3.title",
      descKey: "streamlinedHow.steps.3.description"
    }
  ];
  
  return (
    <section className="py-16 bg-white px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <span className="px-4 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-slate-100 to-slate-200 text-slate-800 inline-block mb-2">
            <I18nText translationKey="streamlinedHow.simple" />
          </span>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            <I18nText translationKey="streamlinedHow.title" />
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            <I18nText translationKey="streamlinedHow.description" />
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connecting line between steps (desktop only) */}
          <div className="hidden md:block absolute top-24 left-[calc(16.67%+8px)] right-[calc(16.67%+8px)] h-[2px] bg-slate-200">
            <div className="absolute top-1/2 left-1/3 transform -translate-y-1/2 w-4 h-4 bg-slate-100 rounded-full border-2 border-slate-200"></div>
            <div className="absolute top-1/2 right-1/3 transform -translate-y-1/2 w-4 h-4 bg-slate-100 rounded-full border-2 border-slate-200"></div>
          </div>
          
          {steps.map((step, index) => (
            <div key={index} className="text-center relative">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6 mx-auto shadow-sm z-10 relative">
                <div className={`w-full h-full rounded-full ${step.colorClass}`}></div>
                <step.icon className={`absolute w-8 h-8 ${step.iconColorClass}`} />
                <div className="absolute -right-2 -top-2 w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center text-xs font-medium text-slate-700">
                  {index + 1}
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-slate-900 mb-3">
                <I18nText translationKey={step.titleKey} />
              </h3>
              
              <p className="text-slate-600">
                <I18nText translationKey={step.descKey} />
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StreamlinedHowItWorks;
