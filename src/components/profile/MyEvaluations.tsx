
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Calendar, CheckCircle, XCircle, AlertTriangle, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { I18nText } from '@/components/ui/i18n-text';
import { Link } from 'react-router-dom';

interface Evaluation {
  id: string;
  symbol_id: string;
  comment: string;
  verification_rating: 'verified' | 'disputed' | 'unverified';
  expertise_level: string;
  created_at: string;
  symbols?: {
    name: string;
    culture: string;
    period: string;
  };
}

interface MyEvaluationsProps {
  userId?: string;
}

const MyEvaluations: React.FC<MyEvaluationsProps> = ({ userId }) => {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      loadEvaluations();
    }
  }, [userId]);

  const loadEvaluations = async () => {
    if (!userId) return;

    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('symbol_verification_community')
        .select(`
          id,
          symbol_id,
          comment,
          verification_rating,
          expertise_level,
          created_at,
          symbols (
            name,
            culture,
            period
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erreur lors du chargement des évaluations:', error);
        return;
      }

      setEvaluations(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des évaluations:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'disputed':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'unverified':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <XCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'disputed':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'unverified':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'verified':
        return 'Vérifié';
      case 'disputed':
        return 'Contesté';
      case 'unverified':
        return 'Non vérifié';
      default:
        return 'Inconnu';
    }
  };

  const getExpertiseText = (level: string) => {
    switch (level) {
      case 'admin':
        return 'Administrateur';
      case 'expert':
        return 'Expert';
      case 'community':
        return 'Communauté';
      default:
        return level;
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (evaluations.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            <I18nText translationKey="profile.evaluations.noEvaluations">
              Aucune évaluation
            </I18nText>
          </h3>
          <p className="text-gray-600">
            <I18nText translationKey="profile.evaluations.noEvaluationsDescription">
              Vous n'avez pas encore posté d'évaluations de symboles.
            </I18nText>
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          <I18nText translationKey="profile.evaluations.title">
            Mes Évaluations ({evaluations.length})
          </I18nText>
        </h3>
      </div>

      {evaluations.map((evaluation) => (
        <Card key={evaluation.id}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {getStatusIcon(evaluation.verification_rating)}
                <span className="text-base">
                  {evaluation.symbols?.name || 'Symbole inconnu'}
                </span>
                <Badge className={getStatusColor(evaluation.verification_rating)}>
                  {getStatusText(evaluation.verification_rating)}
                </Badge>
              </div>
              <Link to={`/symbols/${evaluation.symbol_id}`}>
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Voir
                </Button>
              </Link>
            </CardTitle>
            {evaluation.symbols && (
              <div className="text-sm text-gray-600">
                {evaluation.symbols.culture} • {evaluation.symbols.period}
              </div>
            )}
          </CardHeader>

          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">
                <I18nText translationKey="profile.evaluations.comment">
                  Commentaire:
                </I18nText>
              </p>
              <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-blue-300">
                <p className="text-gray-800">{evaluation.comment}</p>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(evaluation.created_at).toLocaleDateString('fr-FR')}</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {getExpertiseText(evaluation.expertise_level)}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MyEvaluations;
