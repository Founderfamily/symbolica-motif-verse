
import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { SymbolData } from '@/types/supabase';
import { SymbolEditModal } from './SymbolEditModal';

interface AdminFloatingEditButtonProps {
  symbol: SymbolData;
  onSymbolUpdated: (updatedSymbol: SymbolData) => void;
}

export const AdminFloatingEditButton: React.FC<AdminFloatingEditButtonProps> = ({
  symbol,
  onSymbolUpdated
}) => {
  const { user, profile } = useAuth();

  // Ne pas afficher le bouton si l'utilisateur n'est pas admin
  if (!user || !profile?.is_admin) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <SymbolEditModal
        symbol={symbol}
        onSymbolUpdated={onSymbolUpdated}
        trigger={
          <Button
            size="lg"
            className="rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-amber-600 hover:bg-amber-700 gap-2"
          >
            <Edit className="h-5 w-5" />
            Éditer ce symbole
          </Button>
        }
      />
    </div>
  );
};
