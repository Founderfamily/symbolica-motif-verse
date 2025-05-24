
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, TooltipProps } from 'recharts';
import { I18nText } from '@/components/ui/i18n-text';
import { useTranslation } from '@/i18n/useTranslation';
import { AdminStats, TimeSeriesPoint } from '@/services/admin/statsService';

interface AnalyticsChartsProps {
  stats: AdminStats;
  loading: boolean;
}

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border shadow-sm rounded-md">
        <p className="text-sm font-medium">{label}</p>
        {payload.map((entry, index) => (
          <p key={`item-${index}`} style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  
  return null;
};

// Helper to prepare data for charts combining multiple data sources
const prepareChartData = (
  userRegistrations: TimeSeriesPoint[] = [], 
  contributions: TimeSeriesPoint[] = []
): any[] => {
  const combinedData = new Map<string, any>();
  
  // Add user registrations data - with null check
  if (userRegistrations && Array.isArray(userRegistrations)) {
    userRegistrations.forEach(point => {
      combinedData.set(point.date, {
        date: point.date,
        registrations: point.count
      });
    });
  }
  
  // Add contributions data - with null check
  if (contributions && Array.isArray(contributions)) {
    contributions.forEach(point => {
      const existing = combinedData.get(point.date) || { date: point.date, registrations: 0 };
      combinedData.set(point.date, {
        ...existing,
        contributions: point.count
      });
    });
  }
  
  // Convert map to array and sort by date
  return Array.from(combinedData.values())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

export default function AnalyticsCharts({ stats, loading }: AnalyticsChartsProps) {
  const { t } = useTranslation();
  
  // Prepare data for the combination chart with safe defaults
  const activityData = prepareChartData(
    stats?.userRegistrationsOverTime || [], 
    stats?.contributionsOverTime || []
  );
  
  // Prepare data for the top contributors chart with safe defaults
  const contributorsData = (stats?.topContributors || [])
    .slice(0, 5)
    .map(contributor => ({
      name: contributor.fullName || contributor.username || 'Anonymous',
      points: contributor.pointsTotal,
      contributions: contributor.contributionsCount
    }));
  
  // Format date for X-axis to show only every 7th date
  const formatXAxis = (dateStr: string) => {
    const date = new Date(dateStr);
    // Only show every 7th date to avoid overcrowding
    if (date.getDate() % 7 === 0) {
      return `${date.getDate()}/${date.getMonth() + 1}`;
    }
    return '';
  };
  
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="col-span-2">
        <CardHeader className="pb-0">
          <CardTitle className="text-base">
            <I18nText translationKey="admin.charts.activityOverTime">
              Activité au cours des 60 derniers jours
            </I18nText>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-80 w-full bg-slate-50 animate-pulse rounded"></div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart
                data={activityData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorRegistrations" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorContributions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatXAxis} 
                  tick={{ fontSize: 12 }}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="registrations" 
                  name={t('admin.charts.newUsers')}
                  stroke="#8884d8" 
                  fillOpacity={1} 
                  fill="url(#colorRegistrations)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="contributions" 
                  name={t('admin.charts.newContributions')}
                  stroke="#82ca9d" 
                  fillOpacity={1} 
                  fill="url(#colorContributions)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-0">
          <CardTitle className="text-base">
            <I18nText translationKey="admin.charts.topContributors">
              Top 5 des contributeurs
            </I18nText>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-80 w-full bg-slate-50 animate-pulse rounded"></div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={contributorsData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 10 }}
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={70}
                />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar 
                  yAxisId="left" 
                  dataKey="points" 
                  name={t('admin.charts.points')} 
                  fill="#8884d8" 
                />
                <Bar 
                  yAxisId="right" 
                  dataKey="contributions" 
                  name={t('admin.charts.contributions')} 
                  fill="#82ca9d" 
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
