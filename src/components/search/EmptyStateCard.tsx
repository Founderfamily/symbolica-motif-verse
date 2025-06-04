
import React from 'react';
import { Card } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

export const EmptyStateCard: React.FC = React.memo(() => {
  return (
    <Card className="p-8 text-center text-slate-500">
      <div className="space-y-2">
        <AlertCircle className="w-12 h-12 mx-auto text-slate-300" />
        <h3 className="text-lg font-medium">Aucun symbole trouvé</h3>
        <p className="text-sm">Essayez de modifier vos critères de recherche</p>
      </div>
    </Card>
  );
});

EmptyStateCard.displayName = 'EmptyStateCard';
