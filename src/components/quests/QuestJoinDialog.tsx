import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Crown, 
  Eye,
  UserPlus,
  Send,
  Loader2,
  Info,
  CheckCircle
} from 'lucide-react';
import { TreasureQuest } from '@/types/quests';
import { toast } from 'sonner';

interface QuestJoinDialogProps {
  quest: TreasureQuest;
  className?: string;
}

const QuestJoinDialog: React.FC<QuestJoinDialogProps> = ({ quest, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [participationType, setParticipationType] = useState<string>('');
  const [motivation, setMotivation] = useState('');

  const participationTypes = {
    myth: [
      { value: 'explorer', label: 'Explorateur', icon: Eye, desc: 'Suivre et étudier la légende' },
      { value: 'researcher', label: 'Chercheur', icon: Crown, desc: 'Contribuer activement aux recherches' }
    ],
    found_treasure: [
      { value: 'adventurer', label: 'Aventurier', icon: Eye, desc: 'Vivre l\'expérience de la quête' },
      { value: 'guide', label: 'Guide', icon: Users, desc: 'Aider les nouveaux participants' }
    ],
    unfound_treasure: [
      { value: 'investigator', label: 'Enquêteur', icon: Eye, desc: 'Participer à la recherche active' },
      { value: 'expert', label: 'Expert', icon: Crown, desc: 'Apporter expertise et leadership' }
    ]
  };

  const getQuestTypeInfo = () => {
    switch (quest.quest_type) {
      case 'myth':
        return {
          title: 'Exploration de Mythe',
          description: 'Plongez dans l\'histoire et la légende de ce mystère ancestral',
          commitment: 'Participation libre et flexible'
        };
      case 'found_treasure':
        return {
          title: 'Quête Redécouverte',
          description: 'Revivez l\'aventure de cette découverte historique',
          commitment: 'Parcours guidé avec énigmes'
        };
      case 'unfound_treasure':
        return {
          title: 'Recherche Active',
          description: 'Contribuez à la découverte de ce trésor authentique',
          commitment: 'Engagement collaboratif requis'
        };
      default:
        return {
          title: 'Rejoindre la Quête',
          description: 'Participez à cette aventure',
          commitment: 'Détails à définir'
        };
    }
  };

  const getCollaborationInfo = () => {
    switch (quest.collaboration_type) {
      case 'open':
        return {
          status: 'Ouverte à tous',
          color: 'text-green-600',
          icon: CheckCircle,
          desc: 'Tout le monde peut participer librement'
        };
      case 'restricted':
        return {
          status: 'Collaboration limitée',
          color: 'text-amber-600',
          icon: Info,
          desc: 'Validation requise pour certaines actions'
        };
      case 'expert_only':
        return {
          status: 'Experts uniquement',
          color: 'text-red-600',
          icon: Crown,
          desc: 'Réservé aux utilisateurs expérimentés'
        };
      default:
        return {
          status: 'Non défini',
          color: 'text-stone-600',
          icon: Info,
          desc: 'Statut de collaboration à préciser'
        };
    }
  };

  const handleJoin = async () => {
    if (!participationType) {
      toast.error('Veuillez sélectionner votre type de participation');
      return;
    }

    setIsJoining(true);
    
    try {
      // Simuler l'inscription à la quête
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Vous avez rejoint la quête avec succès !');
      setIsOpen(false);
      
    } catch (error) {
      toast.error('Erreur lors de l\'inscription à la quête');
    } finally {
      setIsJoining(false);
    }
  };

  const questInfo = getQuestTypeInfo();
  const collabInfo = getCollaborationInfo();
  const availableTypes = participationTypes[quest.quest_type] || [];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className={`bg-stone-800 hover:bg-stone-900 text-amber-100 ${className}`}>
          <UserPlus className="w-4 h-4 mr-2" />
          Rejoindre
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-stone-600" />
            {questInfo.title}
          </DialogTitle>
          <p className="text-stone-600">
            {questInfo.description}
          </p>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informations sur la quête */}
          <Card className="p-4 bg-stone-50 border-stone-200">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium text-stone-800">{quest.title}</span>
                <Badge variant="secondary" className="capitalize">
                  {quest.difficulty_level}
                </Badge>
              </div>
              
              <div className="flex items-center gap-2">
                <collabInfo.icon className={`w-4 h-4 ${collabInfo.color}`} />
                <span className={`text-sm ${collabInfo.color} font-medium`}>
                  {collabInfo.status}
                </span>
                <span className="text-xs text-stone-500">
                  • {collabInfo.desc}
                </span>
              </div>

              <div className="text-sm text-stone-600">
                <strong>Engagement :</strong> {questInfo.commitment}
              </div>

              {quest.ai_research_enabled && (
                <div className="flex items-center gap-2 text-sm text-blue-600">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Recherche IA activée</span>
                </div>
              )}
            </div>
          </Card>

          {/* Type de participation */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-stone-700">
              Comment souhaitez-vous participer ? *
            </label>
            <Select value={participationType} onValueChange={setParticipationType}>
              <SelectTrigger>
                <SelectValue placeholder="Choisissez votre rôle" />
              </SelectTrigger>
              <SelectContent>
                {availableTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center gap-2">
                      <type.icon className="w-4 h-4" />
                      <div>
                        <div className="font-medium">{type.label}</div>
                        <div className="text-xs text-stone-500">{type.desc}</div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Motivation */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-stone-700">
              Votre motivation (optionnel)
            </label>
            <Textarea
              value={motivation}
              onChange={(e) => setMotivation(e.target.value)}
              placeholder="Partagez ce qui vous motive à rejoindre cette quête..."
              rows={3}
              className="border-stone-300"
            />
          </div>

          {/* Aperçu de la participation */}
          {participationType && (
            <Card className="p-4 bg-blue-50 border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Info className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-blue-800">Votre participation</span>
              </div>
              <div className="text-sm text-blue-700">
                En tant que <strong>{availableTypes.find(t => t.value === participationType)?.label}</strong>, 
                vous pourrez {quest.clue_submission_enabled ? 'soumettre des indices, ' : ''}
                consulter les découvertes de la communauté
                {quest.ai_research_enabled ? ' et utiliser les suggestions IA' : ''}.
              </div>
            </Card>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              Annuler
            </Button>
            <Button
              onClick={handleJoin}
              disabled={!participationType || isJoining}
              className="flex-1 bg-stone-800 hover:bg-stone-900 text-amber-100"
            >
              {isJoining ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Inscription...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Rejoindre la Quête
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuestJoinDialog;