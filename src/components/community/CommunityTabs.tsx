
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from '@/i18n/useTranslation';
import { InterestGroup } from '@/types/interest-groups';
import InterestGroupCard from './InterestGroupCard';

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
  
  const popularGroups = [...groups].sort((a, b) => b.members_count - a.members_count);
  const activeGroups = [...groups].sort((a, b) => b.discoveries_count - a.discoveries_count);

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardHeader>
            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="h-3 bg-slate-200 rounded"></div>
              <div className="h-3 bg-slate-200 rounded w-2/3"></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const GroupGrid = ({ groupList }: { groupList: InterestGroup[] }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {groupList.map((group) => (
        <InterestGroupCard key={group.id} group={group} />
      ))}
    </div>
  );

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="space-y-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="all">
          {t('community:allGroups', 'Tous les groupes')}
        </TabsTrigger>
        <TabsTrigger value="popular">
          {t('community:popular', 'Populaires')}
        </TabsTrigger>
        <TabsTrigger value="active">
          {t('community:mostActive', 'Plus actifs')}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="all" className="space-y-6">
        {loading ? <LoadingSkeleton /> : <GroupGrid groupList={groups} />}
      </TabsContent>

      <TabsContent value="popular" className="space-y-6">
        <GroupGrid groupList={popularGroups.slice(0, 8)} />
      </TabsContent>

      <TabsContent value="active" className="space-y-6">
        <GroupGrid groupList={activeGroups.slice(0, 8)} />
      </TabsContent>
    </Tabs>
  );
};

export default CommunityTabs;
