
import React from 'react';
import { Shield, Trophy, Users } from 'lucide-react';
import { useTranslation } from '@/i18n/useTranslation';
import { I18nText } from '@/components/ui/i18n-text';

const GamificationItem = ({
  icon: Icon,
  titleKey,
  descriptionKey
}: {
  icon: React.ElementType;
  titleKey: string;
  descriptionKey: string;
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-amber-100">
      <div className="bg-amber-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
        <Icon className="h-6 w-6 text-amber-700" />
      </div>
      <h3 className="text-lg font-medium mb-2">
        <I18nText translationKey={titleKey} />
      </h3>
      <p className="text-slate-600">
        <I18nText translationKey={descriptionKey} />
      </p>
    </div>
  );
};

const Gamification = () => {
  // Fixed the arguments to use the correct format with titleKey and descriptionKey
  const gamificationItems = [
    {
      icon: Trophy,
      titleKey: "gamification.badges.title",
      descriptionKey: "gamification.badges.description"
    },
    {
      icon: Shield,
      titleKey: "gamification.points.title",
      descriptionKey: "gamification.points.description"
    },
    {
      icon: Users,
      titleKey: "gamification.leaderboard.title",
      descriptionKey: "gamification.leaderboard.description"
    }
  ];
  
  return (
    <section className="py-16 px-4 md:px-8 bg-gradient-to-b from-amber-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            <I18nText translationKey="gamification.title" />
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            <I18nText translationKey="gamification.subtitle" />
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {gamificationItems.map((item, index) => (
            <GamificationItem 
              key={index}
              icon={item.icon}
              titleKey={item.titleKey}
              descriptionKey={item.descriptionKey}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gamification;
