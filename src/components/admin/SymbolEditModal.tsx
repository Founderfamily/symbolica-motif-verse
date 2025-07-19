
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PaginatedSymbol, useUpdateSymbol } from '@/hooks/useAdminSymbols';
import { useSymbolSources, useAddSymbolSource, useDeleteSymbolSource } from '@/hooks/useSymbolSources';
import { useSymbolImageUpload, useDeleteSymbolImage } from '@/hooks/useSymbolImageUpload';
import { useSymbolImages } from '@/hooks/useSymbolImages';
import { useSymbolCommunityVerification } from '@/hooks/useSymbolCommunityVerification';
import { Plus, Trash2, Upload, ExternalLink } from 'lucide-react';

interface SymbolEditModalProps {
  symbol: PaginatedSymbol | null;
  isOpen: boolean;
  onClose: () => void;
}

export function SymbolEditModal({ symbol, isOpen, onClose }: SymbolEditModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    culture: '',
    period: '',
    description: ''
  });

  const [newSource, setNewSource] = useState({
    title: '',
    url: '',
    source_type: 'academic',
    description: ''
  });

  const updateSymbol = useUpdateSymbol();
  const { data: sources } = useSymbolSources(symbol?.id || null);
  const addSource = useAddSymbolSource();
  const deleteSource = useDeleteSymbolSource();
  const { images } = useSymbolImages(symbol?.id || null);
  const uploadImage = useSymbolImageUpload();
  const deleteImage = useDeleteSymbolImage();
  const { data: verificationComments } = useSymbolCommunityVerification(symbol?.id || null);

  useEffect(() => {
    if (symbol) {
      setFormData({
        name: symbol.name || '',
        culture: symbol.culture || '',
        period: symbol.period || '',
        description: symbol.description || ''
      });
    }
  }, [symbol]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symbol) return;

    try {
      await updateSymbol.mutateAsync({
        id: symbol.id,
        updates: formData
      });
      onClose();
    } catch (error) {
      console.error('Error updating symbol:', error);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddSource = async () => {
    if (!symbol || !newSource.title || !newSource.url) return;

    try {
      await addSource.mutateAsync({
        symbol_id: symbol.id,
        title: newSource.title,
        url: newSource.url,
        source_type: newSource.source_type,
        description: newSource.description,
        created_by: 'current-user-id' // TODO: Get from auth
      });
      setNewSource({ title: '', url: '', source_type: 'academic', description: '' });
    } catch (error) {
      console.error('Error adding source:', error);
    }
  };

  const handleDeleteSource = async (sourceId: string) => {
    if (!symbol) return;
    try {
      await deleteSource.mutateAsync({ id: sourceId, symbolId: symbol.id });
    } catch (error) {
      console.error('Error deleting source:', error);
    }
  };

  const handleImageUpload = async (file: File) => {
    if (!symbol) return;
    try {
      await uploadImage.mutateAsync({
        symbolId: symbol.id,
        file,
        imageType: 'original'
      });
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!symbol) return;
    try {
      await deleteImage.mutateAsync({ id: imageId, symbolId: symbol.id });
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifier le symbole</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">Informations générales</TabsTrigger>
            <TabsTrigger value="sources">Sources</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="verification">Vérification</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom du symbole *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="culture">Culture</Label>
                  <Input
                    id="culture"
                    value={formData.culture}
                    onChange={(e) => handleChange('culture', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="period">Période</Label>
                  <Input
                    id="period"
                    value={formData.period}
                    onChange={(e) => handleChange('period', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows={4}
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={onClose}>
                  Annuler
                </Button>
                <Button type="submit" disabled={updateSymbol.isPending}>
                  {updateSymbol.isPending ? 'Mise à jour...' : 'Sauvegarder'}
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>

          <TabsContent value="sources" className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Ajouter une nouvelle source</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="source-title">Titre</Label>
                  <Input
                    id="source-title"
                    value={newSource.title}
                    onChange={(e) => setNewSource(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Titre de la source"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="source-url">URL</Label>
                  <Input
                    id="source-url"
                    value={newSource.url}
                    onChange={(e) => setNewSource(prev => ({ ...prev, url: e.target.value }))}
                    placeholder="https://..."
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="source-description">Description</Label>
                <Textarea
                  id="source-description"
                  value={newSource.description}
                  onChange={(e) => setNewSource(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Description de la source..."
                  rows={2}
                />
              </div>
              <Button onClick={handleAddSource} disabled={!newSource.title || !newSource.url}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter la source
              </Button>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Sources existantes</h3>
              {sources && sources.length > 0 ? (
                <div className="space-y-2">
                  {sources.map((source) => (
                    <div key={source.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{source.title}</h4>
                          <Button variant="ghost" size="sm" asChild>
                            <a href={source.url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        </div>
                        {source.description && (
                          <p className="text-sm text-muted-foreground">{source.description}</p>
                        )}
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteSource(source.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">Aucune source ajoutée pour ce symbole.</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="images" className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Ajouter une image</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file);
                  }}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="flex flex-col items-center cursor-pointer"
                >
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">Cliquer pour télécharger une image</span>
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Images existantes</h3>
              {images.original || images.pattern ? (
                <div className="grid grid-cols-2 gap-4">
                  {images.original && (
                    <div className="space-y-2">
                      <img
                        src={images.original.image_url}
                        alt="Original"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Image originale</span>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteImage(images.original!.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                  {images.pattern && (
                    <div className="space-y-2">
                      <img
                        src={images.pattern.image_url}
                        alt="Pattern"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Motif</span>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteImage(images.pattern!.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground">Aucune image ajoutée pour ce symbole.</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="verification" className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Statut de vérification</h3>
              <div className="p-4 border rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">
                  Les informations de vérification seront affichées ici une fois disponibles.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Commentaires de la communauté</h3>
              {verificationComments && verificationComments.length > 0 ? (
                <div className="space-y-3">
                  {verificationComments.map((comment) => (
                    <div key={comment.id} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium">
                          {comment.profiles?.username || comment.profiles?.full_name || 'Utilisateur'}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {comment.verification_rating}
                        </span>
                      </div>
                      <p className="text-sm">{comment.comment}</p>
                      <div className="mt-2 text-xs text-muted-foreground">
                        Niveau d'expertise: {comment.expertise_level}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">Aucun commentaire de vérification disponible.</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
