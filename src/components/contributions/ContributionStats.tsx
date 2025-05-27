
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, Award, Eye, Heart, MessageCircle } from 'lucide-react';
import { CompleteContribution } from '@/types/contributions';

interface ContributionStatsProps {
  contributions: CompleteContribution[];
}

const ContributionStats: React.FC<ContributionStatsProps> = ({ contributions }) => {
  const totalContributions = contributions.length;
  const approvedContributions = contributions.filter(c => c.status === 'approved').length;
  const pendingContributions = contributions.filter(c => c.status === 'pending').length;
  const rejectedContributions = contributions.filter(c => c.status === 'rejected').length;
  
  const totalComments = contributions.reduce((sum, c) => sum + c.comments.length, 0);
  const totalTags = contributions.reduce((sum, c) => sum + c.tags.length, 0);
  const uniqueCultures = new Set(contributions.map(c => c.cultural_context)).size;

  const approvalRate = totalContributions > 0 ? Math.round((approvedContributions / totalContributions) * 100) : 0;

  const stats = [
    {
      title: 'Total des contributions',
      value: totalContributions,
      icon: <TrendingUp className="h-5 w-5" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Taux d\'approbation',
      value: `${approvalRate}%`,
      icon: <Award className="h-5 w-5" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Cultures représentées',
      value: uniqueCultures,
      icon: <Users className="h-5 w-5" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Commentaires reçus',
      value: totalComments,
      icon: <MessageCircle className="h-5 w-5" />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="transition-all hover:shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <div className={stat.color}>
                    {stat.icon}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Répartition par statut</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-green-50 text-green-800 border-green-300">
                Approuvées: {approvedContributions}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-300">
                En attente: {pendingContributions}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-red-50 text-red-800 border-red-300">
                Rejetées: {rejectedContributions}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContributionStats;
