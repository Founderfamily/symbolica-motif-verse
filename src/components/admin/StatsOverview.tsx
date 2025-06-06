
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
  <Card>
    <CardContent className="p-6">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h4 className="text-2xl font-bold mt-1">
            {loading ? (
              <div className="h-7 w-16 bg-slate-200 animate-pulse rounded"></div>
            ) : value}
          </h4>
          {description && <p className="text-xs text-slate-500 mt-1">{description}</p>}
        </div>
        <div className={`p-2 rounded-md bg-opacity-15 ${color}`}>
          <Icon className={`h-5 w-5 ${color.replace('bg-', 'text-')}`} />
        </div>
      </div>
    </CardContent>
  </Card>
);

export default function StatsOverview({ stats, loading }: StatsOverviewProps) {
  const { t } = useTranslation();
  
  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat().format(num);
  };
  
  // Safe access with default values
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
  
  // Calculate activity rate (active users / total users)
  const activityRate = totalUsers > 0 
    ? `${((activeUsersLast30Days / totalUsers) * 100).toFixed(1)}%` 
    : '0%';
  
  // Calculate approval rate for contributions
  const approvalRate = totalContributions > 0 
    ? `${((approvedContributions / totalContributions) * 100).toFixed(1)}%` 
    : '0%';
  
  // Calculate verification rate for symbol locations (fix: use locations, not symbols)
  const verificationRate = totalSymbolLocations > 0 
    ? `${((verifiedSymbols / totalSymbolLocations) * 100).toFixed(1)}%` 
    : '0%';

  // Get last contribution date from real data
  const getLastContributionDate = (): string => {
    if (contributionsOverTime.length === 0) {
      return t('admin.stats.noRecentActivity');
    }
    
    const lastEntry = contributionsOverTime
      .slice()
      .reverse()
      .find(entry => entry.count > 0);
    
    if (!lastEntry) {
      return t('admin.stats.noRecentActivity');
    }
    
    return new Date(lastEntry.date).toLocaleDateString();
  };
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <StatCard
        icon={Users}
        title={t('admin.stats.totalUsers')}
        value={loading ? '' : formatNumber(totalUsers)}
        description={t('admin.stats.activeUsers', { count: activeUsersLast30Days, rate: activityRate })}
        loading={loading}
        color="bg-blue-500"
      />
      
      <StatCard
        icon={FileText}
        title={t('admin.stats.totalContributions')}
        value={loading ? '' : formatNumber(totalContributions)}
        description={t('admin.stats.pendingContributions', { count: pendingContributions, rate: approvalRate })}
        loading={loading}
        color="bg-amber-500"
      />
      
      <StatCard
        icon={Bookmark}
        title={t('admin.stats.totalSymbols')}
        value={loading ? '' : formatNumber(totalSymbols)}
        loading={loading}
        color="bg-emerald-500"
      />
      
      <StatCard
        icon={Map}
        title={t('admin.stats.symbolLocations')}
        value={loading ? '' : formatNumber(totalSymbolLocations)}
        description={t('admin.stats.verifiedLocations', { count: verifiedSymbols, rate: verificationRate })}
        loading={loading}
        color="bg-violet-500"
      />
      
      <StatCard
        icon={Award}
        title={t('admin.stats.topContributor')}
        value={loading || topContributors.length === 0 ? '' : 
          (topContributors[0].fullName || topContributors[0].username || 'Unknown')}
        description={topContributors.length > 0 ? 
          t('admin.stats.contributorStats', { 
            contributions: topContributors[0].contributionsCount, 
            points: topContributors[0].pointsTotal 
          }) : ''}
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
