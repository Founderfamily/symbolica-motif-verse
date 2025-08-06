import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff } from 'lucide-react';

interface LegendItem {
  type: 'clues' | 'archives' | 'community';
  label: string;
  color: string;
  count: number;
  visible: boolean;
}

interface MapLegendProps {
  clueCount: number;
  archiveCount: number;
  communityCount: number;
  visibleLayers: {
    clues: boolean;
    archives: boolean;
    community: boolean;
  };
  onToggleLayer: (type: 'clues' | 'archives' | 'community') => void;
}

const MapLegend: React.FC<MapLegendProps> = ({ 
  clueCount, 
  archiveCount, 
  communityCount,
  visibleLayers,
  onToggleLayer 
}) => {
  const legendItems: LegendItem[] = [
    {
      type: 'clues',
      label: 'Indices de la quête',
      color: '#EF4444',
      count: clueCount,
      visible: visibleLayers.clues
    },
    {
      type: 'archives',
      label: 'Sites historiques',
      color: '#8B5CF6',
      count: archiveCount,
      visible: visibleLayers.archives
    },
    {
      type: 'community',
      label: 'Lieux communautaires',
      color: '#10B981',
      count: communityCount,
      visible: visibleLayers.community
    }
  ];

  return (
    <Card className="absolute top-4 left-4 z-10 min-w-[200px] shadow-lg">
      <CardContent className="p-3">
        <h3 className="text-sm font-semibold mb-3 text-foreground">Légende</h3>
        <div className="space-y-2">
          {legendItems.map((item) => (
            <div key={item.type} className="flex items-center justify-between">
              <div className="flex items-center gap-2 flex-1">
                <div 
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs text-foreground truncate">
                  {item.label}
                </span>
                <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                  {item.count}
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 ml-1"
                onClick={() => onToggleLayer(item.type)}
              >
                {item.visible ? (
                  <Eye className="h-3 w-3" />
                ) : (
                  <EyeOff className="h-3 w-3 opacity-50" />
                )}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MapLegend;