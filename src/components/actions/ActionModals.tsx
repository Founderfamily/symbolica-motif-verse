import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Camera, FileText, Eye, Users, CheckCircle, Clock } from 'lucide-react';

interface ActionModalsProps {
  isOpen: boolean;
  onClose: () => void;
  actionType: string;
  actionData?: any;
}

const ActionModals: React.FC<ActionModalsProps> = ({ isOpen, onClose, actionType, actionData }) => {
  const getModalContent = () => {
    switch (actionType) {
      case 'take_photo':
        return {
          title: "📸 Appareil Photo Activé",
          content: (
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-400">
                <p className="text-blue-800 font-medium mb-2">Mode Capture d'Indices</p>
                <p className="text-blue-700 text-sm">
                  Activez votre appareil photo pour capturer des indices sur le terrain. 
                  Assurez-vous que les photos sont nettes et bien éclairées.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <Card className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Camera className="w-4 h-4 text-blue-500" />
                    <span className="font-medium text-sm">Conseils Photo</span>
                  </div>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Stabilisez l'appareil</li>
                    <li>• Cadrage serré sur l'indice</li>
                    <li>• Éclairage optimal</li>
                  </ul>
                </Card>
                
                <Card className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="font-medium text-sm">Auto-validation</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    L'IA analysera automatiquement vos photos pour valider les indices trouvés.
                  </p>
                </Card>
              </div>
            </div>
          )
        };

      case 'chat':
        return {
          title: "💭 Chat Collaboratif",
          content: (
            <div className="space-y-4">
              <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-400">
                <p className="text-green-800 font-medium mb-2">Mode Discussion Équipe</p>
                <p className="text-green-700 text-sm">
                  Partagez vos théories et découvertes avec l'équipe. 
                  L'IA participera aussi aux discussions pour vous aider.
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium">Participants actifs</span>
                  <Badge variant="secondary" className="text-xs">3 en ligne</Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  Marie (Terrain), Thomas (Historien), IA Assistant
                </div>
              </div>
            </div>
          )
        };

      case 'explore_map':
        return {
          title: "🗺️ Carte Interactive",
          content: (
            <div className="space-y-4">
              <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-400">
                <p className="text-purple-800 font-medium mb-2">Mode Navigation</p>
                <p className="text-purple-700 text-sm">
                  Explorez la carte interactive avec les zones d'intérêt, 
                  indices découverts et positions de l'équipe.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-gray-50 rounded">
                  <div className="font-medium text-sm">Zones explorées</div>
                  <div className="text-2xl font-bold text-blue-600">3/7</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded">
                  <div className="font-medium text-sm">Indices marqués</div>
                  <div className="text-2xl font-bold text-green-600">12</div>
                </div>
              </div>
            </div>
          )
        };

      case 'tutorial':
        return {
          title: "🎯 Guide Interactif",
          content: (
            <div className="space-y-4">
              <div className="bg-orange-50 rounded-lg p-4 border-l-4 border-orange-400">
                <p className="text-orange-800 font-medium mb-2">Tutoriel Personnalisé</p>
                <p className="text-orange-700 text-sm">
                  Apprenez les bases de la chasse aux trésors avec un guide interactif 
                  adapté à votre profil et à cette quête.
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Progression du tutoriel</span>
                  <span className="text-sm text-muted-foreground">0/5 étapes</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-orange-500 h-2 rounded-full w-0"></div>
                </div>
              </div>
            </div>
          )
        };

      default:
        return {
          title: "Action en cours",
          content: <p>Cette action est en cours de traitement...</p>
        };
    }
  };

  const modalContent = getModalContent();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{modalContent.title}</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          {modalContent.content}
        </div>
        
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
          <Button onClick={onClose}>
            Continuer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ActionModals;