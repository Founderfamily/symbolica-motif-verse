
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Award, Star } from 'lucide-react';
import { useTranslation } from '@/i18n/useTranslation';
import { I18nText } from '@/components/ui/i18n-text';

const Gamification = () => {
  const { t } = useTranslation();
  
  return (
    <section className="py-16 px-4 md:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            <I18nText translationKey="gamification.title" />
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            <I18nText translationKey="gamification.subtitle" />
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <h3 className="flex items-center gap-2 text-xl font-semibold mb-4">
              <Award className="h-6 w-6 text-amber-700" />
              <I18nText translationKey="gamification.badges" />
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
              {Object.keys(t("gamification.badgeTypes", {}, { returnObjects: true })).map((badgeKey, i) => (
                <div key={i} className="bg-amber-50 py-2 px-3 rounded-lg border border-amber-100 text-center">
                  <p className="text-amber-900 font-medium text-sm">
                    <I18nText translationKey={`gamification.badgeTypes.${badgeKey}`} />
                  </p>
                </div>
              ))}
            </div>
            
            <p className="text-slate-600 text-sm">
              <I18nText translationKey="gamification.badgesDescription" />
            </p>
          </div>
          
          <div className="flex-1">
            <h3 className="flex items-center gap-2 text-xl font-semibold mb-4">
              <Star className="h-6 w-6 text-teal-700" />
              <I18nText translationKey="gamification.levels" />
            </h3>
            
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="space-y-4">
                  {Object.keys(t("gamification.pointsActivities", {}, { returnObjects: true })).map((activityKey, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <span className="font-medium">
                        <I18nText translationKey={`gamification.pointsActivities.${activityKey}`} />
                      </span>
                      <Badge className="bg-amber-700">+{(i + 2) * (i % 2 ? 1 : 2)} pts</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <p className="text-slate-600 text-sm">
              <I18nText translationKey="gamification.levelsDescription" />
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Gamification;
