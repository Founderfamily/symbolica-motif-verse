import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, X, Star, StarOff, Edit, Save, Trash2, Image as ImageIcon } from 'lucide-react';
import { SymbolImage } from '@/types/supabase';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useDropzone } from 'react-dropzone';

interface ImageGalleryEditorProps {
  symbolId: string;
  images: SymbolImage[];
  onImagesUpdated: (updatedImages: SymbolImage[]) => void;
}

export const ImageGalleryEditor: React.FC<ImageGalleryEditorProps> = ({
  symbolId,
  images,
  onImagesUpdated
}) => {
  const [uploading, setUploading] = useState(false);
  const [editingImage, setEditingImage] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<{
    title: string;
    description: string;
    image_type: 'original' | 'pattern' | 'reuse';
  }>({ title: '', description: '', image_type: 'original' });

  const uploadImage = async (file: File) => {
    try {
      setUploading(true);
      
      // Vérifier que l'utilisateur est connecté
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        toast.error('Vous devez être connecté pour uploader des images');
        return;
      }
      
      // Créer un nom de fichier unique
      const fileExt = file.name.split('.').pop();
      const fileName = `${symbolId}/${Date.now()}.${fileExt}`;
      
      // Upload vers Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('symbol-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Obtenir l'URL publique
      const { data: { publicUrl } } = supabase.storage
        .from('symbol-images')
        .getPublicUrl(fileName);

      // Créer l'entrée dans la base de données
      const { data: imageData, error: dbError } = await supabase
        .from('symbol_images')
        .insert({
          symbol_id: symbolId,
          image_url: publicUrl,
          image_type: 'original',
          title: file.name,
          description: null,
          uploaded_by: user.id
        })
        .select()
        .single();

      if (dbError) throw dbError;

      // Mettre à jour la liste des images
      onImagesUpdated([...images, imageData]);
      toast.success('Image uploadée avec succès');

    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      toast.error('Erreur lors de l\'upload de l\'image');
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (imageId: string, imageUrl: string) => {
    try {
      // Extraire le chemin du fichier depuis l'URL
      const urlParts = imageUrl.split('/');
      const filePath = urlParts.slice(-2).join('/'); // symbolId/filename

      // Supprimer de la base de données
      const { error: dbError } = await supabase
        .from('symbol_images')
        .delete()
        .eq('id', imageId);

      if (dbError) throw dbError;

      // Supprimer du stockage
      const { error: storageError } = await supabase.storage
        .from('symbol-images')
        .remove([filePath]);

      if (storageError) {
        console.warn('Erreur lors de la suppression du fichier:', storageError);
        // On continue même si la suppression du fichier échoue
      }

      // Mettre à jour la liste des images
      onImagesUpdated(images.filter(img => img.id !== imageId));
      toast.success('Image supprimée avec succès');

    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression de l\'image');
    }
  };

  const updateImage = async (imageId: string) => {
    try {
      const { data, error } = await supabase
        .from('symbol_images')
        .update({
          title: editingData.title,
          description: editingData.description,
          image_type: editingData.image_type,
          updated_at: new Date().toISOString()
        })
        .eq('id', imageId)
        .select()
        .single();

      if (error) throw error;

      // Mettre à jour la liste des images
      onImagesUpdated(images.map(img => img.id === imageId ? data : img));
      setEditingImage(null);
      toast.success('Image mise à jour avec succès');

    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast.error('Erreur lors de la mise à jour de l\'image');
    }
  };

  const startEditing = (image: SymbolImage) => {
    setEditingImage(image.id);
    setEditingData({
      title: image.title || '',
      description: image.description || '',
      image_type: image.image_type
    });
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach(file => {
      uploadImage(file);
    });
  }, [symbolId]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif']
    },
    multiple: true
  });

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-semibold">Galerie d'images</Label>
        <p className="text-sm text-slate-500 mb-4">
          Gérez les images de ce symbole. Glissez-déposez ou cliquez pour ajouter de nouvelles images.
        </p>

        {/* Zone de drop pour upload */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-amber-400 bg-amber-50'
              : 'border-slate-300 hover:border-amber-400 hover:bg-slate-50'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-8 w-8 text-slate-400 mb-2" />
          {isDragActive ? (
            <p className="text-amber-600">Déposez les images ici...</p>
          ) : (
            <div>
              <p className="text-slate-600">Glissez-déposez des images ici ou cliquez pour sélectionner</p>
              <p className="text-xs text-slate-400 mt-1">JPEG, PNG, WebP, GIF acceptés</p>
            </div>
          )}
        </div>

        {uploading && (
          <div className="mt-2 text-center">
            <div className="inline-flex items-center gap-2 text-amber-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-600"></div>
              Upload en cours...
            </div>
          </div>
        )}
      </div>

      {/* Liste des images existantes */}
      {images.length > 0 && (
        <div className="space-y-4">
          <Label className="text-base font-semibold">Images existantes ({images.length})</Label>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {images.map((image) => (
              <Card key={image.id} className="p-4">
                <div className="flex gap-4">
                  {/* Miniature de l'image */}
                  <div className="flex-shrink-0">
                    <img
                      src={image.image_url}
                      alt={image.title || 'Image de symbole'}
                      className="w-20 h-20 object-cover rounded border"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder.svg';
                      }}
                    />
                  </div>

                  {/* Informations et édition */}
                  <div className="flex-1 space-y-2">
                    {editingImage === image.id ? (
                      <div className="space-y-2">
                        <Input
                          placeholder="Titre de l'image"
                          value={editingData.title}
                          onChange={(e) => setEditingData(prev => ({ ...prev, title: e.target.value }))}
                        />
                        <Textarea
                          placeholder="Description"
                          value={editingData.description}
                          onChange={(e) => setEditingData(prev => ({ ...prev, description: e.target.value }))}
                          rows={2}
                        />
                        <select
                          value={editingData.image_type}
                          onChange={(e) => setEditingData(prev => ({ 
                            ...prev, 
                            image_type: e.target.value as 'original' | 'pattern' | 'reuse'
                          }))}
                          className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                        >
                          <option value="original">Image originale</option>
                          <option value="pattern">Motif extrait</option>
                          <option value="reuse">Réutilisation</option>
                        </select>
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => updateImage(image.id)}>
                            <Save className="h-3 w-3 mr-1" />
                            Sauver
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingImage(null)}>
                            <X className="h-3 w-3 mr-1" />
                            Annuler
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-sm">{image.title || 'Sans titre'}</h4>
                          <Badge variant="outline" className="text-xs">
                            {image.image_type === 'original' ? 'Original' : 
                             image.image_type === 'pattern' ? 'Motif' : 'Réutilisation'}
                          </Badge>
                        </div>
                        {image.description && (
                          <p className="text-xs text-slate-600 mb-2">{image.description}</p>
                        )}
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline" onClick={() => startEditing(image)}>
                            <Edit className="h-3 w-3 mr-1" />
                            Éditer
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => {
                              if (confirm('Êtes-vous sûr de vouloir supprimer cette image ?')) {
                                deleteImage(image.id, image.image_url);
                              }
                            }}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Suppr.
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {images.length === 0 && (
        <div className="text-center py-8 text-slate-500">
          <ImageIcon className="mx-auto h-12 w-12 text-slate-300 mb-4" />
          <p>Aucune image pour ce symbole</p>
          <p className="text-sm">Uploadez la première image ci-dessus</p>
        </div>
      )}
    </div>
  );
};
