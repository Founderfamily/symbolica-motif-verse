
import React from 'react';
import { Award, Shield, Trophy, Users, Star, ChevronRight } from 'lucide-react';
import { useTranslation } from '@/i18n/useTranslation';
import { I18nText } from '@/components/ui/i18n-text';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const GamificationItem = ({
  icon: Icon,
  titleKey,
  descriptionKey,
  points
}: {
  icon: React.ElementType;
  titleKey: string;
  descriptionKey: string;
  points?: number;
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-amber-100 hover:shadow-lg transition-all hover:border-amber-200">
      <div className="bg-amber-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
        <Icon className="h-6 w-6 text-amber-700" />
      </div>
      <h3 className="text-lg font-medium mb-2">
        <I18nText translationKey={titleKey}>
          {/* Fallback derived from the key */}
          {titleKey.split('.').pop()?.replace(/([A-Z])/g, ' $1')}
        </I18nText>
      </h3>
      <p className="text-slate-600 mb-4">
        <I18nText translationKey={descriptionKey}>
          Features and gamification elements to enhance your experience.
        </I18nText>
      </p>
      {points !== undefined && (
        <div className="flex items-center text-amber-700 font-medium">
          <Star className="h-4 w-4 mr-1 fill-amber-500 stroke-amber-700" />
          <span>
            {points} <I18nText translationKey="gamification.points">points</I18nText>
          </span>
        </div>
      )}
    </div>
  );
};

const Gamification = () => {
  const { t } = useTranslation();
  
  const gamificationItems = [
    {
      icon: Trophy,
      titleKey: "gamification.badges.title",
      descriptionKey: "gamification.badges.description",
      points: 50
    },
    {
      icon: Shield,
      titleKey: "gamification.points.title",
      descriptionKey: "gamification.points.description",
      points: 25
    },
    {
      icon: Users,
      titleKey: "gamification.leaderboard.title",
      descriptionKey: "gamification.leaderboard.description",
      points: 100
    },
    {
      icon: Award,
      titleKey: "gamification.achievements.title",
      descriptionKey: "gamification.achievements.description",
      points: 75
    }
  ];
  
  return (
    <section className="py-16 px-4 md:px-8 bg-gradient-to-b from-amber-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            <I18nText translationKey="gamification.title">
              Gagnez des Récompenses pour vos Contributions
            </I18nText>
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            <I18nText translationKey="gamification.subtitle">
              Rejoignez notre communauté et gagnez des points, des badges et de la reconnaissance
            </I18nText>
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {gamificationItems.map((item, index) => (
            <GamificationItem 
              key={index}
              icon={item.icon}
              titleKey={item.titleKey}
              descriptionKey={item.descriptionKey}
              points={item.points}
            />
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Button asChild className="gap-2 bg-amber-600 hover:bg-amber-700">
            <Link to="/profile">
              <I18nText translationKey="gamification.viewYourProgress">
                Voir Votre Progression
              </I18nText>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Gamification;
