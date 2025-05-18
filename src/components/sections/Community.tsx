
import React, { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Users, Book, Search } from 'lucide-react';
import { culturalGradient } from '@/lib/utils';
import { useTranslation } from '@/i18n/useTranslation';
import { I18nText } from '@/components/ui/i18n-text';
import { useBreakpoint } from '@/hooks/use-breakpoints';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getInterestGroups, InterestGroup } from '@/services/interestGroupService';
import { Link } from 'react-router-dom';

const Community = () => {
  const { t } = useTranslation();
  const isSmallScreen = useBreakpoint('md');
  const [featuredGroups, setFeaturedGroups] = useState<InterestGroup[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoading(true);
        const groups = await getInterestGroups();
        // Show only up to 4 groups
        setFeaturedGroups(groups.slice(0, 4));
      } catch (error) {
        console.error('Error fetching groups:', error);
        // If no real groups, use fallback static data
        setFeaturedGroups([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchGroups();
  }, []);
  
  // Fallback data if no groups found in database
  const fallbackGroups = [
    {
      id: "1",
      name: t('community.groups.artDeco.name'),
      members_count: 4200,
      discoveries_count: 12000,
      icon: "/images/symbols/adinkra.png",
      culture: t('community.groups.artDeco.culture'),
      color: "from-blue-500 to-indigo-600",
      bgColor: "bg-blue-50"
    },
    {
      id: "2",
      name: t('community.groups.celticSymbolism.name'),
      members_count: 3800,
      discoveries_count: 9000,
      icon: "/images/symbols/triskelion.png",
      culture: t('community.groups.celticSymbolism.culture'),
      color: "from-emerald-500 to-teal-600",
      bgColor: "bg-emerald-50"
    },
    {
      id: "3",
      name: t('community.groups.japanesePatterns.name'),
      members_count: 5100,
      discoveries_count: 15000,
      icon: "/images/symbols/seigaiha.png",
      culture: t('community.groups.japanesePatterns.culture'),
      color: "from-sky-500 to-blue-600",
      bgColor: "bg-sky-50"
    },
    {
      id: "4",
      name: t('community.groups.islamicArt.name'),
      members_count: 3500,
      discoveries_count: 8000,
      icon: "/images/symbols/arabesque.png",
      culture: t('community.groups.islamicArt.culture'), 
      color: "from-teal-500 to-emerald-600",
      bgColor: "bg-teal-50"
    }
  ];

  // Use real groups if available, otherwise use fallback
  const groupsToDisplay = featuredGroups.length > 0 ? featuredGroups : fallbackGroups;
  
  return (
    <section className="py-12 sm:py-16 px-4 md:px-8 relative overflow-hidden bg-gradient-to-b from-white to-slate-50">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-5 pattern-grid-lg"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-8 sm:mb-12">
          <span className="px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-medium bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 inline-block mb-2">
            <I18nText translationKey="sections.community" />
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold mb-3 sm:mb-4 text-center bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            <I18nText translationKey="community.title" />
          </h2>
          <p className="text-center text-slate-600 mb-6 sm:mb-10 max-w-2xl mx-auto text-sm sm:text-base">
            <I18nText translationKey="community.description" />
          </p>
        </div>
        
        {isSmallScreen ? (
          <ScrollArea className="w-full pb-6">
            <div className="flex gap-4 pb-2 px-1">
              {groupsToDisplay.map((group, i) => (
                <GroupCard 
                  key={group.id} 
                  group={group} 
                  isRealGroup={featuredGroups.length > 0}
                />
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {groupsToDisplay.map((group, i) => (
              <GroupCard 
                key={group.id} 
                group={group}
                isRealGroup={featuredGroups.length > 0}
              />
            ))}
          </div>
        )}
        
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6 rounded-xl border border-slate-200 shadow-md hover:shadow-lg transition-all">
            <div className="w-10 sm:w-12 h-10 sm:h-12 mb-4 rounded-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-200">
              <Users className="h-5 sm:h-6 w-5 sm:w-6" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2">
              <I18nText translationKey="community.features.thematicCommunities.title" />
            </h3>
            <p className="text-sm text-slate-600">
              <I18nText translationKey="community.features.thematicCommunities.description" />
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6 rounded-xl border border-slate-200 shadow-md hover:shadow-lg transition-all">
            <div className="w-10 sm:w-12 h-10 sm:h-12 mb-4 rounded-full flex items-center justify-center bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-200">
              <Book className="h-5 sm:h-6 w-5 sm:w-6" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2">
              <I18nText translationKey="community.features.personalSpace.title" />
            </h3>
            <p className="text-sm text-slate-600">
              <I18nText translationKey="community.features.personalSpace.description" />
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6 rounded-xl border border-slate-200 shadow-md hover:shadow-lg transition-all sm:col-span-2 md:col-span-1">
            <div className="w-10 sm:w-12 h-10 sm:h-12 mb-4 rounded-full flex items-center justify-center bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-200">
              <Search className="h-5 sm:h-6 w-5 sm:w-6" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2">
              <I18nText translationKey="community.features.intuitiveNavigation.title" />
            </h3>
            <p className="text-sm text-slate-600">
              <I18nText translationKey="community.features.intuitiveNavigation.description" />
            </p>
          </div>
        </div>
        
        <div className="text-center mt-8">
          <Link to="/groups">
            <button className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-md font-medium shadow-md hover:shadow-lg transition-all">
              {t('community.exploreGroups')}
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

const GroupCard = ({ 
  group, 
  isRealGroup 
}: { 
  group: InterestGroup | any; 
  isRealGroup: boolean;
}) => {
  const { t } = useTranslation();
  
  // For real groups from Supabase
  if (isRealGroup) {
    return (
      <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden symbol-card min-w-[260px]">
        <div className="h-2 w-full bg-gradient-to-r" style={{ 
          backgroundImage: group.theme_color ? 
            `linear-gradient(to right, ${group.theme_color}, ${group.theme_color})` : 
            'linear-gradient(to right, #f59e0b, #d97706)'
        }}></div>
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="h-12 w-12 ring-2 ring-white shadow-md">
              <AvatarImage src={group.icon} alt={group.name} />
              <AvatarFallback className="bg-amber-100 text-amber-800 text-lg">
                {group.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-base sm:text-lg text-slate-800">
                {group.name}
              </p>
              <p className="text-xs sm:text-sm text-slate-500 flex items-center">
                <Users className="h-3 w-3 mr-1 text-slate-400" /> 
                {group.members_count} {t('community.stats.members')}
              </p>
            </div>
          </div>
          <div className="flex justify-between text-xs sm:text-sm items-center">
            <span className="flex items-center gap-1 text-slate-600">
              <MapPin className="h-3 sm:h-4 w-3 sm:w-4 text-slate-500" />
              {group.discoveries_count} {t('community.stats.discoveries')}
            </span>
            <Link to={`/groups/${group.slug}`}>
              <span className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium bg-white rounded-md shadow-sm hover:shadow border border-slate-100 text-slate-800 hover:bg-gradient-to-r hover:from-amber-500 hover:to-amber-600 hover:text-white cursor-pointer transition-all duration-200">
                {t('community.stats.view')}
              </span>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // For fallback static groups
  return (
    <Card className={`border-none shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden symbol-card min-w-[260px] ${culturalGradient(group.culture)}`}>
      <div className={`h-2 w-full bg-gradient-to-r ${group.color}`}></div>
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center gap-4 mb-4">
          <Avatar className="h-12 w-12 ring-2 ring-white shadow-md">
            <AvatarImage src={group.icon} alt={group.name} />
            <AvatarFallback className={`bg-gradient-to-br ${group.color} text-white text-lg`}>
              {group.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-base sm:text-lg text-slate-800">
              {group.name}
            </p>
            <p className="text-xs sm:text-sm text-slate-500 flex items-center">
              <Users className="h-3 w-3 mr-1 text-slate-400" /> 
              {group.members_count.toLocaleString()} {t('community.stats.members')}
            </p>
          </div>
        </div>
        <div className="flex justify-between text-xs sm:text-sm items-center">
          <span className="flex items-center gap-1 text-slate-600">
            <MapPin className="h-3 sm:h-4 w-3 sm:w-4 text-slate-500" />
            {group.discoveries_count.toLocaleString()} {t('community.stats.discoveries')}
          </span>
          <Link to="/groups">
            <span className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium bg-white rounded-md shadow-sm hover:shadow border border-slate-100 text-slate-800 hover:bg-gradient-to-r hover:from-amber-500 hover:to-amber-600 hover:text-white cursor-pointer transition-all duration-200">
              {t('community.stats.join')}
            </span>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default Community;
