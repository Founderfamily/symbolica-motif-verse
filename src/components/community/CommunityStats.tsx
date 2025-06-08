
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, TrendingUp, Star } from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';
import { InterestGroup } from '@/types/interest-groups';

interface CommunityStatsProps {
  groups: InterestGroup[];
}

const CommunityStats: React.FC<CommunityStatsProps> = ({ groups }) => {
  const totalMembers = groups.reduce((sum, group) => sum + group.members_count, 0);
  const totalDiscoveries = groups.reduce((sum, group) => sum + group.discoveries_count, 0);
  const totalGroups = groups.length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-3 rounded-full">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalGroups}</p>
              <p className="text-slate-600 text-sm">
                <I18nText translationKey="community.stats.groups">Groupes d'Intérêt</I18nText>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-3 rounded-full">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalMembers.toLocaleString()}</p>
              <p className="text-slate-600 text-sm">
                <I18nText translationKey="community.stats.members">Membres de la Communauté</I18nText>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 p-3 rounded-full">
              <Star className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalDiscoveries.toLocaleString()}</p>
              <p className="text-slate-600 text-sm">
                <I18nText translationKey="community.stats.discoveries">Découvertes Partagées</I18nText>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommunityStats;
