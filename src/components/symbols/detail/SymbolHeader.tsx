import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface SymbolHeaderProps {
  onBackClick: () => void;
  isLoading?: boolean;
}

export const SymbolHeader: React.FC<SymbolHeaderProps> = ({ onBackClick, isLoading }) => {
  return (
    <div className="mb-6">
      <Button
        variant="ghost"
        onClick={onBackClick}
        className="mb-4 hover:bg-accent"
        disabled={isLoading}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour aux symboles
      </Button>
    </div>
  );
};