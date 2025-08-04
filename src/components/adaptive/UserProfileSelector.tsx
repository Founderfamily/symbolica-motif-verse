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
      <div className="bg-background rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                <User className="w-6 h-6 inline mr-2" />
                Choisis ton profil d'explorateur
              </h2>
              <p className="text-muted-foreground mt-1">
                L'interface s'adaptera à tes besoins et préférences
              </p>
            </div>
            <Button variant="ghost" onClick={onClose}>✕</Button>
          </div>
        </div>

        <div className="p-6 grid md:grid-cols-2 gap-4">
          {profiles.map((profile) => {
            const IconComponent = profile.icon;
            const isSelected = currentProfile === profile.type;
            
            return (
              <Card 
                key={profile.type}
                className={`p-6 cursor-pointer transition-all hover:shadow-lg ${
                  isSelected ? 'ring-2 ring-primary border-primary' : ''
                }`}
                onClick={() => onProfileChange(profile.type)}
              >
                <div className="space-y-4">
                  {/* En-tête avec icône gradient */}
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-lg bg-gradient-to-br ${profile.color} text-white`}>
                      <IconComponent className="w-8 h-8" />
                    </div>
                    {isSelected && (
                      <Badge variant="default" className="bg-green-500">
                        ✓ Sélectionné
                      </Badge>
                    )}
                  </div>

                  {/* Titre et description */}
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {profile.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {profile.description}
                    </p>
                  </div>

                  {/* Fonctionnalités */}
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Fonctionnalités :</h4>
                    <div className="flex flex-wrap gap-2">
                      {profile.features.map((feature, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Idéal pour */}
                  <div className="pt-2 border-t border-border">
                    <p className="text-xs text-muted-foreground italic">
                      💡 {profile.ideal}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="p-6 border-t border-border bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              <Settings className="w-4 h-4 inline mr-1" />
              Tu peux changer de profil à tout moment dans les paramètres
            </div>
            <Button onClick={onClose}>
              Continuer avec ce profil
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileSelector;