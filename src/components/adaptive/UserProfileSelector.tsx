import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Rocket,
  Compass, 
  BookOpen, 
  Monitor,
  User,
  Settings
} from 'lucide-react';
import { UserProfileType } from '@/hooks/useUserProfile';

interface UserProfileSelectorProps {
  currentProfile: UserProfileType;
  onProfileChange: (profile: UserProfileType) => void;
  isOpen: boolean;
  onClose: () => void;
}

const UserProfileSelector: React.FC<UserProfileSelectorProps> = ({ 
  currentProfile, 
  onProfileChange, 
  isOpen,
  onClose 
}) => {
  if (!isOpen) return null;

  const profiles = [
    {
      type: 'beginner' as UserProfileType,
      title: '🚀 Débutant Explorateur',
      description: 'Je découvre le monde des chasseurs de trésors et veux apprendre les bases',
      features: ['Interface gamifiée', 'Tutoriels guidés', 'Points et badges', 'Communauté bienveillante'],
      icon: Rocket,
      color: 'from-blue-500 to-purple-600',
      ideal: 'Parfait pour les nouveaux utilisateurs et les jeunes explorateurs'
    },
    {
      type: 'treasure_hunter' as UserProfileType,
      title: '🗺️ Chasseur de Terrain',
      description: 'Je vais sur le terrain, je recherche physiquement et documente mes découvertes',
      features: ['Outils terrain', 'GPS intégré', 'Actions prioritaires', 'Validation rapide'],
      icon: Compass,
      color: 'from-orange-500 to-red-600',
      ideal: 'Pour ceux qui explorent physiquement les sites historiques'
    },
    {
      type: 'historian' as UserProfileType,
      title: '📚 Historien Expert',
      description: 'Je valide les sources, analyse la méthodologie et contribue académiquement',
      features: ['Sources primaires', 'Validation académique', 'Méthodologie', 'Publications'],
      icon: BookOpen,
      color: 'from-emerald-500 to-teal-600',
      ideal: 'Pour les experts en histoire et archéologie'
    },
    {
      type: 'remote_helper' as UserProfileType,
      title: '💻 Assistant à Distance',
      description: 'Je contribue depuis chez moi avec des recherches numériques et micro-tâches',
      features: ['Micro-contributions', 'Recherche en ligne', 'Analyse de données', 'Support'],
      icon: Monitor,
      color: 'from-cyan-500 to-blue-600',
      ideal: 'Pour participer activement sans se déplacer'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-foreground">
                <User className="w-5 h-5 inline mr-2" />
                Choisis ton profil d'explorateur
              </h2>
              <p className="text-muted-foreground mt-1 text-sm">
                L'interface s'adaptera à tes besoins
              </p>
            </div>
            <Button variant="ghost" onClick={onClose}>✕</Button>
          </div>
        </div>

        <div className="p-4 grid md:grid-cols-2 gap-3">
          {profiles.map((profile) => {
            const IconComponent = profile.icon;
            const isSelected = currentProfile === profile.type;
            
            return (
              <Card 
                key={profile.type}
                className={`p-4 cursor-pointer transition-all hover:shadow-lg ${
                  isSelected ? 'ring-2 ring-primary border-primary' : ''
                }`}
                onClick={() => onProfileChange(profile.type)}
              >
                <div className="space-y-3">
                  {/* En-tête avec icône gradient */}
                  <div className="flex items-center justify-between">
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${profile.color} text-white`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    {isSelected && (
                      <Badge variant="default" className="bg-green-500 text-xs">
                        ✓
                      </Badge>
                    )}
                  </div>

                  {/* Titre et description */}
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">
                      {profile.title}
                    </h3>
                    <p className="text-muted-foreground text-xs leading-relaxed">
                      {profile.description}
                    </p>
                  </div>

                  {/* Fonctionnalités */}
                  <div>
                    <div className="flex flex-wrap gap-1">
                      {profile.features.slice(0, 3).map((feature, index) => (
                        <Badge key={index} variant="secondary" className="text-xs px-2 py-1">
                          {feature}
                        </Badge>
                      ))}
                      {profile.features.length > 3 && (
                        <Badge variant="outline" className="text-xs px-2 py-1">
                          +{profile.features.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="p-3 border-t border-border bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="text-xs text-muted-foreground">
              <Settings className="w-3 h-3 inline mr-1" />
              Modifiable dans les paramètres
            </div>
            <Button onClick={onClose} size="sm">
              Continuer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileSelector;