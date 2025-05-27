
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, MessageCircle, Tag, MapPin, Calendar } from 'lucide-react';
import { CompleteContribution } from '@/types/contributions';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ContributionGridViewProps {
  contributions: CompleteContribution[];
  onViewDetail: (id: string) => void;
}

const ContributionGridView: React.FC<ContributionGridViewProps> = ({
  contributions,
  onViewDetail
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-300">En attente</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-50 text-green-800 border-green-300">Approuvée</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-800 border-red-300">Rejetée</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  if (contributions.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg bg-slate-50">
        <h3 className="text-lg font-medium mb-2">Aucune contribution trouvée</h3>
        <p className="text-muted-foreground">
          Aucune contribution ne correspond à vos critères de recherche.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {contributions.map((contribution) => (
        <Card key={contribution.id} className="hover:shadow-lg transition-all duration-300 group">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
                {contribution.title}
              </h3>
              {getStatusBadge(contribution.status)}
            </div>
          </CardHeader>
          
          <CardContent className="space-y-3">
            {/* Description */}
            {contribution.description && (
              <p className="text-sm text-muted-foreground line-clamp-3">
                {contribution.description}
              </p>
            )}

            {/* Cultural Context & Period */}
            <div className="flex flex-wrap gap-2">
              {contribution.cultural_context && (
                <Badge variant="secondary" className="text-xs">
                  {contribution.cultural_context}
                </Badge>
              )}
              {contribution.period && (
                <Badge variant="outline" className="text-xs">
                  {contribution.period}
                </Badge>
              )}
            </div>

            {/* Location */}
            {contribution.location_name && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span className="truncate">{contribution.location_name}</span>
              </div>
            )}

            {/* Tags */}
            {contribution.tags.length > 0 && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Tag className="h-4 w-4" />
                <div className="flex flex-wrap gap-1">
                  {contribution.tags.slice(0, 3).map((tag) => (
                    <span key={tag.id} className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {tag.tag}
                    </span>
                  ))}
                  {contribution.tags.length > 3 && (
                    <span className="text-xs text-muted-foreground">
                      +{contribution.tags.length - 3}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="flex items-center justify-between text-sm text-muted-foreground pt-2 border-t">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4" />
                  <span>{contribution.comments.length}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {formatDistanceToNow(new Date(contribution.created_at), {
                      addSuffix: true,
                      locale: fr
                    })}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => onViewDetail(contribution.id)}
            >
              <Eye className="h-4 w-4 mr-2" />
              Voir les détails
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default ContributionGridView;
