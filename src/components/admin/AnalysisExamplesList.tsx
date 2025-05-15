
import React from 'react';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/components/ui/use-toast';
import { AnalysisExample, deleteAnalysisExample } from '@/services/analysisExampleService';
import AnalysisExampleForm from './AnalysisExampleForm';

interface AnalysisExamplesListProps {
  examples: AnalysisExample[];
  onUpdate: () => void;
}

export default function AnalysisExamplesList({ 
  examples, 
  onUpdate 
}: AnalysisExamplesListProps) {
  const { toast } = useToast();

  const handleDelete = async (id: string) => {
    try {
      await deleteAnalysisExample(id);
      toast({
        title: "Exemple supprimé",
        description: "L'exemple a été supprimé avec succès",
      });
      onUpdate();
    } catch (error) {
      console.error("Error deleting example:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'exemple",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Exemples d'analyse enregistrés</h3>
      
      {examples.length === 0 ? (
        <p className="text-slate-500 italic">Aucun exemple d'analyse n'a été ajouté.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Titre</TableHead>
              <TableHead>Images</TableHead>
              <TableHead>Date de création</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {examples.map((example) => (
              <TableRow key={example.id}>
                <TableCell className="font-medium">{example.title}</TableCell>
                <TableCell>
                  <div className="flex space-x-1">
                    {example.original_image_url && (
                      <div className="w-8 h-8 rounded overflow-hidden">
                        <img 
                          src={example.original_image_url} 
                          alt="Original" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    {example.detection_image_url && (
                      <div className="w-8 h-8 rounded overflow-hidden">
                        <img 
                          src={example.detection_image_url} 
                          alt="Detection" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    {example.extraction_image_url && (
                      <div className="w-8 h-8 rounded overflow-hidden">
                        <img 
                          src={example.extraction_image_url} 
                          alt="Extraction" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    {example.classification_image_url && (
                      <div className="w-8 h-8 rounded overflow-hidden">
                        <img 
                          src={example.classification_image_url} 
                          alt="Classification" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>{formatDate(example.created_at)}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Pencil className="h-4 w-4 mr-1" />
                          Modifier
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl">
                        <DialogHeader>
                          <DialogTitle>Modifier l'exemple</DialogTitle>
                        </DialogHeader>
                        <AnalysisExampleForm 
                          existingExample={example} 
                          onSubmitSuccess={() => {
                            onUpdate();
                            const closeButton = document.querySelector('[data-radix-dialog-close]');
                            if (closeButton && closeButton instanceof HTMLElement) {
                              closeButton.click();
                            }
                          }} 
                        />
                      </DialogContent>
                    </Dialog>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="h-4 w-4 mr-1" />
                          Supprimer
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Êtes-vous sûr?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Cette action ne peut pas être annulée. Cela supprimera définitivement
                            l'exemple d'analyse et toutes ses images associées.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDelete(example.id)}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            Supprimer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
