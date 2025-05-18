import React, { useEffect, useState } from 'react';
import { useTranslation } from '@/i18n/useTranslation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Users, Plus, Map, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { getInterestGroups, InterestGroup } from '@/services/interestGroupService';
import { useNavigate } from 'react-router-dom';
import { useBreakpoint } from '@/hooks/use-breakpoints';
import { ScrollArea } from '@/components/ui/scroll-area';

const GroupsPage: React.FC = () => {
  const { t } = useTranslation();
  const [groups, setGroups] = useState<InterestGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const isSmallScreen = useBreakpoint('md');
  
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoading(true);
        const data = await getInterestGroups();
        setGroups(data);
      } catch (error) {
        console.error('Error fetching groups:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchGroups();
  }, []);
  
  const filteredGroups = searchTerm 
    ? groups.filter(group => 
        group.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (group.description?.toLowerCase().includes(searchTerm.toLowerCase())))
    : groups;
  
  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{t('groups.title')}</h1>
          <p className="text-sm sm:text-base text-slate-600 mt-1">{t('groups.subtitle')}</p>
        </div>
        <Button 
          className="mt-4 md:mt-0 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
          onClick={() => navigate('/groups/create')}
        >
          <Plus className="mr-2 h-4 w-4" /> {t('groups.createNew')}
        </Button>
      </div>
      
      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <Input
            placeholder={t('groups.searchPlaceholder')}
            className="pl-10 bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Card key={i} className="border shadow-md animate-pulse">
              <div className="h-32 bg-slate-200"></div>
              <CardContent className="p-5">
                <div className="h-6 bg-slate-200 rounded mb-2 w-3/4"></div>
                <div className="h-4 bg-slate-100 rounded mb-1 w-1/2"></div>
                <div className="h-4 bg-slate-100 rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredGroups.length > 0 ? (
        isSmallScreen ? (
          <ScrollArea className="w-full pb-4">
            <div className="flex gap-4 pb-2 px-1">
              {filteredGroups.map(group => (
                <GroupCard key={group.id} group={group} />
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGroups.map(group => (
              <GroupCard key={group.id} group={group} />
            ))}
          </div>
        )
      ) : (
        <div className="text-center py-16">
          <p className="text-slate-500">{t('groups.noResults')}</p>
        </div>
      )}
    </div>
  );
};

const GroupCard: React.FC<{ group: InterestGroup }> = ({ group }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/groups/${group.slug}`);
  };
  
  return (
    <Card 
      className="border shadow-md hover:shadow-lg transition-shadow overflow-hidden cursor-pointer min-w-[300px]" 
      onClick={handleClick}
    >
      <div 
        className="h-32 bg-cover bg-center relative" 
        style={{ 
          backgroundImage: group.banner_image ? `url(${group.banner_image})` : 'linear-gradient(to right, #f59e0b, #d97706)'
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      </div>
      <CardContent className="p-5 relative">
        <Avatar className="w-16 h-16 absolute -top-8 left-4 border-4 border-white shadow-md">
          <AvatarImage src={group.icon || undefined} />
          <AvatarFallback className="bg-amber-100 text-amber-800 text-lg">
            {group.name.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="mt-8">
          <h3 className="font-semibold text-lg text-slate-900">{group.name}</h3>
          <p className="text-sm text-slate-500 line-clamp-2 mt-1">{group.description || t('groups.noDescription')}</p>
        </div>
      </CardContent>
      <CardFooter className="px-5 py-3 bg-slate-50 flex justify-between">
        <div className="flex items-center text-sm text-slate-600">
          <Users className="h-4 w-4 mr-1" /> {group.members_count} {t('community.stats.members')}
        </div>
        <div className="flex items-center text-sm text-slate-600">
          <Map className="h-4 w-4 mr-1" /> {group.discoveries_count} {t('community.stats.discoveries')}
        </div>
      </CardFooter>
    </Card>
  );
};

export default GroupsPage;
