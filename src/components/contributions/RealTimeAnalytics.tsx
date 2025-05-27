
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, MapPin, Clock, Users, Target, Activity } from 'lucide-react';
import { CompleteContribution } from '@/types/contributions';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface RealTimeAnalyticsProps {
  contributions: CompleteContribution[];
}

interface AnalyticsData {
  totalSubmissions: number;
  submissionsToday: number;
  averageProcessingTime: number;
  topCultures: Array<{ culture: string; count: number }>;
  recentActivity: Array<{ type: string; timestamp: Date; details: string }>;
  approvalRate: number;
  trendingPeriods: Array<{ period: string; count: number }>;
  geographicDistribution: Array<{ region: string; count: number }>;
}

const RealTimeAnalytics: React.FC<RealTimeAnalyticsProps> = ({ contributions }) => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalSubmissions: 0,
    submissionsToday: 0,
    averageProcessingTime: 0,
    topCultures: [],
    recentActivity: [],
    approvalRate: 0,
    trendingPeriods: [],
    geographicDistribution: []
  });

  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    const calculateAnalytics = () => {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      // Basic metrics
      const totalSubmissions = contributions.length;
      const submissionsToday = contributions.filter(c => 
        new Date(c.created_at) >= today
      ).length;

      // Approval rate
      const approvedCount = contributions.filter(c => c.status === 'approved').length;
      const approvalRate = totalSubmissions > 0 ? (approvedCount / totalSubmissions) * 100 : 0;

      // Top cultures
      const cultureCount = contributions.reduce((acc, c) => {
        if (c.cultural_context) {
          acc[c.cultural_context] = (acc[c.cultural_context] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>);

      const topCultures = Object.entries(cultureCount)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([culture, count]) => ({ culture, count }));

      // Trending periods
      const periodCount = contributions.reduce((acc, c) => {
        if (c.period) {
          acc[c.period] = (acc[c.period] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>);

      const trendingPeriods = Object.entries(periodCount)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([period, count]) => ({ period, count }));

      // Recent activity simulation
      const recentActivity = contributions
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5)
        .map(c => ({
          type: c.status === 'approved' ? 'approval' : 'submission',
          timestamp: new Date(c.created_at),
          details: `${c.title} - ${c.cultural_context || 'Culture non spécifiée'}`
        }));

      // Geographic distribution (mock based on location names)
      const locationCount = contributions.reduce((acc, c) => {
        if (c.location_name) {
          const region = c.location_name.split(',')[0].trim();
          acc[region] = (acc[region] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>);

      const geographicDistribution = Object.entries(locationCount)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([region, count]) => ({ region, count }));

      setAnalytics({
        totalSubmissions,
        submissionsToday,
        averageProcessingTime: 2.5, // Mock average in days
        topCultures,
        recentActivity,
        approvalRate,
        trendingPeriods,
        geographicDistribution
      });

      setLastUpdate(new Date());
    };

    calculateAnalytics();

    // Auto-refresh every 30 seconds
    const interval = setInterval(calculateAnalytics, 30000);
    return () => clearInterval(interval);
  }, [contributions]);

  return (
    <div className="space-y-6">
      {/* Header with last update */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Analyse en temps réel</h2>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Activity className="h-4 w-4" />
          <span>Dernière mise à jour: {formatDistanceToNow(lastUpdate, { addSuffix: true, locale: fr })}</span>
        </div>
      </div>

      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total des soumissions</p>
                <p className="text-2xl font-bold">{analytics.totalSubmissions}</p>
              </div>
              <div className="p-2 bg-blue-50 rounded-lg">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Aujourd'hui</p>
                <p className="text-2xl font-bold text-green-600">{analytics.submissionsToday}</p>
              </div>
              <div className="p-2 bg-green-50 rounded-lg">
                <Clock className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Taux d'approbation</p>
                <p className="text-2xl font-bold">{analytics.approvalRate.toFixed(1)}%</p>
              </div>
              <div className="p-2 bg-purple-50 rounded-lg">
                <Target className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Temps de traitement moyen</p>
                <p className="text-2xl font-bold">{analytics.averageProcessingTime}j</p>
              </div>
              <div className="p-2 bg-orange-50 rounded-lg">
                <Users className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Cultures */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Cultures les plus représentées
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {analytics.topCultures.map((item, index) => (
              <div key={item.culture} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{item.culture}</span>
                  <Badge variant="secondary">{item.count}</Badge>
                </div>
                <Progress 
                  value={(item.count / analytics.totalSubmissions) * 100} 
                  className="h-2"
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Activité récente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-2 rounded-lg bg-slate-50">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'approval' ? 'bg-green-500' : 'bg-blue-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.details}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(activity.timestamp, { addSuffix: true, locale: fr })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Trending Periods */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Périodes tendances
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {analytics.trendingPeriods.map((item, index) => (
              <div key={item.period} className="flex items-center justify-between">
                <span className="text-sm">{item.period}</span>
                <Badge variant="outline">{item.count} contributions</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Geographic Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Distribution géographique
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {analytics.geographicDistribution.map((item, index) => (
              <div key={item.region} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{item.region}</span>
                  <Badge variant="secondary">{item.count}</Badge>
                </div>
                <Progress 
                  value={(item.count / analytics.totalSubmissions) * 100} 
                  className="h-2"
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RealTimeAnalytics;
