import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Camera, 
  MapPin, 
  Upload, 
  Search, 
  FileText, 
  Eye,
  CheckCircle,
  BookOpen,
  Users,
  Target
} from 'lucide-react';

interface ActionModalsProps {
  isOpen: boolean;
  onClose: () => void;
  actionType: string;
  userProfile: string;
}

const ActionModals: React.FC<ActionModalsProps> = ({ 
  isOpen, 
  onClose, 
  actionType, 
  userProfile 
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleAction = async (message: string) => {
    setLoading(true);
    
    // Simulate action processing
    setTimeout(() => {
      toast({
        title: "Action réalisée !",
        description: message,
      });
      setLoading(false);
      onClose();
    }, 1500);
  };

  const getModalContent = () => {
    switch (actionType) {
      case 'take_photo':
        return {
          title: '📸 Prendre une photo',
          content: (
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Trouve un symbole, une inscription ou tout élément qui pourrait être un indice.
              </p>
              <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
                <Camera className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-4">
                  Clique pour activer l'appareil photo
                </p>
                <Button 
                  onClick={() => handleAction("Photo prise avec succès ! +10 points ajoutés.")}
                  disabled={loading}
                >
                  {loading ? "Traitement..." : "📸 Prendre la photo"}
                </Button>
              </div>
            </div>
          )
        };

      case 'verify_coordinates':
        return {
          title: '📍 Vérifier coordonnées GPS',
          content: (
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Escalier secret signalé - position exacte à confirmer
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Latitude</label>
                  <Input placeholder="48.8566" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Longitude</label>
                  <Input placeholder="2.3522" className="mt-1" />
                </div>
              </div>
              <Card className="p-4 bg-red-50">
                <div className="flex items-center gap-2 text-red-700">
                  <Target className="w-4 h-4" />
                  <span className="font-medium">URGENT - 2h restantes</span>
                </div>
                <p className="text-sm text-red-600 mt-1">
                  Équipe en attente de confirmation pour intervention
                </p>
              </Card>
              <Button 
                onClick={() => handleAction("Coordonnées GPS confirmées ! L'équipe a été alertée.")}
                disabled={loading}
                className="w-full"
              >
                {loading ? "Vérification..." : "✅ Confirmer la position"}
              </Button>
            </div>
          )
        };

      case 'validate_sources':
        return {
          title: '📚 Valider sources primaires',
          content: (
            <div className="space-y-4">
              <p className="text-muted-foreground">
                12 documents époque François Ier - authentification critique requise
              </p>
              <div className="space-y-2">
                {[1, 2, 3].map((doc) => (
                  <Card key={doc} className="p-3 hover:bg-accent cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Document {doc}/12</p>
                        <p className="text-sm text-muted-foreground">
                          Manuscrit - Archives nationales - Série K {doc}4
                        </p>
                      </div>
                      <Badge variant="outline">Non validé</Badge>
                    </div>
                  </Card>
                ))}
              </div>
              <Button 
                onClick={() => handleAction("Sources validées ! Votre expertise académique a été enregistrée.")}
                disabled={loading}
                className="w-full"
              >
                {loading ? "Validation..." : "📋 Valider l'authenticité"}
              </Button>
            </div>
          )
        };

      case 'online_research':
        return {
          title: '🔍 Recherche documentaire',
          content: (
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Archives numériques BNF - recherche de mots-clés ciblés
              </p>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium">Mots-clés à rechercher</label>
                  <Input 
                    placeholder="François Ier, Fontainebleau, salamandre..." 
                    className="mt-1" 
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Période</label>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <Input placeholder="1515" />
                    <Input placeholder="1547" />
                  </div>
                </div>
              </div>
              <Card className="p-3 bg-cyan-50">
                <div className="flex items-center gap-2 text-cyan-700">
                  <Search className="w-4 h-4" />
                  <span className="font-medium">Estimation : 15-30 minutes</span>
                </div>
              </Card>
              <Button 
                onClick={() => handleAction("Recherche documentaire lancée ! Résultats en cours d'analyse.")}
                disabled={loading}
                className="w-full"
              >
                {loading ? "Recherche..." : "🔍 Lancer la recherche"}
              </Button>
            </div>
          )
        };

      case 'chat':
        return {
          title: '💭 Proposer une théorie',
          content: (
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Partage ton idée sur ce que tu penses avoir découvert !
              </p>
              <Textarea 
                placeholder="Je pense que ce symbole pourrait représenter..."
                className="min-h-[100px]"
              />
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>Ta théorie sera partagée avec la communauté</span>
              </div>
              <Button 
                onClick={() => handleAction("Théorie partagée ! +15 points ajoutés.")}
                disabled={loading}
                className="w-full"
              >
                {loading ? "Envoi..." : "💭 Partager ma théorie"}
              </Button>
            </div>
          )
        };

      default:
        return {
          title: 'Action en développement',
          content: (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                Cette action sera bientôt disponible !
              </p>
              <Button onClick={onClose} variant="outline">
                Retour
              </Button>
            </div>
          )
        };
    }
  };

  const { title, content } = getModalContent();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
};

export default ActionModals;