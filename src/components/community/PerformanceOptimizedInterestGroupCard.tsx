
import React, { memo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Eye, Globe, Lock } from 'lucide-react';
import { InterestGroup } from '@/types/interest-groups';
import { LazyGroupImage } from './LazyGroupImage';
import { useCommunityCache } from '@/hooks/useCommunityCache';

interface PerformanceOptimizedInterestGroupCardProps {
  group: InterestGroup;
  onHover?: (groupId: string) => void;
}

const PerformanceOptimizedInterestGroupCard: React.FC<PerformanceOptimizedInterestGroupCardProps> = memo(({
  group,
  onHover
}) => {
  const { prefetchGroup } = useCommunityCache();

  const handleMouseEnter = useCallback(() => {
    if (onHover) {
      onHover(group.id);
    }
    // Prefetch group details on hover
    prefetchGroup(group.id);
  }, [group.id, onHover, prefetchGroup]);

  const handleViewGroup = useCallback(() => {
    // Navigate to group detail
    console.log('Navigating to group:', group.id);
  }, [group.id]);

  return (
    <Card 
      className="group hover:shadow-lg transition-all duration-200 cursor-pointer"
      onMouseEnter={handleMouseEnter}
    >
      <CardHeader className="p-4 pb-2">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold truncate">
              {group.name}
            </CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <Badge 
                variant={group.is_public ? "secondary" : "outline"}
                className="text-xs"
              >
                {group.is_public ? (
                  <>
                    <Globe className="w-3 h-3 mr-1" />
                    Public
                  </>
                ) : (
                  <>
                    <Lock className="w-3 h-3 mr-1" />
                    Private
                  </>
                )}
              </Badge>
            </div>
          </div>
          {group.banner_image && (
            <LazyGroupImage
              src={group.banner_image}
              alt={group.name}
              className="w-12 h-12 rounded-lg ml-3"
              fallbackColor={group.theme_color}
            />
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-0">
        {group.description && (
          <p className="text-sm text-slate-600 mb-4 line-clamp-2">
            {group.description}
          </p>
        )}

        <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{group.members_count}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{group.discoveries_count}</span>
            </div>
          </div>
        </div>

        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={handleViewGroup}
        >
          View Group
        </Button>
      </CardContent>
    </Card>
  );
});

PerformanceOptimizedInterestGroupCard.displayName = 'PerformanceOptimizedInterestGroupCard';

export default PerformanceOptimizedInterestGroupCard;
