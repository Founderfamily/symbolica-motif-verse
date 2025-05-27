
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  Globe, 
  Clock, 
  Download,
  Search,
  Filter,
  Zap
} from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';
import SymbolComparator from './SymbolComparator';
import TemporalAnalysis from './TemporalAnalysis';
import { analyzeSymbol, getTemporalAnalysis, exportAnalysisData, SymbolAnalysisResult } from '@/services/advancedAnalysisService';
import { getAllGroups } from '@/services/interestGroupService';

const AnalysisDashboard: React.FC = () => {
  const [activeAnalysis, setActiveAnalysis] = useState<'overview' | 'compare' | 'temporal' | 'patterns'>('overview');
  const [analysisResults, setAnalysisResults] = useState<SymbolAnalysisResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalSymbols: 0,
    culturesAnalyzed: 0,
    timePeriodsSpanned: 0,
    analysisCompleted: 0
  });

  useEffect(() => {
    loadAnalysisOverview();
  }, []);

  const loadAnalysisOverview = async () => {
    setLoading(true);
    try {
      // Simulate loading recent analysis data
      const mockStats = {
        totalSymbols: 1247,
        culturesAnalyzed: 23,
        timePeriodsSpanned: 15,
        analysisCompleted: 89
      };
      setStats(mockStats);
    } catch (error) {
      console.error('Error loading analysis overview:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportResults = async (format: 'json' | 'csv' | 'pdf') => {
    if (analysisResults.length === 0) {
      alert('No analysis results to export');
      return;
    }
    
    await exportAnalysisData(analysisResults, format);
  };

  const analysisCards = [
    {
      title: 'Symbol Comparison',
      description: 'Compare symbols across cultures and time periods',
      icon: <BarChart3 className="h-6 w-6" />,
      value: 'compare',
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Temporal Analysis',
      description: 'Analyze symbol evolution over time',
      icon: <Clock className="h-6 w-6" />,
      value: 'temporal',
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Pattern Recognition',
      description: 'Identify recurring patterns and motifs',
      icon: <Zap className="h-6 w-6" />,
      value: 'patterns',
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Geographic Distribution',
      description: 'Map symbol spread across regions',
      icon: <Globe className="h-6 w-6" />,
      value: 'geographic',
      color: 'from-orange-500 to-orange-600'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            <I18nText translationKey="analysis.title">Advanced Symbol Analysis</I18nText>
          </h1>
          <p className="text-slate-600 mt-2">
            <I18nText translationKey="analysis.subtitle">
              Discover patterns, relationships, and insights across cultural symbols
            </I18nText>
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => handleExportResults('json')}>
            <Download className="h-4 w-4 mr-2" />
            Export JSON
          </Button>
          <Button variant="outline" onClick={() => handleExportResults('csv')}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Search className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{stats.totalSymbols.toLocaleString()}</p>
                <p className="text-sm text-slate-600">Total Symbols</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Globe className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{stats.culturesAnalyzed}</p>
                <p className="text-sm text-slate-600">Cultures Analyzed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{stats.timePeriodsSpanned}</p>
                <p className="text-sm text-slate-600">Time Periods</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{stats.analysisCompleted}%</p>
                <p className="text-sm text-slate-600">Analysis Complete</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analysis Tools */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {analysisCards.map((card) => (
          <Card 
            key={card.value}
            className="cursor-pointer hover:shadow-lg transition-all duration-200 border-none"
            onClick={() => setActiveAnalysis(card.value as any)}
          >
            <CardContent className="p-6">
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${card.color} flex items-center justify-center text-white mb-4`}>
                {card.icon}
              </div>
              <h3 className="font-semibold text-lg mb-2">{card.title}</h3>
              <p className="text-slate-600 text-sm">{card.description}</p>
              <Badge variant="secondary" className="mt-3">
                {card.value === activeAnalysis ? 'Active' : 'Available'}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Analysis Content */}
      <Tabs value={activeAnalysis} onValueChange={(value) => setActiveAnalysis(value as any)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="compare">Compare</TabsTrigger>
          <TabsTrigger value="temporal">Temporal</TabsTrigger>
          <TabsTrigger value="patterns">Patterns</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Analysis Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Recent Discoveries</h4>
                  <div className="space-y-2">
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <p className="font-medium">Celtic Knotwork Evolution</p>
                      <p className="text-sm text-slate-600">Cross-cultural influence patterns identified</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <p className="font-medium">Geometric Motif Clustering</p>
                      <p className="text-sm text-slate-600">Similar patterns across 7 cultures</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Analysis Insights</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                      <span className="text-sm">Cultural Exchange Rate</span>
                      <Badge>High</Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                      <span className="text-sm">Pattern Complexity</span>
                      <Badge variant="secondary">Moderate</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compare">
          <SymbolComparator />
        </TabsContent>

        <TabsContent value="temporal">
          <TemporalAnalysis />
        </TabsContent>

        <TabsContent value="patterns" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pattern Recognition Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Zap className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">
                  Advanced Pattern Recognition
                </h3>
                <p className="text-slate-600 mb-4">
                  AI-powered pattern analysis coming soon. This will identify recurring motifs,
                  geometric similarities, and cultural pattern evolution.
                </p>
                <Button disabled>
                  <Zap className="h-4 w-4 mr-2" />
                  Run Pattern Analysis
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalysisDashboard;
