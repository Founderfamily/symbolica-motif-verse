
import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from '@/i18n/useTranslation';
import { RoadmapItem, getRoadmapItems } from '@/services/roadmapService';
import { I18nText } from '@/components/ui/i18n-text';

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
  
  return (
    <div className={`relative pl-8 ${isCurrent ? "" : "opacity-80"}`}>
      <div className={`absolute left-0 top-0 w-4 h-4 rounded-full ${
        isCompleted ? "bg-green-500" : isCurrent ? "bg-slate-700" : "bg-slate-300"
      }`}></div>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-lg font-semibold">{title}</h3>
          {isCurrent && <Badge className="bg-slate-700">{t('roadmap.inProgress')}</Badge>}
          {isCompleted && <Badge className="bg-green-600">{t('roadmap.completed')}</Badge>}
        </div>
        <p className="text-sm text-slate-500 mb-1">{phase}</p>
        <p className="text-slate-600">{description}</p>
      </div>
    </div>
  );
};

const TimelineRoadmap = () => {
  const { t, i18n } = useTranslation();
  const [roadmapItems, setRoadmapItems] = useState<RoadmapItem[]>([]);
  const [loading, setLoading] = useState(true);
  
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
  
  const lang = i18n.language || 'fr';
  
  return (
    <section className="py-16 px-4 md:px-8 bg-white">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-4 text-center">
          <I18nText translationKey="sections.roadmap" />
        </h2>
        <p className="text-center text-slate-600 mb-10">
          <I18nText translationKey="roadmap.subtitle" />
        </p>
        
        <div className="relative">
          <div className="absolute left-[7px] top-0 bottom-0 w-[2px] bg-slate-200"></div>
          
          {loading ? (
            // Placeholders while loading
            Array(5).fill(0).map((_, i) => (
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
                title={item.title?.[lang] || ''}
                description={item.description?.[lang] || ''}
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
