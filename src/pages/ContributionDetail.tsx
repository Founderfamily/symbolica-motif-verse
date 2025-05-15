
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { getContributionById, updateContributionStatus } from '@/services/contributionService';
import { CompleteContribution } from '@/types/contributions';
import { useTranslation } from '@/i18n/useTranslation';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Calendar, 
  MapPin, 
  User, 
  Clock, 
  Tag, 
  MessageCircle, 
  CheckCircle2, 
  XCircle, 
  ArrowLeft,
  Eye
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const ContributionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { t } = useTranslation();
  const [contribution, setContribution] = useState<CompleteContribution | null>(null);
  const [loading, setLoading] = useState(true);
  const [rejectionReason, setRejectionReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadContribution = async () => {
      if (!id) return;
      
      setLoading(true);
      const data = await getContributionById(id);
      setContribution(data);
      setLoading(false);
    };

    loadContribution();
  }, [id]);

  const handleApprove = async () => {
    if (!user || !contribution) return;
    
    setSubmitting(true);
    const success = await updateContributionStatus(contribution.id, 'approved', user.id);
    setSubmitting(false);
    
    if (success) {
      // Recharger la contribution
      const updatedContribution = await getContributionById(id!);
      setContribution(updatedContribution);
    }
  };

  const handleReject = async () => {
    if (!user || !contribution || !rejectionReason.trim()) return;
    
    setSubmitting(true);
    const success = await updateContributionStatus(
      contribution.id, 
      'rejected', 
      user.id, 
      rejectionReason
    );
    setSubmitting(false);
    
    if (success) {
      // Recharger la contribution
      const updatedContribution = await getContributionById(id!);
      setContribution(updatedContribution);
      setRejectionReason('');
    }
  };

  const canView = () => {
    if (!user || !contribution) return false;
    return isAdmin || contribution.status === 'approved' || contribution.user_id === user.id;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">{t('contributions.status.pending')}</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 border-green-300">{t('contributions.status.approved')}</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 border-red-300">{t('contributions.status.rejected')}</Badge>;
      default:
        return <Badge>{t('contributions.status.unknown')}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-1/3 mb-6"></div>
          <div className="h-64 bg-slate-200 rounded-lg mb-6"></div>
          <div className="space-y-3">
            <div className="h-4 bg-slate-200 rounded w-2/3"></div>
            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!contribution) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-4">{t('contributions.detail.notFound')}</h1>
        <p className="mb-6">{t('contributions.detail.notFoundDescription')}</p>
        <Button onClick={() => navigate('/contributions')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('contributions.detail.back')}
        </Button>
      </div>
    );
  }

  if (!canView()) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-4">{t('contributions.detail.accessDenied')}</h1>
        <p className="mb-6">{t('contributions.detail.accessDeniedDescription')}</p>
        <Button onClick={() => navigate('/contributions')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('contributions.detail.back')}
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => navigate('/contributions')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        {t('contributions.detail.back')}
      </Button>
      
      <div className="flex flex-col md:flex-row justify-between items-start gap-6">
        {/* Colonne principale */}
        <div className="w-full md:w-2/3 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {getStatusBadge(contribution.status)}
              <h1 className="text-2xl md:text-3xl font-bold">{contribution.title}</h1>
            </div>
            
            {contribution.user_profile && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-3 w-3" />
                <span>{contribution.user_profile.username || contribution.user_profile.full_name}</span>
                <Clock className="h-3 w-3 ml-2" />
                <span>
                  {format(new Date(contribution.created_at), 'dd MMMM yyyy', { locale: fr })}
                </span>
              </div>
            )}
          </div>
          
          {/* Images de la contribution */}
          <div className="space-y-4">
            {contribution.images.length > 0 && (
              <div>
                <img
                  src={contribution.images[0].image_url}
                  alt={contribution.title}
                  className="w-full rounded-lg border object-cover max-h-[500px]"
                />
                {contribution.images[0].extracted_pattern_url && (
                  <div className="mt-4">
                    <h3 className="text-lg font-medium mb-2">Motif extrait:</h3>
                    <img
                      src={contribution.images[0].extracted_pattern_url}
                      alt="Motif extrait"
                      className="max-w-full h-auto rounded-lg border"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-slate-700 whitespace-pre-line">
              {contribution.description || "Aucune description fournie."}
            </p>
          </div>
          
          {/* Section commentaires */}
          <div className="pt-4">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <MessageCircle className="mr-2 h-5 w-5" />
              {t('contributions.detail.comments')} ({contribution.comments.length})
            </h2>
            
            {contribution.comments.length === 0 ? (
              <p className="text-muted-foreground italic">
                {t('contributions.detail.noComments')}
              </p>
            ) : (
              <div className="space-y-4">
                {contribution.comments.map(comment => (
                  <div key={comment.id} className="border rounded-lg p-4 bg-slate-50">
                    <div className="flex items-center gap-2 mb-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {comment.profiles?.username?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {comment.profiles?.username || "Administrateur"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(comment.created_at), 'dd MMM yyyy HH:mm', { locale: fr })}
                        </p>
                      </div>
                    </div>
                    <p className="ml-10">{comment.comment}</p>
                  </div>
                ))}
              </div>
            )}
            
            {/* Section admin pour approuver/rejeter */}
            {isAdmin && contribution.status === 'pending' && (
              <div className="mt-6 border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">{t('contributions.detail.admin.title')}</h3>
                
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <Button
                      className="w-full"
                      onClick={handleApprove}
                      disabled={submitting}
                    >
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      {t('contributions.detail.admin.approve')}
                    </Button>
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <Textarea
                      placeholder={t('contributions.detail.admin.rejectReason')}
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      rows={2}
                    />
                    <Button
                      variant="destructive"
                      className="w-full"
                      onClick={handleReject}
                      disabled={submitting || !rejectionReason.trim()}
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      {t('contributions.detail.admin.reject')}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Barre latérale */}
        <div className="w-full md:w-1/3 space-y-4">
          {/* Informations */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-4">{t('contributions.detail.information')}</h3>
              
              <div className="space-y-3">
                {contribution.cultural_context && (
                  <div className="flex items-start gap-3">
                    <div className="bg-slate-100 p-2 rounded-full">
                      <Eye className="h-4 w-4 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{t('contributions.detail.fields.culture')}</p>
                      <p className="text-sm text-slate-600">{contribution.cultural_context}</p>
                    </div>
                  </div>
                )}
                
                {contribution.period && (
                  <div className="flex items-start gap-3">
                    <div className="bg-slate-100 p-2 rounded-full">
                      <Calendar className="h-4 w-4 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{t('contributions.detail.fields.period')}</p>
                      <p className="text-sm text-slate-600">{contribution.period}</p>
                    </div>
                  </div>
                )}
                
                {contribution.location_name && (
                  <div className="flex items-start gap-3">
                    <div className="bg-slate-100 p-2 rounded-full">
                      <MapPin className="h-4 w-4 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{t('contributions.detail.fields.location')}</p>
                      <p className="text-sm text-slate-600">{contribution.location_name}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Tags */}
          {contribution.tags.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4 flex items-center">
                  <Tag className="mr-2 h-4 w-4" />
                  Tags
                </h3>
                
                <div className="flex flex-wrap gap-2">
                  {contribution.tags.map(tag => (
                    <Badge key={tag.id} variant="secondary">
                      {tag.tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Statut de modération */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-4">{t('contributions.detail.moderation')}</h3>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">{t('contributions.table.status')}:</span>
                  {getStatusBadge(contribution.status)}
                </div>
                
                {contribution.reviewed_at && (
                  <div className="flex items-center justify-between text-sm">
                    <span>{t('contributions.detail.reviewedOn')}</span>
                    <span>{format(new Date(contribution.reviewed_at), 'dd/MM/yyyy', { locale: fr })}</span>
                  </div>
                )}
                
                {contribution.status === 'pending' && (
                  <Alert className="mt-4 bg-yellow-50 text-yellow-800 border-yellow-300">
                    <AlertTitle className="text-yellow-800">{t('contributions.detail.pendingReview')}</AlertTitle>
                    <AlertDescription className="text-yellow-700">
                      {t('contributions.detail.pendingReviewDescription')}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ContributionDetail;
