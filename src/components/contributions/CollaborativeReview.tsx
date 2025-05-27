
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Users, MessageSquare, ThumbsUp, ThumbsDown, Star, Clock } from 'lucide-react';
import { CompleteContribution } from '@/types/contributions';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Review {
  id: string;
  reviewerId: string;
  reviewerName: string;
  reviewerAvatar?: string;
  rating: number;
  comment: string;
  isExpert: boolean;
  timestamp: Date;
  helpful: number;
  verified: boolean;
}

interface CollaborativeReviewProps {
  contribution: CompleteContribution;
  userCanReview: boolean;
  onSubmitReview: (rating: number, comment: string) => void;
}

const CollaborativeReview: React.FC<CollaborativeReviewProps> = ({
  contribution,
  userCanReview,
  onSubmitReview
}) => {
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);

  const mockReviews: Review[] = [
    {
      id: '1',
      reviewerId: 'expert1',
      reviewerName: 'Dr. Marie Dubois',
      reviewerAvatar: '',
      rating: 5,
      comment: 'Excellente documentation avec des sources fiables. Les détails historiques sont particulièrement bien recherchés.',
      isExpert: true,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      helpful: 12,
      verified: true
    },
    {
      id: '2',
      reviewerId: 'contributor1',
      reviewerName: 'Jean Martin',
      rating: 4,
      comment: 'Très bonne contribution. J\'aurais aimé voir plus d\'informations sur l\'usage moderne de ce symbole.',
      isExpert: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
      helpful: 8,
      verified: false
    },
    {
      id: '3',
      reviewerId: 'expert2',
      reviewerName: 'Prof. Sophie Laurent',
      rating: 5,
      comment: 'Analyse contextuelle remarquable. Cette contribution enrichit significativement notre base de données.',
      isExpert: true,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
      helpful: 15,
      verified: true
    }
  ];

  const averageRating = mockReviews.reduce((sum, review) => sum + review.rating, 0) / mockReviews.length;
  const expertReviews = mockReviews.filter(review => review.isExpert);
  const communityReviews = mockReviews.filter(review => !review.isExpert);

  const handleSubmitReview = () => {
    if (newRating > 0 && newComment.trim()) {
      onSubmitReview(newRating, newComment);
      setNewRating(0);
      setNewComment('');
      setShowReviewForm(false);
    }
  };

  const renderStars = (rating: number, interactive = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating 
                ? 'text-yellow-400 fill-current' 
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
            onClick={interactive ? () => setNewRating(star) : undefined}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Review Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Évaluations collaboratives
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600 mb-2">
                {averageRating.toFixed(1)}
              </div>
              {renderStars(Math.round(averageRating))}
              <p className="text-sm text-gray-600 mt-2">
                {mockReviews.length} évaluations
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-3">Distribution des notes</h4>
              {[5, 4, 3, 2, 1].map(rating => {
                const count = mockReviews.filter(r => r.rating === rating).length;
                const percentage = (count / mockReviews.length) * 100;
                return (
                  <div key={rating} className="flex items-center gap-2 mb-1">
                    <span className="text-sm w-4">{rating}</span>
                    <Star className="h-3 w-3 text-yellow-400 fill-current" />
                    <Progress value={percentage} className="flex-1 h-2" />
                    <span className="text-xs text-gray-600 w-8">{count}</span>
                  </div>
                );
              })}
            </div>

            <div>
              <h4 className="font-medium mb-3">Types d'évaluateurs</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Experts</span>
                  <Badge variant="outline">{expertReviews.length}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Communauté</span>
                  <Badge variant="outline">{communityReviews.length}</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Review */}
      {userCanReview && (
        <Card>
          <CardHeader>
            <CardTitle>Ajouter votre évaluation</CardTitle>
          </CardHeader>
          <CardContent>
            {!showReviewForm ? (
              <Button onClick={() => setShowReviewForm(true)}>
                <MessageSquare className="h-4 w-4 mr-2" />
                Évaluer cette contribution
              </Button>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Note</label>
                  {renderStars(newRating, true)}
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Commentaire</label>
                  <Textarea
                    placeholder="Partagez votre avis détaillé sur cette contribution..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={handleSubmitReview}
                    disabled={newRating === 0 || !newComment.trim()}
                  >
                    Publier l'évaluation
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowReviewForm(false)}
                  >
                    Annuler
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Expert Reviews */}
      {expertReviews.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-600" />
              Évaluations d'experts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {expertReviews.map(review => (
              <div key={review.id} className="border rounded-lg p-4 bg-yellow-50">
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={review.reviewerAvatar} />
                    <AvatarFallback>
                      {review.reviewerName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium">{review.reviewerName}</span>
                      <Badge variant="default" className="text-xs">Expert</Badge>
                      {review.verified && (
                        <Badge variant="outline" className="text-xs">
                          Vérifié
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                      {renderStars(review.rating)}
                      <span className="text-sm text-gray-600">
                        {formatDistanceToNow(review.timestamp, { addSuffix: true, locale: fr })}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-700 mb-3">
                      {review.comment}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-600">
                      <button className="flex items-center gap-1 hover:text-green-600">
                        <ThumbsUp className="h-3 w-3" />
                        Utile ({review.helpful})
                      </button>
                      <button className="flex items-center gap-1 hover:text-red-600">
                        <ThumbsDown className="h-3 w-3" />
                        Pas utile
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Community Reviews */}
      {communityReviews.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Évaluations de la communauté
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {communityReviews.map(review => (
              <div key={review.id} className="border rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {review.reviewerName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium">{review.reviewerName}</span>
                      <Badge variant="secondary" className="text-xs">Contributeur</Badge>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                      {renderStars(review.rating)}
                      <span className="text-sm text-gray-600">
                        {formatDistanceToNow(review.timestamp, { addSuffix: true, locale: fr })}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-700 mb-3">
                      {review.comment}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-600">
                      <button className="flex items-center gap-1 hover:text-green-600">
                        <ThumbsUp className="h-3 w-3" />
                        Utile ({review.helpful})
                      </button>
                      <button className="flex items-center gap-1 hover:text-red-600">
                        <ThumbsDown className="h-3 w-3" />
                        Pas utile
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Review Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle>Conseils pour une évaluation constructive</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2 text-green-600">À faire :</h4>
              <ul className="space-y-1 text-gray-700">
                <li>• Soyez spécifique dans vos commentaires</li>
                <li>• Évaluez l'exactitude des informations</li>
                <li>• Commentez la qualité des sources</li>
                <li>• Suggérez des améliorations</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2 text-red-600">À éviter :</h4>
              <ul className="space-y-1 text-gray-700">
                <li>• Commentaires personnels ou offensants</li>
                <li>• Évaluations basées sur des préférences</li>
                <li>• Critiques non constructives</li>
                <li>• Plagiat ou contenu inapproprié</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CollaborativeReview;
