
import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { SymbolData } from '@/types/supabase';
import { PaginatedSymbol } from '@/hooks/useAdminSymbols';

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

  // Convertir SymbolData vers PaginatedSymbol
  const convertedSymbol: PaginatedSymbol = {
    ...symbol,
    image_count: 0, // Ces valeurs seront récupérées dynamiquement
    verification_count: 0,
    total_count: 0
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        type="button"
        size="lg"
        className="rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-amber-600 hover:bg-amber-700 gap-2"
      >
        <Edit className="h-5 w-5" />
        Éditer ce symbole
      </Button>
    </div>
  );
};
