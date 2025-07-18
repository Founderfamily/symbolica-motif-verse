
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Calendar, Globe, User } from 'lucide-react';
import { ContributionForModeration } from '@/services/admin/contributionModerationService';

interface ContributionDetailProps {
  contribution: ContributionForModeration | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ContributionDetail({ contribution, open, onOpenChange }: ContributionDetailProps) {
  if (!contribution) return null;

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "secondary",
      approved: "default",
      rejected: "destructive",
    } as const;
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
        {status === 'pending' && 'En attente'}
        {status === 'approved' && 'Approuvée'}
        {status === 'rejected' && 'Rejetée'}
      </Badge>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Détails de la contribution</span>
            {getStatusBadge(contribution.status)}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informations générales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">{contribution.title}</h3>
                {contribution.description && (
                  <p className="text-slate-700 leading-relaxed">{contribution.description}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {contribution.cultural_context && (
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-slate-500" />
                    <div>
                      <span className="text-sm text-slate-500">Culture:</span>
                      <p className="font-medium">{contribution.cultural_context}</p>
                    </div>
                  </div>
                )}

                {contribution.period && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-slate-500" />
                    <div>
                      <span className="text-sm text-slate-500">Période:</span>
                      <p className="font-medium">{contribution.period}</p>
                    </div>
                  </div>
                )}

                {contribution.location_name && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-slate-500" />
                    <div>
                      <span className="text-sm text-slate-500">Lieu:</span>
                      <p className="font-medium">{contribution.location_name}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-slate-500" />
                  <div>
                    <span className="text-sm text-slate-500">Contributeur:</span>
                    <p className="font-medium">
                      {contribution.user_profile?.username || contribution.user_profile?.full_name || 'Utilisateur anonyme'}
                    </p>
                  </div>
                </div>
              </div>

              {(contribution.latitude && contribution.longitude) && (
                <div>
                  <span className="text-sm text-slate-500">Coordonnées GPS:</span>
                  <p className="font-medium">{contribution.latitude}, {contribution.longitude}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Historique</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded">
                  <span>Contribution créée</span>
                  <span className="text-sm text-slate-500">
                    {new Date(contribution.created_at).toLocaleString('fr-FR')}
                  </span>
                </div>

                {contribution.updated_at !== contribution.created_at && (
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded">
                    <span>Dernière modification</span>
                    <span className="text-sm text-slate-500">
                      {new Date(contribution.updated_at).toLocaleString('fr-FR')}
                    </span>
                  </div>
                )}

                {contribution.reviewed_at && (
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded">
                    <span>
                      {contribution.status === 'approved' ? 'Approuvée' : 
                       contribution.status === 'rejected' ? 'Rejetée' : 'Révisée'}
                    </span>
                    <span className="text-sm text-slate-500">
                      {new Date(contribution.reviewed_at).toLocaleString('fr-FR')}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
