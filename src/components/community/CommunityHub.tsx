
import React, { useState, useEffect } from 'react';
import { InterestGroup } from '@/types/interest-groups';
import { getAllGroups } from '@/services/interestGroupService';
import CommunityHeader from './CommunityHeader';
import CommunitySearch from './CommunitySearch';
import CommunityStats from './CommunityStats';
import CommunityTabs from './CommunityTabs';
import CommunityEmptyState from './CommunityEmptyState';
import TopContributors from './TopContributors';
import ActivityFeed from './ActivityFeed';
import GroupNotificationCenter from './GroupNotificationCenter';
import InvitationsCenter from './InvitationsCenter';
import RealTimeNotifications from './RealTimeNotifications';

const CommunityHub: React.FC = () => {
  const [groups, setGroups] = useState<InterestGroup[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      const fetchedGroups = await getAllGroups();
      setGroups(fetchedGroups);
    } catch (error) {
      console.error('Error loading groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredGroups = groups.filter(group => 
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      <RealTimeNotifications />
      
      <CommunityHeader onGroupCreated={loadGroups} />
      
      <CommunitySearch 
        searchQuery={searchQuery} 
        onSearchChange={setSearchQuery} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          <CommunityStats groups={groups} />
          
          <CommunityTabs 
            groups={filteredGroups}
            loading={loading}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          <CommunityEmptyState 
            filteredGroupsLength={filteredGroups.length}
            loading={loading}
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <GroupNotificationCenter />
          <InvitationsCenter />
          <TopContributors />
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
};

export default CommunityHub;
