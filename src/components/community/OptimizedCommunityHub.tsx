
import React, { useState, useCallback } from 'react';
import { usePaginatedGroups } from '@/hooks/usePaginatedGroups';
import CommunityHeader from './CommunityHeader';
import { OptimizedCommunitySearch } from './OptimizedCommunitySearch';
import CommunityStats from './CommunityStats';
import { OptimizedCommunityTabs } from './OptimizedCommunityTabs';
import TopContributors from './TopContributors';
import ActivityFeed from './ActivityFeed';

const OptimizedCommunityHub: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const {
    groups,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    refetch
  } = usePaginatedGroups(searchQuery);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
  }, []);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleGroupCreated = useCallback(() => {
    refetch();
  }, [refetch]);

  if (isLoading && groups.length === 0) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-slate-200 rounded w-64" />
          <div className="h-10 bg-slate-200 rounded w-80" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className="space-y-3">
                <div className="h-48 bg-slate-200 rounded-lg" />
                <div className="h-4 bg-slate-200 rounded w-3/4" />
                <div className="h-3 bg-slate-200 rounded w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <CommunityHeader onGroupCreated={handleGroupCreated} />
      
      <OptimizedCommunitySearch 
        onSearchChange={handleSearchChange}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Correction : CommunityStats gère ses propres données */}
          <CommunityStats />
          
          <OptimizedCommunityTabs
            groups={groups}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            onLoadMore={handleLoadMore}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <TopContributors />
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
};

export default OptimizedCommunityHub;
