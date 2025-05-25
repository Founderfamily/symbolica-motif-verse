
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getContributionById } from '@/services/contributionService';
import { CompleteContribution } from '@/types/contributions';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from '@/i18n/useTranslation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  User, 
  Tags,
  Eye,
  Download,
  Share2,
  Heart
} from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const ContributionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [contribution, setContribution] = useState<CompleteContribution | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

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

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!contribution) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card>
          <CardContent className="py-12 text-center">
            <h2 className="text-xl font-semibold mb-2">Contribution introuvable</h2>
            <p className="text-muted-foreground mb-4">
              Cette contribution n'existe pas ou a été supprimée.
            </p>
            <Button onClick={() => navigate('/contributions')}>
              Retour aux contributions
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const images = contribution.images.filter(img => img.image_type === 'original');
  const currentImage = images[selectedImageIndex];

  return (
    <div className="container mx-auto py-8 px-4 space-y-6">
      {/* Navigation */}
      <Button
        variant="ghost"
        onClick={() => navigate('/contributions')}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Retour aux contributions
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Galerie d'images */}
        <div className="space-y-4">
          {currentImage && (
            <Card className="overflow-hidden">
              <div className="relative">
                <img
                  src={currentImage.image_url}
                  alt={contribution.title}
                  className="w-full h-96 object-contain bg-secondary/20"
                />
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button size="sm" variant="secondary">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="secondary">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="secondary">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Miniatures */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    index === selectedImageIndex ? 'border-primary' : 'border-transparent'
                  }`}
                >
                  <img
                    src={image.image_url}
                    alt={`Vue ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Informations */}
        <div className="space-y-6">
          {/* En-tête */}
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold">{contribution.title}</h1>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {contribution.user_profile?.username || 'Utilisateur inconnu'}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {format(new Date(contribution.created_at), 'dd MMMM yyyy', { locale: fr })}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Badge 
                  variant={contribution.status === 'approved' ? 'default' : 'secondary'}
                  className={contribution.status === 'approved' ? 'bg-green-100 text-green-800' : ''}
                >
                  {contribution.status === 'approved' ? 'Approuvé' : 'En attente'}
                </Badge>
                <Button size="sm" variant="outline">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {contribution.description && (
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {contribution.description}
                </p>
              </div>
            )}
          </div>

          <Separator />

          {/* Détails culturels */}
          <div className="space-y-4">
            <h3 className="font-semibold">Informations culturelles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {contribution.cultural_context && (
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Contexte culturel</span>
                  <p className="mt-1">{contribution.cultural_context}</p>
                </div>
              )}
              {contribution.period && (
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Période</span>
                  <p className="mt-1">{contribution.period}</p>
                </div>
              )}
            </div>
          </div>

          {/* Localisation */}
          {contribution.location_name && (
            <>
              <Separator />
              <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Localisation
                </h3>
                <p className="text-muted-foreground">{contribution.location_name}</p>
                {contribution.latitude && contribution.longitude && (
                  <p className="text-xs text-muted-foreground">
                    Coordonnées: {contribution.latitude.toFixed(6)}, {contribution.longitude.toFixed(6)}
                  </p>
                )}
              </div>
            </>
          )}

          {/* Tags */}
          {contribution.tags.length > 0 && (
            <>
              <Separator />
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <Tags className="h-4 w-4" />
                  Tags ({contribution.tags.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {contribution.tags.map((tag) => (
                    <Badge key={tag.id} variant="secondary">
                      {tag.tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Commentaires */}
          {contribution.comments.length > 0 && (
            <>
              <Separator />
              <div className="space-y-3">
                <h3 className="font-semibold">
                  Commentaires ({contribution.comments.length})
                </h3>
                <div className="space-y-4">
                  {contribution.comments.map((comment) => (
                    <div key={comment.id} className="bg-muted/50 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium text-sm">
                          {comment.profiles?.username || 'Modérateur'}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(comment.created_at), 'dd/MM/yyyy à HH:mm', { locale: fr })}
                        </span>
                      </div>
                      <p className="text-sm">{comment.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContributionDetail;
