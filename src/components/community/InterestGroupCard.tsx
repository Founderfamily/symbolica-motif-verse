
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
  // Determine a fallback background color from the stone/amber palette
  const fallbackBgColor = group.theme_color ? group.theme_color : 'hsl(var(--muted))'; // Keep theme color if present, else use muted

  return (
    <Card className="hover:shadow-lg transition-shadow bg-white/80 backdrop-blur-sm border-stone-200/60">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={group.icon || ''} alt={group.name} />
            <AvatarFallback style={{ backgroundColor: fallbackBgColor }} className="text-stone-700">
              {group.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg truncate text-stone-800">{group.name}</CardTitle>
            <div className="flex items-center space-x-4 text-sm text-stone-500 mt-1">
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4 text-stone-500" />
                <span>{group.members_count} <I18nText translationKey="community.members">membres</I18nText></span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageCircle className="h-4 w-4 text-stone-500" />
                <span>{group.discoveries_count} <I18nText translationKey="community.discoveries">découvertes</I18nText></span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-stone-600 text-sm mb-3 line-clamp-2">
          {group.description}
        </p>
        <div className="flex items-center justify-between">
          <Badge 
            variant={group.is_public ? "secondary" : "outline"} 
            className={group.is_public ? "bg-amber-100 text-amber-800 border-amber-200" : "border-stone-300 text-stone-600"}
          >
            {group.is_public ? 
              <I18nText translationKey="community.public">Public</I18nText> : 
              <I18nText translationKey="community.private">Privé</I18nText>
            }
          </Badge>
          <Link 
            to={`/community/groups/${group.slug}`}
            className="text-amber-700 hover:text-amber-800 text-sm font-medium"
          >
            <I18nText translationKey="community.viewGroup">Voir le Groupe</I18nText>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default InterestGroupCard;
