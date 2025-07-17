import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, X, Star, StarOff, Edit, Save, Trash2, Image as ImageIcon, Sparkles, CheckCircle, XCircle } from 'lucide-react';
import { SymbolImage } from '@/types/supabase';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useDropzone } from 'react-dropzone';
import { generateSEOImageTitle, generateImageDescription, getNextImageIndex } from '@/utils/seoImageUtils';
import { migrateImageTitles, migrateSingleImageTitle } from '@/utils/migrateImageTitles';

interface ImageGalleryEditorProps {
  symbolId: string;
  images: SymbolImage[];
  onImagesUpdated: (updatedImages: SymbolImage[]) => void;
  symbolName?: string;
  culture?: string;
  period?: string;
}

export const ImageGalleryEditor: React.FC<ImageGalleryEditorProps> = ({
  symbolId,
  images,
  onImagesUpdated,
  symbolName,
  culture,
  period
}) => {
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [editingImage, setEditingImage] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<'checking' | 'available' | 'unavailable'>('checking');
  const [migrating, setMigrating] = useState(false);
  const [editingData, setEditingData] = useState<{
    title: string;
    description: string;
    image_type: 'original' | 'pattern' | 'reuse';
    is_primary: boolean;
  }>({ title: '', description: '', image_type: 'original', is_primary: false });

  // Vérifier le statut de l'API au chargement
  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const { error } = await supabase.functions.invoke('generate-image-deepseek', {
          body: { prompt: 'test', symbolName: 'test' }
        });
        
        if (error?.message?.includes('OPENAI_API_KEY') || error?.message?.includes('non configurée')) {
          setApiStatus('unavailable');
        } else {
          setApiStatus('available');
        }
      } catch (error) {
        console.error('Erreur lors de la vérification API:', error);
        setApiStatus('unavailable');
      }
    };

    checkApiStatus();
  }, []);

  const handleMigrateAllTitles = async () => {
    setMigrating(true);
    try {
      const result = await migrateImageTitles();
      if (result.success) {
        toast.success(`${result.updated} images mises à jour avec des titres SEO-friendly`);
        // Recharger les images pour voir les changements
        window.location.reload();
      } else {
        toast.error(`Migration partiellement échouée: ${result.errors.length} erreurs`);
      }
    } catch (error) {
      console.error('Erreur lors de la migration:', error);
      toast.error('Erreur lors de la migration des titres');
    } finally {
      setMigrating(false);
    }
  };

  const handleMigrateSingleTitle = async (imageId: string) => {
    try {
      const success = await migrateSingleImageTitle(imageId);
      if (success) {
        toast.success('Titre mis à jour avec succès');
        // Recharger les images pour voir les changements
        window.location.reload();
      } else {
        toast.error('Erreur lors de la mise à jour du titre');
      }
    } catch (error) {
      console.error('Erreur lors de la migration:', error);
      toast.error('Erreur lors de la mise à jour du titre');
    }
  };

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

      // Générer un titre SEO-friendly
      const imageIndex = getNextImageIndex(images, 'original');
      const seoTitle = generateSEOImageTitle(symbolName || 'symbole', 'original', imageIndex);
      const seoDescription = generateImageDescription(
        symbolName || 'Symbole',
        culture || 'Culture',
        'original'
      );

      // Créer l'entrée dans la base de données
      const { data: imageData, error: dbError } = await supabase
        .from('symbol_images')
        .insert({
          symbol_id: symbolId,
          image_url: publicUrl,
          image_type: 'original',
          title: seoTitle,
          description: seoDescription,
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
          is_primary: editingData.is_primary,
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
      image_type: image.image_type,
      is_primary: image.is_primary || false
    });
  };

  const togglePrimary = async (imageId: string, currentIsPrimary: boolean) => {
    try {
      const { data, error } = await supabase
        .from('symbol_images')
        .update({
          is_primary: !currentIsPrimary,
          updated_at: new Date().toISOString()
        })
        .eq('id', imageId)
        .select()
        .single();

      if (error) throw error;

      // Mettre à jour la liste des images
      onImagesUpdated(images.map(img => img.id === imageId ? data : img));
      toast.success(data.is_primary ? 'Image définie comme principale' : 'Image retirée comme principale');

    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast.error('Erreur lors de la mise à jour de l\'image');
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach(file => {
      uploadImage(file);
    });
  }, [symbolId]);

  const generateImage = async () => {
    if (!generatedPrompt.trim()) {
      toast.error('Veuillez entrer une description pour générer l\'image');
      return;
    }

    try {
      setGenerating(true);
      console.log('🔄 ÉTAPE 1: Début de la génération d\'image');
      
      // Vérifier que l'utilisateur est connecté
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        console.log('❌ ÉTAPE 1: Utilisateur non connecté');
        toast.error('Vous devez être connecté pour générer des images');
        return;
      }
      console.log('✅ ÉTAPE 1: Utilisateur connecté', user.id);

      // ÉTAPE 2: Appel à l'edge function
      console.log('🔄 ÉTAPE 2: Appel à l\'edge function avec prompt:', generatedPrompt);
      const { data, error } = await supabase.functions.invoke('generate-image-deepseek', {
        body: {
          prompt: generatedPrompt,
          symbolName,
          culture,
          period
        }
      });

      console.log('📊 ÉTAPE 2: Réponse de l\'edge function:', { data, error });

      if (error) {
        console.log('❌ ÉTAPE 2: Erreur edge function:', error);
        throw error;
      }

      if (!data.success || !data.image) {
        console.log('❌ ÉTAPE 2: Données invalides:', data);
        throw new Error(data.error || 'Erreur lors de la génération');
      }

      console.log('✅ ÉTAPE 2: Image générée avec succès, taille base64:', data.image.length);

      // ÉTAPE 3: Convertir base64 en blob
      console.log('🔄 ÉTAPE 3: Conversion base64 en blob');
      const base64Response = await fetch(data.image);
      const blob = await base64Response.blob();
      console.log('✅ ÉTAPE 3: Blob créé, taille:', blob.size);

      // ÉTAPE 4: Upload vers Supabase Storage
      console.log('🔄 ÉTAPE 4: Upload vers Supabase Storage');
      const fileName = `${symbolId}/generated_${Date.now()}.png`;
      
      console.log('📂 ÉTAPE 4: Nom du fichier:', fileName);

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('symbol-images')
        .upload(fileName, blob);

      if (uploadError) {
        console.log('❌ ÉTAPE 4: Erreur upload storage:', uploadError);
        throw uploadError;
      }

      console.log('✅ ÉTAPE 4: Upload réussi:', uploadData);

      // ÉTAPE 5: Obtenir l'URL publique
      console.log('🔄 ÉTAPE 5: Obtention de l\'URL publique');
      const { data: { publicUrl } } = supabase.storage
        .from('symbol-images')
        .getPublicUrl(fileName);

      console.log('✅ ÉTAPE 5: URL publique:', publicUrl);

      // ÉTAPE 6: Insertion en base de données
      console.log('🔄 ÉTAPE 6: Insertion en base de données');
      // Générer un titre SEO-friendly pour l'image IA
      const imageIndex = getNextImageIndex(images, 'original');
      const seoTitle = generateSEOImageTitle(symbolName || 'symbole', 'original', imageIndex);
      const seoDescription = `${generateImageDescription(
        symbolName || 'Symbole',
        culture || 'Culture',
        'original'
      )} - Générée avec IA: ${generatedPrompt}`;

      const imageData = {
        symbol_id: symbolId,
        image_url: publicUrl,
        image_type: 'original' as const,
        title: seoTitle,
        description: seoDescription,
        uploaded_by: user.id
      };

      console.log('📊 ÉTAPE 6: Données à insérer:', imageData);

      const { data: insertData, error: dbError } = await supabase
        .from('symbol_images')
        .insert(imageData)
        .select()
        .single();

      if (dbError) {
        console.log('❌ ÉTAPE 6: Erreur insertion base:', dbError);
        throw dbError;
      }

      console.log('✅ ÉTAPE 6: Insertion réussie:', insertData);

      // ÉTAPE 7: Mise à jour de l'état local
      console.log('🔄 ÉTAPE 7: Mise à jour de l\'état local');
      const updatedImages = [...images, insertData];
      onImagesUpdated(updatedImages);
      console.log('✅ ÉTAPE 7: État mis à jour, total images:', updatedImages.length);

      // Reset du prompt
      setGeneratedPrompt('');
      toast.success('Image générée et ajoutée avec succès !');
      console.log('🎉 PROCESSUS TERMINÉ AVEC SUCCÈS');

    } catch (error) {
      console.error('💥 ERREUR DANS LE PROCESSUS:', error);
      console.error('📊 Détails de l\'erreur:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      toast.error('Erreur lors de la génération de l\'image: ' + error.message);
    } finally {
      setGenerating(false);
      console.log('🏁 Fin du processus de génération');
    }
  };

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

      {/* Générateur d'images IA */}
      <div className="border border-blue-200 rounded-lg p-4 bg-blue-50/50">
        <div className="flex items-center justify-between mb-2">
          <Label className="text-base font-semibold text-blue-900 flex items-center">
            <Sparkles className="h-4 w-4 mr-2" />
            Générer une image avec IA
          </Label>
          
          {/* Indicateur de statut API */}
          <div className="flex items-center gap-2">
            {apiStatus === 'checking' ? (
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <div className="animate-spin rounded-full h-3 w-3 border-b border-slate-400"></div>
                Vérification...
              </div>
            ) : apiStatus === 'available' ? (
              <div className="flex items-center gap-1 text-xs text-green-600">
                <CheckCircle className="h-3 w-3" />
                API disponible
              </div>
            ) : (
              <div className="flex items-center gap-1 text-xs text-red-600">
                <XCircle className="h-3 w-3" />
                API indisponible
              </div>
            )}
          </div>
        </div>
        
        {apiStatus === 'unavailable' ? (
          <div className="bg-red-50 border border-red-200 rounded p-3 mb-3">
            <p className="text-sm text-red-700 mb-2">
              ⚠️ La clé API DeepSeek n'est pas configurée. Veuillez la configurer pour utiliser cette fonctionnalité.
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-blue-700 mb-3">
              Décrivez l'image que vous souhaitez générer pour ce symbole
            </p>
            
            <div className="space-y-3">
              <Textarea
                placeholder="Ex: Une représentation artistique détaillée du symbole, avec des couleurs vives et un style traditionnel..."
                value={generatedPrompt}
                onChange={(e) => setGeneratedPrompt(e.target.value)}
                rows={3}
                className="bg-white"
              />
              
              <Button 
                onClick={generateImage}
                disabled={generating || !generatedPrompt.trim() || apiStatus !== 'available'}
                className="bg-blue-600 hover:bg-blue-700"
              >
              {generating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Génération en cours...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Générer l'image
                </>
              )}
            </Button>
          </div>
        </>
        )}
      </div>

      {/* Outils de migration SEO */}
      {images.length > 0 && (
        <div className="border border-green-200 rounded-lg p-4 bg-green-50/50">
          <div className="flex items-center justify-between mb-2">
            <Label className="text-base font-semibold text-green-900 flex items-center">
              <Sparkles className="h-4 w-4 mr-2" />
              Optimisation SEO des titres
            </Label>
          </div>
          
          <p className="text-sm text-green-700 mb-3">
            Transformez les noms de fichiers en titres SEO-friendly (ex: "mandala-original-1")
          </p>
          
          <Button 
            onClick={handleMigrateAllTitles}
            disabled={migrating}
            variant="outline"
            size="sm"
            className="bg-green-600 text-white hover:bg-green-700"
          >
            {migrating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Migration en cours...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Migrer tous les titres
              </>
            )}
          </Button>
        </div>
      )}

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
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`primary-${image.id}`}
                            checked={editingData.is_primary}
                            onChange={(e) => setEditingData(prev => ({ 
                              ...prev, 
                              is_primary: e.target.checked
                            }))}
                            className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                          />
                          <label htmlFor={`primary-${image.id}`} className="text-sm text-gray-700">
                            Image principale
                          </label>
                        </div>
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
                          {image.is_primary && (
                            <Badge variant="default" className="text-xs bg-amber-500">
                              Principale
                            </Badge>
                          )}
                        </div>
                        {image.description && (
                          <p className="text-xs text-slate-600 mb-2">{image.description}</p>
                        )}
                        <div className="flex gap-1">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => togglePrimary(image.id, image.is_primary || false)}
                            className={image.is_primary ? "text-amber-600 hover:text-amber-700" : "text-gray-600 hover:text-gray-700"}
                          >
                            {image.is_primary ? <Star className="h-3 w-3 mr-1 fill-current" /> : <StarOff className="h-3 w-3 mr-1" />}
                            {image.is_primary ? 'Défaut' : 'Définir'}
                          </Button>
                           <Button size="sm" variant="outline" onClick={() => startEditing(image)}>
                             <Edit className="h-3 w-3 mr-1" />
                             Éditer
                           </Button>
                           <Button 
                             size="sm" 
                             variant="outline"
                             onClick={() => handleMigrateSingleTitle(image.id)}
                             className="text-green-600 hover:text-green-700"
                             title="Générer un titre SEO-friendly"
                           >
                             <Sparkles className="h-3 w-3 mr-1" />
                             SEO
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
