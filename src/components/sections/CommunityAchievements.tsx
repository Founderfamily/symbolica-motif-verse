
import React from 'react';
import { Trophy, Award, Star } from 'lucide-react';
import { useTranslation } from '@/i18n/useTranslation';
import { I18nText } from '@/components/ui/i18n-text';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const users = [
  { id: 1, name: 'Sarah J.', avatar: null, contributions: 87, expertise: 'Norse Symbols' },
  { id: 2, name: 'Miguel R.', avatar: null, contributions: 64, expertise: 'Mesoamerican' },
  { id: 3, name: 'Aisha M.', avatar: null, contributions: 52, expertise: 'Islamic Patterns' },
];

const stats = [
  { 
    icon: Trophy,
    colorClass: "bg-amber-50",
    iconColorClass: "text-amber-600",
    value: "1,243",
    labelKey: "communityAchievements.stats.symbols"
  },
  { 
    icon: Award,
    colorClass: "bg-blue-50",
    iconColorClass: "text-blue-600",
    value: "367",
    labelKey: "communityAchievements.stats.contributors"
  },
  { 
    icon: Star,
    colorClass: "bg-emerald-50",
    iconColorClass: "text-emerald-600",
    value: "8,975",
    labelKey: "communityAchievements.stats.interactions"
  }
];

const CommunityAchievements = () => {
  const { t } = useTranslation();
  
  return (
    <section className="py-16 bg-gradient-to-b from-white to-slate-50 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <span className="px-4 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 inline-block mb-2">
            <I18nText translationKey="communityAchievements.community" />
          </span>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            <I18nText translationKey="communityAchievements.title" />
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            <I18nText translationKey="communityAchievements.description" />
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl border border-slate-100 shadow-md p-6 text-center">
              <div className={`w-16 h-16 rounded-full ${stat.colorClass} flex items-center justify-center mx-auto mb-4`}>
                <stat.icon className={`w-8 h-8 ${stat.iconColorClass}`} />
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
              <div className="text-slate-600">
                <I18nText translationKey={stat.labelKey} />
              </div>
            </div>
          ))}
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Top Contributors */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-lg p-6">
            <h3 className="text-xl font-semibold text-slate-900 mb-4">
              <I18nText translationKey="communityAchievements.topContributors" />
            </h3>
            
            <div className="space-y-4">
              {users.map((user, index) => (
                <div key={user.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={user.avatar || undefined} alt={user.name} />
                      <AvatarFallback className="bg-amber-100 text-amber-800">
                        {user.name.split(' ').map(part => part[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-slate-500">{user.expertise}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{user.contributions}</div>
                    <div className="text-xs text-slate-500">
                      <I18nText translationKey="communityAchievements.contributions" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Recent Achievements */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-lg p-6">
            <h3 className="text-xl font-semibold text-slate-900 mb-4">
              <I18nText translationKey="communityAchievements.recentAchievements" />
            </h3>
            
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                  <div className="flex items-start">
                    <div className="bg-amber-100 p-2 rounded-lg mr-3">
                      <Trophy className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <div className="font-medium text-slate-900">
                        <I18nText translationKey={`communityAchievements.achievement${i}.title`} />
                      </div>
                      <div className="text-sm text-slate-600 mt-1">
                        <I18nText translationKey={`communityAchievements.achievement${i}.description`} />
                      </div>
                      <div className="mt-2">
                        <Progress value={i === 1 ? 100 : i === 2 ? 65 : 40} className="h-1.5" />
                      </div>
                      <div className="flex justify-between text-xs text-slate-500 mt-1">
                        <span>
                          <I18nText 
                            translationKey="communityAchievements.progress" 
                            params={{ value: i === 1 ? "100" : i === 2 ? "65" : "40" }}
                          />
                        </span>
                        {i === 1 && <span className="text-emerald-600 font-medium">
                          <I18nText translationKey="communityAchievements.completed" />
                        </span>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunityAchievements;
