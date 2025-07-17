import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Volume2, BookOpen, Languages } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

interface Mantra {
  id: string;
  mantra_text: string;
  pronunciation?: string;
  language: string;
  meaning?: string;
  audio_url?: string;
}

interface SymbolMantrasProps {
  symbolId: string;
}

export const SymbolMantras: React.FC<SymbolMantrasProps> = ({ symbolId }) => {
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [audioElements, setAudioElements] = useState<{ [key: string]: HTMLAudioElement }>({});

  const { data: mantras, isLoading } = useQuery({
    queryKey: ['symbol-mantras', symbolId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('symbol_mantras')
        .select('*')
        .eq('symbol_id', symbolId)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data as Mantra[];
    }
  });

  const playAudio = (mantraId: string, audioUrl: string) => {
    // Stop any currently playing audio
    if (playingAudio && audioElements[playingAudio]) {
      audioElements[playingAudio].pause();
      audioElements[playingAudio].currentTime = 0;
    }

    if (playingAudio === mantraId) {
      setPlayingAudio(null);
      return;
    }

    // Create new audio element if it doesn't exist
    if (!audioElements[mantraId]) {
      const audio = new Audio(audioUrl);
      audio.onended = () => setPlayingAudio(null);
      setAudioElements(prev => ({ ...prev, [mantraId]: audio }));
      audio.play();
    } else {
      audioElements[mantraId].play();
    }
    
    setPlayingAudio(mantraId);
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

  if (!mantras || mantras.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Mantras sacrés
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Aucun mantra disponible pour ce symbole.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Mantras sacrés
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {mantras.map((mantra) => (
          <div key={mantra.id} className="border border-border rounded-lg p-4 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Languages className="h-3 w-3" />
                    {mantra.language}
                  </Badge>
                </div>
                
                <blockquote className="text-lg font-medium text-foreground mb-2 italic">
                  "{mantra.mantra_text}"
                </blockquote>
                
                {mantra.pronunciation && (
                  <p className="text-sm text-muted-foreground mb-2">
                    <span className="font-medium">Prononciation :</span> {mantra.pronunciation}
                  </p>
                )}
                
                {mantra.meaning && (
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">Signification :</span> {mantra.meaning}
                  </p>
                )}
              </div>
              
              {mantra.audio_url && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => playAudio(mantra.id, mantra.audio_url!)}
                  className="ml-4"
                >
                  {playingAudio === mantra.id ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};