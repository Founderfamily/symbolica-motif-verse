
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, Brain, TrendingUp, Zap, Database,
  FileText, Download, Settings, RefreshCw
} from 'lucide-react';
import { aiPatternRecognitionService } from '@/services/aiPatternRecognitionService';
import InteractiveVisualization from './InteractiveVisualization';
import RealTimeCollaboration from './RealTimeCollaboration';

interface AnalyticsMetrics {
  total_symbols_analyzed: number;
  ai_accuracy_score: number;
  cultural_connections_found: number;
  research_projects_active: number;
  collaboration_sessions: number;
  data_processing_speed: number;
}

interface ResearchInsight {
  id: string;
  type: 'discovery' | 'pattern' | 'correlation' | 'prediction';
  title: string;
  description: string;
  confidence: number;
  impact_score: number;
  data_points: number;
  created_at: Date;
}

const AdvancedAnalyticsDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<AnalyticsMetrics>({
    total_symbols_analyzed: 0,
    ai_accuracy_score: 0,
    cultural_connections_found: 0,
    research_projects_active: 0,
    collaboration_sessions: 0,
    data_processing_speed: 0
  });
  
  const [insights, setInsights] = useState<ResearchInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    setLoading(true);
    
    // Simulate loading advanced analytics
    setTimeout(() => {
      setMetrics({
        total_symbols_analyzed: 15847,
        ai_accuracy_score: 94.7,
        cultural_connections_found: 2834,
        research_projects_active: 127,
        collaboration_sessions: 45,
        data_processing_speed: 1.2
      });

      setInsights([
        {
          id: '1',
          type: 'discovery',
          title: 'Celtic-Norse Pattern Convergence',
          description: 'AI identified previously unknown connections between Celtic knotwork and Norse interlacing patterns, suggesting 9th century cultural exchange.',
          confidence: 87.3,
          impact_score: 9.2,
          data_points: 234,
          created_at: new Date(Date.now() - 86400000)
        },
        {
          id: '2',
          type: 'pattern',
          title: 'Geometric Evolution Sequence',
          description: 'Mathematical analysis reveals spiral patterns follow Fibonacci sequences across multiple ancient cultures.',
          confidence: 92.1,
          impact_score: 8.7,
          data_points: 567,
          created_at: new Date(Date.now() - 172800000)
        },
        {
          id: '3',
          type: 'prediction',
          title: 'Cultural Symbol Revival Trend',
          description: 'Machine learning models predict resurgence of ancient Slavic symbols in modern digital art within next 5 years.',
          confidence: 76.4,
          impact_score: 7.3,
          data_points: 1205,
          created_at: new Date(Date.now() - 259200000)
        }
      ]);

      setLoading(false);
    }, 2000);
  };

  const mockVisualizationData = {
    temporal_evolution: [],
    cultural_networks: [],
    pattern_clusters: [],
    geographic_spread: [],
    similarity_matrix: [[1, 0.8, 0.6], [0.8, 1, 0.7], [0.6, 0.7, 1]]
  };

  const getInsightIcon = (type: ResearchInsight['type']) => {
    switch (type) {
      case 'discovery': return <Zap className="h-4 w-4 text-yellow-600" />;
      case 'pattern': return <BarChart3 className="h-4 w-4 text-blue-600" />;
      case 'correlation': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'prediction': return <Brain className="h-4 w-4 text-purple-600" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600';
    if (confidence >= 80) return 'text-yellow-600';
    if (confidence >= 70) return 'text-orange-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <Card>
          <CardContent className="p-8">
            <div className="text-center">
              <RefreshCw className="h-12 w-12 mx-auto mb-4 animate-spin text-blue-600" />
              <h3 className="text-lg font-medium mb-2">Loading Advanced Analytics</h3>
              <p className="text-muted-foreground mb-4">
                Processing symbol data and generating insights...
              </p>
              <Progress value={65} className="w-64 mx-auto" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Advanced Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            AI-powered insights and real-time research collaboration
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadAnalyticsData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Configure
          </Button>
          <Button>
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{metrics.total_symbols_analyzed.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Symbols Analyzed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{metrics.ai_accuracy_score}%</p>
                <p className="text-xs text-muted-foreground">AI Accuracy</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{metrics.cultural_connections_found.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Connections Found</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{metrics.research_projects_active}</p>
                <p className="text-xs text-muted-foreground">Active Projects</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{metrics.collaboration_sessions}</p>
                <p className="text-xs text-muted-foreground">Live Sessions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-2xl font-bold">{metrics.data_processing_speed}s</p>
                <p className="text-xs text-muted-foreground">Processing Speed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="visualizations">Visualizations</TabsTrigger>
          <TabsTrigger value="collaboration">Collaboration</TabsTrigger>
          <TabsTrigger value="research">Research Hub</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Research Insights */}
          <Card>
            <CardHeader>
              <CardTitle>Latest Research Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {insights.map(insight => (
                  <div key={insight.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        {getInsightIcon(insight.type)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{insight.title}</h3>
                            <Badge variant="outline" className="text-xs">
                              {insight.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {insight.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className={`font-medium ${getConfidenceColor(insight.confidence)}`}>
                              {insight.confidence}% confidence
                            </span>
                            <span>Impact: {insight.impact_score}/10</span>
                            <span>{insight.data_points} data points</span>
                            <span>{insight.created_at.toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="visualizations">
          <InteractiveVisualization 
            data={mockVisualizationData}
            symbols={['celtic-knot', 'norse-rune', 'slavic-symbol']}
          />
        </TabsContent>

        <TabsContent value="collaboration">
          <RealTimeCollaboration 
            symbolIds={['symbol1', 'symbol2']}
            currentUserId="current_user"
          />
        </TabsContent>

        <TabsContent value="research" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Research Project Hub</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">Research Management System</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Comprehensive research project management, hypothesis testing, 
                  and collaborative academic workspace coming soon.
                </p>
                <Button>
                  <Zap className="h-4 w-4 mr-2" />
                  Create Research Project
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedAnalyticsDashboard;
