
import React from 'react';
import { I18nText } from '@/components/ui/i18n-text';
import { cn } from '@/lib/utils';

const partners = [
  {
    name: 'British Museum',
    logo: '/path/to/british-museum-logo.svg',
    width: 'w-36'
  },
  {
    name: 'UNESCO',
    logo: '/path/to/unesco-logo.svg',
    width: 'w-24'
  },
  {
    name: 'Smithsonian',
    logo: '/path/to/smithsonian-logo.svg',
    width: 'w-32'
  },
  {
    name: 'Louvre Museum',
    logo: '/path/to/louvre-logo.svg',
    width: 'w-28'
  }
];

const Partners = () => {
  return (
    <section className="py-12 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
            <I18nText translationKey="sections.partners" />
          </h2>
          
          <div className="flex flex-wrap justify-center gap-12 items-center mt-10">
            {partners.map((partner, index) => (
              <div 
                key={index}
                className={cn("grayscale hover:grayscale-0 transition-all duration-300", 
                  partner.width || "w-28")}
              >
                {/* Placeholder for actual logos */}
                <div className="h-12 bg-slate-200 flex items-center justify-center rounded">
                  {partner.name}
                </div>
              </div>
            ))}
          </div>
          
          <p className="mt-8 text-slate-600">
            <I18nText translationKey="sections.contactUs" /> 
          </p>
        </div>
      </div>
    </section>
  );
};

export default Partners;
