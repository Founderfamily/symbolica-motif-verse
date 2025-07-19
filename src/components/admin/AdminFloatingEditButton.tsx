
import React, { useState } from 'react';
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
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Ne pas afficher le bouton si l'utilisateur n'est pas admin
  if (!user || !profile?.is_admin) {
    return null;
  }

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Convertir SymbolData vers le format attendu par SymbolEditModal (PaginatedSymbol)
  const convertedSymbol = symbol ? {
    id: symbol.id,
    name: symbol.name,
    culture: symbol.culture,
    period: symbol.period,
    description: symbol.description || '',
    created_at: symbol.created_at,
    updated_at: symbol.updated_at,
    image_count: 0,
    verification_count: 0,
    total_count: 0
  } : null;

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          type="button"
          size="lg"
          onClick={handleOpenModal}
          className="rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-amber-600 hover:bg-amber-700 gap-2"
        >
          <Edit className="h-5 w-5" />
          Éditer ce symbole
        </Button>
      </div>

      <SymbolEditModal
        symbol={convertedSymbol}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
};
