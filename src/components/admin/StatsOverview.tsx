
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
  
  const calculateGrowthRate = (current: number, previous: number): string => {
    if (previous === 0) return '0%';
    const growth = ((current - previous) / previous) * 100;
    return `${growth > 0 ? '+' : ''}${growth.toFixed(1)}%`;
  };
  
  // Calculate activity rate (active users / total users)
  const activityRate = stats.totalUsers > 0 
    ? `${((stats.activeUsersLast30Days / stats.totalUsers) * 100).toFixed(1)}%` 
    : '0%';
  
  // Calculate approval rate for contributions
  const approvedContributions = stats.totalContributions - stats.pendingContributions;
  const approvalRate = stats.totalContributions > 0 
    ? `${((approvedContributions / stats.totalContributions) * 100).toFixed(1)}%` 
    : '0%';
  
  // Calculate verification rate for symbols
  const verificationRate = stats.totalSymbolLocations > 0 
    ? `${((stats.verifiedSymbols / stats.totalSymbolLocations) * 100).toFixed(1)}%` 
    : '0%';
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <StatCard
        icon={Users}
        title={t('admin.stats.totalUsers')}
        value={loading ? '' : formatNumber(stats.totalUsers)}
        description={t('admin.stats.activeUsers', { count: stats.activeUsersLast30Days, rate: activityRate })}
        loading={loading}
        color="bg-blue-500"
      />
      
      <StatCard
        icon={FileText}
        title={t('admin.stats.totalContributions')}
        value={loading ? '' : formatNumber(stats.totalContributions)}
        description={t('admin.stats.pendingContributions', { count: stats.pendingContributions, rate: approvalRate })}
        loading={loading}
        color="bg-amber-500"
      />
      
      <StatCard
        icon={Bookmark}
        title={t('admin.stats.totalSymbols')}
        value={loading ? '' : formatNumber(stats.totalSymbols)}
        loading={loading}
        color="bg-emerald-500"
      />
      
      <StatCard
        icon={Map}
        title={t('admin.stats.symbolLocations')}
        value={loading ? '' : formatNumber(stats.totalSymbolLocations)}
        description={t('admin.stats.verifiedLocations', { count: stats.verifiedSymbols, rate: verificationRate })}
        loading={loading}
        color="bg-violet-500"
      />
      
      <StatCard
        icon={Award}
        title={t('admin.stats.topContributor')}
        value={loading || !stats.topContributors.length ? '' : 
          (stats.topContributors[0].fullName || stats.topContributors[0].username || 'Unknown')}
        description={stats.topContributors.length > 0 ? 
          t('admin.stats.contributorStats', { 
            contributions: stats.topContributors[0].contributionsCount, 
            points: stats.topContributors[0].pointsTotal 
          }) : ''}
        loading={loading}
        color="bg-pink-500"
      />
      
      <StatCard
        icon={Clock}
        title={t('admin.stats.lastContribution')}
        value={loading ? '' : (
          stats.contributionsOverTime.length > 0 && 
          stats.contributionsOverTime.some(p => p.count > 0) ? 
            new Date(
              stats.contributionsOverTime
                .slice()
                .reverse()
                .find(p => p.count > 0)?.date || ''
            ).toLocaleDateString() : 
            t('admin.stats.noRecentActivity')
        )}
        loading={loading}
        color="bg-orange-500"
      />
    </div>
  );
}
