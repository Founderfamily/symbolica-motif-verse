import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Circle, Zap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

interface Chakra {
  id: string;
  chakra_name: string;
  position?: number;
  color?: string;
  element?: string;
  description?: string;
}

interface SymbolChakrasProps {
  symbolId: string;
}

const chakraColors: { [key: string]: string } = {
  'rouge': '#DC2626',
  'orange': '#EA580C',
  'jaune': '#CA8A04',
  'vert': '#16A34A',
  'bleu': '#2563EB',
  'indigo': '#4F46E5',
  'violet': '#7C3AED',
  'red': '#DC2626',
  'yellow': '#CA8A04',
  'green': '#16A34A',
  'blue': '#2563EB',
  'purple': '#7C3AED'
};

export const SymbolChakras: React.FC<SymbolChakrasProps> = ({ symbolId }) => {
  const { data: chakras, isLoading } = useQuery({
    queryKey: ['symbol-chakras', symbolId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('symbol_chakras')
        .select('*')
        .eq('symbol_id', symbolId)
        .order('position', { ascending: true });
      
      if (error) throw error;
      return data as Chakra[];
    }
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!chakras || chakras.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Connexions chakras
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Aucune connexion chakra définie pour ce symbole.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          Connexions chakras
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {chakras.map((chakra) => (
          <div key={chakra.id} className="flex items-start gap-4 p-4 border border-border rounded-lg">
            <div className="flex-shrink-0">
              <Circle 
                className="h-8 w-8" 
                fill={chakra.color ? chakraColors[chakra.color.toLowerCase()] || chakra.color : '#6B7280'}
                color={chakra.color ? chakraColors[chakra.color.toLowerCase()] || chakra.color : '#6B7280'}
              />
            </div>
            
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-foreground">{chakra.chakra_name}</h4>
                {chakra.position && (
                  <Badge variant="outline">
                    {chakra.position}° chakra
                  </Badge>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2">
                {chakra.color && (
                  <Badge variant="secondary" style={{ 
                    backgroundColor: `${chakraColors[chakra.color.toLowerCase()] || chakra.color}20`,
                    color: chakraColors[chakra.color.toLowerCase()] || chakra.color
                  }}>
                    {chakra.color}
                  </Badge>
                )}
                {chakra.element && (
                  <Badge variant="outline">
                    Élément : {chakra.element}
                  </Badge>
                )}
              </div>
              
              {chakra.description && (
                <p className="text-sm text-muted-foreground">
                  {chakra.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};