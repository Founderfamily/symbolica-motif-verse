
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

const TimelineItem = ({ 
  phase, 
  title, 
  description, 
  isCurrent = false 
}: { 
  phase: string; 
  title: string; 
  description: string; 
  isCurrent?: boolean; 
}) => {
  return (
    <div className={`relative pl-8 ${isCurrent ? "" : "opacity-80"}`}>
      <div className={`absolute left-0 top-0 w-4 h-4 rounded-full ${isCurrent ? "bg-amber-700" : "bg-slate-300"}`}></div>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-lg font-semibold">{title}</h3>
          {isCurrent && <Badge className="bg-amber-700">En cours</Badge>}
        </div>
        <p className="text-sm text-slate-500 mb-1">{phase}</p>
        <p className="text-slate-600">{description}</p>
      </div>
    </div>
  );
};

const TimelineRoadmap = () => {
  return (
    <section className="py-16 px-4 md:px-8 bg-white">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-4 text-center">Notre feuille de route</h2>
        <p className="text-center text-slate-600 mb-10">
          Symbolica se construit progressivement avec votre participation
        </p>
        
        <div className="relative">
          <div className="absolute left-[7px] top-0 bottom-0 w-[2px] bg-slate-200"></div>
          
          <TimelineItem 
            phase="Phase 0 - Terminée"
            title="Prototype" 
            description="Premiers tests des fonctionnalités fondamentales et validation du concept"
          />
          
          <TimelineItem 
            phase="Phase 1 - En cours"
            title="MVP (Minimum Viable Product)" 
            description="Lancement d'une version utilisable avec les fonctionnalités essentielles"
            isCurrent={true}
          />
          
          <TimelineItem 
            phase="Phase 2 - À venir"
            title="Alpha publique" 
            description="Ouverture de la plateforme à un public plus large et intégration des premières fonctionnalités IA"
          />
          
          <TimelineItem 
            phase="Phase 3 - À venir"
            title="Bêta publique" 
            description="Lancement public officiel en version bêta avec une communication plus large"
          />
          
          <TimelineItem 
            phase="Phase 4 - À venir"
            title="Version 1.0" 
            description="Sortie officielle avec toutes les fonctionnalités principales complètes et stables"
          />
        </div>
      </div>
    </section>
  );
};

export default TimelineRoadmap;
