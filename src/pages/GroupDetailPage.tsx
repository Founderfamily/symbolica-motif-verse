
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { I18nText } from '@/components/ui/i18n-text';
import { ChevronLeft, Users } from 'lucide-react';
import { useTranslation } from '@/i18n/useTranslation';

const GroupDetailPage = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  
  // Replace with actual group data fetch
  const group = {
    id,
    name: 'Art Deco Enthusiasts',
    description: 'A group dedicated to documenting Art Deco symbols and patterns around the world.',
    memberCount: 156,
    joined: false,
    image: '/images/symbols/art-deco.jpg'
  };
  
  const handleJoin = () => {
    console.log('Join group:', id);
    // Add join logic
  };
  
  const handleLeave = () => {
    console.log('Leave group:', id);
    // Add leave logic
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/groups" className="flex items-center text-blue-600 hover:text-blue-800 mb-4">
        <ChevronLeft className="h-4 w-4 mr-1" />
        <I18nText translationKey="groupDetail.back" />
      </Link>
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="h-40 bg-gradient-to-r from-blue-500 to-purple-500 relative">
          <div className="absolute -bottom-12 left-6">
            <Avatar className="h-24 w-24 border-4 border-white">
              <AvatarImage src={group.image} />
              <AvatarFallback>{group.name.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
        </div>
        
        <div className="pt-16 pb-6 px-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{group.name}</h1>
              <div className="flex items-center mt-2 text-gray-600">
                <Users className="h-4 w-4 mr-1" />
                <span><I18nText translationKey="groupDetail.members" />: {group.memberCount}</span>
              </div>
            </div>
            
            {group.joined ? (
              <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-50" onClick={handleLeave}>
                <I18nText translationKey="groupDetail.leave" />
              </Button>
            ) : (
              <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleJoin}>
                <I18nText translationKey="groupDetail.join" />
              </Button>
            )}
          </div>
          
          <Card className="mt-6">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-2"><I18nText translationKey="groupDetail.description" /></h2>
              <p className="text-gray-600">{group.description}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GroupDetailPage;
