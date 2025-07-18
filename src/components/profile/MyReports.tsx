
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Clock, CheckCircle, XCircle, Eye } from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

import { Report } from '@/types/contributions';

interface MyReportsProps {
  userId?: string;
}

const MyReports: React.FC<MyReportsProps> = ({ userId }) => {
  const [myReports, setMyReports] = useState<any[]>([]); // Signalements faits par l'utilisateur
  const [reportsAboutMe, setReportsAboutMe] = useState<any[]>([]); // Signalements concernant ses contributions
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const targetUserId = userId || user?.id;

  useEffect(() => {
    if (targetUserId) {
      loadReports();
    }
  }, [targetUserId]);

  const loadReports = async () => {
    if (!targetUserId) return;

    try {
      setLoading(true);

      // Charger les signalements faits par l'utilisateur depuis symbol_moderation_items
      const { data: userReports, error: userReportsError } = await supabase
        .from('symbol_moderation_items')
        .select(`
          *,
          profiles!symbol_moderation_items_reviewed_by_fkey (
            username,
            full_name
          )
        `)
        .eq('reported_by', targetUserId)
        .order('created_at', { ascending: false });

      if (userReportsError) {
        console.error('Erreur lors du chargement des signalements utilisateur:', userReportsError);
      }

      // Charger les signalements concernant les contributions de l'utilisateur
      const { data: contributionReports, error: contributionReportsError } = await supabase
        .from('symbol_source_reports')
        .select(`
          *,
          profiles!symbol_source_reports_reviewed_by_fkey (
            username,
            full_name
          ),
          user_contributions!symbol_source_reports_source_id_fkey (
            title,
            status,
            user_id
          )
        `)
        .eq('user_contributions.user_id', targetUserId)
        .order('created_at', { ascending: false });

      if (contributionReportsError) {
        console.error('Erreur lors du chargement des signalements de contributions:', contributionReportsError);
      }

      setMyReports(userReports || []);
      setReportsAboutMe(contributionReports || []);
    } catch (error) {
      console.error('Erreur lors du chargement des signalements:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
            <Clock className="h-3 w-3 mr-1" />
            En cours
          </Badge>
        );
      case 'resolved':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Résolu
          </Badge>
        );
      case 'dismissed':
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            <XCircle className="h-3 w-3 mr-1" />
            Rejeté
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusDescription = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Le signalement est en cours d\'examen par nos modérateurs.';
      case 'resolved':
        return 'Le signalement a été traité et des mesures ont été prises si nécessaire.';
      case 'dismissed':
        return 'Le signalement a été examiné et jugé non fondé.';
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (myReports.length === 0 && reportsAboutMe.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">Aucun signalement à afficher.</p>
          <p className="text-sm text-gray-500">
            Vous n'avez fait aucun signalement et aucun signalement ne concerne vos contributions.
          </p>
        </CardContent>
      </Card>
    );
  }

  const renderReportCard = (report: any, isUserReport: boolean) => (
    <Card key={report.id} className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <span>
                {isUserReport ? 'Mon signalement' : 'Signalement de contribution'}
              </span>
            </CardTitle>
            {isUserReport ? (
              <p className="text-sm text-gray-600 mt-1">
                Signalement de contenu ({report.item_type || 'élément'})
              </p>
            ) : (
              report.user_contributions && (
                <p className="text-sm text-gray-600 mt-1">
                  Contribution: "{report.user_contributions.title}"
                </p>
              )
            )}
          </div>
          {getStatusBadge(report.status)}
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          <div className="text-sm text-gray-700">
            <p className="font-medium">Raison du signalement:</p>
            <p className="mt-1">{report.content || report.reason || 'Aucune raison spécifiée'}</p>
          </div>

          <div className="text-sm text-gray-600">
            {getStatusDescription(report.status)}
          </div>

          {report.evidence_url && (
            <div className="text-sm">
              <p className="font-medium text-gray-700">Preuve fournie:</p>
              <Button variant="link" size="sm" className="p-0 h-auto" asChild>
                <a href={report.evidence_url} target="_blank" rel="noopener noreferrer">
                  <Eye className="h-4 w-4 mr-1" />
                  Voir la preuve
                </a>
              </Button>
            </div>
          )}

          {report.resolution_notes && (
            <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800 font-medium">Notes de résolution:</p>
              <p className="text-sm text-blue-700 mt-1">{report.resolution_notes}</p>
              {report.profiles && report.reviewed_at && (
                <p className="text-xs text-blue-600 mt-2">
                  Traité par {report.profiles.full_name || report.profiles.username} le{' '}
                  {format(new Date(report.reviewed_at), 'dd MMMM yyyy', { locale: fr })}
                </p>
              )}
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
            <span>
              Signalé le {format(new Date(report.created_at), 'dd MMMM yyyy à HH:mm', { locale: fr })}
            </span>
            
            {report.status === 'pending' && (
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                Action requise
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Section des signalements faits par l'utilisateur */}
      {myReports.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Mes signalements ({myReports.length})</h3>
            <div className="text-sm text-gray-600">
              {myReports.filter(r => r.status === 'pending').length} en cours
            </div>
          </div>
          <p className="text-sm text-gray-600">Signalements que vous avez effectués</p>
          
          {myReports.map((report) => renderReportCard(report, true))}
        </div>
      )}

      {/* Section des signalements concernant les contributions de l'utilisateur */}
      {reportsAboutMe.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Signalements concernant mes contributions ({reportsAboutMe.length})</h3>
            <div className="text-sm text-gray-600">
              {reportsAboutMe.filter(r => r.status === 'pending').length} en cours
            </div>
          </div>
          <p className="text-sm text-gray-600">Signalements reçus sur vos contributions</p>
          
          {reportsAboutMe.map((report) => renderReportCard(report, false))}
        </div>
      )}
    </div>
  );
};

export default MyReports;
