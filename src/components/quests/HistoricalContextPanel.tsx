
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollText, Crown, Sword, BookOpen } from 'lucide-react';

interface HistoricalContextPanelProps {
  questType: 'templar' | 'lost_civilization' | 'grail';
  storyBackground?: string;
}

const HistoricalContextPanel = ({ questType, storyBackground }: HistoricalContextPanelProps) => {
  const contextData = {
    templar: {
      icon: Sword,
      title: "Ordre du Temple",
      period: "1119 - 1312",
      color: "from-red-500 to-red-700",
      badgeColor: "bg-red-100 text-red-800",
      facts: [
        "Fondé pour protéger les pèlerins en Terre Sainte",
        "Devenus les banquiers de l'Europe médiévale",
        "Dissous par Philippe le Bel en 1307",
        "Leur trésor n'a jamais été retrouvé"
      ]
    },
    lost_civilization: {
      icon: ScrollText,
      title: "Civilisations Perdues",
      period: "Temps anciens",
      color: "from-blue-500 to-blue-700",
      badgeColor: "bg-blue-100 text-blue-800",
      facts: [
        "L'Atlantide décrite par Platon vers 360 av. J.-C.",
        "Civilisation technologiquement avancée",
        "Disparue en une journée et une nuit",
        "Influence supposée sur les monuments antiques"
      ]
    },
    grail: {
      icon: Crown,
      title: "Légende Arthurienne",
      period: "Ve - VIe siècle",
      color: "from-purple-500 to-purple-700",
      badgeColor: "bg-purple-100 text-purple-800",
      facts: [
        "Le Graal, calice de la Cène et de la Crucifixion",
        "Quête des chevaliers de la Table Ronde",
        "Symbole de pureté et de perfection spirituelle",
        "Objet de nombreuses légendes médiévales"
      ]
    }
  };

  const context = contextData[questType];
  const IconComponent = context.icon;

  return (
    <Card className="p-6 border-l-4 border-amber-400 bg-gradient-to-r from-amber-50 to-orange-50">
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-full bg-gradient-to-br ${context.color} text-white`}>
          <IconComponent className="w-6 h-6" />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <h3 className="text-xl font-bold text-slate-800">{context.title}</h3>
            <Badge className={context.badgeColor}>
              <BookOpen className="w-3 h-3 mr-1" />
              {context.period}
            </Badge>
          </div>
          
          {storyBackground && (
            <div className="mb-4">
              <p className="text-amber-800 leading-relaxed">{storyBackground}</p>
            </div>
          )}
          
          <div className="space-y-2">
            <h4 className="font-semibold text-amber-900 mb-2">Contexte Historique :</h4>
            <ul className="space-y-1">
              {context.facts.map((fact, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-amber-700">
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-2 flex-shrink-0"></span>
                  {fact}
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
