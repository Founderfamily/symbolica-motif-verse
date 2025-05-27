
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, 
  PolarRadiusAxis, Radar, Treemap
} from 'recharts';
import { 
  Activity, TrendingUp, Users, Globe, Clock, 
  Zap, AlertTriangle, CheckCircle, Database
} from 'lucide-react';

interface RealTimeMetrics {
  active_analyses: number;
  symbols_processed: number;
  ai_confidence_avg: number;
  cultural_discoveries: number;
  system_performance: {
    cpu_usage: number;
    memory_usage: number;
    gpu_usage: number;
    network_latency: number;
  };
  user_activity: {
    concurrent_users: number;
    analyses_per_minute: number;
    collaboration_sessions: number;
  };
}

interface AnalysisStream {
  id: string;
  timestamp: Date;
  type: 'pattern_recognition' | 'cultural_analysis' | 'temporal_evolution' | 'comparison';
  status: 'processing' | 'completed' | 'failed';
  confidence: number;
  processing_time: number;
  user_id: string;
  symbol_ids: string[];
}

interface CulturalTrend {
  culture: string;
  trend_direction: 'rising' | 'stable' | 'declining';
  analysis_count: number;
  avg_complexity: number;
  geographic_spread: number;
  temporal_range: string;
}

const RealTimeAnalytics: React.FC = () => {
  const [metrics, setMetrics] = useState<RealTimeMetrics>({
    active_analyses: 0,
    symbols_processed: 0,
    ai_confidence_avg: 0,
    cultural_discoveries: 0,
    system_performance: {
      cpu_usage: 0,
      memory_usage: 0,
      gpu_usage: 0,
      network_latency: 0
    },
    user_activity: {
      concurrent_users: 0,
      analyses_per_minute: 0,
      collaboration_sessions: 0
    }
  });

  const [analysisStream, setAnalysisStream] = useState<AnalysisStream[]>([]);
  const [culturalTrends, setCulturalTrends] = useState<CulturalTrend[]>([]);
  const [alertsCount, setAlertsCount] = useState(0);
  const [isMonitoring, setIsMonitoring] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isMonitoring) {
        updateRealTimeMetrics();
        updateAnalysisStream();
        updateCulturalTrends();
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isMonitoring]);

  const updateRealTimeMetrics = () => {
    setMetrics(prev => ({
      active_analyses: Math.floor(Math.random() * 25) + 5,
      symbols_processed: prev.symbols_processed + Math.floor(Math.random() * 3),
      ai_confidence_avg: 0.75 + Math.random() * 0.2,
      cultural_discoveries: prev.cultural_discoveries + (Math.random() > 0.9 ? 1 : 0),
      system_performance: {
        cpu_usage: 30 + Math.random() * 40,
        memory_usage: 45 + Math.random() * 35,
        gpu_usage: 20 + Math.random() * 60,
        network_latency: 10 + Math.random() * 20
      },
      user_activity: {
        concurrent_users: 15 + Math.floor(Math.random() * 10),
        analyses_per_minute: 8 + Math.floor(Math.random() * 12),
        collaboration_sessions: 3 + Math.floor(Math.random() * 5)
      }
    }));
  };

  const updateAnalysisStream = () => {
    if (Math.random() > 0.7) {
      const newAnalysis: AnalysisStream = {
        id: `analysis_${Date.now()}`,
        timestamp: new Date(),
        type: ['pattern_recognition', 'cultural_analysis', 'temporal_evolution', 'comparison'][
          Math.floor(Math.random() * 4)
        ] as any,
        status: Math.random() > 0.1 ? 'completed' : 'processing',
        confidence: 0.6 + Math.random() * 0.4,
        processing_time: 500 + Math.random() * 3000,
        user_id: `user_${Math.floor(Math.random() * 100)}`,
        symbol_ids: [`symbol_${Math.floor(Math.random() * 1000)}`]
      };

      setAnalysisStream(prev => [newAnalysis, ...prev.slice(0, 9)]);
    }
  };

  const updateCulturalTrends = () => {
    setCulturalTrends([
      {
        culture: 'Celtic',
        trend_direction: 'rising',
        analysis_count: 156 + Math.floor(Math.random() * 10),
        avg_complexity: 0.78,
        geographic_spread: 85,
        temporal_range: '500 BCE - 1200 CE'
      },
      {
        culture: 'Norse',
        trend_direction: 'rising',
        analysis_count: 134 + Math.floor(Math.random() * 8),
        avg_complexity: 0.72,
        geographic_spread: 92,
        temporal_range: '700 - 1100 CE'
      },
      {
        culture: 'Roman',
        trend_direction: 'stable',
        analysis_count: 289 + Math.floor(Math.random() * 15),
        avg_complexity: 0.85,
        geographic_spread: 98,
        temporal_range: '753 BCE - 476 CE'
      },
      {
        culture: 'Greek',
        trend_direction: 'stable',
        analysis_count: 198 + Math.floor(Math.random() * 12),
        avg_complexity: 0.89,
        geographic_spread: 76,
        temporal_range: '800 BCE - 600 CE'
      }
    ]);
  };

  const performanceData = [
    { time: '00:00', cpu: 45, memory: 62, gpu: 38 },
    { time: '00:05', cpu: 52, memory: 58, gpu: 45 },
    { time: '00:10', cpu: 48, memory: 65, gpu: 52 },
    { time: '00:15', cpu: 55, memory: 61, gpu: 48 },
    { time: '00:20', cpu: metrics.system_performance.cpu_usage, memory: metrics.system_performance.memory_usage, gpu: metrics.system_performance.gpu_usage }
  ];

  const activityData = [
    { hour: '00h', analyses: 12, users: 8 },
    { hour: '04h', analyses: 6, users: 4 },
    { hour: '08h', analyses: 28, users: 18 },
    { hour: '12h', analyses: 45, users: 32 },
    { hour: '16h', analyses: 38, users: 28 },
    { hour: '20h', analyses: 22, users: 16 }
  ];

  const getStatusIcon = (status: AnalysisStream['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'processing': return <Activity className="h-4 w-4 text-blue-500 animate-pulse" />;
      case 'failed': return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
  };

  const getTrendIcon = (direction: CulturalTrend['trend_direction']) => {
    switch (direction) {
      case 'rising': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'stable': return <Activity className="h-4 w-4 text-blue-500" />;
      case 'declining': return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Status Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Analytics Temps Réel</h2>
          <p className="text-muted-foreground">
            Surveillance en direct des analyses et performances système
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant={isMonitoring ? 'default' : 'secondary'} className="animate-pulse">
            <Activity className="h-3 w-3 mr-1" />
            {isMonitoring ? 'EN DIRECT' : 'PAUSED'}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsMonitoring(!isMonitoring)}
          >
            {isMonitoring ? 'Pause' : 'Reprendre'}
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Zap className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{metrics.active_analyses}</p>
                <p className="text-sm text-muted-foreground">Analyses Actives</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Database className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{metrics.symbols_processed.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Symboles Traités</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{metrics.user_activity.concurrent_users}</p>
                <p className="text-sm text-muted-foreground">Utilisateurs En Ligne</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Globe className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{metrics.cultural_discoveries}</p>
                <p className="text-sm text-muted-foreground">Découvertes Aujourd'hui</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Monitoring */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Performance Système</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>CPU Usage</span>
                  <span>{metrics.system_performance.cpu_usage.toFixed(1)}%</span>
                </div>
                <Progress value={metrics.system_performance.cpu_usage} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Memory Usage</span>
                  <span>{metrics.system_performance.memory_usage.toFixed(1)}%</span>
                </div>
                <Progress value={metrics.system_performance.memory_usage} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>GPU Usage</span>
                  <span>{metrics.system_performance.gpu_usage.toFixed(1)}%</span>
                </div>
                <Progress value={metrics.system_performance.gpu_usage} className="h-2" />
              </div>

              <div className="pt-4">
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="cpu" stroke="#8884d8" strokeWidth={2} />
                    <Line type="monotone" dataKey="memory" stroke="#82ca9d" strokeWidth={2} />
                    <Line type="monotone" dataKey="gpu" stroke="#ffc658" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activité Utilisateurs</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="analyses" stackId="1" stroke="#8884d8" fill="#8884d8" />
                <Area type="monotone" dataKey="users" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Live Analysis Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Flux d'Analyses en Direct</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analysisStream.map((analysis) => (
                <div key={analysis.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(analysis.status)}
                    <div>
                      <div className="font-medium text-sm">{analysis.type.replace('_', ' ')}</div>
                      <div className="text-xs text-muted-foreground">
                        {analysis.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="text-xs">
                      {(analysis.confidence * 100).toFixed(0)}%
                    </Badge>
                    <div className="text-xs text-muted-foreground mt-1">
                      {analysis.processing_time.toFixed(0)}ms
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tendances Culturelles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {culturalTrends.map((trend) => (
                <div key={trend.culture} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    {getTrendIcon(trend.trend_direction)}
                    <div>
                      <div className="font-medium text-sm">{trend.culture}</div>
                      <div className="text-xs text-muted-foreground">
                        {trend.analysis_count} analyses • {trend.temporal_range}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {(trend.avg_complexity * 100).toFixed(0)}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      complexité
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RealTimeAnalytics;
