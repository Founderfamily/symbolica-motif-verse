import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  MapPin, 
  Camera, 
  FileText, 
  Code,
  Search,
  Lightbulb,
  Send,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

interface ClueSubmissionDialogProps {
  questId: string;
  questType: 'myth' | 'found_treasure' | 'unfound_treasure';
  className?: string;
}

const ClueSubmissionDialog: React.FC<ClueSubmissionDialogProps> = ({ 
  questId, 
  questType, 
  className 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clueType, setClueType] = useState<string>('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [hint, setHint] = useState('');
  const [source, setSource] = useState('');
  const [location, setLocation] = useState({ latitude: '', longitude: '' });

  const clueTypes = [
    { value: 'location', label: 'Localisation', icon: MapPin, desc: 'Lieu géographique précis' },
    { value: 'symbol', label: 'Symbole', icon: Search, desc: 'Symbole ou motif à identifier' },
    { value: 'photo', label: 'Photo', icon: Camera, desc: 'Preuve photographique' },
    { value: 'text', label: 'Texte', icon: FileText, desc: 'Document ou inscription' },
    { value: 'code', label: 'Code', icon: Code, desc: 'Chiffre ou cryptage' }
  ];

  const getQuestTypeMessage = () => {
    switch (questType) {
      case 'myth':
        return "Partagez vos découvertes sur cette légende historique";
      case 'found_treasure':
        return "Ajoutez vos propres indices pour enrichir cette quête";
      case 'unfound_treasure':
        return "Contribuez à la recherche de ce trésor authentique";
      default:
        return "Partagez votre indice avec la communauté";
    }
  };

  const handleSubmit = async () => {
    if (!clueType || !title || !description) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simuler la soumission d'indice
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Indice soumis avec succès ! Il sera vérifié par la communauté.');
      
      // Reset form
      setClueType('');
      setTitle('');
      setDescription('');
      setHint('');
      setSource('');
      setLocation({ latitude: '', longitude: '' });
      setIsOpen(false);
      
    } catch (error) {
      toast.error('Erreur lors de la soumission');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedClueType = clueTypes.find(type => type.value === clueType);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className={`bg-amber-600 hover:bg-amber-700 text-white ${className}`}>
          <Plus className="w-4 h-4 mr-2" />
          Contribuer un Indice
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-600" />
            Soumettre un Indice
          </DialogTitle>
          <p className="text-stone-600 text-sm">
            {getQuestTypeMessage()}
          </p>
        </DialogHeader>

        <div className="space-y-6">
          {/* Type d'indice */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-stone-700">
              Type d'indice *
            </label>
            <Select value={clueType} onValueChange={setClueType}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez le type d'indice" />
              </SelectTrigger>
              <SelectContent>
                {clueTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center gap-2">
                      <type.icon className="w-4 h-4" />
                      <div>
                        <div className="font-medium">{type.label}</div>
                        <div className="text-xs text-stone-500">{type.desc}</div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Informations principales */}
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-700">
                Titre de l'indice *
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Inscription sur le pilier de l'église"
                className="border-stone-300"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-700">
                Description détaillée *
              </label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Décrivez précisément votre découverte, son contexte et son importance..."
                rows={4}
                className="border-stone-300"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-700">
                Indice pour les autres chercheurs
              </label>
              <Textarea
                value={hint}
                onChange={(e) => setHint(e.target.value)}
                placeholder="Donnez un conseil subtil pour aider les autres à comprendre..."
                rows={2}
                className="border-stone-300"
              />
            </div>
          </div>

          {/* Localisation si nécessaire */}
          {clueType === 'location' && (
            <Card className="p-4 bg-blue-50 border-blue-200">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-blue-800">Coordonnées géographiques</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-blue-700">Latitude</label>
                  <Input
                    value={location.latitude}
                    onChange={(e) => setLocation(prev => ({ ...prev, latitude: e.target.value }))}
                    placeholder="Ex: 48.8566"
                    type="number"
                    step="any"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-blue-700">Longitude</label>
                  <Input
                    value={location.longitude}
                    onChange={(e) => setLocation(prev => ({ ...prev, longitude: e.target.value }))}
                    placeholder="Ex: 2.3522"
                    type="number"
                    step="any"
                  />
                </div>
              </div>
            </Card>
          )}

          {/* Source */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-stone-700">
              Source ou référence
            </label>
            <Input
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="Livre, site web, témoignage, observation personnelle..."
              className="border-stone-300"
            />
          </div>

          {/* Aperçu */}
          {selectedClueType && title && (
            <Card className="p-4 bg-stone-50 border-stone-200">
              <div className="flex items-center gap-2 mb-2">
                <selectedClueType.icon className="w-4 h-4 text-stone-600" />
                <span className="font-medium text-stone-800">Aperçu de votre indice</span>
              </div>
              <div className="text-sm text-stone-600">
                <div className="font-medium">{title}</div>
                {description && <div className="mt-1">{description.slice(0, 100)}...</div>}
                <Badge variant="secondary" className="mt-2">
                  {selectedClueType.label}
                </Badge>
              </div>
            </Card>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              Annuler
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!clueType || !title || !description || isSubmitting}
              className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Soumission...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Soumettre l'Indice
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ClueSubmissionDialog;