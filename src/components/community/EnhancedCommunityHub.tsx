
import React, { useState, useCallback } from 'react';
import { usePaginatedGroups } from '@/hooks/usePaginatedGroups';
import CommunityHeader from './CommunityHeader';
import { OptimizedCommunitySearch } from './OptimizedCommunitySearch';
import CommunityStats from './CommunityStats';
import { OptimizedCommunityTabs } from './OptimizedCommunityTabs';
import TopContributors from './TopContributors';
import ActivityFeed from './ActivityFeed';
import { SocialInterestGroupCard } from './SocialInterestGroupCard';
import { ShareButton } from '@/components/social/ShareButton';
import { OpenGraphMeta } from '@/components/social/OpenGraphMeta';

const EnhancedCommunityHub: React.FC = () => {
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

  const communityShareUrl = `${window.location.origin}/community`;
  const communityTitle = "Communauté Cultural Heritage Symbols";
  const communityDescription = "Rejoignez notre communauté passionnée et découvrez des groupes d'intérêt autour des symboles du patrimoine culturel mondial.";

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
    <>
      <OpenGraphMeta
        title={communityTitle}
        description={communityDescription}
        url={communityShareUrl}
        type="website"
      />
      
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <CommunityHeader onGroupCreated={handleGroupCreated} />
          <ShareButton
            url={communityShareUrl}
            title={communityTitle}
            description={communityDescription}
            className="hidden sm:flex"
          />
        </div>
        
        <OptimizedCommunitySearch 
          onSearchChange={handleSearchChange}
          placeholder="Rechercher des groupes..."
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Correction : CommunityStats gère ses propres données */}
            <CommunityStats />
            
            {/* Grille des groupes avec fonctionnalités sociales */}
            <div className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groups.map((group) => (
                  <SocialInterestGroupCard key={group.id} group={group} />
                ))}
              </div>

              {hasNextPage && (
                <div className="flex justify-center mt-8">
                  <button
                    onClick={handleLoadMore}
                    disabled={isFetchingNextPage}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isFetchingNextPage ? 'Chargement...' : 'Charger plus'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <TopContributors />
            <ActivityFeed />
          </div>
        </div>
      </div>
    </>
  );
};

export default EnhancedCommunityHub;
