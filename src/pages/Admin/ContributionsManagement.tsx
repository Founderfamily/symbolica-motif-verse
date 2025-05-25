
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPendingContributions } from '@/services/contributionService';
import { CompleteContribution } from '@/types/contributions';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from '@/i18n/useTranslation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import ContributionModerationCard from '@/components/admin/ContributionModerationCard';

const ContributionsManagement = () => {
  const [pendingContributions, setPendingContributions] = useState<CompleteContribution[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isAdmin } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const loadContributions = async () => {
    setLoading(true);
    const data = await getPendingContributions();
    setPendingContributions(data);
    setLoading(false);
  };

  useEffect(() => {
    if (isAdmin) {
      loadContributions();
    }
  }, [isAdmin]);

  const handleStatusUpdate = () => {
    // Recharger la liste après une mise à jour de statut
    loadContributions();
  };

  if (!isAdmin) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-4">
        <AlertTriangle className="h-10 w-10 text-yellow-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">{t('contributions.admin.accessRestricted')}</h1>
        <p className="text-muted-foreground mb-4">
          {t('contributions.admin.accessRestrictedDescription')}
        </p>
        <Button onClick={() => navigate('/')}>
          {t('contributions.admin.backToHome')}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('contributions.admin.title')}</h1>
          <p className="text-muted-foreground">
            {t('contributions.admin.subtitle')}
          </p>
        </div>
        <Button onClick={loadContributions} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Actualiser
        </Button>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              {t('contributions.admin.pending')} ({pendingContributions.length})
            </CardTitle>
            <CardDescription>
              {t('contributions.admin.pendingDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-10 text-center">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">{t('contributions.loading')}</p>
              </div>
            ) : pendingContributions.length === 0 ? (
              <div className="py-10 text-center border rounded-lg bg-slate-50">
                <h3 className="text-lg font-medium mb-2">{t('contributions.admin.noPending')}</h3>
                <p className="text-muted-foreground">
                  {t('contributions.admin.noActive')}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {pendingContributions.map((contribution) => (
                  <ContributionModerationCard
                    key={contribution.id}
                    contribution={contribution}
                    onStatusUpdate={handleStatusUpdate}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContributionsManagement;
