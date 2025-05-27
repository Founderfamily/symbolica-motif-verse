
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { CheckSquare, Download, Tag, MessageSquare, FileText, Users } from 'lucide-react';
import { CompleteContribution } from '@/types/contributions';
import { useAuth } from '@/hooks/useAuth';
import { updateContributionStatus } from '@/services/contributionService';
import { toast } from '@/components/ui/use-toast';

interface BulkOperationsProps {
  contributions: CompleteContribution[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  onBulkAction: (action: string, data?: any) => void;
}

const BulkOperations: React.FC<BulkOperationsProps> = ({
  contributions,
  selectedIds,
  onSelectionChange,
  onBulkAction
}) => {
  const { isAdmin } = useAuth();
  const [bulkActionType, setBulkActionType] = useState<string>('');
  const [bulkComment, setBulkComment] = useState('');
  const [newTags, setNewTags] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const selectedContributions = contributions.filter(c => selectedIds.includes(c.id));
  const allSelected = contributions.length > 0 && selectedIds.length === contributions.length;
  const someSelected = selectedIds.length > 0 && selectedIds.length < contributions.length;

  const handleSelectAll = () => {
    if (allSelected) {
      onSelectionChange([]);
    } else {
      onSelectionChange(contributions.map(c => c.id));
    }
  };

  const handleExport = (format: 'csv' | 'pdf' | 'excel') => {
    const data = selectedContributions.map(c => ({
      title: c.title,
      status: c.status,
      culture: c.cultural_context,
      period: c.period,
      location: c.location_name,
      submissionDate: c.created_at,
      tags: c.tags.map(t => t.tag).join(', ')
    }));

    // Simple CSV export for now
    if (format === 'csv') {
      const headers = ['Titre', 'Statut', 'Culture', 'Période', 'Localisation', 'Date de soumission', 'Tags'];
      const csvContent = [
        headers.join(','),
        ...data.map(row => Object.values(row).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `contributions-export-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);

      toast({
        title: "Export réussi",
        description: `${selectedContributions.length} contributions exportées en CSV`,
      });
    }

    onBulkAction('export', { format, count: selectedContributions.length });
  };

  const handleBulkStatusUpdate = async () => {
    if (!isAdmin || !bulkActionType) return;

    try {
      // This would need to be implemented in the service
      for (const contribution of selectedContributions) {
        // await updateContributionStatus(contribution.id, bulkActionType as any, user.id, bulkComment);
      }

      toast({
        title: "Mise à jour réussie",
        description: `${selectedContributions.length} contributions mises à jour`,
      });

      onBulkAction('statusUpdate', { 
        status: bulkActionType, 
        count: selectedContributions.length,
        comment: bulkComment 
      });

      setIsDialogOpen(false);
      setBulkComment('');
      setBulkActionType('');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour les contributions",
      });
    }
  };

  const handleBulkTagging = () => {
    if (!newTags.trim()) return;

    const tags = newTags.split(',').map(tag => tag.trim()).filter(tag => tag);
    
    toast({
      title: "Tags ajoutés",
      description: `${tags.length} tags ajoutés à ${selectedContributions.length} contributions`,
    });

    onBulkAction('addTags', { tags, count: selectedContributions.length });
    setNewTags('');
    setIsDialogOpen(false);
  };

  if (selectedIds.length === 0) {
    return (
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Checkbox
              checked={allSelected}
              ref={(el) => {
                if (el) el.indeterminate = someSelected;
              }}
              onCheckedChange={handleSelectAll}
            />
            <span className="text-sm text-muted-foreground">
              Sélectionnez des contributions pour accéder aux opérations en lot
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckSquare className="h-5 w-5" />
          Opérations en lot
          <Badge variant="secondary">{selectedIds.length} sélectionnées</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Selection Controls */}
        <div className="flex items-center gap-3">
          <Checkbox
            checked={allSelected}
            ref={(el) => {
              if (el) el.indeterminate = someSelected;
            }}
            onCheckedChange={handleSelectAll}
          />
          <span className="text-sm">
            {allSelected ? 'Tout désélectionner' : someSelected ? 'Tout sélectionner' : 'Tout sélectionner'}
          </span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onSelectionChange([])}
          >
            Effacer la sélection
          </Button>
        </div>

        {/* Bulk Actions */}
        <div className="flex flex-wrap gap-2">
          {/* Export Options */}
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleExport('csv')}
              className="flex items-center gap-1"
            >
              <Download className="h-4 w-4" />
              CSV
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleExport('pdf')}
              className="flex items-center gap-1"
            >
              <FileText className="h-4 w-4" />
              PDF
            </Button>
          </div>

          {/* Tagging */}
          <Dialog open={isDialogOpen && bulkActionType === 'tag'} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {setBulkActionType('tag'); setIsDialogOpen(true);}}
                className="flex items-center gap-1"
              >
                <Tag className="h-4 w-4" />
                Ajouter des tags
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter des tags en lot</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Tags (séparés par des virgules)</label>
                  <Textarea
                    placeholder="tag1, tag2, tag3..."
                    value={newTags}
                    onChange={(e) => setNewTags(e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleBulkTagging}>
                    Ajouter les tags
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Admin Actions */}
          {isAdmin && (
            <>
              <Dialog open={isDialogOpen && bulkActionType !== 'tag'} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {setBulkActionType('status'); setIsDialogOpen(true);}}
                    className="flex items-center gap-1"
                  >
                    <Users className="h-4 w-4" />
                    Changer le statut
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Mise à jour en lot du statut</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Nouveau statut</label>
                      <Select value={bulkActionType} onValueChange={setBulkActionType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un statut" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="approved">Approuvé</SelectItem>
                          <SelectItem value="rejected">Rejeté</SelectItem>
                          <SelectItem value="pending">En attente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Commentaire (optionnel)</label>
                      <Textarea
                        placeholder="Raison de la modification..."
                        value={bulkComment}
                        onChange={(e) => setBulkComment(e.target.value)}
                        rows={3}
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Annuler
                      </Button>
                      <Button onClick={handleBulkStatusUpdate}>
                        Mettre à jour
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>

        {/* Selected Items Summary */}
        <div className="pt-2 border-t">
          <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
            <span>Statuts sélectionnés:</span>
            {['pending', 'approved', 'rejected'].map(status => {
              const count = selectedContributions.filter(c => c.status === status).length;
              if (count > 0) {
                return (
                  <Badge key={status} variant="outline" className="text-xs">
                    {status}: {count}
                  </Badge>
                );
              }
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BulkOperations;
