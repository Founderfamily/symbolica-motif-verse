
import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from '@/i18n/useTranslation';
import { RoadmapItem, getRoadmapItems } from '@/services/roadmapService';
import { I18nText } from '@/components/ui/i18n-text';
import { useBreakpoint } from '@/hooks/use-breakpoints';

const TimelineItem = ({ 
  phase, 
  title, 
  description, 
  isCurrent = false,
  isCompleted = false
}: { 
  phase: string; 
  title: string; 
  description: string; 
  isCurrent?: boolean;
  isCompleted?: boolean;
}) => {
  const { t } = useTranslation();
  const isMobile = useBreakpoint('sm');

  return (
    <div className={`relative pl-8 mb-8 ${isCurrent ? "" : "opacity-80"}`}>
      <div className={`absolute left-0 top-0 w-4 h-4 rounded-full ${
        isCompleted ? "bg-green-500" : isCurrent ? "bg-slate-700" : "bg-slate-300"
      }`}></div>
      <div className="mb-2">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <h3 className="text-lg font-semibold">{title}</h3>
          {isCurrent && (
            <Badge className="bg-slate-700">
              <I18nText translationKey="roadmap.inProgress" />
            </Badge>
          )}
          {isCompleted && (
            <Badge className="bg-green-600">
              <I18nText translationKey="roadmap.completed" />
            </Badge>
          )}
        </div>
        <p className="text-sm text-slate-500 mb-1">{phase}</p>
        <p className={`text-slate-600 ${isMobile ? 'text-sm' : ''}`}>{description}</p>
      </div>
    </div>
  );
};

const TimelineRoadmap = () => {
  const { t, i18n } = useTranslation();
  const [roadmapItems, setRoadmapItems] = useState<RoadmapItem[]>([]);
  const [loading, setLoading] = useState(true);
  const isMobile = useBreakpoint('sm');
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getRoadmapItems();
        setRoadmapItems(data);
      } catch (error) {
        console.error('Error fetching roadmap items:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Get current language, ensuring we default to a valid option if not available
  const currentLang = i18n.language;
  const lang = currentLang === 'fr' || currentLang === 'en' ? currentLang : 'en';
  
  // Debug information
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('TimelineRoadmap - Current language:', lang);
      console.log('TimelineRoadmap - Available roadmap items:', roadmapItems);
    }
  }, [lang, roadmapItems]);
  
  const getTranslatedContent = (item: RoadmapItem, field: 'title' | 'description', lang: string) => {
    // Try to get content in current language
    const content = item[field]?.[lang];
    
    // If content exists in current language, use it
    if (content) return content;
    
    // Otherwise try to get content in the other language
    const fallbackLang = lang === 'fr' ? 'en' : 'fr';
    const fallbackContent = item[field]?.[fallbackLang];
    
    // Return fallback content or empty string
    return fallbackContent || '';
  };
  
  return (
    <section className="py-12 md:py-16 px-4 md:px-8 bg-white">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-2 md:mb-4 text-center">
          <I18nText translationKey="sections.roadmap" />
        </h2>
        <p className="text-center text-slate-600 mb-8 md:mb-10 text-sm md:text-base">
          <I18nText translationKey="roadmap.subtitle" />
        </p>
        
        <div className="relative">
          <div className="absolute left-[7px] top-0 bottom-0 w-[2px] bg-slate-200"></div>
          
          {loading ? (
            // Placeholders while loading
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="relative pl-8 mb-6 animate-pulse">
                <div className="absolute left-0 top-0 w-4 h-4 rounded-full bg-slate-200"></div>
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-slate-200 rounded"></div>
                  <div className="h-3 w-24 bg-slate-100 rounded"></div>
                  <div className="h-3 w-full bg-slate-100 rounded"></div>
                </div>
              </div>
            ))
          ) : roadmapItems.length > 0 ? (
            roadmapItems.map((item) => (
              <TimelineItem 
                key={item.id}
                phase={item.phase}
                title={getTranslatedContent(item, 'title', lang)}
                description={getTranslatedContent(item, 'description', lang)}
                isCurrent={item.is_current}
                isCompleted={item.is_completed}
              />
            ))
          ) : (
            // Fallback if no roadmap items are available
            <>
              <TimelineItem 
                phase={t('roadmap.fallback.phase0.phase')}
                title={t('roadmap.fallback.phase0.title')}
                description={t('roadmap.fallback.phase0.description')}
                isCompleted={true}
              />
              
              <TimelineItem 
                phase={t('roadmap.fallback.phase1.phase')}
                title={t('roadmap.fallback.phase1.title')} 
                description={t('roadmap.fallback.phase1.description')}
                isCurrent={true}
              />
              
              <TimelineItem 
                phase={t('roadmap.fallback.phase2.phase')}
                title={t('roadmap.fallback.phase2.title')}
                description={t('roadmap.fallback.phase2.description')}
              />
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default TimelineRoadmap;
