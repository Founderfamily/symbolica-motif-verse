
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight, Sparkles, Users, MapPin } from 'lucide-react';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onClose, userName }) => {
  const nextSteps = [
    {
      icon: Sparkles,
      title: 'Explorez les symboles',
      description: 'Découvrez notre collection de milliers de symboles du monde entier',
      action: 'Explorer'
    },
    {
      icon: MapPin,
      title: 'Contribuez',
      description: 'Partagez vos propres découvertes avec la communauté',
      action: 'Contribuer'
    },
    {
      icon: Users,
      title: 'Rejoignez la communauté',
      description: 'Connectez-vous avec d\'autres passionnés de symbolique',
      action: 'Découvrir'
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="mx-auto w-12 h-12 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-6 w-6 text-white" />
          </div>
          <DialogTitle className="text-center text-xl">
            Bienvenue{userName ? ` ${userName}` : ''} !
          </DialogTitle>
          <p className="text-center text-slate-600 mt-2">
            Votre compte a été créé avec succès. Voici comment commencer :
          </p>
        </DialogHeader>
        
        <div className="space-y-3 mt-6">
          {nextSteps.map((step, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 rounded-lg border border-slate-200 hover:border-amber-200 hover:bg-amber-50 transition-colors group">
              <div className="bg-amber-100 p-2 rounded-lg group-hover:bg-amber-200 transition-colors">
                <step.icon className="h-4 w-4 text-amber-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-slate-900">{step.title}</h4>
                <p className="text-sm text-slate-600 mt-1">{step.description}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-amber-600 transition-colors" />
            </div>
          ))}
        </div>

        <div className="flex space-x-3 mt-6">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Plus tard
          </Button>
          <Button onClick={onClose} className="flex-1 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800">
            Commencer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
