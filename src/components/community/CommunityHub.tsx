
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
        console.log('🔍 [CommunityHub] Fetching groups...');
        const fetchedGroups = await getInterestGroups();
        console.log('📋 [CommunityHub] Fetched groups:', fetchedGroups?.length, 'groups');
        console.log('📋 [CommunityHub] Group names:', fetchedGroups?.map(g => g.name));
        
        // Ensure unique groups by ID
        const uniqueGroups = fetchedGroups?.filter((group, index, self) => 
          index === self.findIndex(g => g.id === group.id)
        ) || [];
        
        console.log('✅ [CommunityHub] Unique groups:', uniqueGroups.length, 'groups');
        setGroups(uniqueGroups);
      } catch (error) {
        console.error('Error fetching interest groups:', error);
        setGroups([]);
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
    console.log('🎛️ [CommunityHub] Before filtering - activeTab:', activeTab, 'groups:', filteredGroups.length);

    if (activeTab === 'popular') {
      filteredGroups = filteredGroups.sort((a, b) => b.members_count - a.members_count).slice(0, 5);
    } else if (activeTab === 'active') {
      filteredGroups = filteredGroups.sort((a, b) => b.discoveries_count - a.discoveries_count).slice(0, 5);
    }

    console.log('🎯 [CommunityHub] After filtering - rendering:', filteredGroups.length, 'groups');
    console.log('🎯 [CommunityHub] Filtered group names:', filteredGroups.map(g => g.name));

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGroups.map(group => (
          <InterestGroupCard key={group.id} group={group} />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen relative bg-stone-50">
      {/* Subtle background like HomePage */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Main subtle paper effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-stone-50 via-amber-50/30 to-stone-100"></div>
        {/* Soft background circles */}
        <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-stone-100/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-56 h-56 bg-amber-50/20 rounded-full blur-2xl" />
        <div className="absolute top-2/3 right-1/4 w-40 h-40 bg-stone-200/15 rounded-full blur-2xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block p-2 bg-gradient-to-r from-stone-50 to-amber-50 rounded-full mb-4">
            <div className="bg-white/75 px-4 py-2 rounded-full text-stone-700 text-sm font-medium border border-amber-100">
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

        {/* Stats - subtle neutral style */}
        <div className="mb-8">
          <div className="bg-white/75 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-stone-200/60">
            <CommunityStats />
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-stone-100/50">
            <CommunityTabs 
              groups={groups}
              loading={loading}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>
        </div>

        {/* Content layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-4">
            {/* Les groupes sont déjà affichés dans CommunityTabs ci-dessus */}
          </div>

          <div className="lg:col-span-4 grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1 space-y-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow border border-stone-100/60">
                <TopContributors />
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow border border-stone-100/60">
                <ActivityFeed />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityHub;
