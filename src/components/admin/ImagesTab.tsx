
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, Trash2, Edit, Star, Loader2 } from 'lucide-react';
import { useSymbolImages } from '@/hooks/useSupabaseSymbols';
import { useSymbolImageUpload, useDeleteSymbolImage, useSetPrimaryImage } from '@/hooks/useSymbolImageUpload';

interface ImagesTabProps {
  symbolId?: string;
}

export function ImagesTab({ symbolId }: ImagesTabProps) {
  const [aiPrompt, setAiPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: images, isLoading: imagesLoading } = useSymbolImages(symbolId);
  const uploadImage = useSymbolImageUpload();
  const deleteImage = useDeleteSymbolImage();
  const setPrimaryImage = useSetPrimaryImage();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !symbolId) return;

    try {
      await uploadImage.mutateAsync({
        symbolId,
        file,
        imageType: 'original',
        title: `Image de ${symbolId}`
      });
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!symbolId) return;
    
    try {
      await deleteImage.mutateAsync({ id: imageId, symbolId });
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  const handleSetPrimaryImage = async (imageId: string) => {
    if (!symbolId) return;
    
    try {
      await setPrimaryImage.mutateAsync({ id: imageId, symbolId });
    } catch (error) {
      console.error('Error setting primary image:', error);
    }
  };

  const handleGenerateImage = async () => {
    if (!aiPrompt.trim() || !symbolId) return;
    
    setGenerating(true);
    // Simulate AI image generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    setGenerating(false);
    setAiPrompt('');
  };

  // Convert images data to array format if needed
  const imagesArray = images ? (Array.isArray(images) ? images : Object.values(images)) : [];

  return (
    <div className="space-y-6">
      {/* Upload d'images */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Télécharger des images</h3>
        
        <div 
          className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center cursor-pointer hover:border-slate-400 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-12 w-12 mx-auto text-slate-400 mb-4" />
          <p className="text-slate-600 mb-2">
            Cliquez pour sélectionner des images ou glissez-déposez ici
          </p>
          <p className="text-sm text-slate-500">
            PNG, JPG, GIF jusqu'à 10MB
          </p>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </div>

      {/* Génération d'image avec IA */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Générer une image avec IA</h3>
        
        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="ai-prompt">Description pour l'IA</Label>
            <Textarea
              id="ai-prompt"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Décrivez l'image que vous souhaitez générer..."
              rows={3}
            />
          </div>
          
          <Button
            onClick={handleGenerateImage}
            disabled={generating || !aiPrompt.trim() || !symbolId}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            {generating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {generating ? 'Génération en cours...' : 'Générer l\'image'}
          </Button>
        </div>
      </div>

      {/* Images existantes */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Images existantes ({imagesArray.length})</h3>
        
        {imagesLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : imagesArray.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {imagesArray.map((image, index) => (
              <Card key={image?.id || index} className="overflow-hidden">
                <div className="relative aspect-square bg-slate-100">
                  {image && (
                    <>
                      <img
                        src={image.image_url}
                        alt={image.title || `Image ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder.svg';
                        }}
                      />
                      
                      {image.is_primary && (
                        <div className="absolute top-2 left-2">
                          <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                            <Star className="h-3 w-3 mr-1" />
                            Principale
                          </Badge>
                        </div>
                      )}
                      
                      <div className="absolute top-2 right-2 flex gap-1">
                        {!image.is_primary && (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleSetPrimaryImage(image.id)}
                            className="h-8 w-8 p-0"
                          >
                            <Star className="h-3 w-3" />
                          </Button>
                        )}
                        
                        <Button
                          size="sm"
                          variant="secondary"
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteImage(image.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
                
                {image?.title && (
                  <CardContent className="p-3">
                    <p className="text-sm font-medium truncate">{image.title}</p>
                    <p className="text-xs text-slate-500">
                      {image.image_type === 'original' ? 'Image originale' : 'Image générée'}
                    </p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-500">
            <Upload className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Aucune image pour ce symbole</p>
            <p className="text-sm">Téléchargez ou générez des images pour commencer</p>
          </div>
        )}
      </div>
    </div>
  );
}
