
import React, { useState, useEffect } from 'react';
import { I18nText } from '@/components/ui/i18n-text';
import CommunityStats from '@/components/community/CommunityStats';
import CommunityTabs from '@/components/community/CommunityTabs';
import InterestGroupCard from '@/components/community/InterestGroupCard';
import TopContributors from '@/components/community/TopContributors';
import ActivityFeed from '@/components/community/ActivityFeed';
import { getInterestGroups } from '@/services/interestGroupService';
import { InterestGroup } from '@/types/interest-groups';

const CommunityHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [groups, setGroups] = useState<InterestGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoading(true);
        const fetchedGroups = await getInterestGroups();
        setGroups(fetchedGroups || []);
      } catch (error) {
        console.error('Error fetching interest groups:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  const renderContent = () => {
    if (loading) {
      return <p>Loading groups...</p>;
    }

    let filteredGroups = [...groups];

    if (activeTab === 'popular') {
      filteredGroups = filteredGroups.sort((a, b) => b.members_count - a.members_count).slice(0, 5);
    } else if (activeTab === 'active') {
      filteredGroups = filteredGroups.sort((a, b) => b.discoveries_count - a.discoveries_count).slice(0, 5);
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGroups.map(group => (
          <InterestGroupCard key={group.id} group={group} />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            <I18nText translationKey="title" ns="community">Hub Communautaire</I18nText>
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            <I18nText translationKey="description" ns="community">
              Rejoignez des groupes d'intérêt, partagez vos découvertes et collaborez avec d'autres passionnés de symboles
            </I18nText>
          </p>
        </div>

        {/* Stats - Le composant gère ses propres données */}
        <CommunityStats />

        {/* Tabs - Correction de l'interface */}
        <CommunityTabs 
          groups={groups}
          loading={loading}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            {renderContent()}
          </div>

          <div className="space-y-8">
            <TopContributors />
            <ActivityFeed />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityHub;
