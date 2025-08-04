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
        // Pour les trésors découverts, adapter l'action
        return {
          title: '📚 Étudier la découverte',
          content: (
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-medium text-green-900 mb-2">🏆 Trésor découvert !</h4>
                <p className="text-sm text-green-800">
                  Ce trésor a été trouvé en 2019. Étudiez comment il a été découvert pour améliorer vos futures recherches.
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-400">
                  <h5 className="font-medium text-blue-900">📋 Méthode utilisée</h5>
                  <p className="text-sm text-blue-800">Analyse géoradar et recherche d'archives historiques</p>
                </div>
                <div className="bg-yellow-50 p-3 rounded border-l-4 border-yellow-400">
                  <h5 className="font-medium text-yellow-900">💡 Leçon apprise</h5>
                  <p className="text-sm text-yellow-800">Les indices architecturaux étaient cachés dans les moulures</p>
                </div>
                <div className="bg-purple-50 p-3 rounded border-l-4 border-purple-400">
                  <h5 className="font-medium text-purple-900">🎯 Application</h5>
                  <p className="text-sm text-purple-800">Technique applicable aux châteaux Renaissance</p>
                </div>
              </div>
              
              <Card className="p-3 bg-cyan-50">
                <div className="flex items-center gap-2 text-cyan-700">
                  <BookOpen className="w-4 h-4" />
                  <span className="font-medium">Temps d'étude : 10-15 minutes</span>
                </div>
              </Card>
              
              <Button 
                onClick={() => handleAction("Excellente analyse ! Votre compréhension s'améliore. +25 points 🎓")}
                disabled={loading}
                className="w-full"
              >
                {loading ? "Analyse..." : "📖 J'ai compris la méthode"}
              </Button>
            </div>
          )
        };

      case 'validate_sources':
        return {
          title: '📖 Analyser les documents de découverte',
          content: (
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Consultez les documents qui ont mené à cette découverte réussie
              </p>
              <div className="space-y-2">
                {[
                  { title: "Rapport de découverte", desc: "Document officiel - 2019", status: "Authentifié" },
                  { title: "Photos avant/après", desc: "Archives photographiques", status: "Validé" },
                  { title: "Analyse géoradar", desc: "Résultats techniques", status: "Confirmé" }
                ].map((doc, index) => (
                  <Card key={index} className="p-3 hover:bg-accent cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{doc.title}</p>
                        <p className="text-sm text-muted-foreground">{doc.desc}</p>
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {doc.status}
                      </Badge>
                    </div>
                  </Card>
                ))}
              </div>
              <Button 
                onClick={() => handleAction("Documents analysés ! Vous maîtrisez mieux la méthodologie. +20 points 📚")}
                disabled={loading}
                className="w-full"
              >
                {loading ? "Lecture..." : "📚 Terminer l'analyse"}
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

      // Actions éducatives pour trésors découverts
      case 'study_discovery':
        return {
          title: '📚 Étudier la découverte',
          content: (
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Découvrez comment ce trésor a été localisé et les techniques utilisées pour le trouver.
              </p>
              <div className="space-y-3">
                <Card className="p-3 bg-green-50">
                  <h5 className="font-medium text-green-900 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    Historique de la recherche
                  </h5>
                  <p className="text-sm text-green-800 mt-1">Recherches menées de 2015 à 2019</p>
                </Card>
                <Card className="p-3 bg-blue-50">
                  <h5 className="font-medium text-blue-900 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Méthodes de détection
                  </h5>
                  <p className="text-sm text-blue-800 mt-1">Géoradar et détection magnétique</p>
                </Card>
                <Card className="p-3 bg-purple-50">
                  <h5 className="font-medium text-purple-900 flex items-center gap-2">
                    <Search className="w-4 h-4" />
                    Processus d'excavation
                  </h5>
                  <p className="text-sm text-purple-800 mt-1">Fouilles minutieuses et documentation</p>
                </Card>
              </div>
              <Button 
                onClick={() => handleAction("Contenu éducatif consulté ! Votre compréhension s'améliore. +15 points 🎓")}
                disabled={loading}
                className="w-full"
              >
                {loading ? "Étude..." : "📖 J'ai terminé l'étude"}
              </Button>
            </div>
          )
        };

      case 'understand_clues':
        return {
          title: '💡 Comprendre les indices',
          content: (
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Apprenez comment chaque indice a contribué à la découverte de ce trésor.
              </p>
              <div className="space-y-2">
                {[
                  { icon: "🏛️", title: "Archive historique", desc: "Document de 1547 mentionnant un trésor caché" },
                  { icon: "🗺️", title: "Carte ancienne", desc: "Plan du château avec annotations mystérieuses" },
                  { icon: "🔍", title: "Symbole sculpté", desc: "Salamandre pointant vers l'est découverte en 2016" }
                ].map((clue, index) => (
                  <Card key={index} className="p-3 hover:bg-accent cursor-pointer">
                    <div className="flex items-start gap-3">
                      <span className="text-lg">{clue.icon}</span>
                      <div>
                        <p className="font-medium">{clue.title}</p>
                        <p className="text-sm text-muted-foreground">{clue.desc}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              <Button 
                onClick={() => handleAction("Connexions comprises ! Vous maîtrisez l'analyse d'indices. +20 points 🔍")}
                disabled={loading}
                className="w-full"
              >
                {loading ? "Analyse..." : "💡 J'ai compris les connexions"}
              </Button>
            </div>
          )
        };

      case 'analyze_techniques':
        return {
          title: '📖 Analyser les techniques utilisées',
          content: (
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Étudiez les techniques professionnelles utilisées pour localiser ce trésor.
              </p>
              <div className="space-y-3">
                <div className="bg-emerald-50 p-3 rounded border-l-4 border-emerald-400">
                  <h5 className="font-medium text-emerald-900">🛠️ Détection par métaux</h5>
                  <p className="text-sm text-emerald-800">Utilisation d'un détecteur haute fréquence Minelab CTX 3030</p>
                </div>
                <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-400">
                  <h5 className="font-medium text-blue-900">📡 Géoradar</h5>
                  <p className="text-sm text-blue-800">Cartographie souterraine précise jusqu'à 3 mètres</p>
                </div>
                <div className="bg-purple-50 p-3 rounded border-l-4 border-purple-400">
                  <h5 className="font-medium text-purple-900">⚒️ Excavation</h5>
                  <p className="text-sm text-purple-800">Fouilles archéologiques avec préservation du contexte</p>
                </div>
              </div>
              <Button 
                onClick={() => handleAction("Techniques maîtrisées ! Vous pouvez appliquer ces méthodes. +25 points 🎯")}
                disabled={loading}
                className="w-full"
              >
                {loading ? "Étude..." : "🎯 Techniques assimilées"}
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