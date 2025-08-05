import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ExternalLink, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { historicalFiguresService, HistoricalFigureSuggestion } from '@/services/historicalFiguresService';

interface WikipediaLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  questId: string;
  figureName: string;
  figureRole: string;
  figurePeriod: string;
  onSuggestionSubmitted?: () => void;
}

const WikipediaLinkDialog: React.FC<WikipediaLinkDialogProps> = ({
  open,
  onOpenChange,
  questId,
  figureName,
  figureRole,
  figurePeriod,
  onSuggestionSubmitted
}) => {
  const [wikipediaUrl, setWikipediaUrl] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateWikipediaUrl = (url: string): boolean => {
    const wikipediaRegex = /^https:\/\/(fr|en)\.wikipedia\.org\/wiki\/.+/;
    return wikipediaRegex.test(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!wikipediaUrl) {
      toast.error('Veuillez entrer une URL Wikipedia');
      return;
    }

    if (!validateWikipediaUrl(wikipediaUrl)) {
      toast.error('Veuillez entrer une URL Wikipedia valide (fr.wikipedia.org ou en.wikipedia.org)');
      return;
    }

    setIsSubmitting(true);

    try {
      const suggestion: HistoricalFigureSuggestion = {
        quest_id: questId,
        figure_name: figureName,
        figure_role: figureRole,
        figure_period: figurePeriod,
        wikipedia_url: wikipediaUrl,
        description: description.trim() || undefined
      };

      await historicalFiguresService.suggestWikipediaLink(suggestion);
      
      toast.success('Suggestion de lien Wikipedia envoyée avec succès !', {
        description: 'Elle sera examinée par un administrateur.'
      });
      
      setWikipediaUrl('');
      setDescription('');
      onOpenChange(false);
      onSuggestionSubmitted?.();
    } catch (error: any) {
      console.error('Erreur lors de la suggestion:', error);
      toast.error(error.message || 'Erreur lors de l\'envoi de la suggestion');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTestLink = () => {
    if (wikipediaUrl && validateWikipediaUrl(wikipediaUrl)) {
      window.open(wikipediaUrl, '_blank', 'noopener,noreferrer');
    } else {
      toast.error('Veuillez entrer une URL Wikipedia valide');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Suggérer un lien Wikipedia</DialogTitle>
          <DialogDescription>
            Proposez un lien Wikipedia pour <strong>{figureName}</strong> ({figureRole}, {figurePeriod})
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="wikipedia-url">URL Wikipedia *</Label>
            <div className="flex gap-2">
              <Input
                id="wikipedia-url"
                type="url"
                placeholder="https://fr.wikipedia.org/wiki/..."
                value={wikipediaUrl}
                onChange={(e) => setWikipediaUrl(e.target.value)}
                required
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleTestLink}
                disabled={!wikipediaUrl}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Seuls les liens vers fr.wikipedia.org ou en.wikipedia.org sont acceptés
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optionnel)</Label>
            <Textarea
              id="description"
              placeholder="Ajoutez des informations supplémentaires sur ce personnage..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Suggérer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default WikipediaLinkDialog;