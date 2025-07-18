
import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  Users, 
  Clock, 
  Trophy, 
  FileText, 
  Award,
  Search,
  Plus,
  Sword,
  Scroll,
  Crown,
  History,
  Globe,
  Building,
  Landmark,
  Navigation
} from 'lucide-react';
import { TreasureQuest } from '@/types/quests';
import { getQuestTypeLabel, getDifficultyLabel, getQuestCluesCount } from '@/utils/questUtils';

interface EnhancedQuestCardProps {
  quest: TreasureQuest & {
    locationData?: {
      country: string;
      region: string;
      city: string;
      zone?: string;
      hasCoordinates: boolean;
      coordinates?: { latitude: number; longitude: number } | null;
    };
  };
}

const EnhancedQuestCard: React.FC<EnhancedQuestCardProps> = ({ quest }) => {
  const questTypeIcons = {
    templar: Sword,
    lost_civilization: Scroll,
    grail: Crown,
    custom: Trophy
  };

  const difficultyColors = {
    beginner: 'bg-amber-50 text-amber-800 border-amber-200',
    intermediate: 'bg-amber-100 text-amber-900 border-amber-300',
    expert: 'bg-stone-100 text-stone-800 border-stone-300',
    master: 'bg-stone-200 text-stone-900 border-stone-400'
  };

  const statusColors = {
    upcoming: 'bg-amber-100 text-amber-800',
    active: 'bg-green-100 text-green-800',
    completed: 'bg-stone-100 text-stone-800',
    cancelled: 'bg-red-100 text-red-800'
  };

  const statusLabels = {
    upcoming: 'À venir',
    active: 'Active',
    completed: 'Terminée',
    cancelled: 'Annulée'
  };

  const TypeIcon = questTypeIcons[quest.quest_type];
  const location = quest.locationData;

  return (
    <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-white/95 backdrop-blur-sm border border-amber-200/50">
      <div className="relative">
        {/* En-tête avec gradient et icône de type */}
        <div className="p-6 bg-gradient-to-br from-amber-100 to-stone-100 border-b border-amber-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-stone-800 text-amber-100 rounded-lg flex items-center justify-center">
              <TypeIcon className="w-6 h-6" />
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge className={`${difficultyColors[quest.difficulty_level]} border-0`}>
                {getDifficultyLabel(quest.difficulty_level)}
              </Badge>
              {location?.hasCoordinates && (
                <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                  <Navigation className="w-3 h-3 mr-1" />
                  GPS
                </Badge>
              )}
            </div>
          </div>
          
          <h3 className="text-2xl font-bold mb-2 text-stone-800 line-clamp-2">{quest.title}</h3>
          <p className="text-stone-600 text-sm">{getQuestTypeLabel(quest.quest_type)}</p>
          
          {/* Badge d'authenticité historique */}
          {['templar', 'lost_civilization', 'grail'].includes(quest.quest_type) && (
            <div className="mt-3">
              <Badge variant="secondary" className="bg-amber-50 text-amber-800 border-amber-300">
                <History className="w-3 h-3 mr-1" />
                Basé sur l'Histoire
              </Badge>
            </div>
          )}
        </div>
        
        {/* Badge de statut */}
        <div className="absolute top-4 right-4">
          <Badge className={statusColors[quest.status]}>
            {statusLabels[quest.status]}
          </Badge>
        </div>
      </div>
      
      <div className="p-6">
        {/* Informations géographiques */}
        {location && (
          <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Globe className="w-4 h-4 text-blue-600" />
              <span className="font-semibold text-blue-800">Localisation</span>
            </div>
            <div className="flex flex-wrap gap-2 text-sm">
              <span className="flex items-center gap-1 text-blue-700">
                <MapPin className="w-3 h-3" />
                {location.region}
              </span>
              {location.city !== 'Non spécifiée' && (
                <span className="flex items-center gap-1 text-green-700">
                  <Building className="w-3 h-3" />
                  {location.city}
                </span>
              )}
              {location.zone && (
                <span className="flex items-center gap-1 text-purple-700">
                  <Landmark className="w-3 h-3" />
                  {location.zone}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Description */}
        <p className="text-stone-600 mb-4 line-clamp-3">
          {quest.description}
        </p>
        
        {/* Aperçu du contexte historique */}
        {quest.story_background && (
          <div className="bg-amber-50 rounded-lg p-3 mb-4 border-l-4 border-amber-400">
            <p className="text-amber-800 text-sm line-clamp-2">
              {quest.story_background}
            </p>
          </div>
        )}
        
        {/* Métriques de contribution */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center text-sm text-stone-600">
            <FileText className="w-4 h-4 mr-2 text-amber-600" />
            {getQuestCluesCount(quest)} indices
          </div>
          <div className="flex items-center text-sm text-stone-600">
            <Award className="w-4 h-4 mr-2 text-amber-700" />
            {quest.reward_points || 0} points
          </div>
          <div className="flex items-center text-sm text-stone-600">
            <Users className="w-4 h-4 mr-2 text-stone-700" />
            {quest.max_participants || 0} max
          </div>
          <div className="flex items-center text-sm text-stone-600">
            <Clock className="w-4 h-4 mr-2 text-stone-600" />
            Multi-étapes
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex gap-3">
          <Link to={`/quests/${quest.id}`} className="flex-1">
            <Button 
              variant="outline" 
              className="w-full border-2 border-amber-300 text-amber-700 hover:bg-amber-50"
            >
              <Search className="w-4 h-4 mr-2" />
              Explorer
            </Button>
          </Link>
          
          <Button className="flex-1 bg-stone-800 hover:bg-stone-900 text-amber-100">
            <Plus className="w-4 h-4 mr-2" />
            Contribuer
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default EnhancedQuestCard;
