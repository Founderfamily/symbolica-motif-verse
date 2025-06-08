
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Folder, Plus, Eye, Trash2, Edit } from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';
import { useAuth } from '@/hooks/useAuth';
import { GroupCollection } from '@/types/interest-groups';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface GroupCollectionsProps {
  groupId: string;
  isMember: boolean;
  isAdmin?: boolean;
}

const GroupCollections: React.FC<GroupCollectionsProps> = ({ groupId, isMember, isAdmin = false }) => {
  const [collections, setCollections] = useState<GroupCollection[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [newCollectionDescription, setNewCollectionDescription] = useState('');
  const [creating, setCreating] = useState(false);
  const auth = useAuth();

  useEffect(() => {
    if (isMember) {
      loadCollections();
    }
  }, [groupId, isMember]);

  const loadCollections = async () => {
    try {
      const { data, error } = await supabase
        .from('group_symbol_collections')
        .select(`
          *,
          creator:profiles!created_by(username, full_name)
        `)
        .eq('group_id', groupId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setCollections(data || []);
    } catch (error) {
      console.error('Error loading collections:', error);
      toast.error('Failed to load collections');
    } finally {
      setLoading(false);
    }
  };

  const createCollection = async () => {
    if (!auth?.user || !newCollectionName.trim()) return;

    setCreating(true);
    try {
      const { error } = await supabase
        .from('group_symbol_collections')
        .insert({
          group_id: groupId,
          name: newCollectionName.trim(),
          description: newCollectionDescription.trim() || null,
          created_by: auth.user.id,
          translations: {
            en: { name: newCollectionName.trim(), description: newCollectionDescription.trim() },
            fr: { name: newCollectionName.trim(), description: newCollectionDescription.trim() }
          }
        });

      if (error) throw error;

      toast.success('Collection created successfully!');
      setCreateDialogOpen(false);
      setNewCollectionName('');
      setNewCollectionDescription('');
      loadCollections();
    } catch (error) {
      console.error('Error creating collection:', error);
      toast.error('Failed to create collection');
    } finally {
      setCreating(false);
    }
  };

  const deleteCollection = async (collectionId: string) => {
    if (!auth?.user) return;

    try {
      const { error } = await supabase
        .from('group_symbol_collections')
        .delete()
        .eq('id', collectionId);

      if (error) throw error;

      toast.success('Collection deleted successfully!');
      loadCollections();
    } catch (error) {
      console.error('Error deleting collection:', error);
      toast.error('Failed to delete collection');
    }
  };

  if (!isMember) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Folder className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-600">
            <I18nText translationKey="community.joinToSeeCollections">
              Join this group to see collections
            </I18nText>
          </p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-slate-200 rounded w-full"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">
            <I18nText translationKey="community.groupCollections">Group Collections</I18nText>
          </h3>
          <p className="text-sm text-slate-600">
            <I18nText translationKey="community.collectionsDescription">
              Collaborative symbol collections created by group members
            </I18nText>
          </p>
        </div>
        
        {isMember && auth?.user && (
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                <I18nText translationKey="community.createCollection">Create Collection</I18nText>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  <I18nText translationKey="community.createNewCollection">Create New Collection</I18nText>
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    <I18nText translationKey="community.collectionName">Name</I18nText> *
                  </label>
                  <Input
                    value={newCollectionName}
                    onChange={(e) => setNewCollectionName(e.target.value)}
                    placeholder="Enter collection name..."
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    <I18nText translationKey="community.collectionDescription">Description</I18nText>
                  </label>
                  <Textarea
                    value={newCollectionDescription}
                    onChange={(e) => setNewCollectionDescription(e.target.value)}
                    placeholder="Describe this collection..."
                    rows={3}
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button variant="outline" onClick={() => setCreateDialogOpen(false)} className="flex-1">
                    <I18nText translationKey="common.cancel">Cancel</I18nText>
                  </Button>
                  <Button 
                    onClick={createCollection} 
                    disabled={creating || !newCollectionName.trim()} 
                    className="flex-1"
                  >
                    {creating ? (
                      <I18nText translationKey="common.creating">Creating...</I18nText>
                    ) : (
                      <I18nText translationKey="community.createCollection">Create Collection</I18nText>
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Collections List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {collections.map((collection) => (
          <Card key={collection.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Folder className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-base">{collection.name}</CardTitle>
                </div>
                
                {(isAdmin || collection.created_by === auth?.user?.id) && (
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                      onClick={() => deleteCollection(collection.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            
            <CardContent>
              {collection.description && (
                <p className="text-sm text-slate-600 mb-3">{collection.description}</p>
              )}
              
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>
                  Created {new Date(collection.created_at).toLocaleDateString()}
                </span>
                <Button variant="ghost" size="sm" className="h-auto p-1 text-xs">
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {collections.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Folder className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h4 className="font-medium text-slate-900 mb-2">
              <I18nText translationKey="community.noCollections">No collections yet</I18nText>
            </h4>
            <p className="text-slate-600 mb-4">
              <I18nText translationKey="community.noCollectionsDescription">
                Create the first collection to organize symbols collaboratively
              </I18nText>
            </p>
            {isMember && auth?.user && (
              <Button onClick={() => setCreateDialogOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                <I18nText translationKey="community.createFirstCollection">Create First Collection</I18nText>
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GroupCollections;
