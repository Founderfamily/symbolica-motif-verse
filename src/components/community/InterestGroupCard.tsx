
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, MessageCircle } from 'lucide-react';
import { InterestGroup } from '@/types/interest-groups';
import { I18nText } from '@/components/ui/i18n-text';

interface InterestGroupCardProps {
  group: InterestGroup;
}

const InterestGroupCard: React.FC<InterestGroupCardProps> = ({ group }) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={group.icon || ''} alt={group.name} />
            <AvatarFallback style={{ backgroundColor: group.theme_color || '#3B82F6' }}>
              {group.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg truncate">{group.name}</CardTitle>
            <div className="flex items-center space-x-4 text-sm text-slate-500 mt-1">
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>{group.members_count} <I18nText translationKey="community.members">members</I18nText></span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageCircle className="h-4 w-4" />
                <span>{group.discoveries_count} <I18nText translationKey="community.discoveries">discoveries</I18nText></span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-slate-600 text-sm mb-3 line-clamp-2">
          {group.description}
        </p>
        <div className="flex items-center justify-between">
          <Badge variant={group.is_public ? "secondary" : "outline"}>
            {group.is_public ? 
              <I18nText translationKey="community.public">Public</I18nText> : 
              <I18nText translationKey="community.private">Private</I18nText>
            }
          </Badge>
          <Link 
            to={`/groups/${group.slug}`}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            <I18nText translationKey="community.viewGroup">View Group</I18nText>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default InterestGroupCard;
