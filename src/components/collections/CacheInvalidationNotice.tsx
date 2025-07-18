import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useInvalidateCollectionsCache } from '@/features/collections/hooks/queries/invalidateCollectionsCache';
import { toast } from 'sonner';

/**
 * Component to help users refresh collections after the database restructuring
 */
export const CacheInvalidationNotice: React.FC = () => {
  const { invalidateAll } = useInvalidateCollectionsCache();

  useEffect(() => {
    // Auto-invalidate cache on component mount to show new collections
    const timer = setTimeout(() => {
      invalidateAll();
    }, 1000);

    return () => clearTimeout(timer);
  }, [invalidateAll]);

  const handleRefresh = () => {
    invalidateAll();
    toast.success('Collections mises à jour ! Les nouvelles collections mondiales sont maintenant visibles.');
  };

  return (
    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium text-primary">Nouvelles Collections Mondiales</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Les collections ont été restructurées selon les 20 grandes traditions mondiales.
          </p>
        </div>
        <Button onClick={handleRefresh} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualiser
        </Button>
      </div>
    </div>
  );
};