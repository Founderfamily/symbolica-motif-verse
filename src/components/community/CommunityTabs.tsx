
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from '@/i18n/useTranslation';
import { InterestGroup } from '@/types/interest-groups';
import { SocialInterestGroupCard } from './SocialInterestGroupCard';

interface CommunityTabsProps {
  groups: InterestGroup[];
  loading: boolean;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const CommunityTabs: React.FC<CommunityTabsProps> = ({ 
  groups, 
  loading, 
  activeTab, 
  onTabChange 
}) => {
  const { t } = useTranslation();
  
  // Sort groups by real data from database
  const popularGroups = [...groups].sort((a, b) => b.members_count - a.members_count);
  const activeGroups = [...groups].sort((a, b) => b.discoveries_count - a.discoveries_count);

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="animate-pulse">
          <div className="h-48 bg-slate-200 rounded-t-lg"></div>
          <CardHeader>
            <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-slate-200 rounded w-full"></div>
            <div className="h-3 bg-slate-200 rounded w-2/3"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="h-3 bg-slate-200 rounded"></div>
              <div className="h-8 bg-slate-200 rounded"></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const GroupGrid = ({ groupList }: { groupList: InterestGroup[] }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {groupList.map((group) => (
        <SocialInterestGroupCard key={group.id} group={group} />
      ))}
    </div>
  );

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="space-y-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="all">
          {t('community:allGroups', 'Tous les groupes')} ({groups.length})
        </TabsTrigger>
        <TabsTrigger value="popular">
          {t('community:popular', 'Populaires')} (Top {Math.min(8, popularGroups.length)})
        </TabsTrigger>
        <TabsTrigger value="active">
          {t('community:mostActive', 'Plus actifs')} (Top {Math.min(8, activeGroups.length)})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="all" className="space-y-6">
        {loading ? <LoadingSkeleton /> : <GroupGrid groupList={groups} />}
      </TabsContent>

      <TabsContent value="popular" className="space-y-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-slate-800 mb-2">
            Groupes les plus populaires
          </h3>
          <p className="text-sm text-slate-600">
            Classés par nombre de membres ({popularGroups[0]?.members_count || 0} membres maximum)
          </p>
        </div>
        <GroupGrid groupList={popularGroups.slice(0, 8)} />
      </TabsContent>

      <TabsContent value="active" className="space-y-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-slate-800 mb-2">
            Groupes les plus actifs
          </h3>
          <p className="text-sm text-slate-600">
            Classés par nombre de découvertes ({activeGroups[0]?.discoveries_count || 0} découvertes maximum)
          </p>
        </div>
        <GroupGrid groupList={activeGroups.slice(0, 8)} />
      </TabsContent>
    </Tabs>
  );
};

export default CommunityTabs;
