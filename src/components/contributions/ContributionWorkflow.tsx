
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, Clock, AlertCircle, User, FileText, MessageSquare } from 'lucide-react';
import { CompleteContribution } from '@/types/contributions';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface WorkflowStep {
  id: string;
  name: string;
  status: 'completed' | 'current' | 'pending';
  assignee?: string;
  completedAt?: Date;
  comment?: string;
}

interface ContributionWorkflowProps {
  contribution: CompleteContribution;
  isAdmin: boolean;
  onStatusUpdate: (status: string, comment?: string) => void;
}

const ContributionWorkflow: React.FC<ContributionWorkflowProps> = ({
  contribution,
  isAdmin,
  onStatusUpdate
}) => {
  const [newStatus, setNewStatus] = useState('');
  const [comment, setComment] = useState('');
  const [selectedReviewer, setSelectedReviewer] = useState('');

  const workflowSteps: WorkflowStep[] = [
    {
      id: 'submission',
      name: 'Soumission',
      status: 'completed',
      completedAt: new Date(contribution.created_at)
    },
    {
      id: 'initial_review',
      name: 'Révision initiale',
      status: contribution.status === 'pending' ? 'current' : 'completed',
      assignee: 'Équipe de modération',
      completedAt: contribution.status !== 'pending' ? new Date() : undefined
    },
    {
      id: 'expert_review',
      name: 'Révision experte',
      status: contribution.status === 'approved' ? 'completed' : 
              contribution.status === 'pending' ? 'pending' : 'completed',
      assignee: 'Expert culturel',
      completedAt: contribution.status === 'approved' ? new Date() : undefined
    },
    {
      id: 'publication',
      name: 'Publication',
      status: contribution.status === 'approved' ? 'completed' : 'pending',
      completedAt: contribution.status === 'approved' ? new Date() : undefined
    }
  ];

  const mockReviewers = [
    'Dr. Marie Dubois - Expert en cultures anciennes',
    'Prof. Jean Martin - Spécialiste en symbolisme',
    'Dr. Sophie Laurent - Historienne de l\'art'
  ];

  const getStepIcon = (status: WorkflowStep['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'current':
        return <Clock className="h-5 w-5 text-blue-600" />;
      case 'pending':
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  const handleStatusUpdate = () => {
    if (newStatus && comment) {
      onStatusUpdate(newStatus, comment);
      setNewStatus('');
      setComment('');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Current Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Statut actuel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <Badge className={getStatusColor(contribution.status)}>
              {contribution.status}
            </Badge>
            <span className="text-sm text-muted-foreground">
              Dernière mise à jour: {formatDistanceToNow(new Date(contribution.created_at), { addSuffix: true, locale: fr })}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Workflow Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Processus de révision</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {workflowSteps.map((step, index) => (
              <div key={step.id} className="flex items-start gap-4">
                {/* Step Icon */}
                <div className="flex flex-col items-center">
                  {getStepIcon(step.status)}
                  {index < workflowSteps.length - 1 && (
                    <div className={`w-px h-12 mt-2 ${
                      step.status === 'completed' ? 'bg-green-300' : 'bg-gray-300'
                    }`} />
                  )}
                </div>

                {/* Step Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className={`font-medium ${
                      step.status === 'current' ? 'text-blue-600' : 
                      step.status === 'completed' ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {step.name}
                    </h3>
                    {step.status === 'current' && (
                      <Badge variant="outline" className="text-xs">
                        En cours
                      </Badge>
                    )}
                  </div>

                  {step.assignee && (
                    <div className="flex items-center gap-1 mt-1">
                      <User className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-600">{step.assignee}</span>
                    </div>
                  )}

                  {step.completedAt && (
                    <p className="text-xs text-gray-500 mt-1">
                      Complété {formatDistanceToNow(step.completedAt, { addSuffix: true, locale: fr })}
                    </p>
                  )}

                  {step.comment && (
                    <div className="mt-2 p-2 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">{step.comment}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Admin Actions */}
      {isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Actions administrateur
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Nouveau statut</label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="approved">Approuver</SelectItem>
                    <SelectItem value="rejected">Rejeter</SelectItem>
                    <SelectItem value="revision_needed">Révision nécessaire</SelectItem>
                    <SelectItem value="pending">Remettre en attente</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Assigner à un réviseur</label>
                <Select value={selectedReviewer} onValueChange={setSelectedReviewer}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir un réviseur" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockReviewers.map(reviewer => (
                      <SelectItem key={reviewer} value={reviewer}>
                        {reviewer}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Commentaire</label>
              <Textarea
                placeholder="Ajoutez un commentaire pour expliquer la décision..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={handleStatusUpdate}
                disabled={!newStatus || !comment}
              >
                Mettre à jour le statut
              </Button>
              <Button variant="outline">
                Programmer une révision
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Review History */}
      <Card>
        <CardHeader>
          <CardTitle>Historique des révisions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Contribution soumise</span>
                  <Badge variant="outline" className="text-xs">Système</Badge>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  {formatDistanceToNow(new Date(contribution.created_at), { addSuffix: true, locale: fr })}
                </p>
              </div>
            </div>

            {contribution.status !== 'pending' && (
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                {contribution.status === 'approved' ? (
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {contribution.status === 'approved' ? 'Approuvé' : 'Rejeté'} par Dr. Marie Dubois
                    </span>
                    <Badge variant="outline" className="text-xs">Admin</Badge>
                  </div>
                  <p className="text-sm text-gray-700 mt-1">
                    Excellente documentation du symbole avec des sources fiables.
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Il y a 2 heures
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContributionWorkflow;
