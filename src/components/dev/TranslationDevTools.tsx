
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Languages, Bug } from 'lucide-react';
import { TranslationValidationPanel } from './TranslationValidationPanel';

export const TranslationDevTools: React.FC = () => {
  const [showValidationPanel, setShowValidationPanel] = useState(false);

  // Skip en production
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <>
      {/* Bouton flottant en bas à droite */}
      <div className="fixed bottom-4 right-4 z-40 flex flex-col gap-2">
        <Button
          onClick={() => setShowValidationPanel(true)}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white shadow-lg"
          size="sm"
        >
          <Languages className="w-4 h-4" />
          <Bug className="w-4 h-4" />
          i18n Tools
        </Button>
      </div>

      {/* Panel de validation */}
      <TranslationValidationPanel
        isOpen={showValidationPanel}
        onClose={() => setShowValidationPanel(false)}
      />
    </>
  );
};

export default TranslationDevTools;
