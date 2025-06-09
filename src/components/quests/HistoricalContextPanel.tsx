
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { History, MapPin, Calendar, Users, Scroll } from 'lucide-react';

interface HistoricalContextPanelProps {
  questType: 'templar' | 'lost_civilization' | 'grail' | 'custom';
  storyBackground?: string;
  period?: string;
  locations?: string[];
  historicalFigures?: string[];
}

const HistoricalContextPanel: React.FC<HistoricalContextPanelProps> = ({
  questType,
  storyBackground,
  period,
  locations = [],
  historicalFigures = []
}) => {
  const getContextData = () => {
    switch (questType) {
      case 'templar':
        return {
          title: 'Les Templiers dans l\'Histoire',
          period: '1119-1314',
          summary: 'L\'Ordre du Temple fut créé en 1119 pour protéger les pèlerins en Terre Sainte. Devenus immensément riches et puissants, ils furent dissous en 1307 par Philippe le Bel.',
          keyEvents: [
            '1119 - Fondation de l\'Ordre du Temple',
            '1129 - Reconnaissance officielle par l\'Église',
            '1187 - Perte de Jérusalem face à Saladin',
            '1307 - Arrestation massive des Templiers',
            '1314 - Exécution de Jacques de Molay'
          ],
          locations: ['Jérusalem', 'Paris', 'Gisors', 'La Rochelle', 'Chypre']
        };
      case 'lost_civilization':
        return {
          title: 'Civilisations Perdues des Amériques',
          period: '1500 av. J.-C. - 1600 ap. J.-C.',
          summary: 'Les civilisations précolombiennes ont créé des empires sophistiqués, avec des connaissances avancées en astronomie, architecture et métallurgie.',
          keyEvents: [
            '1200 av. J.-C. - Civilisation Olmèque',
            '300-900 - Apogée Maya',
            '1345 - Fondation de Tenochtitlan',
            '1532 - Conquête de l\'Empire Inca',
            '1541 - Expédition de Pizarro vers l\'Eldorado'
          ],
          locations: ['Lac Guatavita', 'Machu Picchu', 'Cuzco', 'Amazonie', 'Madre de Dios']
        };
      case 'grail':
        return {
          title: 'Objets Sacrés et Reliques',
          period: 'Antiquité - Moyen Âge',
          summary: 'Les objets sacrés comme l\'Arche d\'Alliance ont façonné l\'histoire religieuse et inspiré de nombreuses quêtes à travers les siècles.',
          keyEvents: [
            '1000 av. J.-C. - Construction du Temple de Salomon',
            '586 av. J.-C. - Destruction du Premier Temple',
            '70 ap. J.-C. - Destruction du Second Temple',
            '325 - Concile de Nicée',
            'XIIe s. - Légendes du Graal'
          ],
          locations: ['Jérusalem', 'Qumrân', 'Axoum', 'Rosslyn', 'Montségur']
        };
      default:
        return null;
    }
  };

  const contextData = getContextData();
  
  if (!contextData) return null;

  return (
    <Card className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
      <div className="flex items-center gap-3 mb-4">
        <History className="w-6 h-6 text-amber-600" />
        <h3 className="text-xl font-bold text-amber-800">{contextData.title}</h3>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-4 h-4 text-amber-600" />
          <Badge variant="outline" className="border-amber-300 text-amber-700">
            {contextData.period}
          </Badge>
        </div>
        
        <p className="text-amber-700 leading-relaxed">
          {storyBackground || contextData.summary}
        </p>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-amber-800 mb-2 flex items-center gap-2">
              <Scroll className="w-4 h-4" />
              Événements Clés
            </h4>
            <ul className="space-y-1 text-sm text-amber-700">
              {contextData.keyEvents.map((event, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-amber-500 rounded-full mt-2 flex-shrink-0"></span>
                  {event}
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-amber-800 mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Lieux Historiques
            </h4>
            <ul className="space-y-1 text-sm text-amber-700">
              {(locations.length > 0 ? locations : contextData.locations).map((location, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-amber-500 rounded-full mt-2 flex-shrink-0"></span>
                  {location}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default HistoricalContextPanel;
