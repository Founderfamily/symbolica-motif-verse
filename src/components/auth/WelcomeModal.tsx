
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight, Sparkles, Users, MapPin } from 'lucide-react';
import { useTranslation } from '@/i18n/useTranslation';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onClose, userName }) => {
  const { t } = useTranslation();

  const nextSteps = [
    {
      icon: Sparkles,
      title: t('auth.welcome.exploreSymbols.title'),
      description: t('auth.welcome.exploreSymbols.description'),
      action: t('auth.welcome.exploreSymbols.action')
    },
    {
      icon: MapPin,
      title: t('auth.welcome.contribute.title'),
      description: t('auth.welcome.contribute.description'),
      action: t('auth.welcome.contribute.action')
    },
    {
      icon: Users,
      title: t('auth.welcome.joinCommunity.title'),
      description: t('auth.welcome.joinCommunity.description'),
      action: t('auth.welcome.joinCommunity.action')
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
            {t('auth.welcome.title', { userName: userName ? ` ${userName}` : '' })}
          </DialogTitle>
          <p className="text-center text-slate-600 mt-2">
            {t('auth.welcome.description')}
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
            {t('auth.welcome.laterButton')}
          </Button>
          <Button onClick={onClose} className="flex-1 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800">
            {t('auth.welcome.startButton')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
