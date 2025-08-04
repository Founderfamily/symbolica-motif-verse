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
  FileText
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
      <div className="relative max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Contenu principal */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                {config.badge}
              </Badge>
              {profile.isFirstTime && (
                <Badge variant="outline" className="border-white/30 text-white">
                  🌟 PREMIÈRE FOIS
                </Badge>
              )}
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
              {config.title}
            </h1>
            
            <p className="text-xl opacity-90">
              {config.subtitle}
            </p>
            
            <p className="text-white/80 text-lg">
              {config.description}
            </p>

            {/* Étapes rapides */}
            <div className="flex flex-wrap gap-4 pt-4">
              {getSteps().map((step, index) => (
                <div key={index} className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg">
                  <span className="text-lg">{step.icon}</span>
                  <span className="text-sm font-medium">{step.text}</span>
                </div>
              ))}
            </div>

            <Button 
              size="lg" 
              className="bg-white text-gray-900 hover:bg-white/90 shadow-lg font-semibold px-8 py-3 text-lg"
              onClick={onStartAdventure}
            >
              <IconComponent className="w-5 h-5 mr-2" />
              {config.cta}
            </Button>
          </div>

          {/* Stats visuelles */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-white/10 border-white/20 text-white p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Compass className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold">4</div>
                  <div className="text-sm opacity-80">🔍 Indices trouvés</div>
                </div>
              </div>
            </Card>
            
            <Card className="bg-white/10 border-white/20 text-white p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Trophy className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold">12</div>
                  <div className="text-sm opacity-80">⚡ Explorateurs</div>
                </div>
              </div>
            </Card>
            
            <Card className="bg-white/10 border-white/20 text-white p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold">3</div>
                  <div className="text-sm opacity-80">📍 Lieux actifs</div>
                </div>
              </div>
            </Card>
            
            <Card className="bg-white/10 border-white/20 text-white p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold">75%</div>
                  <div className="text-sm opacity-80">📋 Progression</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdaptiveHero;