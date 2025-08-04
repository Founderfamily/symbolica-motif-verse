import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
}

const AdaptiveActions: React.FC<AdaptiveActionsProps> = ({ profile, onAction }) => {
  const getActionsConfig = () => {
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
                action.remote ? 'border-l-cyan-500 bg-cyan-50/50' :
                'border-l-blue-500 bg-blue-50/50'
              }`}
              onClick={() => onAction(action.id)}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${action.color} text-white`}>
                  <IconComponent className="w-6 h-6" />
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
    </div>
  );
};

export default AdaptiveActions;