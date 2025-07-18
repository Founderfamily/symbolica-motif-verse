
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, FileText, Map, Award, Bookmark, Clock, CheckCircle } from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';
import { useTranslation } from '@/i18n/useTranslation';
import { AdminStats } from '@/services/admin/statsService';

interface StatsOverviewProps {
  stats: AdminStats;
  loading: boolean;
}

const StatCard = ({ 
  icon: Icon, 
  title, 
  value, 
  description, 
  loading, 
  color 
}: { 
  icon: React.ElementType; 
  title: string; 
  value: string | number; 
  description?: string; 
  loading: boolean;
  color: string;
}) => (
  <Card className="hover:shadow-md transition-shadow duration-200">
    <CardContent className="p-6">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
          <h4 className="text-2xl font-bold">
            {loading ? (
              <div className="h-7 w-16 bg-slate-200 animate-pulse rounded"></div>
            ) : (
              <span className="text-slate-900">{value}</span>
            )}
          </h4>
          {description && !loading && (
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">{description}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
          <Icon className={`h-5 w-5 ${color.replace('bg-', 'text-')}`} />
        </div>
      </div>
    </CardContent>
  </Card>
);

export default function StatsOverview({ stats, loading }: StatsOverviewProps) {
  const { t } = useTranslation();
  
  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('fr-FR').format(num);
  };
  
  const formatPercentage = (value: number, total: number): string => {
    if (total === 0) return '0%';
    return `${((value / total) * 100).toFixed(1)}%`;
  };
  
  // Calculs des taux corrigés
  const activityRate = formatPercentage(stats.activeUsersLast30Days, stats.totalUsers);
  const approvalRate = formatPercentage(stats.approvedContributions, stats.totalContributions);
  const locationVerificationRate = formatPercentage(stats.verifiedSymbolLocations, stats.totalSymbolLocations);

  // Obtenir le meilleur contributeur
  const topContributor = stats.topContributors?.[0];
  
  // Obtenir la date de la dernière contribution
  const getLastContributionDate = (): string => {
    if (!stats.contributionsOverTime || stats.contributionsOverTime.length === 0) {
      return 'Aucune activité récente';
    }
    
    const sortedEntries = stats.contributionsOverTime
      .filter(entry => entry.count > 0)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    if (sortedEntries.length === 0) {
      return 'Aucune activité récente';
    }
    
    return new Date(sortedEntries[0].date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <StatCard
        icon={Users}
        title="Utilisateurs totaux"
        value={loading ? '' : formatNumber(stats.totalUsers)}
        description={`${formatNumber(stats.activeUsersLast30Days)} actifs (${activityRate})`}
        loading={loading}
        color="bg-blue-500"
      />
      
      <StatCard
        icon={FileText}
        title="Contributions"
        value={loading ? '' : formatNumber(stats.totalContributions)}
        description={`${formatNumber(stats.pendingContributions)} en attente • ${approvalRate} approuvées`}
        loading={loading}
        color="bg-amber-500"
      />
      
      <StatCard
        icon={Bookmark}
        title="Symboles"
        value={loading ? '' : formatNumber(stats.totalSymbols)}
        description={`${formatNumber(stats.verifiedSymbols)} dans la base`}
        loading={loading}
        color="bg-emerald-500"
      />
      
      <StatCard
        icon={Map}
        title="Emplacements géographiques"
        value={loading ? '' : formatNumber(stats.totalSymbolLocations)}
        description={`${formatNumber(stats.verifiedSymbolLocations)} vérifiés (${locationVerificationRate})`}
        loading={loading}
        color="bg-violet-500"
      />
      
      <StatCard
        icon={Award}
        title="Top contributeur"
        value={loading || !topContributor ? 
          'Aucun contributeur' : 
          (topContributor.fullName || topContributor.username)}
        description={topContributor ? 
          `${formatNumber(topContributor.contributionsCount)} contributions • ${formatNumber(topContributor.pointsTotal)} points` : undefined}
        loading={loading}
        color="bg-pink-500"
      />
      
      <StatCard
        icon={Clock}
        title="Dernière contribution"
        value={loading ? '' : getLastContributionDate()}
        loading={loading}
        color="bg-orange-500"
      />
    </div>
  );
}
