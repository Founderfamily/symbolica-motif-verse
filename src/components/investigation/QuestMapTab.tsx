
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Search, 
  Filter, 
  Navigation, 
  Compass,
  Target,
  Eye,
  Plus
} from 'lucide-react';
import { TreasureQuest } from '@/types/quests';

interface QuestMapTabProps {
  quest: TreasureQuest;
}

const QuestMapTab: React.FC<QuestMapTabProps> = ({ quest }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  // Simuler des lieux pour la carte
  const mockLocations = [
    {
      id: '1',
      name: 'Église Saint-Martin',
      type: 'religious',
      coordinates: { lat: 48.8566, lng: 2.3522 },
      description: 'Église gothique du XIIe siècle avec symboles templiers',
      clues: ['Indice 1', 'Indice 3'],
      verified: true
    },
    {
      id: '2',
      name: 'Ancien Château',
      type: 'castle',
      coordinates: { lat: 48.8606, lng: 2.3376 },
      description: 'Ruines du château médiéval, possible cachette',
      clues: ['Indice 2'],
      verified: false
    },
    {
      id: '3',
      name: 'Crypte Souterraine',
      type: 'underground',
      coordinates: { lat: 48.8529, lng: 2.3499 },
      description: 'Réseau de tunnels sous la ville ancienne',
      clues: ['Indice 4'],
      verified: true
    }
  ];

  const getLocationIcon = (type: string) => {
    switch (type) {
      case 'religious': return '⛪';
      case 'castle': return '🏰';
      case 'underground': return '🕳️';
      default: return '📍';
    }
  };

  const filteredLocations = mockLocations.filter(location =>
    location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Contrôles de la carte */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Compass className="h-5 w-5" />
            Carte Interactive de la Quête
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un lieu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtres
              </Button>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un Lieu
              </Button>
            </div>
          </div>

          {/* Zone de carte - Placeholder pour Mapbox */}
          <div className="w-full h-96 bg-muted rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium mb-2">Carte Interactive</p>
              <p className="text-sm text-muted-foreground">
                Intégration Mapbox en cours de développement
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Affichage des lieux d'indices, navigation GPS, analyse géographique
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des lieux */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLocations.map((location) => (
          <Card 
            key={location.id} 
            className={`cursor-pointer transition-all ${
              selectedLocation === location.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => setSelectedLocation(location.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{getLocationIcon(location.type)}</span>
                  <CardTitle className="text-lg">{location.name}</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  {location.verified && (
                    <Badge variant="secondary" className="text-xs">
                      ✓ Vérifié
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-xs">
                    {location.clues.length} indice{location.clues.length > 1 ? 's' : ''}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                {location.description}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Navigation className="h-3 w-3" />
                  {location.coordinates.lat.toFixed(4)}, {location.coordinates.lng.toFixed(4)}
                </div>
                <div className="flex gap-1">
                  <Button size="sm" variant="outline" className="h-7 px-2">
                    <Eye className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="outline" className="h-7 px-2">
                    <Target className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredLocations.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium mb-2">Aucun lieu trouvé</p>
            <p className="text-sm text-muted-foreground">
              Essayez de modifier votre recherche ou d'ajouter un nouveau lieu
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QuestMapTab;
