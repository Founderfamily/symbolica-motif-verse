
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, FileText, Map, Award, Bookmark, Clock } from 'lucide-react';
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
  
  // Accès sécurisé avec valeurs par défaut
  const totalUsers = stats?.totalUsers || 0;
  const activeUsersLast30Days = stats?.activeUsersLast30Days || 0;
  const totalContributions = stats?.totalContributions || 0;
  const pendingContributions = stats?.pendingContributions || 0;
  const approvedContributions = stats?.approvedContributions || 0;
  const totalSymbols = stats?.totalSymbols || 0;
  const verifiedSymbols = stats?.verifiedSymbols || 0;
  const totalSymbolLocations = stats?.totalSymbolLocations || 0;
  const topContributors = stats?.topContributors || [];
  const contributionsOverTime = stats?.contributionsOverTime || [];
  
  // Calculs corrigés des taux
  const activityRate = formatPercentage(activeUsersLast30Days, totalUsers);
  const approvalRate = formatPercentage(approvedContributions, totalContributions);
  const verificationRate = formatPercentage(verifiedSymbols, totalSymbolLocations);

  // Obtenir la date de la dernière contribution depuis les vraies données
  const getLastContributionDate = (): string => {
    if (contributionsOverTime.length === 0) {
      return t('admin.stats.noRecentActivity');
    }
    
    // Trouver la dernière entrée avec des contributions
    const sortedEntries = contributionsOverTime
      .filter(entry => entry.count > 0)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    if (sortedEntries.length === 0) {
      return t('admin.stats.noRecentActivity');
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
        title={t('admin.stats.totalUsers')}
        value={loading ? '' : formatNumber(totalUsers)}
        description={t('admin.stats.activeUsers', { 
          count: formatNumber(activeUsersLast30Days), 
          rate: activityRate 
        })}
        loading={loading}
        color="bg-blue-500"
      />
      
      <StatCard
        icon={FileText}
        title={t('admin.stats.totalContributions')}
        value={loading ? '' : formatNumber(totalContributions)}
        description={t('admin.stats.pendingContributions', { 
          count: formatNumber(pendingContributions), 
          rate: approvalRate 
        })}
        loading={loading}
        color="bg-amber-500"
      />
      
      <StatCard
        icon={Bookmark}
        title={t('admin.stats.totalSymbols')}
        value={loading ? '' : formatNumber(totalSymbols)}
        description={`${formatNumber(verifiedSymbols)} vérifiés`}
        loading={loading}
        color="bg-emerald-500"
      />
      
      <StatCard
        icon={Map}
        title={t('admin.stats.symbolLocations')}
        value={loading ? '' : formatNumber(totalSymbolLocations)}
        description={t('admin.stats.verifiedLocations', { 
          count: formatNumber(verifiedSymbols), 
          rate: verificationRate 
        })}
        loading={loading}
        color="bg-violet-500"
      />
      
      <StatCard
        icon={Award}
        title={t('admin.stats.topContributor')}
        value={loading || topContributors.length === 0 ? 
          t('admin.stats.noRecentActivity') : 
          (topContributors[0].fullName || topContributors[0].username || 'Utilisateur inconnu')}
        description={topContributors.length > 0 ? 
          t('admin.stats.contributorStats', { 
            contributions: formatNumber(topContributors[0].contributionsCount), 
            points: formatNumber(topContributors[0].pointsTotal)
          }) : undefined}
        loading={loading}
        color="bg-pink-500"
      />
      
      <StatCard
        icon={Clock}
        title={t('admin.stats.lastContribution')}
        value={loading ? '' : getLastContributionDate()}
        loading={loading}
        color="bg-orange-500"
      />
    </div>
  );
}
