
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPendingContributions } from '@/services/contributionService';
import { CompleteContribution } from '@/types/contributions';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from '@/i18n/useTranslation';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const ContributionsManagement = () => {
  const [pendingContributions, setPendingContributions] = useState<CompleteContribution[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isAdmin } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const loadContributions = async () => {
      setLoading(true);
      const data = await getPendingContributions();
      setPendingContributions(data);
      setLoading(false);
    };

    if (isAdmin) {
      loadContributions();
    }
  }, [isAdmin]);

  const handleViewContribution = (id: string) => {
    navigate(`/contributions/${id}`);
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
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">{t('contributions.admin.pending')} ({pendingContributions.length})</CardTitle>
            <CardDescription>
              {t('contributions.admin.pendingDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-10 text-center">
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
              <div className="overflow-x-auto">
                <Table>
                  <TableCaption>{t('contributions.admin.table.caption')}</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('contributions.admin.table.title')}</TableHead>
                      <TableHead>{t('contributions.admin.table.submittedBy')}</TableHead>
                      <TableHead>{t('contributions.admin.table.date')}</TableHead>
                      <TableHead>{t('contributions.admin.table.type')}</TableHead>
                      <TableHead className="text-right">{t('contributions.admin.table.actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingContributions.map((contribution) => (
                      <TableRow key={contribution.id}>
                        <TableCell className="font-medium max-w-[200px] truncate">
                          {contribution.title}
                        </TableCell>
                        <TableCell>
                          {contribution.user_profile?.username || contribution.user_id.substring(0, 8)}
                        </TableCell>
                        <TableCell>
                          {format(new Date(contribution.created_at), 'dd/MM/yyyy', { locale: fr })}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {contribution.cultural_context || "Non spécifié"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewContribution(contribution.id)}
                          >
                            <Eye className="h-4 w-4" />
                            <span className="ml-1">{t('contributions.admin.table.view')}</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContributionsManagement;
