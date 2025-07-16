import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Palette, Hammer, Star } from 'lucide-react';
import { SymbolData } from '@/types/supabase';

interface SymbolTechnicalInfoProps {
  symbol: SymbolData;
}

export const SymbolTechnicalInfo: React.FC<SymbolTechnicalInfoProps> = ({ symbol }) => {
  const hasAnyTechnicalInfo = symbol.function || symbol.medium || symbol.technique;

  if (!hasAnyTechnicalInfo) {
    return null;
  }

  return (
    <Card className="p-6 mb-8">
      <h3 className="text-xl font-semibold mb-4">Aspects techniques</h3>
      <div className="space-y-4">
        {symbol.function && symbol.function.length > 0 && (
          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Star className="h-4 w-4" />
              Fonctions
            </h4>
            <div className="flex flex-wrap gap-2">
              {symbol.function.map((func, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {func}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {symbol.medium && symbol.medium.length > 0 && (
          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Supports
            </h4>
            <div className="flex flex-wrap gap-2">
              {symbol.medium.map((med, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {med}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {symbol.technique && symbol.technique.length > 0 && (
          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Hammer className="h-4 w-4" />
              Techniques
            </h4>
            <div className="flex flex-wrap gap-2">
              {symbol.technique.map((tech, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};