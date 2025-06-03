
import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { I18nText } from '@/components/ui/i18n-text';
import { useTranslation } from '@/i18n/useTranslation';
import { getRoadmapItems, RoadmapItem } from '@/services/roadmapService';

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
  return (
    <div className={`relative pl-8 ${isCurrent ? "" : "opacity-80"}`}>
      <div className={`absolute left-0 top-0 w-4 h-4 rounded-full ${
        isCompleted ? "bg-green-500" : isCurrent ? "bg-slate-700" : "bg-slate-300"
      }`}></div>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-lg font-semibold">{title}</h3>
          {isCurrent && <Badge className="bg-slate-700"><I18nText translationKey="roadmap.inProgress">En cours</I18nText></Badge>}
          {isCompleted && <Badge className="bg-green-600"><I18nText translationKey="roadmap.completed">Terminé</I18nText></Badge>}
        </div>
        <p className="text-sm text-slate-500 mb-1">{phase}</p>
        <p className="text-slate-600">{description}</p>
      </div>
    </div>
  );
};

const TimelineRoadmap = () => {
  const { i18n } = useTranslation();
  const [roadmapItems, setRoadmapItems] = useState<RoadmapItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoadmapItems = async () => {
      try {
        const data = await getRoadmapItems();
        setRoadmapItems(data);
      } catch (error) {
        console.error('Error fetching roadmap items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmapItems();
  }, []);

  if (loading) {
    return (
      <section className="py-16 px-4 md:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-center">
            <I18nText translationKey="sections.roadmap">Notre Feuille de Route</I18nText>
          </h2>
          <p className="text-center text-slate-600 mb-10">
            <I18nText translationKey="roadmap.subtitle">
              Symbolica se construit progressivement avec votre participation
            </I18nText>
          </p>
          <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-amber-500 rounded-full animate-spin"></div>
          </div>
        </div>
      </section>
    );
  }
  
  return (
    <section className="py-16 px-4 md:px-8 bg-white">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-4 text-center">
          <I18nText translationKey="sections.roadmap">Notre Feuille de Route</I18nText>
        </h2>
        <p className="text-center text-slate-600 mb-10">
          <I18nText translationKey="roadmap.subtitle">
            Symbolica se construit progressivement avec votre participation
          </I18nText>
        </p>
        
        {roadmapItems.length === 0 ? (
          <div className="text-center text-slate-500">
            <p>Aucune étape de la feuille de route disponible pour le moment.</p>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute left-[7px] top-0 bottom-0 w-[2px] bg-slate-200"></div>
            
            {roadmapItems.map((item) => (
              <TimelineItem 
                key={item.id}
                phase={item.phase}
                title={item.title?.[i18n.language] || item.title?.fr || 'Titre non disponible'}
                description={item.description?.[i18n.language] || item.description?.fr || 'Description non disponible'}
                isCurrent={item.is_current}
                isCompleted={item.is_completed}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TimelineRoadmap;
