import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, MessageSquare, Star, Calendar, User, Tag, MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { CompleteContribution } from '@/types/contributions';
import { getPendingContributions } from '@/services/contributionService';

const ValidatorDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [contributions, setContributions] = useState<CompleteContribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContribution, setSelectedContribution] = useState<CompleteContribution | null>(null);

  useEffect(() => {
    loadPendingContributions();
  }, []);

  const loadPendingContributions = async () => {
    try {
      setLoading(true);
      const data = await getPendingContributions();
      setContributions(data);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les contributions",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const validateContribution = async (contributionId: string, action: 'approve' | 'reject', score?: number, comments?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('user_contributions')
        .update({
          status: action === 'approve' ? 'approved' : 'rejected',
          validator_id: user.id,
          validator_comments: comments,
          validation_score: score,
          reviewed_at: new Date().toISOString(),
          reviewed_by: user.id
        })
        .eq('id', contributionId);

      if (error) throw error;

      toast({
        title: action === 'approve' ? "Contribution approuvée" : "Contribution rejetée",
        description: "L'action a été enregistrée avec succès"
      });

      loadPendingContributions();
      setSelectedContribution(null);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const ContributionCard = ({ contribution }: { contribution: CompleteContribution }) => (
    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedContribution(contribution)}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{contribution.title}</CardTitle>
            <CardDescription className="flex items-center gap-2 mt-2">
              <User className="w-4 h-4" />
              {contribution.user_profile?.username || 'Utilisateur anonyme'}
              <Calendar className="w-4 h-4 ml-2" />
              {new Date(contribution.created_at).toLocaleDateString()}
            </CardDescription>
          </div>
          <Badge variant="secondary">
            {contribution.community_score ? `${contribution.community_score}/5` : 'Nouveau'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Tag className="w-4 h-4" />
            <span>{contribution.cultural_context}</span>
            {contribution.period && (
              <>
                <span>•</span>
                <span>{contribution.period}</span>
              </>
            )}
          </div>
          
          {contribution.location_name && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>{contribution.location_name}</span>
            </div>
          )}
          
          <p className="text-sm line-clamp-3">{contribution.description}</p>
          
          {contribution.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {contribution.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag.tag}
                </Badge>
              ))}
              {contribution.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{contribution.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const ContributionDetails = ({ contribution }: { contribution: CompleteContribution }) => {
    const [score, setScore] = useState(5);
    const [comments, setComments] = useState('');

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold">{contribution.title}</h2>
            <p className="text-muted-foreground">
              Proposé par {contribution.user_profile?.username} le {new Date(contribution.created_at).toLocaleDateString()}
            </p>
          </div>
          <Button variant="outline" onClick={() => setSelectedContribution(null)}>
            Retour à la liste
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Image */}
          {contribution.images.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Image</CardTitle>
              </CardHeader>
              <CardContent>
                <img
                  src={contribution.images[0].image_url}
                  alt={contribution.title}
                  className="w-full h-64 object-contain rounded border"
                />
              </CardContent>
            </Card>
          )}

          {/* Informations */}
          <Card>
            <CardHeader>
              <CardTitle>Informations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <strong>Culture :</strong> {contribution.cultural_context}
              </div>
              {contribution.period && (
                <div>
                  <strong>Période :</strong> {contribution.period}
                </div>
              )}
              {contribution.location_name && (
                <div>
                  <strong>Localisation :</strong> {contribution.location_name}
                </div>
              )}
              {contribution.tags.length > 0 && (
                <div>
                  <strong>Tags :</strong>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {contribution.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">
                        {tag.tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Description */}
        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{contribution.description}</p>
          </CardContent>
        </Card>

        {/* Signification */}
        {contribution.significance && (
          <Card>
            <CardHeader>
              <CardTitle>Signification</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{contribution.significance}</p>
            </CardContent>
          </Card>
        )}

        {/* Contexte historique */}
        {contribution.historical_context && (
          <Card>
            <CardHeader>
              <CardTitle>Contexte historique</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{contribution.historical_context}</p>
            </CardContent>
          </Card>
        )}

        {/* Sources */}
        {contribution.sources && contribution.sources.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {contribution.sources.map((source: any, index: number) => (
                  <div key={index} className="p-3 border rounded">
                    <div className="font-medium">{source.title}</div>
                    <div className="text-sm text-muted-foreground">{source.url}</div>
                    <Badge variant="outline" className="mt-1">{source.type}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Validation */}
        <Card>
          <CardHeader>
            <CardTitle>Validation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Score de qualité (1-5)
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((num) => (
                  <Button
                    key={num}
                    type="button"
                    variant={score === num ? "default" : "outline"}
                    size="sm"
                    onClick={() => setScore(num)}
                    className="w-10"
                  >
                    {num}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Commentaires (optionnel)
              </label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="w-full p-2 border rounded-md"
                rows={3}
                placeholder="Commentaires pour le contributeur..."
              />
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => validateContribution(contribution.id, 'approve', score, comments)}
                className="flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Approuver
              </Button>
              
              <Button
                variant="destructive"
                onClick={() => validateContribution(contribution.id, 'reject', score, comments)}
                className="flex items-center gap-2"
              >
                <XCircle className="w-4 h-4" />
                Rejeter
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Dashboard Validateur</h1>
          <p className="text-muted-foreground">
            Examinez et validez les propositions de symboles de la communauté
          </p>
        </div>

        {selectedContribution ? (
          <ContributionDetails contribution={selectedContribution} />
        ) : (
          <Tabs defaultValue="pending" className="space-y-6">
            <TabsList>
              <TabsTrigger value="pending">
                En attente ({contributions.length})
              </TabsTrigger>
              <TabsTrigger value="stats">Statistiques</TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="space-y-4">
              {loading ? (
                <div className="text-center py-8">Chargement...</div>
              ) : contributions.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-muted-foreground">Aucune contribution en attente</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {contributions.map((contribution) => (
                    <ContributionCard key={contribution.id} contribution={contribution} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="stats">
              <Card>
                <CardHeader>
                  <CardTitle>Statistiques de validation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 border rounded">
                      <div className="text-2xl font-bold text-green-600">{contributions.length}</div>
                      <div className="text-sm text-muted-foreground">En attente</div>
                    </div>
                    <div className="text-center p-4 border rounded">
                      <div className="text-2xl font-bold text-blue-600">-</div>
                      <div className="text-sm text-muted-foreground">Validées ce mois</div>
                    </div>
                    <div className="text-center p-4 border rounded">
                      <div className="text-2xl font-bold text-orange-600">-</div>
                      <div className="text-sm text-muted-foreground">Score moyen</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default ValidatorDashboard;