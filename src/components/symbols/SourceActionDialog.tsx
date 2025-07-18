import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Wrench, 
  FileText, 
  ExternalLink, 
  UserCheck, 
  Plus, 
  Archive 
} from 'lucide-react';

interface SourceActionDialogProps {
  sourceId: string;
  children: React.ReactNode;
}

const actionTypes = [
  {
    value: 'complete_citation',
    label: 'Compléter la citation',
    description: 'Demander une citation académique complète',
    icon: FileText,
    priority: 2,
  },
  {
    value: 'add_doi',
    label: 'Ajouter DOI/ISBN',
    description: 'Ajouter un identifiant numérique',
    icon: ExternalLink,
    priority: 2,
  },
  {
    value: 'verify_expert',
    label: 'Vérification experte',
    description: 'Demander une validation par un expert',
    icon: UserCheck,
    priority: 3,
  },
  {
    value: 'add_alternative',
    label: 'Source alternative',
    description: 'Proposer une source alternative',
    icon: Plus,
    priority: 2,
  },
  {
    value: 'archive_backup',
    label: 'Sauvegarde archive',
    description: 'Créer une sauvegarde via Archive.org',
    icon: Archive,
    priority: 1,
  },
];

export const SourceActionDialog: React.FC<SourceActionDialogProps> = ({
  sourceId,
  children,
}) => {
  const [open, setOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string>('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!selectedAction) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une action",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const actionData = actionTypes.find(a => a.value === selectedAction);

    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour demander une amélioration",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from('source_action_requests')
      .insert({
        source_id: sourceId,
        user_id: user.id,
        action_type: selectedAction,
        description: description.trim() || null,
        priority: actionData?.priority || 2,
      });

    if (error) {
      console.error('Error submitting action request:', error);
      toast({
        title: "Erreur",
        description: "Impossible de soumettre la demande d'action",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Demande envoyée",
        description: "Votre demande d'amélioration a été transmise",
      });
      setOpen(false);
      setSelectedAction('');
      setDescription('');
    }

    setLoading(false);
  };

  const selectedActionData = actionTypes.find(a => a.value === selectedAction);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5 text-blue-500" />
            Demander une amélioration
          </DialogTitle>
          <DialogDescription>
            Proposez des améliorations pour rendre cette source plus fiable et complète.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="action">Type d'amélioration</Label>
            <Select value={selectedAction} onValueChange={setSelectedAction}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez une amélioration" />
              </SelectTrigger>
              <SelectContent>
                {actionTypes.map((action) => {
                  const IconComponent = action.icon;
                  return (
                    <SelectItem key={action.value} value={action.value}>
                      <div className="flex items-center gap-2">
                        <IconComponent className="h-4 w-4" />
                        <div>
                          <div className="font-medium">{action.label}</div>
                          <div className="text-xs text-muted-foreground">
                            {action.description}
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {selectedActionData && (
            <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
              <p className="text-sm text-muted-foreground">
                {selectedActionData.description}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-xs font-medium">Priorité:</span>
                <div className="flex">
                  {[1, 2, 3].map((level) => (
                    <div
                      key={level}
                      className={`h-2 w-2 rounded-full mx-0.5 ${
                        level <= selectedActionData.priority
                          ? 'bg-blue-500'
                          : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="description">Détails de la demande (optionnel)</Label>
            <Textarea
              id="description"
              placeholder="Ajoutez des détails spécifiques pour cette amélioration..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[80px]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? 'Envoi...' : 'Demander'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};