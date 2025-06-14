import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Calendar, Heart, UserPlus, Eye, CheckCircle } from 'lucide-react';
import { InterestGroup } from '@/types/interest-groups';
import { ShareButton } from '@/components/social/ShareButton';
import { GroupInviteDialog } from '@/components/social/GroupInviteDialog';
import { LazyGroupImage } from './LazyGroupImage';
import { checkGroupMembership, joinGroup } from '@/services/communityService';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface SocialInterestGroupCardProps {
  group: InterestGroup;
}

export const SocialInterestGroupCard: React.FC<SocialInterestGroupCardProps> = ({ group }) => {
  const [isMember, setIsMember] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  const shareUrl = `${window.location.origin}/groups/${group.slug}`;
  const shareTitle = `Rejoignez le groupe "${group.name}" sur Cultural Heritage Symbols`;
  const shareDescription = group.description || `Découvrez et partagez des symboles culturels dans le groupe ${group.name}`;

  useEffect(() => {
    if (user) {
      checkMembership();
    } else {
      setLoading(false);
    }
  }, [user, group.id]);

  const checkMembership = async () => {
    if (!user) return;
    
    try {
      const membership = await checkGroupMembership(group.id, user.id);
      setIsMember(membership);
    } catch (error) {
      console.error('Error checking membership:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGroup = async () => {
    if (!user) {
      navigate('/auth');
      toast.info('Veuillez vous connecter pour rejoindre un groupe.');
      return;
    }

    setIsJoining(true);
    try {
      await joinGroup(group.id, user.id);
      setIsMember(true);
      toast.success('Vous avez rejoint le groupe avec succès !');
    } catch (error) {
      console.error('Error joining group:', error);
      toast.error("Erreur lors de l'adhésion au groupe");
    } finally {
      setIsJoining(false);
    }
  };

  const handleViewGroup = () => {
    navigate(`/groups/${group.slug}`);
  };

  const getButtonContent = () => {
    if (loading) {
      return {
        variant: "outline" as const,
        icon: <UserPlus className="w-4 h-4 mr-1" />,
        text: "Chargement...",
        disabled: true,
        onClick: () => {},
        className: "flex-1 bg-stone-100 text-stone-500 border-stone-200"
      };
    }

    if (!user) {
      return {
        variant: "outline" as const,
        icon: <UserPlus className="w-4 h-4 mr-1" />,
        text: "Se connecter pour rejoindre",
        disabled: false,
        onClick: handleJoinGroup,
        className: "flex-1 bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 hover:border-amber-300 transition-colors"
      };
    }

    if (isMember) {
      return {
        variant: "default" as const,
        icon: <Eye className="w-4 h-4 mr-1" />,
        text: "Voir le groupe",
        disabled: false,
        onClick: handleViewGroup,
        className: "flex-1 bg-amber-600 hover:bg-amber-700 text-white border-amber-600"
      };
    }

    return {
      variant: "default" as const,
      icon: isJoining ? <UserPlus className="w-4 h-4 mr-1 animate-spin" /> : <UserPlus className="w-4 h-4 mr-1" />,
      text: isJoining ? 'Adhésion...' : 'Rejoindre',
      disabled: isJoining,
      onClick: handleJoinGroup,
      className: "flex-1 bg-amber-600 hover:bg-amber-700 text-white border-amber-600"
    };
  };

  const buttonProps = getButtonContent();
  const imageFallbackColor = group.theme_color || 'hsl(40, 5.6%, 90%)';

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 shadow-sm overflow-hidden bg-white/80 backdrop-blur-sm border-stone-200/60">
      <div className="relative">
        <LazyGroupImage
          src={group.banner_image || undefined}
          alt={group.name}
          className="h-48 w-full rounded-t-lg"
          fallbackColor={imageFallbackColor}
        />
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <ShareButton
            url={shareUrl}
            title={shareTitle}
            description={shareDescription}
            image={group.banner_image || undefined}
            className="bg-white/90 backdrop-blur-sm text-stone-700 hover:bg-stone-50"
          />
        </div>
        {isMember && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-amber-500 text-white border-0">
              <CheckCircle className="w-3 h-3 mr-1" />
              Membre
            </Badge>
          </div>
        )}
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold line-clamp-1 mb-1 text-stone-800">
              {group.name}
            </CardTitle>
            <CardDescription className="line-clamp-2 text-sm text-stone-600">
              {group.description}
            </CardDescription>
          </div>
          {group.icon && (
            <div className="ml-3 text-2xl" style={{ color: group.theme_color && !group.theme_color.startsWith('#') ? group.theme_color : 'hsl(var(--foreground))' }}>
              {group.icon}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center justify-between text-sm text-stone-600 mb-4">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4 text-stone-500" />
            <span>{group.members_count} membres</span>
          </div>
          <div className="flex items-center gap-1">
            <Heart className="w-4 h-4 text-stone-500" />
            <span>{group.discoveries_count} découvertes</span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2">
          <Button 
            variant={buttonProps.variant}
            size="sm" 
            className={buttonProps.className}
            onClick={buttonProps.onClick}
            disabled={buttonProps.disabled}
          >
            {buttonProps.icon}
            {buttonProps.text}
          </Button>
          
          <GroupInviteDialog
            groupId={group.id}
            groupName={group.name}
          />
        </div>

        <div className="flex items-center justify-between mt-3 text-xs text-stone-500">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>Créé le {new Date(group.created_at).toLocaleDateString()}</span>
          </div>
          {group.is_public && (
            <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-800 border-amber-200">
              Public
            </Badge>
          )}
          {!group.is_public && (
            <Badge variant="outline" className="text-xs border-stone-300 text-stone-600">
              Privé
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SocialInterestGroupCard;
