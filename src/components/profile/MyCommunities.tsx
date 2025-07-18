
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Crown, Shield, User, MessageCircle, Calendar } from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface GroupMembership {
  id: string;
  role: string;
  joined_at: string;
  interest_groups: {
    id: string;
    name: string;
    description: string;
    slug: string;
    is_public: boolean;
    members_count: number;
    discoveries_count: number;
    created_at: string;
    icon?: string;
    theme_color?: string;
  };
}

interface MyCommunitiesProps {
  userId?: string;
}

const MyCommunities: React.FC<MyCommunitiesProps> = ({ userId }) => {
  const [memberships, setMemberships] = useState<GroupMembership[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const targetUserId = userId || user?.id;

  useEffect(() => {
    if (targetUserId) {
      loadMemberships();
    }
  }, [targetUserId]);

  const loadMemberships = async () => {
    if (!targetUserId) return;

    try {
      const { data, error } = await supabase
        .from('group_members')
        .select(`
          id,
          role,
          joined_at,
          interest_groups (
            id,
            name,
            description,
            slug,
            is_public,
            members_count,
            discoveries_count,
            created_at,
            icon,
            theme_color
          )
        `)
        .eq('user_id', targetUserId)
        .order('joined_at', { ascending: false });

      if (error) throw error;
      setMemberships(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des communautés:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Crown className="h-4 w-4 text-yellow-600" />;
      case 'moderator':
        return <Shield className="h-4 w-4 text-blue-600" />;
      default:
        return <User className="h-4 w-4 text-gray-600" />;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Administrateur</Badge>;
      case 'moderator':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Modérateur</Badge>;
      default:
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Membre</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (memberships.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">Vous ne faites partie d'aucune communauté pour le moment.</p>
          <Button asChild>
            <a href="/community">
              <I18nText translationKey="community.exploreGroups">Découvrir les communautés</I18nText>
            </a>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Mes communautés ({memberships.length})</h3>
        <Button variant="outline" size="sm" asChild>
          <a href="/community">Découvrir plus</a>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {memberships.map((membership) => (
          <Card key={membership.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    {membership.interest_groups.icon && (
                      <span className="text-xl">{membership.interest_groups.icon}</span>
                    )}
                    <span>{membership.interest_groups.name}</span>
                  </CardTitle>
                  {membership.interest_groups.description && (
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {membership.interest_groups.description}
                    </p>
                  )}
                </div>
                {getRoleBadge(membership.role)}
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{membership.interest_groups.members_count} membres</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="h-4 w-4" />
                      <span>{membership.interest_groups.discoveries_count} découvertes</span>
                    </div>
                  </div>
                  
                  {!membership.interest_groups.is_public && (
                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                      Privé
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500 flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Membre depuis {format(new Date(membership.joined_at), 'MMMM yyyy', { locale: fr })}
                    </span>
                  </div>

                  <Button variant="outline" size="sm" asChild>
                    <a href={`/community/${membership.interest_groups.slug}`}>
                      Visiter
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MyCommunities;
