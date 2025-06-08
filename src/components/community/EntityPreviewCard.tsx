
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Folder, FileText, ExternalLink, MapPin, Calendar } from 'lucide-react';
import { EntityPreview } from '@/types/interest-groups';

interface EntityPreviewCardProps {
  entity: EntityPreview;
  onNavigate?: (entityType: string, entityId: string) => void;
}

const EntityPreviewCard: React.FC<EntityPreviewCardProps> = ({ entity, onNavigate }) => {
  const getEntityIcon = () => {
    switch (entity.type) {
      case 'symbol':
        return <Eye className="h-4 w-4" />;
      case 'collection':
        return <Folder className="h-4 w-4" />;
      case 'contribution':
        return <FileText className="h-4 w-4" />;
      default:
        return <Eye className="h-4 w-4" />;
    }
  };

  const getEntityUrl = () => {
    switch (entity.type) {
      case 'symbol':
        return `/symbols/${entity.id}`;
      case 'collection':
        return `/collections/${entity.id}`;
      case 'contribution':
        return `/contributions/${entity.id}`;
      default:
        return '#';
    }
  };

  const getEntityTypeColor = () => {
    switch (entity.type) {
      case 'symbol':
        return 'bg-blue-100 text-blue-800';
      case 'collection':
        return 'bg-purple-100 text-purple-800';
      case 'contribution':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleNavigate = () => {
    if (onNavigate) {
      onNavigate(entity.type, entity.id);
    } else {
      window.open(getEntityUrl(), '_blank');
    }
  };

  return (
    <Card className="p-4 bg-slate-50 border border-slate-200">
      <CardContent className="p-0">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <Badge variant="secondary" className={`text-xs gap-1 ${getEntityTypeColor()}`}>
              {getEntityIcon()}
              {entity.type.charAt(0).toUpperCase() + entity.type.slice(1)}
            </Badge>
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-slate-900 truncate mb-1">
              {entity.name}
            </h4>
            
            {entity.description && (
              <p className="text-sm text-slate-600 line-clamp-2 mb-2">
                {entity.description}
              </p>
            )}
            
            <div className="flex flex-wrap gap-2 mb-3">
              {entity.culture && (
                <Badge variant="outline" className="text-xs">
                  <MapPin className="h-3 w-3 mr-1" />
                  {entity.culture}
                </Badge>
              )}
              {entity.period && (
                <Badge variant="outline" className="text-xs">
                  <Calendar className="h-3 w-3 mr-1" />
                  {entity.period}
                </Badge>
              )}
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleNavigate}
              className="gap-2 text-xs"
            >
              <ExternalLink className="h-3 w-3" />
              View Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EntityPreviewCard;
