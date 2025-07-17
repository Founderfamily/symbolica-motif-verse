import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp, Flame, Clock, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

interface Ritual {
  id: string;
  ritual_name: string;
  description?: string;
  instructions?: string;
  materials_needed?: string[];
  occasion?: string;
  difficulty_level: string;
  duration_minutes?: number;
}

interface SymbolRitualsProps {
  symbolId: string;
}

const difficultyColors = {
  'beginner': 'bg-green-100 text-green-800',
  'intermediate': 'bg-yellow-100 text-yellow-800',
  'advanced': 'bg-red-100 text-red-800'
};

const difficultyLabels = {
  'beginner': 'Débutant',
  'intermediate': 'Intermédiaire',
  'advanced': 'Avancé'
};

export const SymbolRituals: React.FC<SymbolRitualsProps> = ({ symbolId }) => {
  const [openRituals, setOpenRituals] = useState<Set<string>>(new Set());

  const { data: rituals, isLoading } = useQuery({
    queryKey: ['symbol-rituals', symbolId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('symbol_rituals')
        .select('*')
        .eq('symbol_id', symbolId)
        .order('difficulty_level', { ascending: true });
      
      if (error) throw error;
      return data as Ritual[];
    }
  });

  const toggleRitual = (ritualId: string) => {
    setOpenRituals(prev => {
      const newSet = new Set(prev);
      if (newSet.has(ritualId)) {
        newSet.delete(ritualId);
      } else {
        newSet.add(ritualId);
      }
      return newSet;
    });
  };

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

  if (!rituals || rituals.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-primary" />
            Rituels et pratiques
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Aucun rituel disponible pour ce symbole.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-primary" />
          Rituels et pratiques
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {rituals.map((ritual) => (
          <Collapsible key={ritual.id} open={openRituals.has(ritual.id)}>
            <CollapsibleTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full justify-between p-4 h-auto"
                onClick={() => toggleRitual(ritual.id)}
              >
                <div className="text-left space-y-2">
                  <h4 className="font-semibold">{ritual.ritual_name}</h4>
                  <div className="flex items-center gap-2 text-sm">
                    <Badge 
                      variant="secondary" 
                      className={difficultyColors[ritual.difficulty_level as keyof typeof difficultyColors] || 'bg-gray-100 text-gray-800'}
                    >
                      <Star className="h-3 w-3 mr-1" />
                      {difficultyLabels[ritual.difficulty_level as keyof typeof difficultyLabels] || ritual.difficulty_level}
                    </Badge>
                    
                    {ritual.duration_minutes && (
                      <Badge variant="outline">
                        <Clock className="h-3 w-3 mr-1" />
                        {ritual.duration_minutes} min
                      </Badge>
                    )}
                    
                    {ritual.occasion && (
                      <Badge variant="outline">
                        {ritual.occasion}
                      </Badge>
                    )}
                  </div>
                </div>
                
                {openRituals.has(ritual.id) ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            
            <CollapsibleContent className="mt-4 space-y-4 p-4 border border-border rounded-lg">
              {ritual.description && (
                <div>
                  <h5 className="font-medium mb-2">Description</h5>
                  <p className="text-sm text-muted-foreground">{ritual.description}</p>
                </div>
              )}
              
              {ritual.materials_needed && ritual.materials_needed.length > 0 && (
                <div>
                  <h5 className="font-medium mb-2">Matériaux nécessaires</h5>
                  <ul className="list-disc list-inside space-y-1">
                    {ritual.materials_needed.map((material, index) => (
                      <li key={index} className="text-sm text-muted-foreground">
                        {material}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {ritual.instructions && (
                <div>
                  <h5 className="font-medium mb-2">Instructions</h5>
                  <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {ritual.instructions}
                  </div>
                </div>
              )}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </CardContent>
    </Card>
  );
};