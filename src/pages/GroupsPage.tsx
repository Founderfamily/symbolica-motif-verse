
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Plus, Search, Users } from 'lucide-react';
import { useTranslation } from '@/i18n/useTranslation';
import { I18nText } from '@/components/ui/i18n-text';

const GroupsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { t } = useTranslation();
  
  // Replace with real data fetch
  const groups = [
    {
      id: '1',
      name: 'Art Deco Enthusiasts',
      memberCount: 156,
      image: '/images/symbols/art-deco.jpg'
    },
    {
      id: '2',
      name: 'Celtic Symbol Research',
      memberCount: 89,
      image: '/images/symbols/celtic.jpg'
    },
    {
      id: '3',
      name: 'Japanese Pattern Collectors',
      memberCount: 212,
      image: '/images/symbols/japanese.jpg'
    }
  ];
  
  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold"><I18nText translationKey="groupsPage.title" /></h1>
          <p className="text-gray-600 mt-2"><I18nText translationKey="groupsPage.description" /></p>
        </div>
        
        <Link to="/groups/create">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <I18nText translationKey="groupsPage.createGroup" />
          </Button>
        </Link>
      </div>
      
      <div className="mb-6 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input 
            className="pl-10"
            placeholder={t('groupsPage.search.placeholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {filteredGroups.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-500"><I18nText translationKey="groupsPage.empty" /></p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGroups.map(group => (
            <Link to={`/groups/${group.id}`} key={group.id}>
              <Card className="hover:shadow-lg transition-shadow h-full">
                <CardContent className="p-0">
                  <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-500 relative">
                    <div className="absolute -bottom-6 left-4">
                      <Avatar className="h-12 w-12 border-2 border-white">
                        <AvatarImage src={group.image} />
                        <AvatarFallback>{group.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                  
                  <div className="p-4 pt-8">
                    <h3 className="font-semibold text-lg">{group.name}</h3>
                    <div className="flex items-center mt-2 text-gray-600 text-sm">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{group.memberCount} members</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default GroupsPage;
