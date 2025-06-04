
import React from 'react';
import { Shield, Lock, Eye, Award } from 'lucide-react';

export const SecurityBadges: React.FC = () => {
  const badges = [
    {
      icon: Shield,
      text: 'Données sécurisées',
      subtext: 'Chiffrement SSL'
    },
    {
      icon: Lock,
      text: 'Confidentialité',
      subtext: 'RGPD conforme'
    },
    {
      icon: Eye,
      text: 'Pas de spam',
      subtext: 'Aucun email indésirable'
    },
    {
      icon: Award,
      text: 'Gratuit',
      subtext: 'Aucun engagement'
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-3 mt-4">
      {badges.map((badge, index) => (
        <div key={index} className="flex items-center space-x-2 p-2 bg-green-50 rounded-lg border border-green-100">
          <badge.icon className="h-4 w-4 text-green-600 flex-shrink-0" />
          <div>
            <div className="text-xs font-medium text-green-800">{badge.text}</div>
            <div className="text-xs text-green-600">{badge.subtext}</div>
          </div>
        </div>
      ))}
    </div>
  );
};
