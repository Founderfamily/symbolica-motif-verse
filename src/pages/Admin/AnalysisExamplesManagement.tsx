
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { I18nText } from '@/components/ui/i18n-text';
import { useTranslation } from '@/i18n/useTranslation';
import { Plus, Search, Edit, Trash2, Eye, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { getAnalysisExamples, createAnalysisExample, deleteAnalysisExample, type AnalysisExample } from '@/services/analysisExampleService';
import { toast } from 'sonner';

export default function AnalysisExamplesManagement() {
  const { t } = useTranslation();
  const { isAdmin } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newExample, setNewExample] = useState({
    title: '',
    description: '',
    tags: [] as string[]
  });

  const { data: examples = [], isLoading, error, refetch } = useQuery({
    queryKey: ['analysis-examples'],
    queryFn: getAnalysisExamples
  });

  // Show access denied message if user is not admin
  if (!isAdmin) {
    return (
      <div className="p-6 space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <I18nText translationKey="admin.access.denied">
              Accès refusé. Vous devez être administrateur pour accéder à cette section.
            </I18nText>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const filteredExamples = examples.filter(example =>
    example.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    example.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateExample = async () => {
    try {
      await createAnalysisExample(newExample);
      setNewExample({ title: '', description: '', tags: [] });
      setIsCreateDialogOpen(false);
      refetch();
      toast.success('Exemple créé avec succès');
    } catch (error: any) {
      console.error('Error creating analysis example:', error);
      toast.error(error.message || 'Erreur lors de la création de l\'exemple');
    }
  };

  const handleDeleteExample = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet exemple ?')) {
      try {
        await deleteAnalysisExample(id);
        refetch();
        toast.success('Exemple supprimé avec succès');
      } catch (error: any) {
        console.error('Error deleting analysis example:', error);
        toast.error(error.message || 'Erreur lors de la suppression de l\'exemple');
      }
    }
  };

  const getImageCount = (example: AnalysisExample) => {
    let count = 0;
    if (example.original_image_url) count++;
    if (example.detection_image_url) count++;
    if (example.extraction_image_url) count++;
    if (example.classification_image_url) count++;
    return count;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">
          <I18nText translationKey="admin.analysis.title">
            Gestion des exemples d'analyse
          </I18nText>
        </h1>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              <I18nText translationKey="admin.analysis.create">
                Créer un exemple
              </I18nText>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                <I18nText translationKey="admin.analysis.create">
                  Créer un exemple
                </I18nText>
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Titre</Label>
                <Input
                  id="title"
                  value={newExample.title}
                  onChange={(e) => setNewExample({ ...newExample, title: e.target.value })}
                  placeholder="Titre de l'exemple"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newExample.description}
                  onChange={(e) => setNewExample({ ...newExample, description: e.target.value })}
                  placeholder="Description de l'exemple"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="tags">Tags (séparés par des virgules)</Label>
                <Input
                  id="tags"
                  value={newExample.tags.join(', ')}
                  onChange={(e) => setNewExample({ 
                    ...newExample, 
                    tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                  })}
                  placeholder="motif, geometrique, traditionnel"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  <I18nText translationKey="admin.analysis.cancel">
                    Annuler
                  </I18nText>
                </Button>
                <Button onClick={handleCreateExample}>
                  <I18nText translationKey="admin.analysis.save">
                    Sauvegarder
                  </I18nText>
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Error display */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Erreur lors du chargement des exemples: {error.message}
          </AlertDescription>
        </Alert>
      )}

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative max-w-md">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher des exemples..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </CardContent>
      </Card>

      {/* Examples Table */}
      <Card>
        <CardContent>
          {isLoading ? (
            <div className="p-8 text-center">Chargement...</div>
          ) : filteredExamples.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              {examples.length === 0 ? (
                searchQuery ? 'Aucun exemple trouvé pour cette recherche.' : 'Aucun exemple trouvé.'
              ) : (
                'Aucun exemple ne correspond à votre recherche.'
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Titre</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Images</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead>Date de création</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExamples.map((example) => (
                  <TableRow key={example.id}>
                    <TableCell className="font-medium">{example.title}</TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate">
                        {example.description || 'Aucune description'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {getImageCount(example)}/4 images
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {example.tags?.slice(0, 2).map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {(example.tags?.length || 0) > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{(example.tags?.length || 0) - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {example.created_at ? 
                        new Date(example.created_at).toLocaleDateString('fr-FR') : 
                        'N/A'
                      }
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteExample(example.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
