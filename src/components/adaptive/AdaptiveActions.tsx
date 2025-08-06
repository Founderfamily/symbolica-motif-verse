import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

import { 
  Camera, 
  MessageSquare, 
  Map, 
  Search,
  FileText,
  Eye,
  CheckCircle,
  BookOpen,
  Clock,
  Target,
  Award,
  Users
} from 'lucide-react';
import { AdaptiveProfile } from '@/hooks/useUserProfile';

interface AdaptiveActionsProps {
  profile: AdaptiveProfile;
  onAction: (action: string) => void;
  questType?: string;
  questStatus?: string;
}

const AdaptiveActions: React.FC<AdaptiveActionsProps> = ({ profile, onAction, questType, questStatus }) => {
  const { toast } = useToast();
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  const handleActionClick = async (actionId: string) => {
    // Actions simples - pas de modales factices
    console.log('Action simple:', actionId);

    // Actions avec feedback immédiat
    setLoading(actionId);
    
    // Messages d'action réels
    const feedbackMessages = {
      'take_photo': 'Appareil photo ouvert ! Capturez vos découvertes.',
      'chat': 'Chat ouvert ! Partagez vos théories avec l\'équipe.',
      'explore_map': 'Carte interactive ouverte ! Explorez les lieux.',
      'tutorial': 'Guide interactif démarré !',
      'study_discovery': 'Documentation de découverte ouverte !',
    };

    setTimeout(() => {
      toast({
        title: "Action activée !",
        description: feedbackMessages[actionId as keyof typeof feedbackMessages] || "Action en cours de traitement...",
      });
      setLoading(null);
      // Garder l'appel original pour la navigation
      onAction(actionId);
    }, 800);
  };
  const getActionsConfig = () => {
    // Actions spéciales pour les trésors découverts
    const isDiscoveredTreasure = questType === 'found_treasure' || questStatus === 'completed';
    
    if (isDiscoveredTreasure) {
      return getDiscoveredTreasureActions();
    }
    
    switch (profile.type) {
      case 'beginner':
        return {
          title: '🎮 QUE PEUX-TU FAIRE MAINTENANT ?',
          subtitle: 'Choisis ton premier défi !',
          actions: [
            {
              id: 'take_photo',
              title: '📸 Prendre une photo',
              description: 'Trouve un symbole ou indice et photographie-le',
              icon: Camera,
              color: 'bg-blue-500',
              points: '+10 pts',
              difficulty: 'Facile'
            },
            {
              id: 'chat',
              title: '💭 Proposer une théorie',
              description: 'Partage ton idée sur ce que tu penses avoir trouvé',
              icon: MessageSquare,
              color: 'bg-green-500',
              points: '+15 pts',
              difficulty: 'Facile'
            },
            {
              id: 'explore_map',
              title: '🗺️ Explorer la carte',
              description: 'Découvre les lieux déjà explorés par la communauté',
              icon: Map,
              color: 'bg-purple-500',
              points: '+5 pts',
              difficulty: 'Très facile'
            },
            {
              id: 'tutorial',
              title: '🎯 Faire le tutoriel',
              description: 'Apprends les bases en 5 minutes (recommandé !)',
              icon: Target,
              color: 'bg-orange-500',
              points: '+25 pts',
              difficulty: 'Tutoriel'
            }
          ]
        };

      case 'treasure_hunter':
        return {
          title: '⚡ ACTIONS PRIORITAIRES',
          subtitle: 'Explorez et documentez vos découvertes',
          actions: [
            {
              id: 'take_photo',
              title: '📸 Photographier indices',
              description: 'Capturez les symboles et détails importants',
              icon: Camera,
              color: 'bg-emerald-500',
              points: '+20 pts',
              difficulty: 'Terrain'
            },
            {
              id: 'chat',
              title: '💭 Partager théorie',
              description: 'Discutez de vos découvertes avec l\'équipe',
              icon: MessageSquare,
              color: 'bg-blue-500',
              points: '+15 pts',
              difficulty: 'Facile'
            },
            {
              id: 'explore_map',
              title: '🗺️ Consulter la carte',
              description: 'Vérifiez votre position et les zones d\'intérêt',
              icon: Map,
              color: 'bg-purple-500',
              points: '+10 pts',
              difficulty: 'Navigation'
            }
          ]
        };

      case 'historian':
        return {
          title: '📚 DÉCOUVERTES PASSIONNANTES',
          subtitle: 'Votre expertise historique enrichit l\'enquête',
          actions: [
            {
              id: 'validate_sources',
              title: '📋 Valider sources primaires',
              description: '12 documents François Ier - authentification critique',
              icon: BookOpen,
              color: 'bg-emerald-500',
              academic: true,
              complexity: 'Expert'
            },
            {
              id: 'review_methodology',
              title: '🔬 Révision méthodologique',
              description: 'Analyse stratigraphique - protocole à valider',
              icon: Eye,
              color: 'bg-teal-500',
              academic: true,
              complexity: 'Avancé'
            },
            {
              id: 'cross_reference',
              title: '📖 Recoupement bibliographique',
              description: 'Archives nationales vs sources locales',
              icon: Search,
              color: 'bg-blue-500',
              academic: true,
              complexity: 'Intermédiaire'
            },
            {
              id: 'publish_findings',
              title: '📝 Publication collaborative',
              description: 'Rédaction article scientifique communautaire',
              icon: FileText,
              color: 'bg-purple-500',
              academic: true,
              complexity: 'Expert'
            }
          ]
        };

      case 'remote_helper':
        return {
          title: '💻 MICRO-TÂCHES DISPONIBLES',
          subtitle: 'Contributions à distance - Impact immédiat',
          actions: [
            {
              id: 'online_research',
              title: '🔍 Recherche documentaire',
              description: 'Archives numériques BNF - mots-clés ciblés',
              icon: Search,
              color: 'bg-cyan-500',
              remote: true,
              timeEstimate: '15-30 min'
            },
            {
              id: 'photo_analysis',
              title: '📊 Analyse d\'images',
              description: 'Classification automatisée - validation humaine',
              icon: Eye,
              color: 'bg-blue-500',
              remote: true,
              timeEstimate: '10-20 min'
            },
            {
              id: 'transcription',
              title: '✍️ Transcription',
              description: 'Documents manuscrits XVI siècle - aide IA',
              icon: FileText,
              color: 'bg-green-500',
              remote: true,
              timeEstimate: '20-45 min'
            },
            {
              id: 'community_support',
              title: '🤝 Support communauté',
              description: 'Aide aux nouveaux explorateurs - modération',
              icon: Users,
              color: 'bg-purple-500',
              remote: true,
              timeEstimate: '30+ min'
            }
          ]
        };
    }
  };

  const getDiscoveredTreasureActions = () => {
    switch (profile.type) {
      case 'beginner':
        return {
          title: '📚 DÉCOUVERTE ÉDUCATIVE',
          subtitle: 'Apprends comment ce trésor a été trouvé !',
          actions: [
            {
              id: 'study_discovery',
              title: '📚 Étudier la découverte',
              description: 'Comprends comment ce trésor a été localisé et excavé',
              icon: BookOpen,
              color: 'bg-blue-500',
              points: '+15 pts',
              difficulty: 'Éducatif'
            },
            {
              id: 'understand_clues',
              title: '💡 Comprendre les indices',
              description: 'Analyse comment chaque indice a mené à la découverte',
              icon: Search,
              color: 'bg-green-500',
              points: '+20 pts',
              difficulty: 'Facile'
            },
            {
              id: 'view_location',
              title: '🗺️ Voir l\'emplacement trouvé',
              description: 'Explore virtuellement le lieu de la découverte',
              icon: Map,
              color: 'bg-purple-500',
              points: '+10 pts',
              difficulty: 'Très facile'
            },
            {
              id: 'learn_method',
              title: '🎓 Apprendre la méthode',
              description: 'Découvre les techniques utilisées par les chercheurs',
              icon: Target,
              color: 'bg-orange-500',
              points: '+25 pts',
              difficulty: 'Tutoriel'
            }
          ]
        };

      case 'treasure_hunter':
        return {
          title: '📚 ÉTUDE DE DÉCOUVERTE',
          subtitle: 'Analysez cette découverte historique',
          actions: [
            {
              id: 'study_discovery',
              title: '📚 Étudier la découverte',
              description: 'Comprenez comment ce trésor a été localisé',
              icon: BookOpen,
              color: 'bg-emerald-500',
              points: '+25 pts',
              difficulty: 'Éducatif'
            },
            {
              id: 'chat',
              title: '💭 Discuter méthodes',
              description: 'Échangez sur les techniques de recherche',
              icon: MessageSquare,
              color: 'bg-blue-500',
              points: '+15 pts',
              difficulty: 'Collaboratif'
            },
            {
              id: 'explore_map',
              title: '🗺️ Voir l\'emplacement',
              description: 'Explorez le lieu de la découverte sur la carte',
              icon: Map,
              color: 'bg-purple-500',
              points: '+10 pts',
              difficulty: 'Navigation'
            }
          ]
        };

      case 'historian':
        return {
          title: '📋 ÉTUDE HISTORIQUE',
          subtitle: 'Analyse académique de la découverte',
          actions: [
            {
              id: 'analyze_official_report',
              title: '📋 Analyser le rapport officiel',
              description: 'Rapport scientifique complet de la découverte',
              icon: FileText,
              color: 'bg-emerald-500',
              academic: true,
              complexity: 'Expert'
            },
            {
              id: 'study_methodology',
              title: '🔬 Étudier la méthodologie',
              description: 'Protocoles scientifiques et archéologiques employés',
              icon: Eye,
              color: 'bg-teal-500',
              academic: true,
              complexity: 'Avancé'
            },
            {
              id: 'historical_context',
              title: '📖 Contextualisation historique',
              description: 'Replacer la découverte dans son contexte historique',
              icon: BookOpen,
              color: 'bg-blue-500',
              academic: true,
              complexity: 'Recherche'
            },
            {
              id: 'discovery_impact',
              title: '📝 Impact de la découverte',
              description: 'Conséquences historiques et scientifiques',
              icon: Award,
              color: 'bg-purple-500',
              academic: true,
              complexity: 'Analyse'
            }
          ]
        };

      case 'remote_helper':
        return {
          title: '📚 ARCHIVES DÉCOUVERTE',
          subtitle: 'Aide à documenter et partager',
          actions: [
            {
              id: 'archives_discovery',
              title: '📚 Consulter les archives de découverte',
              description: 'Documentation complète de la recherche et découverte',
              icon: BookOpen,
              color: 'bg-cyan-500',
              remote: true,
              timeEstimate: '20-30 min'
            },
            {
              id: 'analyze_historical_photos',
              title: '📊 Analyser les photos historiques',
              description: 'Classification et annotation des images de découverte',
              icon: Camera,
              color: 'bg-blue-500',
              remote: true,
              timeEstimate: '15-25 min'
            },
            {
              id: 'transcribe_testimonies',
              title: '✍️ Transcription des témoignages',
              description: 'Témoignages des découvreurs et experts impliqués',
              icon: FileText,
              color: 'bg-green-500',
              remote: true,
              timeEstimate: '25-40 min'
            },
            {
              id: 'help_newcomers_understand',
              title: '🤝 Aider les nouveaux à comprendre',
              description: 'Guide les débutants dans l\'étude de cette découverte',
              icon: Users,
              color: 'bg-purple-500',
              remote: true,
              timeEstimate: '30+ min'
            }
          ]
        };

      default:
        return {
          title: '📚 TRÉSOR DÉCOUVERT',
          subtitle: 'Ce trésor a déjà été trouvé',
          actions: []
        };
    }
  };

  const config = getActionsConfig();

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-xl font-bold text-foreground mb-1">
          {config.title}
        </h2>
        <p className="text-muted-foreground text-sm">
          {config.subtitle}
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-3">
        {config.actions.slice(0, 3).map((action) => {
          const IconComponent = action.icon;
          
          return (
            <Card 
              key={action.id} 
              className={`p-3 hover:shadow-md transition-all cursor-pointer border-l-2 ${
                action.priority === 'high' ? 'border-l-emerald-500 bg-emerald-50/30' : 
                action.academic ? 'border-l-emerald-500 bg-emerald-50/30' :
                action.educational ? 'border-l-blue-500 bg-blue-50/30' :
                action.remote ? 'border-l-cyan-500 bg-cyan-50/30' :
                'border-l-blue-500 bg-blue-50/30'
              }`}
              onClick={() => handleActionClick(action.id)}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${action.color} text-white relative`}>
                  <IconComponent className={`w-4 h-4 ${loading === action.id ? 'animate-pulse' : ''}`} />
                  {loading === action.id && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground text-sm truncate">
                    {action.title}
                  </h3>
                  <div className="flex items-center gap-1 mt-1">
                    {action.priority === 'high' && (
                      <Badge variant="default" className="text-xs px-1 py-0 bg-emerald-500">
                        NOUVELLE
                      </Badge>
                    )}
                    {action.points && (
                      <span className="text-xs text-muted-foreground">{action.points}</span>
                    )}
                    {action.timeLeft && (
                      <span className="text-xs text-muted-foreground">{action.timeLeft}</span>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

    </div>
  );
};

export default AdaptiveActions;