
import React from 'react';
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
      <div className={`absolute left-0 top-0 w-4 h-4 rounded-full ${isCurrent ? "bg-slate-700" : "bg-slate-300"}`}></div>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-lg font-semibold">{title}</h3>
          {isCurrent && <Badge className="bg-slate-700">En cours</Badge>}
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
            title="Conception et recherche" 
            description="Définition du projet, études préliminaires et identification des besoins des communautés de passionnés"
          />
          
          <TimelineItem 
            phase="Phase 1 - En cours"
            title="Plateforme communautaire" 
            description="Lancement des outils de base permettant le partage, l'analyse et la documentation collaborative des symboles patrimoniaux"
            isCurrent={true}
          />
          
          <TimelineItem 
            phase="Phase 2 - À venir"
            title="Intelligence culturelle" 
            description="Déploiement des algorithmes avancés pour l'identification, la comparaison et l'analyse contextuelle des motifs"
          />
          
          <TimelineItem 
            phase="Phase 3 - À venir"
            title="Cartographie mondiale" 
            description="Développement de la navigation spatiale et temporelle entre les cultures, régions et époques"
          />
          
          <TimelineItem 
            phase="Phase 4 - À venir"
            title="Préservation numérique" 
            description="Infrastructure complète pour la documentation pérenne du patrimoine symbolique mondial"
          />
        </div>
      </div>
    </section>
  );
};

export default TimelineRoadmap;
