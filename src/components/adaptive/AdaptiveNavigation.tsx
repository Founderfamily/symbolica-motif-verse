import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Gamepad2, 
  Trophy, 
  Users,
  Map, 
  FileText, 
  Target,
  BookOpen,
  CheckCircle,
  Pen,
  Monitor,
  Search,
  Zap,
  Archive
} from 'lucide-react';
import { AdaptiveProfile } from '@/hooks/useUserProfile';

interface AdaptiveNavigationProps {
  profile: AdaptiveProfile;
  activeTab: string;
  onTabChange: (tab: string) => void;
  children: React.ReactNode;
}

const AdaptiveNavigation: React.FC<AdaptiveNavigationProps> = ({ 
  profile, 
  activeTab, 
  onTabChange,
  children 
}) => {
  const getTabsConfig = () => {
    switch (profile.type) {
      case 'beginner':
        return [
          {
            id: 'adventure',
            label: '🎮 Mon Aventure',
            icon: Gamepad2,
            description: 'Découvre et participe'
          },
          {
            id: 'progress',
            label: '🏆 Mes Réussites',
            icon: Trophy,
            description: 'Points et badges'
          },
          {
            id: 'team',
            label: '👫 Équipe',
            icon: Users,
            description: 'Communauté et aide'
          },
          {
            id: 'map',
            label: '🗺️ Carte Interactive',
            icon: Map,
            description: 'Explore les lieux'
          }
        ];

      case 'treasure_hunter':
        return [
          {
            id: 'field',
            label: '🗺️ Terrain',
            icon: Map,
            description: 'Cartes et GPS',
            urgent: 2
          },
          {
            id: 'actions',
            label: '📋 Actions',
            icon: Target,
            description: 'Tâches prioritaires',
            urgent: 3
          },
          {
            id: 'analysis',
            label: '🔬 Analyse',
            icon: FileText,
            description: 'Documentation terrain'
          },
          {
            id: 'live',
            label: '⚡ Live',
            icon: Zap,
            description: 'Activité temps réel'
          }
        ];

      case 'historian':
        return [
          {
            id: 'sources',
            label: '📚 Sources',
            icon: BookOpen,
            description: 'Documents et références',
            pending: 12
          },
          {
            id: 'validation',
            label: '⚖️ Validation',
            icon: CheckCircle,
            description: 'Révision académique',
            pending: 5
          },
          {
            id: 'publications',
            label: '🖊️ Publications',
            icon: Pen,
            description: 'Articles collaboratifs'
          },
          {
            id: 'methodology',
            label: '🔬 Méthodologie',
            icon: FileText,
            description: 'Protocoles de recherche'
          }
        ];

      case 'remote_helper':
        return [
          {
            id: 'tasks',
            label: '💻 Tâches',
            icon: Monitor,
            description: 'Micro-contributions',
            available: 8
          },
          {
            id: 'research',
            label: '🔍 Recherches',
            icon: Search,
            description: 'Archives numériques'
          },
          {
            id: 'analysis',
            label: '⭐ Analyse',
            icon: Target,
            description: 'Validation données'
          },
          {
            id: 'support',
            label: '🤝 Support',
            icon: Users,
            description: 'Aide communauté'
          }
        ];
    }
  };

  const tabs = getTabsConfig();

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-4 h-auto p-1">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          
          return (
            <TabsTrigger 
              key={tab.id} 
              value={tab.id}
              className="flex flex-col items-center gap-2 h-auto py-3 px-2 relative"
            >
              <div className="relative">
                <IconComponent className="w-5 h-5" />
                
                {/* Badges pour notifications */}
                {tab.urgent && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 w-5 h-5 p-0 text-xs flex items-center justify-center"
                  >
                    {tab.urgent}
                  </Badge>
                )}
                
                {tab.pending && (
                  <Badge 
                    variant="secondary" 
                    className="absolute -top-2 -right-2 w-5 h-5 p-0 text-xs flex items-center justify-center"
                  >
                    {tab.pending}
                  </Badge>
                )}
                
                {tab.available && (
                  <Badge 
                    variant="outline" 
                    className="absolute -top-2 -right-2 w-5 h-5 p-0 text-xs flex items-center justify-center bg-green-100 text-green-700 border-green-300"
                  >
                    {tab.available}
                  </Badge>
                )}
              </div>
              
              <div className="text-center">
                <div className="text-xs font-medium leading-tight">
                  {tab.label}
                </div>
                <div className="text-xs text-muted-foreground mt-1 hidden sm:block">
                  {tab.description}
                </div>
              </div>
            </TabsTrigger>
          );
        })}
      </TabsList>

      {/* Le contenu des onglets est géré par le composant parent */}
      {children}
    </Tabs>
  );
};

export default AdaptiveNavigation;