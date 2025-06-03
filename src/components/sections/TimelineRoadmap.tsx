
import React from 'react';
import { Badge } from '@/components/ui/badge';
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
  const roadmapItems = [
    {
      id: '1',
      phase: 'Phase 0 - Terminée',
      title: 'Conception et recherche',
      description: 'Définition du projet, études préliminaires et identification des besoins des communautés de passionnés',
      is_current: false,
      is_completed: true
    },
    {
      id: '2',
      phase: 'Phase 1 - En cours',
      title: 'Plateforme communautaire',
      description: 'Lancement des outils de base permettant le partage, l\'analyse et la documentation collaborative des symboles patrimoniaux',
      is_current: true,
      is_completed: false
    },
    {
      id: '3',
      phase: 'Phase 2 - À venir',
      title: 'Intelligence culturelle',
      description: 'Déploiement des algorithmes avancés pour l\'identification, la comparaison et l\'analyse contextuelle des motifs',
      is_current: false,
      is_completed: false
    },
    {
      id: '4',
      phase: 'Phase 3 - À venir',
      title: 'Écosystème global',
      description: 'Expansion internationale et partenariats avec institutions culturelles pour créer un réseau mondial de préservation symbolique',
      is_current: false,
      is_completed: false
    }
  ];
  
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
        
        <div className="relative">
          <div className="absolute left-[7px] top-0 bottom-0 w-[2px] bg-slate-200"></div>
          
          {roadmapItems.map((item) => (
            <TimelineItem 
              key={item.id}
              phase={item.phase}
              title={item.title}
              description={item.description}
              isCurrent={item.is_current}
              isCompleted={item.is_completed}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TimelineRoadmap;
