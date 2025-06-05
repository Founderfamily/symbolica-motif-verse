
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Calendar, Heart } from 'lucide-react';
import { InterestGroup } from '@/types/interest-groups';
import { ShareButton } from '@/components/social/ShareButton';
import { GroupInviteDialog } from '@/components/social/GroupInviteDialog';
import { LazyGroupImage } from './LazyGroupImage';

interface SocialInterestGroupCardProps {
  group: InterestGroup;
}

export const SocialInterestGroupCard: React.FC<SocialInterestGroupCardProps> = ({ group }) => {
  const shareUrl = `${window.location.origin}/groups/${group.slug}`;
  const shareTitle = `Rejoignez le groupe "${group.name}" sur Cultural Heritage Symbols`;
  const shareDescription = group.description || `Découvrez et partagez des symboles culturels dans le groupe ${group.name}`;

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-sm overflow-hidden">
      <div className="relative">
        <LazyGroupImage
          src={group.banner_image || undefined}
          alt={group.name}
          className="h-48 w-full rounded-t-lg"
          fallbackColor={group.theme_color || '#3b82f6'}
        />
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <ShareButton
            url={shareUrl}
            title={shareTitle}
            description={shareDescription}
            image={group.banner_image || undefined}
            className="bg-white/90 backdrop-blur-sm"
          />
        </div>
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold line-clamp-1 mb-1">
              {group.name}
            </CardTitle>
            <CardDescription className="line-clamp-2 text-sm">
              {group.description}
            </CardDescription>
          </div>
          {group.icon && (
            <div className="ml-3 text-2xl" style={{ color: group.theme_color }}>
              {group.icon}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center justify-between text-sm text-slate-600 mb-4">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{group.members_count} membres</span>
          </div>
          <div className="flex items-center gap-1">
            <Heart className="w-4 h-4" />
            <span>{group.discoveries_count} découvertes</span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => window.location.href = `/groups/${group.slug}`}
          >
            Rejoindre
          </Button>
          
          <GroupInviteDialog
            groupId={group.id}
            groupName={group.name}
          />
        </div>

        <div className="flex items-center justify-between mt-3 text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>Créé le {new Date(group.created_at).toLocaleDateString()}</span>
          </div>
          {group.is_public && (
            <Badge variant="secondary" className="text-xs">
              Public
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SocialInterestGroupCard;
