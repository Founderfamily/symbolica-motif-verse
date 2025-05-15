
import React, { useEffect, useState } from 'react';
import { useTranslation } from '@/i18n/useTranslation';
import { ContentSection, getContentSectionByKey } from '@/services/contentService';
import { Partner, getPartners } from '@/services/partnersService';
import { Link } from 'react-router-dom';

const Partners = () => {
  const { t, i18n } = useTranslation();
  const [partnersContent, setPartnersContent] = useState<ContentSection | null>(null);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [contentData, partnersData] = await Promise.all([
          getContentSectionByKey('partners'),
          getPartners(true) // Only active partners
        ]);
        
        setPartnersContent(contentData);
        setPartners(partnersData);
      } catch (error) {
        console.error('Error fetching partners data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const lang = i18n.language || 'fr';
  const title = partnersContent?.title?.[lang] || t('sections.partners');
  const subtitle = partnersContent?.subtitle?.[lang] || t('sections.partnerIntro');
  const content = partnersContent?.content?.[lang] || t('sections.interested');
  
  return (
    <section className="py-16 px-4 md:px-8 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-4 text-center">{title}</h2>
        <p className="text-center text-slate-600 mb-10 max-w-2xl mx-auto">
          {subtitle}
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {loading ? (
            // Placeholders while loading
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 flex items-center justify-center h-24 border border-slate-200 animate-pulse">
                <div className="w-32 h-8 bg-slate-200 rounded"></div>
              </div>
            ))
          ) : partners.length > 0 ? (
            partners.map((partner) => (
              <div 
                key={partner.id} 
                className="bg-white rounded-xl p-6 flex items-center justify-center h-24 border border-slate-200 hover:shadow-md transition-shadow"
              >
                {partner.logo_url ? (
                  <img 
                    src={partner.logo_url} 
                    alt={partner.name} 
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <div className="text-slate-600 font-semibold">{partner.name}</div>
                )}
              </div>
            ))
          ) : (
            // Fallback if no partners are available
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 flex items-center justify-center h-24 border border-slate-200">
                <div className="text-slate-400 font-semibold">Institution {i+1}</div>
              </div>
            ))
          )}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-slate-600">
            {content} <Link to="/about" className="text-amber-700 hover:underline font-medium">{t('sections.contactUs')}</Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Partners;
