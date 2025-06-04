
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { useTranslation } from '@/i18n/useTranslation';

interface AdminErrorBoundaryProps {
  error?: Error | null;
  onRetry?: () => void;
  title?: string;
  description?: string;
}

const AdminErrorBoundary: React.FC<AdminErrorBoundaryProps> = ({
  error,
  onRetry,
  title,
  description
}) => {
  const { t } = useTranslation();

  return (
    <Card className="border-red-200 bg-red-50">
      <CardHeader>
        <CardTitle className="flex items-center text-red-700">
          <AlertCircle className="h-5 w-5 mr-2" />
          {title || t('admin.error')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-red-600 mb-4">
          {description || error?.message || 'Une erreur inattendue s\'est produite.'}
        </p>
        {onRetry && (
          <Button 
            onClick={onRetry}
            variant="outline"
            size="sm"
            className="border-red-300 text-red-700 hover:bg-red-100"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Réessayer
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminErrorBoundary;
