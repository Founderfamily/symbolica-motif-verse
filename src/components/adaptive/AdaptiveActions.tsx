import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import ActionModals from '@/components/actions/ActionModals';
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
    // Actions qui ouvrent des modales spécialisées
    const modalActions = [
      'take_photo', 'verify_coordinates', 'validate_sources', 
      'online_research', 'chat', 'document_discovery'
    ];
    
    if (modalActions.includes(actionId)) {
      setSelectedAction(actionId);
      return;
    }

    // Actions avec feedback immédiat
    setLoading(actionId);
    
    // Feedback spécifique selon l'action
    const feedbackMessages = {
      'explore_map': 'Carte interactive chargée ! Explore les zones découvertes.',
      'tutorial': 'Tutoriel démarré ! Suis le guide pas-à-pas.',
      'field_search': 'Zone de recherche activée ! Secteur Nord-Est priorisé.',
      'validate_clue': 'Interface de validation ouverte ! Commence l\'authentification.',
      'review_methodology': 'Protocole d\'analyse affiché ! Révision méthodologique en cours.',
      'cross_reference': 'Bases de données connectées ! Recoupement bibliographique actif.',
      'publish_findings': 'Éditeur collaboratif ouvert ! Commence la rédaction.',
      'photo_analysis': 'Interface d\'analyse chargée ! Sélectionne les images à classifier.',
      'transcription': 'Éditeur de transcription prêt ! Documents manuscrits chargés.',
      'community_support': 'Panneau de modération ouvert ! Nouveaux messages à traiter.',
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
          title: '⚡ ACTIONS TERRAIN PRIORITAIRES',
          subtitle: 'Missions actives sur le site',
          actions: [
            {
              id: 'verify_coordinates',
              title: '📍 Vérifier coordonnées GPS',
              description: 'Escalier secret signalé - confirmation requise',
              icon: Target,
              color: 'bg-red-500',
              urgent: true,
              timeLeft: '2h restantes'
            },
            {
              id: 'document_discovery',
              title: '📋 Documenter découverte',
              description: 'Fragment métallique - photos haute définition',
              icon: FileText,
              color: 'bg-orange-500',
              urgent: true,
              timeLeft: 'En cours'
            },
            {
              id: 'field_search',
              title: '🔍 Recherche guidée',
              description: 'Secteur Nord-Est non exploré - potentiel élevé',
              icon: Search,
              color: 'bg-yellow-500',
              urgent: false,
              reward: 'Bonus découverte'
            },
            {
              id: 'validate_clue',
              title: '✅ Valider sur terrain',
              description: 'Salamandre sculptée - authentification requise',
              icon: CheckCircle,
              color: 'bg-green-500',
              urgent: false,
              reward: '+50 pts'
            }
          ]
        };

      case 'historian':
        return {
          title: '📚 VALIDATIONS ACADÉMIQUES REQUISES',
          subtitle: 'Expertise historique demandée',
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
          title: '🔍 ANALYSE TECHNIQUE',
          subtitle: 'Étudie les méthodes de découverte',
          actions: [
            {
              id: 'analyze_techniques',
              title: '📖 Analyser les techniques utilisées',
              description: 'Méthodes de détection et d\'excavation employées',
              icon: Search,
              color: 'bg-emerald-500',
              educational: true,
              complexity: 'Technique'
            },
            {
              id: 'study_tools',
              title: '🔍 Étudier les outils employés',
              description: 'Détecteurs, GPS, matériel d\'excavation utilisés',
              icon: Target,
              color: 'bg-blue-500',
              educational: true,
              complexity: 'Pratique'
            },
            {
              id: 'view_discovery_photos',
              title: '📸 Voir les photos de découverte',
              description: 'Documentation photographique complète du processus',
              icon: Camera,
              color: 'bg-purple-500',
              educational: true,
              complexity: 'Visuel'
            },
            {
              id: 'apply_to_quests',
              title: '🎯 Appliquer à d\'autres quêtes',
              description: 'Utilise ces méthodes pour tes prochaines recherches',
              icon: Award,
              color: 'bg-orange-500',
              educational: true,
              complexity: 'Application'
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
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          {config.title}
        </h2>
        <p className="text-muted-foreground text-lg">
          {config.subtitle}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {config.actions.map((action) => {
          const IconComponent = action.icon;
          
          return (
            <Card 
              key={action.id} 
              className={`p-6 hover:shadow-lg transition-all cursor-pointer border-l-4 ${
                action.urgent ? 'border-l-red-500 bg-red-50/50' : 
                action.academic ? 'border-l-emerald-500 bg-emerald-50/50' :
                action.educational ? 'border-l-blue-500 bg-blue-50/50' :
                action.remote ? 'border-l-cyan-500 bg-cyan-50/50' :
                'border-l-blue-500 bg-blue-50/50'
              }`}
              onClick={() => handleActionClick(action.id)}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${action.color} text-white relative`}>
                  <IconComponent className={`w-6 h-6 ${loading === action.id ? 'animate-pulse' : ''}`} />
                  {loading === action.id && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-foreground">
                      {action.title}
                    </h3>
                    <div className="flex gap-2">
                      {action.urgent && (
                        <Badge variant="destructive" className="text-xs">
                          URGENT
                        </Badge>
                      )}
                      {action.academic && (
                        <Badge variant="secondary" className="text-xs">
                          ACADÉMIQUE
                        </Badge>
                      )}
                      {action.educational && (
                        <Badge variant="secondary" className="text-xs">
                          ÉDUCATIF
                        </Badge>
                      )}
                      {action.remote && (
                        <Badge variant="outline" className="text-xs">
                          DISTANCE
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground text-sm">
                    {action.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex gap-3 text-xs text-muted-foreground">
                      {action.points && (
                        <div className="flex items-center gap-1">
                          <Award className="w-3 h-3" />
                          {action.points}
                        </div>
                      )}
                      {action.timeLeft && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {action.timeLeft}
                        </div>
                      )}
                      {action.timeEstimate && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {action.timeEstimate}
                        </div>
                      )}
                      {action.difficulty && (
                        <Badge variant="outline" className="text-xs">
                          {action.difficulty}
                        </Badge>
                      )}
                      {action.complexity && (
                        <Badge variant="outline" className="text-xs">
                          {action.complexity}
                        </Badge>
                      )}
                    </div>
                    
                    {(action.reward || action.urgent) && (
                      <div className="text-xs font-medium text-primary">
                        {action.reward || 'Action prioritaire'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <ActionModals
        isOpen={selectedAction !== null}
        onClose={() => setSelectedAction(null)}
        actionType={selectedAction || ''}
        userProfile={profile.type}
      />
    </div>
  );
};

export default AdaptiveActions;