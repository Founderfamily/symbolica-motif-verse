
import React, { useMemo, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { I18nText } from '@/components/ui/i18n-text';
import { InterestGroup } from '@/types/interest-groups';
import { OptimizedGroupGrid } from './OptimizedGroupGrid';

interface OptimizedCommunityTabsProps {
  groups: InterestGroup[];
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const OptimizedCommunityTabs: React.FC<OptimizedCommunityTabsProps> = ({
  groups,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
  activeTab,
  onTabChange
}) => {
  // Memoize sorted groups to avoid recalculation
  const { popularGroups, activeGroups } = useMemo(() => {
    const popular = [...groups].sort((a, b) => b.members_count - a.members_count);
    const active = [...groups].sort((a, b) => b.discoveries_count - a.discoveries_count);
    
    return {
      popularGroups: popular,
      activeGroups: active
    };
  }, [groups]);

  const handleTabChange = useCallback((value: string) => {
    onTabChange(value);
  }, [onTabChange]);

  const getGroupsForTab = useCallback((tab: string) => {
    switch (tab) {
      case 'popular':
        return popularGroups;
      case 'active':
        return activeGroups;
      default:
        return groups;
    }
  }, [groups, popularGroups, activeGroups]);

  const currentGroups = useMemo(() => 
    getGroupsForTab(activeTab), [activeTab, getGroupsForTab]);

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="all">
          <I18nText translationKey="community.allGroups">All Groups</I18nText>
        </TabsTrigger>
        <TabsTrigger value="popular">
          <I18nText translationKey="community.popular">Popular</I18nText>
        </TabsTrigger>
        <TabsTrigger value="active">
          <I18nText translationKey="community.mostActive">Most Active</I18nText>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="all" className="space-y-6">
        <OptimizedGroupGrid
          groups={currentGroups}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          onLoadMore={onLoadMore}
        />
      </TabsContent>

      <TabsContent value="popular" className="space-y-6">
        <OptimizedGroupGrid
          groups={currentGroups}
          hasNextPage={false}
          isFetchingNextPage={false}
          onLoadMore={() => {}}
        />
      </TabsContent>

      <TabsContent value="active" className="space-y-6">
        <OptimizedGroupGrid
          groups={currentGroups}
          hasNextPage={false}
          isFetchingNextPage={false}
          onLoadMore={() => {}}
        />
      </TabsContent>
    </Tabs>
  );
};

export default OptimizedCommunityTabs;
