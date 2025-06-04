
import React from 'react';
import { Link } from 'react-router-dom';
import { useCollections, useDeleteCollection } from '@/hooks/useCollections';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Ban, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/services/logService';

const CollectionsManagement = () => {
  const { data: collections, isLoading, refetch } = useCollections();
  const deleteCollection = useDeleteCollection();

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer la collection "${title}" ?`)) {
      logger.info('Admin deleting collection', { collectionId: id, title });
      
      const success = await deleteCollection.mutateAsync(id);
      if (success) {
        toast.success('Collection supprimée avec succès');
        logger.info('Collection deleted successfully', { collectionId: id });
      } else {
        toast.error('Erreur lors de la suppression');
        logger.error('Failed to delete collection', { collectionId: id });
      }
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean, title: string) => {
    try {
      const newStatus = !currentStatus;
      logger.info('Admin toggling collection status', { 
        collectionId: id, 
        currentStatus, 
        newStatus 
      });

      const { error } = await supabase
        .from('collections')
        .update({ is_featured: newStatus })
        .eq('id', id);

      if (error) throw error;

      toast.success(
        newStatus 
          ? `Collection "${title}" activée`
          : `Collection "${title}" suspendue`
      );
      
      logger.info('Collection status toggled successfully', { 
        collectionId: id, 
        newStatus 
      });
      
      refetch();
    } catch (error) {
      logger.error('Error toggling collection status', { error, collectionId: id });
      toast.error('Erreur lors de la modification du statut');
    }
  };

  const getTranslation = (collection: any, language: string, field: string) => {
    const translation = collection.collection_translations?.find(
      (t: any) => t.language === language
    );
    return translation?.[field] || '';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Collections</h1>
          <p className="text-slate-600 mt-2">
            Organisez les symboles en collections thématiques
          </p>
        </div>
        <Link to="/admin/collections/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle Collection
          </Button>
        </Link>
      </div>

      <div className="grid gap-6">
        {collections?.map((collection) => (
          <Card key={collection.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-xl">
                      {getTranslation(collection, 'fr', 'title')}
                    </CardTitle>
                    {collection.is_featured ? (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-red-100 text-red-800">
                        <Ban className="w-3 h-3 mr-1" />
                        Suspendue
                      </Badge>
                    )}
                  </div>
                  <p className="text-slate-600">
                    {getTranslation(collection, 'fr', 'description')}
                  </p>
                  <div className="text-sm text-slate-500">
                    Slug: <code className="bg-slate-100 px-1 rounded">{collection.slug}</code>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleStatus(
                      collection.id, 
                      collection.is_featured, 
                      getTranslation(collection, 'fr', 'title')
                    )}
                    className={collection.is_featured ? "text-red-600 hover:text-red-700" : "text-green-600 hover:text-green-700"}
                  >
                    {collection.is_featured ? (
                      <Ban className="w-4 h-4" />
                    ) : (
                      <CheckCircle className="w-4 h-4" />
                    )}
                  </Button>
                  <Link to={`/admin/collections/${collection.id}/edit`}>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(collection.id, getTranslation(collection, 'fr', 'title'))}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-slate-500">
                Créé le {new Date(collection.created_at).toLocaleDateString('fr-FR')}
              </div>
            </CardContent>
          </Card>
        ))}

        {collections?.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">Aucune collection</h3>
              <p className="text-slate-600 mb-4">
                Commencez par créer votre première collection thématique
              </p>
              <Link to="/admin/collections/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Créer une collection
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CollectionsManagement;
