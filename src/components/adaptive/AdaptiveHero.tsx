import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Rocket, 
  MapPin, 
  BookOpen, 
  Monitor,
  Trophy,
  Target,
  Compass,
  FileText,
  Users
} from 'lucide-react';
import { AdaptiveProfile } from '@/hooks/useUserProfile';

interface AdaptiveHeroProps {
  profile: AdaptiveProfile;
  quest: any;
  onStartAdventure: () => void;
}

const AdaptiveHero: React.FC<AdaptiveHeroProps> = ({ profile, quest, onStartAdventure }) => {
  const getHeroConfig = () => {
    switch (profile.type) {
      case 'beginner':
        return {
          title: '🏆 QUÊTE EXEMPLE - Apprends comment ça marche !',
          subtitle: 'Ton premier pas dans l\'aventure des chasseurs de trésors !',
          description: 'Cette quête te montre tout ce que tu peux faire : trouver des indices, partager tes découvertes, et aider la communauté à résoudre des mystères historiques !',
          cta: '🚀 COMMENCER L\'AVENTURE',
          icon: Rocket,
          badge: 'DÉBUTANT',
          color: 'from-blue-500 to-purple-600'
        };
      
      case 'treasure_hunter':
        return {
          title: '⚡ MISSION TERRAIN ACTIVE',
          subtitle: 'Château de Chambord - Indices en validation',
          description: 'Quête témoin avec 4 indices confirmés sur le terrain. Dernière découverte : fragment de clé métallique (validation en cours). Action recommandée immédiate.',
          cta: '⚡ VOIR ACTIONS URGENTES',
          icon: Target,
          badge: 'TERRAIN',
          color: 'from-orange-500 to-red-600'
        };
      
      case 'historian':
        return {
          title: '📚 VALIDATION ACADÉMIQUE REQUISE',
          subtitle: 'Sources historiques François Ier - Analyse critique',
          description: 'Corpus documentaire de 12 sources primaires nécessitant expertise académique. Contribution à la recherche collaborative sur les symboles royaux Renaissance.',
          cta: '📚 VALIDER SOURCES',
          icon: BookOpen,
          badge: 'ACADÉMIQUE',
          color: 'from-emerald-500 to-teal-600'
        };
      
      case 'remote_helper':
        return {
          title: '💻 CONTRIBUTION À DISTANCE',
          subtitle: 'Micro-tâches disponibles - Impact immédiat',
          description: 'Participe depuis chez toi : recherches numériques, validation de photos, transcription de documents historiques. Chaque contribution compte !',
          cta: '💻 CHOISIR UNE TÂCHE',
          icon: Monitor,
          badge: 'DISTANCE',
          color: 'from-cyan-500 to-blue-600'
        };
    }
  };

  const config = getHeroConfig();
  const IconComponent = config.icon;

  const getSteps = () => {
    switch (profile.type) {
      case 'beginner':
        return [
          { icon: '🔍', text: 'Explore les indices' },
          { icon: '📸', text: 'Partage tes découvertes' },
          { icon: '🏆', text: 'Aide à résoudre l\'énigme' }
        ];
      
      case 'treasure_hunter':
        return [
          { icon: '🗺️', text: 'Vérifier coordonnées GPS' },
          { icon: '📱', text: 'Photos haute résolution' },
          { icon: '⚡', text: 'Validation immédiate' }
        ];
      
      case 'historian':
        return [
          { icon: '📋', text: 'Analyser sources' },
          { icon: '✅', text: 'Valider authenticité' },
          { icon: '📝', text: 'Documenter méthodologie' }
        ];
      
      case 'remote_helper':
        return [
          { icon: '🔍', text: 'Recherches en ligne' },
          { icon: '📊', text: 'Analyse de données' },
          { icon: '🤝', text: 'Support communauté' }
        ];
    }
  };

  return (
    <div className={`relative bg-gradient-to-br ${config.color} text-white overflow-hidden`}>
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-col lg:flex-row gap-6 items-center">
          {/* Contenu principal condensé */}
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-xs">
                {config.badge}
              </Badge>
              {profile.isFirstTime && (
                <Badge variant="outline" className="border-white/30 text-white text-xs">
                  🌟 PREMIÈRE FOIS
                </Badge>
              )}
            </div>
            
            <h1 className="text-2xl lg:text-3xl font-bold leading-tight">
              {config.title}
            </h1>
            
            <p className="text-base opacity-90">
              {config.subtitle}
            </p>

            <Button 
              size="sm" 
              className="bg-white text-gray-900 hover:bg-white/90 shadow-lg font-semibold px-6 py-2"
              onClick={onStartAdventure}
            >
              <IconComponent className="w-4 h-4 mr-2" />
              {config.cta}
            </Button>
          </div>

          {/* Stats essentielles en ligne */}
          <div className="flex items-center gap-4 text-white/90">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4" />
              <span className="text-sm font-medium">4 indices</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="text-sm font-medium">12 explorateurs</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              <span className="text-sm font-medium">75% progression</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdaptiveHero;