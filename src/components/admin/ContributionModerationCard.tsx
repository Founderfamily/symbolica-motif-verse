
import React, { useState } from 'react';
import { CompleteContribution } from '@/types/contributions';
import { updateContributionStatus } from '@/services/contributionService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Check, 
  X, 
  Eye, 
  MapPin, 
  Calendar, 
  User,
  MessageSquare 
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from '@/i18n/useTranslation';
import { I18nText } from '@/components/ui/i18n-text';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ContributionModerationCardProps {
  contribution: CompleteContribution;
  onStatusUpdate: () => void;
}

const ContributionModerationCard: React.FC<ContributionModerationCardProps> = ({
  contribution,
  onStatusUpdate
}) => {
  const [reviewComment, setReviewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);
  const { user } = useAuth();
  const { t } = useTranslation();

  const handleApprove = async () => {
    if (!user) return;
    
    setSubmitting(true);
    try {
      await updateContributionStatus(
        contribution.id,
        'approved',
        user.id,
        reviewComment || undefined
      );
      onStatusUpdate();
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!user) return;
    
    setSubmitting(true);
    try {
      await updateContributionStatus(
        contribution.id,
        'rejected',
        user.id,
        reviewComment || 'Contribution rejetée'
      );
      onStatusUpdate();
    } finally {
      setSubmitting(false);
    }
  };

  const primaryImage = contribution.images.find(img => img.image_type === 'original');

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <CardTitle className="text-lg">{contribution.title}</CardTitle>
            <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {contribution.user_profile?.username || 'Utilisateur inconnu'}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {format(new Date(contribution.created_at), 'dd/MM/yyyy à HH:mm', { locale: fr })}
              </div>
            </div>
          </div>
          <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-300">
            En attente
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Image principale */}
        {primaryImage && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Image soumise</Label>
            <div className="relative">
              <img
                src={primaryImage.image_url}
                alt={contribution.title}
                className={`w-full rounded-lg border cursor-pointer transition-all ${
                  showFullImage ? 'h-auto' : 'h-48 object-cover'
                }`}
                onClick={() => setShowFullImage(!showFullImage)}
              />
              <Button
                variant="secondary"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => setShowFullImage(!showFullImage)}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Détails de la contribution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Description</Label>
              <p className="text-sm mt-1">{contribution.description || 'Aucune description'}</p>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Contexte culturel</Label>
              <p className="text-sm mt-1">{contribution.cultural_context || 'Non spécifié'}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Période</Label>
              <p className="text-sm mt-1">{contribution.period || 'Non spécifiée'}</p>
            </div>

            {contribution.location_name && (
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Localisation</Label>
                <div className="flex items-center gap-1 mt-1">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm">{contribution.location_name}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tags */}
        {contribution.tags.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground">Tags</Label>
            <div className="flex flex-wrap gap-2">
              {contribution.tags.map((tag) => (
                <Badge key={tag.id} variant="secondary" className="text-xs">
                  {tag.tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Commentaire de modération */}
        <div className="space-y-2">
          <Label htmlFor="review-comment">Commentaire de modération (optionnel)</Label>
          <Textarea
            id="review-comment"
            placeholder="Ajoutez un commentaire pour expliquer votre décision..."
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
            rows={3}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t">
          <Button
            onClick={handleApprove}
            disabled={submitting}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            <Check className="h-4 w-4 mr-2" />
            Approuver
          </Button>
          <Button
            onClick={handleReject}
            disabled={submitting}
            variant="destructive"
            className="flex-1"
          >
            <X className="h-4 w-4 mr-2" />
            Rejeter
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContributionModerationCard;
