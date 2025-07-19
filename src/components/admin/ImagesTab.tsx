
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Upload, ImageIcon, Edit, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ImagesTabProps {
  symbolId: string;
}

export function ImagesTab({ symbolId }: ImagesTabProps) {
  const [uploadingImage, setUploadingImage] = useState(false);
  const [generatingImage, setGeneratingImage] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [images, setImages] = useState([
    {
      id: '1',
      url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
      title: 'Symbole principal',
      type: 'original',
      isPrimary: true,
      uploadedAt: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      url: 'https://images.unsplash.com/photo-1620421680010-0766ff230392?w=400',
      title: 'Variante historique',
      type: 'variant',
      isPrimary: false,
      uploadedAt: '2024-01-15T11:45:00Z'
    },
    {
      id: '3',
      url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
      title: 'Contexte culturel',
      type: 'context',
      isPrimary: false,
      uploadedAt: '2024-01-15T12:15:00Z'
    }
  ]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      // Simulate upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newImage = {
        id: Date.now().toString(),
        url: URL.createObjectURL(file),
        title: file.name,
        type: 'original',
        isPrimary: false,
        uploadedAt: new Date().toISOString()
      };
      
      setImages(prev => [...prev, newImage]);
      toast.success('Image uploadée avec succès');
    } catch (error) {
      toast.error('Erreur lors de l\'upload de l\'image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!aiPrompt.trim()) return;

    setGeneratingImage(true);
    try {
      // Simulate AI generation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const generatedImage = {
        id: Date.now().toString(),
        url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
        title: `Image générée: ${aiPrompt.substring(0, 30)}...`,
        type: 'generated',
        isPrimary: false,
        uploadedAt: new Date().toISOString()
      };
      
      setImages(prev => [...prev, generatedImage]);
      setAiPrompt('');
      toast.success('Image générée avec succès');
    } catch (error) {
      toast.error('Erreur lors de la génération de l\'image');
    } finally {
      setGeneratingImage(false);
    }
  };

  const handleDeleteImage = (imageId: string) => {
    setImages(prev => prev.filter(img => img.id !== imageId));
    toast.success('Image supprimée');
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'original': return 'bg-blue-100 text-blue-800';
      case 'variant': return 'bg-green-100 text-green-800';
      case 'context': return 'bg-purple-100 text-purple-800';
      case 'generated': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'original': return 'Original';
      case 'variant': return 'Variante';
      case 'context': return 'Contexte';
      case 'generated': return 'Générée';
      default: return 'Autre';
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload d'image */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Ajouter une image
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">
              Glissez et déposez une image ici, ou cliquez pour sélectionner
            </p>
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploadingImage}
              className="hidden"
              id="image-upload"
            />
            <Label htmlFor="image-upload" className="cursor-pointer">
              <Button disabled={uploadingImage} variant="outline">
                {uploadingImage ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Upload en cours...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Sélectionner une image
                  </>
                )}
              </Button>
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Génération d'image avec IA */}
      <Card>
        <CardHeader>
          <CardTitle>Générer une image avec IA</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ai-prompt">Description de l'image souhaitée</Label>
            <Textarea
              id="ai-prompt"
              placeholder="Décrivez l'image que vous souhaitez générer..."
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              rows={3}
            />
          </div>
          <Button
            onClick={handleGenerateImage}
            disabled={generatingImage || !aiPrompt.trim()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {generatingImage ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Génération en cours...
              </>
            ) : (
              'Générer l\'image'
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Images existantes */}
      <Card>
        <CardHeader>
          <CardTitle>Images existantes ({images.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((image) => (
              <div key={image.id} className="relative group">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={image.url}
                    alt={image.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Overlay avec actions */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex gap-2">
                    <Button size="sm" variant="secondary">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteImage(image.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Informations */}
                <div className="mt-2 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm truncate">{image.title}</h4>
                    {image.isPrimary && (
                      <Badge className="bg-blue-100 text-blue-800 text-xs">
                        Principal
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`${getTypeColor(image.type)} text-xs`}>
                      {getTypeLabel(image.type)}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {new Date(image.uploadedAt).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {images.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <ImageIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Aucune image pour ce symbole</p>
              <p className="text-sm">Ajoutez une image pour commencer</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
