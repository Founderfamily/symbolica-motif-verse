
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
    <section className="py-16 px-4 md:px-8 bg-gradient-to-b from-white to-amber-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-4">
            <I18nText translationKey="community.title" />
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            <I18nText translationKey="community.description" />
          </p>
        </div>
        
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="overflow-hidden h-72 bg-slate-50/50 animate-pulse">
                <div className="h-full flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-slate-200"></div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {groupsToDisplay.map((group) => (
                <Link 
                  to={`/groups/${group.id}`} 
                  key={group.id}
                  className="block"
                >
                  <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow border border-amber-100/50 hover:border-amber-200">
                    <div className={`h-24 ${group.bgColor || 'bg-amber-50'} relative`}>
                      <div className={`absolute inset-0 bg-gradient-to-r ${group.color || 'from-amber-500 to-amber-600'} opacity-10`}></div>
                      <div className="absolute -bottom-8 left-6">
                        <Avatar className="h-16 w-16 border-4 border-white shadow-lg">
                          <AvatarImage src={group.icon} />
                          <AvatarFallback className="bg-amber-100 text-amber-800">{group.name[0]}</AvatarFallback>
                        </Avatar>
                      </div>
                    </div>
                    
                    <CardContent className="pt-10 pb-6">
                      <h3 className="font-semibold text-lg mb-1">{group.name}</h3>
                      <p className="text-sm text-slate-600 flex items-center">
                        <MapPin className="h-3 w-3 mr-1 inline text-amber-600" />
                        {group.culture}
                      </p>
                      
                      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                        <div className="bg-slate-50 p-2 rounded-lg">
                          <div className="flex items-center text-slate-600">
                            <Users className="h-3 w-3 mr-1" />
                            <span className="text-xs"><I18nText translationKey="community.members" /></span>
                          </div>
                          <p className="font-medium text-slate-800">{group.members_count.toLocaleString()}</p>
                        </div>
                        
                        <div className="bg-slate-50 p-2 rounded-lg">
                          <div className="flex items-center text-slate-600">
                            <Search className="h-3 w-3 mr-1" />
                            <span className="text-xs"><I18nText translationKey="community.discoveries" /></span>
                          </div>
                          <p className="font-medium text-slate-800">{group.discoveries_count.toLocaleString()}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <Link 
                to="/groups" 
                className="inline-flex items-center space-x-2 text-amber-600 hover:text-amber-700 font-medium"
              >
                <span><I18nText translationKey="community.showAllGroups" /></span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </>
        )}
        
        <div className="mt-12 bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-slate-100">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                <I18nText translationKey="community.createGroup.title" />
              </h3>
              <p className="text-slate-600 max-w-2xl">
                <I18nText translationKey="community.createGroup.description" />
              </p>
            </div>
            <Link 
              to="/groups/create"
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 shadow hover:shadow-lg transition-all whitespace-nowrap"
            >
              <I18nText translationKey="community.createGroup.button" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Community;
