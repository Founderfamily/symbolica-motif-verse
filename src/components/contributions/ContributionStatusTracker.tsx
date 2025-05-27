
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, CheckCircle, XCircle, AlertCircle, User, Calendar } from 'lucide-react';
import { CompleteContribution } from '@/types/contributions';
import { useTranslation } from '@/i18n/useTranslation';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ContributionStatusTrackerProps {
  contribution: CompleteContribution;
}

const ContributionStatusTracker: React.FC<ContributionStatusTrackerProps> = ({ contribution }) => {
  const { t } = useTranslation();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusProgress = (status: string) => {
    switch (status) {
      case 'pending':
        return 50;
      case 'approved':
        return 100;
      case 'rejected':
        return 100;
      default:
        return 0;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500';
      case 'approved':
        return 'bg-green-500';
      case 'rejected':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getStatusIcon(contribution.status)}
          Status de la contribution
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className={`${getStatusColor(contribution.status)} text-white`}>
            {t(`contributions.status.${contribution.status}`)}
          </Badge>
          <span className="text-sm text-muted-foreground">
            {getStatusProgress(contribution.status)}% terminé
          </span>
        </div>
        
        <Progress 
          value={getStatusProgress(contribution.status)} 
          className="w-full" 
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Soumis:</span>
            <span>{format(new Date(contribution.created_at), 'dd/MM/yyyy', { locale: fr })}</span>
          </div>
          
          {contribution.reviewed_at && (
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Évalué:</span>
              <span>{format(new Date(contribution.reviewed_at), 'dd/MM/yyyy', { locale: fr })}</span>
            </div>
          )}
        </div>

        {contribution.status === 'pending' && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-800">
              Votre contribution est en cours d'évaluation par notre équipe. 
              Nous vous notifierons dès qu'une décision sera prise.
            </p>
          </div>
        )}

        {contribution.status === 'approved' && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-800">
              Félicitations ! Votre contribution a été approuvée et ajoutée à notre base de données.
            </p>
          </div>
        )}

        {contribution.status === 'rejected' && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-800">
              Votre contribution n'a pas pu être approuvée. 
              Contactez notre équipe pour plus d'informations.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ContributionStatusTracker;
