import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Plus, Brain } from 'lucide-react';
import { useQuestTheories } from '@/hooks/useQuestTheories';

interface CreateTheoryDialogProps {
  questId: string;
  children: React.ReactNode;
}

const CreateTheoryDialog: React.FC<CreateTheoryDialogProps> = ({ questId, children }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    theory_type: '',
    supporting_evidence: [] as string[],
    confidence_level: 70,
  });
  const [newEvidence, setNewEvidence] = useState('');

  const { createTheory, isCreating } = useQuestTheories(questId);

  const handleAddEvidence = () => {
    if (newEvidence.trim()) {
      setFormData(prev => ({
        ...prev,
        supporting_evidence: [...prev.supporting_evidence, newEvidence.trim()]
      }));
      setNewEvidence('');
    }
  };

  const handleRemoveEvidence = (index: number) => {
    setFormData(prev => ({
      ...prev,
      supporting_evidence: prev.supporting_evidence.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    createTheory(formData, {
      onSuccess: () => {
        setOpen(false);
        setFormData({
          title: '',
          description: '',
          theory_type: '',
          supporting_evidence: [],
          confidence_level: 70,
        });
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Créer une Théorie
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Titre de la théorie *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Nom de votre théorie"
              required
            />
          </div>

          <div>
            <Label htmlFor="theory_type">Type de théorie *</Label>
            <Select 
              value={formData.theory_type} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, theory_type: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="location">Localisation</SelectItem>
                <SelectItem value="historical">Historique</SelectItem>
                <SelectItem value="symbolic">Symbolique</SelectItem>
                <SelectItem value="methodology">Méthodologique</SelectItem>
                <SelectItem value="alternative">Alternative</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Description détaillée *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Expliquez votre théorie en détail..."
              rows={4}
              required
            />
          </div>

          <div>
            <Label>Preuves supportant la théorie</Label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  value={newEvidence}
                  onChange={(e) => setNewEvidence(e.target.value)}
                  placeholder="Ajoutez une preuve ou un argument..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddEvidence())}
                />
                <Button type="button" variant="outline" onClick={handleAddEvidence}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {formData.supporting_evidence.length > 0 && (
                <div className="space-y-1">
                  {formData.supporting_evidence.map((evidence, index) => (
                    <div key={index} className="flex items-center justify-between bg-muted/50 rounded px-3 py-2">
                      <span className="text-sm">{evidence}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveEvidence(index)}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <Label>Niveau de confiance: {formData.confidence_level}%</Label>
            <Slider
              value={[formData.confidence_level]}
              onValueChange={(value) => setFormData(prev => ({ ...prev, confidence_level: value[0] }))}
              max={100}
              min={1}
              step={1}
              className="mt-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Faible</span>
              <span>Moyenne</span>
              <span>Élevée</span>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={isCreating}>
              {isCreating ? 'Création...' : 'Créer la Théorie'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTheoryDialog;