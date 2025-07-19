
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { SymbolData } from '@/types/supabase';
import { SymbolEditModalAdvanced } from './SymbolEditModalAdvanced';

interface AdminFloatingEditButtonProps {
  symbol: SymbolData;
  onSymbolUpdated: (updatedSymbol: SymbolData) => void;
  onImageGalleryClose?: () => void;
}

export const AdminFloatingEditButton: React.FC<AdminFloatingEditButtonProps> = ({
  symbol,
  onSymbolUpdated,
  onImageGalleryClose
}) => {
  const { user, profile } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Ne pas afficher le bouton si l'utilisateur n'est pas admin
  if (!user || !profile?.is_admin) {
    return null;
  }

  const handleOpenModal = () => {
    // Fermer la galerie d'images si elle est ouverte
    if (onImageGalleryClose) {
      onImageGalleryClose();
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

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

      <SymbolEditModalAdvanced
        symbol={symbol}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSymbolUpdated={onSymbolUpdated}
      />
    </>
  );
};
