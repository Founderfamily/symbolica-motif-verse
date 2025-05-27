import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ImageAnnotator } from '@/components/patterns/ImageAnnotator';
import { PatternManager } from '@/components/patterns/PatternManager';
import { useSymbolImages } from '@/hooks/useSymbolImages';
import { useAuth } from '@/hooks/useAuth';
import { useGamification } from '@/hooks/useGamification';
import { supabase } from '@/integrations/supabase/client';
import { Sparkles } from 'lucide-react';
import type { SymbolData } from '@/types/supabase';

interface SymbolDetailViewProps {
  symbol: SymbolData;
}

export const SymbolDetailView: React.FC<SymbolDetailViewProps> = ({ symbol }) => {
  const { user } = useAuth();
  const { awardPoints } = useGamification();
  const [selectedImageType, setSelectedImageType] = useState<'original' | 'pattern' | 'reuse'>('original');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasAwardedExplorationPoints, setHasAwardedExplorationPoints] = useState(false);
  const { loading: imagesLoading, images } = useSymbolImages(symbol.id);

  // Award exploration points when user views symbol details
  useEffect(() => {
    if (user && !hasAwardedExplorationPoints) {
      const awardExplorationPoints = async () => {
        try {
          const success = await awardPoints(
            'exploration',
            10, // 10 points for exploring a symbol
            symbol.id,
            { 
              symbolName: symbol.name, 
              symbolCulture: symbol.culture 
            }
          );
          
          if (success) {
            setHasAwardedExplorationPoints(true);
          }
        } catch (error) {
          console.error('Error awarding exploration points:', error);
        }
      };
      
      // Delay to avoid awarding points immediately on page load
      const timer = setTimeout(awardExplorationPoints, 2000);
      return () => clearTimeout(timer);
    }
  }, [user, symbol.id, symbol.name, symbol.culture, awardPoints, hasAwardedExplorationPoints]);

  const handleAIAnalysis = async () => {
    const currentImage = images[selectedImageType];
    if (!currentImage) return;

    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-pattern-recognition', {
        body: {
          imageUrl: currentImage.image_url,
          imageId: currentImage.id,
          imageType: 'symbol'
        }
      });

      if (error) throw error;

      console.log('AI analysis completed:', data);
      
      // Award points for using AI analysis
      if (user) {
        await awardPoints(
          'validation',
          15, // 15 points for AI analysis
          currentImage.id,
          { 
            analysisType: 'ai_pattern_recognition',
            symbolName: symbol.name 
          }
        );
      }
    } catch (error) {
      console.error('Error during AI analysis:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (imagesLoading) {
    return <div>Chargement des détails du symbole...</div>;
  }

  const currentImage = images[selectedImageType];
  const availableImages = Object.entries(images).filter(([_, image]) => image !== null);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {symbol.name}
            <div className="flex gap-2">
              <Badge>{symbol.culture}</Badge>
              <Badge variant="outline">{symbol.period}</Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">{symbol.description}</p>
          
          {symbol.function && symbol.function.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium mb-2">Fonctions :</h4>
              <div className="flex flex-wrap gap-2">
                {symbol.function.map((func, index) => (
                  <Badge key={index} variant="secondary">{func}</Badge>
                ))}
              </div>
            </div>
          )}

          {symbol.medium && symbol.medium.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium mb-2">Supports :</h4>
              <div className="flex flex-wrap gap-2">
                {symbol.medium.map((med, index) => (
                  <Badge key={index} variant="secondary">{med}</Badge>
                ))}
              </div>
            </div>
          )}

          {symbol.technique && symbol.technique.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium mb-2">Techniques :</h4>
              <div className="flex flex-wrap gap-2">
                {symbol.technique.map((tech, index) => (
                  <Badge key={index} variant="secondary">{tech}</Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="images" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="patterns">Motifs</TabsTrigger>
          <TabsTrigger value="analysis">Analyse IA</TabsTrigger>
        </TabsList>

        <TabsContent value="images" className="space-y-4">
          {availableImages.length > 0 && (
            <>
              <div className="flex gap-2 overflow-x-auto">
                {availableImages.map(([type, image]) => (
                  <button
                    key={type}
                    onClick={() => setSelectedImageType(type as 'original' | 'pattern' | 'reuse')}
                    className={`flex-shrink-0 w-20 h-20 rounded border-2 overflow-hidden ${
                      selectedImageType === type ? 'border-blue-500' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image!.image_url}
                      alt={image!.title || 'Image'}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>

              {currentImage && (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">
                        {currentImage.title || 'Image du symbole'}
                      </h3>
                      <Button
                        onClick={handleAIAnalysis}
                        disabled={isAnalyzing}
                        size="sm"
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        {isAnalyzing ? 'Analyse en cours...' : 'Analyser avec IA'}
                      </Button>
                    </div>
                    
                    <ImageAnnotator
                      imageUrl={currentImage.image_url}
                      imageId={currentImage.id}
                      imageType="symbol"
                      symbolId={symbol.id}
                    />
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="patterns">
          <PatternManager 
            symbolId={symbol.id}
            onPatternCreated={(pattern) => {
              console.log('Nouveau motif créé:', pattern);
              // Award points for pattern creation
              if (user) {
                awardPoints(
                  'contribution',
                  20, // 20 points for creating a pattern
                  pattern.id,
                  { 
                    patternName: pattern.name,
                    symbolName: symbol.name 
                  }
                );
              }
            }}
          />
        </TabsContent>

        <TabsContent value="analysis">
          <Card>
            <CardHeader>
              <CardTitle>Analyse IA des motifs</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                L'analyse IA permet de détecter automatiquement les motifs dans les images 
                et de suggérer des annotations. Cette fonctionnalité sera bientôt intégrée 
                avec des modèles de vision par ordinateur avancés.
              </p>
              
              {currentImage && (
                <Button
                  onClick={handleAIAnalysis}
                  disabled={isAnalyzing}
                  className="w-full"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  {isAnalyzing ? 'Analyse en cours...' : 'Lancer l\'analyse IA'}
                </Button>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
