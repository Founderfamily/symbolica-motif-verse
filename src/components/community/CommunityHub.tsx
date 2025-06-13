
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
      return <p className="text-stone-600">Loading groups...</p>;
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
    <div className="min-h-screen relative">
      {/* Subtle background elements like in Hero */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-100/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-stone-200/40 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-orange-100/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block p-2 bg-gradient-to-r from-amber-50 to-stone-50 rounded-full mb-4">
            <div className="bg-white/80 px-4 py-2 rounded-full text-stone-700 text-sm font-medium border border-amber-200">
              <I18nText translationKey="badge" ns="community">Communauté Active</I18nText>
            </div>
          </div>
          
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-stone-800 to-amber-700 bg-clip-text text-transparent">
            <I18nText translationKey="title" ns="community">Hub Communautaire</I18nText>
          </h1>
          <p className="text-stone-600 max-w-2xl mx-auto">
            <I18nText translationKey="description" ns="community">
              Rejoignez des groupes d'intérêt, partagez vos découvertes et collaborez avec d'autres passionnés de symboles
            </I18nText>
          </p>
        </div>

        {/* Stats with warm styling */}
        <div className="mb-8">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-amber-200/50">
            <CommunityStats />
          </div>
        </div>

        {/* Tabs with warm styling */}
        <div className="mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-stone-200/50">
            <CommunityTabs 
              groups={groups}
              loading={loading}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-amber-200/30">
              {renderContent()}
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-stone-200/50">
              <TopContributors />
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-stone-200/50">
              <ActivityFeed />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityHub;
