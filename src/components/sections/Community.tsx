
import React, { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Users, Book, Search } from 'lucide-react';
import { culturalGradient } from '@/lib/utils';
import { useTranslation } from '@/i18n/useTranslation';
import { I18nText } from '@/components/ui/i18n-text';
import { getInterestGroups } from '@/services/interestGroupService';
import { InterestGroup } from '@/types/interest-groups';
import EmptyState from '@/components/common/EmptyState';
import { useNavigate } from 'react-router-dom';

const Community = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [groups, setGroups] = useState<InterestGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEmpty, setIsEmpty] = useState(false);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const data = await getInterestGroups(4); // Limit to 4 groups for display
        setGroups(data);
        setIsEmpty(data.length === 0);
      } catch (error) {
        console.error('Error fetching interest groups:', error);
        setIsEmpty(true);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  if (loading) {
    return (
      <section className="py-16 px-4 md:px-8 relative overflow-hidden bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <span className="px-4 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 inline-block mb-2">
              <I18nText translationKey="sections.community" />
            </span>
            <h2 className="text-4xl font-bold mb-4 text-center bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              <I18nText translationKey="community.title" />
            </h2>
            <p className="text-center text-slate-600 mb-10 max-w-2xl mx-auto">
              <I18nText translationKey="community.description" />
            </p>
          </div>
          <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-amber-500 rounded-full animate-spin"></div>
          </div>
        </div>
      </section>
    );
  }
  
  return (
    <section className="py-16 px-4 md:px-8 relative overflow-hidden bg-gradient-to-b from-white to-slate-50">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-5 pattern-grid-lg"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <span className="px-4 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 inline-block mb-2">
            <I18nText translationKey="sections.community" />
          </span>
          <h2 className="text-4xl font-bold mb-4 text-center bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            <I18nText translationKey="community.title" />
          </h2>
          <p className="text-center text-slate-600 mb-10 max-w-2xl mx-auto">
            <I18nText translationKey="community.description" />
          </p>
        </div>
        
        {isEmpty ? (
          <EmptyState
            icon={Users}
            title="Aucun groupe communautaire"
            description="Il n'y a pas encore de groupes d'intérêt créés. Soyez le premier à créer une communauté thématique !"
            actionLabel="Explorer d'autres sections"
            onAction={() => navigate('/collections')}
            className="mb-12"
          />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {groups.map((group, i) => (
              <Card key={group.id} className={`border-none shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden symbol-card ${culturalGradient('default')}`}>
                <div className="h-2 w-full bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar className="h-14 w-14 ring-2 ring-white shadow-md">
                      <AvatarImage 
                        src={group.icon} 
                        alt={group.name} 
                      />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-lg">
                        {group.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-lg text-slate-800">
                        {group.name}
                      </p>
                      <p className="text-sm text-slate-500 flex items-center">
                        <Users className="h-3 w-3 mr-1 text-slate-400" /> 
                        {group.members_count} <I18nText translationKey="community.stats.members" />
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm items-center">
                    <span className="flex items-center gap-1 text-slate-600">
                      <MapPin className="h-4 w-4 text-slate-500" />
                      {group.discoveries_count} <I18nText translationKey="community.stats.discoveries" />
                    </span>
                    <span className="px-3 py-1.5 text-sm font-medium bg-white rounded-md shadow-sm hover:shadow border border-slate-100 text-slate-800 hover:bg-gradient-to-r hover:from-amber-500 hover:to-amber-600 hover:text-white cursor-pointer transition-all duration-200">
                      <I18nText translationKey="community.stats.join" />
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-6 rounded-xl border border-slate-200 shadow-md hover:shadow-lg transition-all">
            <div className="w-12 h-12 mb-4 rounded-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-200">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              <I18nText translationKey="community.features.thematicCommunities.title" />
            </h3>
            <p className="text-slate-600">
              <I18nText translationKey="community.features.thematicCommunities.description" />
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-6 rounded-xl border border-slate-200 shadow-md hover:shadow-lg transition-all">
            <div className="w-12 h-12 mb-4 rounded-full flex items-center justify-center bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-200">
              <Book className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              <I18nText translationKey="community.features.personalSpace.title" />
            </h3>
            <p className="text-slate-600">
              <I18nText translationKey="community.features.personalSpace.description" />
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-6 rounded-xl border border-slate-200 shadow-md hover:shadow-lg transition-all">
            <div className="w-12 h-12 mb-4 rounded-full flex items-center justify-center bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-200">
              <Search className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              <I18nText translationKey="community.features.intuitiveNavigation.title" />
            </h3>
            <p className="text-slate-600">
              <I18nText translationKey="community.features.intuitiveNavigation.description" />
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Community;
