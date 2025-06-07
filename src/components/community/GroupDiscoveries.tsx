
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Heart, Share2, Plus, Eye, Collection, FileText } from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';
import { useAuth } from '@/hooks/useAuth';
import { GroupDiscovery } from '@/types/interest-groups';
import { getGroupDiscoveries, shareDiscovery } from '@/services/communityService';
import { toast } from 'sonner';

interface GroupDiscoveriesProps {
  groupId: string;
  isMember: boolean;
}

const GroupDiscoveries: React.FC<GroupDiscoveriesProps> = ({ groupId, isMember }) => {
  const [discoveries, setDiscoveries] = useState<GroupDiscovery[]>([]);
  const [loading, setLoading] = useState(true);
  const [showShareForm, setShowShareForm] = useState(false);
  const auth = useAuth();

  useEffect(() => {
    loadDiscoveries();
  }, [groupId]);

  const loadDiscoveries = async () => {
    try {
      const discoveriesData = await getGroupDiscoveries(groupId);
      setDiscoveries(discoveriesData);
    } catch (error) {
      console.error('Error loading discoveries:', error);
      toast.error('Failed to load discoveries');
    } finally {
      setLoading(false);
    }
  };

  const getEntityIcon = (entityType: string) => {
    switch (entityType) {
      case 'symbol':
        return <Eye className="h-4 w-4" />;
      case 'collection':
        return <Collection className="h-4 w-4" />;
      case 'contribution':
        return <FileText className="h-4 w-4" />;
      default:
        return <Share2 className="h-4 w-4" />;
    }
  };

  const getEntityTypeLabel = (entityType: string) => {
    switch (entityType) {
      case 'symbol':
        return 'Symbol';
      case 'collection':
        return 'Collection';
      case 'contribution':
        return 'Contribution';
      default:
        return 'Item';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex space-x-3 animate-pulse">
                <div className="h-10 w-10 bg-slate-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-slate-200 rounded w-24 mb-2"></div>
                  <div className="h-3 bg-slate-200 rounded w-full mb-2"></div>
                  <div className="h-3 bg-slate-200 rounded w-3/4"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Share Button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">
            <I18nText translationKey="community.sharedDiscoveries">Shared Discoveries</I18nText>
          </h3>
          <p className="text-sm text-slate-600">
            <I18nText translationKey="community.discoveriesDescription">
              Symbols, collections, and contributions shared by group members
            </I18nText>
          </p>
        </div>
        
        {isMember && auth?.user && (
          <Button 
            onClick={() => setShowShareForm(!showShareForm)}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            <I18nText translationKey="community.shareDiscovery">Share Discovery</I18nText>
          </Button>
        )}
      </div>

      {/* Share Form - Placeholder for now */}
      {showShareForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              <I18nText translationKey="community.shareNewDiscovery">Share New Discovery</I18nText>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-slate-500">
              <Share2 className="h-12 w-12 mx-auto mb-4 text-slate-400" />
              <p>
                <I18nText translationKey="community.discoveriesComingSoon">
                  Discoveries sharing functionality coming soon
                </I18nText>
              </p>
              <Button 
                variant="outline" 
                onClick={() => setShowShareForm(false)}
                className="mt-4"
              >
                <I18nText translationKey="common.close">Close</I18nText>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Discoveries List */}
      <div className="space-y-4">
        {discoveries.map((discovery) => (
          <Card key={discovery.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage 
                    src={`https://avatar.vercel.sh/${discovery.sharer_profile?.username || 'user'}.png`} 
                    alt={discovery.sharer_profile?.username || 'User'} 
                  />
                  <AvatarFallback>
                    {discovery.sharer_profile?.username?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <p className="font-medium">
                      {discovery.sharer_profile?.full_name || discovery.sharer_profile?.username || 'Unknown User'}
                    </p>
                    <Badge variant="secondary" className="text-xs gap-1">
                      {getEntityIcon(discovery.entity_type)}
                      {getEntityTypeLabel(discovery.entity_type)}
                    </Badge>
                    <span className="text-slate-500 text-sm">
                      {new Date(discovery.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <h4 className="font-semibold text-slate-900 mb-2">
                    {discovery.title}
                  </h4>
                  
                  {discovery.description && (
                    <p className="text-slate-700 mb-3">
                      {discovery.description}
                    </p>
                  )}
                  
                  {/* Discovery Actions */}
                  <div className="flex items-center space-x-4">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-slate-600 hover:text-red-600"
                    >
                      <Heart className="h-4 w-4 mr-1" />
                      {discovery.likes_count}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-slate-600"
                    >
                      <I18nText translationKey="community.viewDetails">View Details</I18nText>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {discoveries.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Share2 className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              <I18nText translationKey="community.noDiscoveries">No discoveries yet</I18nText>
            </h3>
            <p className="text-slate-600">
              <I18nText translationKey="community.startSharingDiscoveries">
                Be the first to share an interesting symbol or collection
              </I18nText>
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GroupDiscoveries;
