import React from 'react';
import { TreasureQuest } from '@/types/quests';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MapPin, Users, BookOpen, Camera } from 'lucide-react';
import HistoricalFiguresWidget from './widgets/HistoricalFiguresWidget';

interface ExplorationJournalProps {
  quest: TreasureQuest;
}

const ExplorationJournal: React.FC<ExplorationJournalProps> = ({ quest }) => {
  const treasures = [
    {
      id: 1,
      name: 'La Galerie François Ier',
      description: 'Cherchez le symbole de la salamandre dans les fresques Renaissance',
      location: 'Galerie François Ier, Château de Fontainebleau',
      clue: 'La salamandre royale garde un secret dans son regard de feu',
      status: 'current',
      historicalContext: 'François Ier fit décorer cette galerie par les maîtres italiens. Selon la légende, il y aurait caché un panneau secret contenant des documents précieux.'
    },
    {
      id: 2,
      name: 'Le Bureau de Napoléon',
      description: 'Trouvez la cachette secrète de l\'Empereur',
      location: 'Appartements de Napoléon',
      clue: 'FONTAINEBLEAU_1814 - Le code de ses derniers jours',
      status: 'locked',
      historicalContext: 'Dans ses appartements, Napoléon aurait dissimulé des objets personnels avant son abdication en 1814.'
    },
    {
      id: 3,
      name: 'L\'Escalier Secret',
      description: 'Découvrez le passage secret des courtisans',
      location: 'Escalier du Roi, aile Renaissance',
      clue: 'Géolocalisation précise requise - 48.4024°N, 2.7000°E',
      status: 'locked',
      historicalContext: 'Cet escalier permettait aux favorites royales de rejoindre discrètement les appartements du roi.'
    }
  ];

  const activeExplorers = [
    { name: 'Marie L.', location: 'Galerie François Ier', lastSeen: '2 min' },
    { name: 'Paul R.', location: 'Cour des Adieux', lastSeen: '5 min' },
    { name: 'Sophie M.', location: 'Appartements Napoléon', lastSeen: '12 min' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header - Journal Style */}
        <div className="bg-white rounded-xl shadow-xl p-8 mb-6 border-l-4 border-amber-500">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <BookOpen className="w-8 h-8 text-amber-600" />
              <div>
                <h1 className="text-3xl font-bold text-slate-800">Journal d'Exploration</h1>
                <p className="text-slate-600">Les Trésors Cachés de Fontainebleau</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-amber-100 text-amber-800">
              Exploration en cours
            </Badge>
          </div>
          
          <div className="bg-amber-50 rounded-lg p-4 border-l-4 border-amber-400">
            <p className="text-slate-700 italic">
              "Dans les couloirs de Fontainebleau, trois trésors attendent d'être découverts. 
              Suivez les traces de François Ier et de Napoléon pour percer leurs secrets..."
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Quest Progress */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-amber-600" />
                Progression de la Quête
              </h2>
              
              <div className="space-y-4">
                {treasures.map((treasure, index) => (
                  <div 
                    key={treasure.id}
                    className={`border rounded-lg p-4 transition-all ${
                      treasure.status === 'current' 
                        ? 'border-amber-400 bg-amber-50 shadow-md' 
                        : treasure.status === 'locked'
                        ? 'border-slate-200 bg-slate-50 opacity-60'
                        : 'border-green-400 bg-green-50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                          treasure.status === 'current' ? 'bg-amber-500' : 
                          treasure.status === 'locked' ? 'bg-slate-400' : 'bg-green-500'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-800">{treasure.name}</h3>
                          <p className="text-sm text-slate-600">{treasure.location}</p>
                        </div>
                      </div>
                      {treasure.status === 'current' && (
                        <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                          En cours
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-slate-700 mb-3">{treasure.description}</p>
                    
                    {treasure.status === 'current' && (
                      <div className="bg-white rounded-lg p-3 border-l-4 border-amber-400">
                        <p className="font-medium text-amber-800 mb-1">Indice actuel :</p>
                        <p className="text-slate-700 italic">"{treasure.clue}"</p>
                      </div>
                    )}
                    
                    <div className="mt-3 text-xs text-slate-500">
                      <p><strong>Contexte historique :</strong> {treasure.historicalContext}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Collaboration Sidebar */}
          <div className="space-y-6">
            {/* Active Explorers */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Explorateurs Actifs
              </h3>
              
              <div className="space-y-3">
                {activeExplorers.map((explorer, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {explorer.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-800">{explorer.name}</p>
                      <p className="text-xs text-slate-600">{explorer.location}</p>
                    </div>
                    <span className="text-xs text-green-600">il y a {explorer.lastSeen}</span>
                  </div>
                ))}
              </div>
              
              <button className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Rejoindre le chat d'équipe
              </button>
            </div>

            {/* Recent Discoveries */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Camera className="w-5 h-5 text-green-600" />
                Découvertes Récentes
              </h3>
              
              <div className="space-y-3">
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm font-medium text-slate-800">Marie a trouvé un indice !</p>
                  <p className="text-xs text-slate-600">Galerie François Ier - il y a 2 min</p>
                </div>
                <div className="p-3 bg-amber-50 rounded-lg">
                  <p className="text-sm font-medium text-slate-800">Paul partage une photo</p>
                  <p className="text-xs text-slate-600">Escalier du Roi - il y a 15 min</p>
                </div>
              </div>
            </div>

            {/* Personnages Historiques */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <HistoricalFiguresWidget questId={quest.id} compact={true} />
            </div>

            {/* Help & Guidance */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Besoin d'aide ?</h3>
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded">
                  📖 Guide du château
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded">
                  🗺️ Plan interactif
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded">
                  👥 Demander de l'aide
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExplorationJournal;