
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  Target, 
  Clock, 
  MapPin,
  Lightbulb,
  BarChart3,
  Zap,
  Microscope
} from 'lucide-react';
import { predictiveAIService, CulturalEvolutionPrediction } from '@/services/predictiveAIService';
import { temporalAnalysisService, TimelineReconstructionResult } from '@/services/temporalAnalysisService';

const PredictiveAIDashboard: React.FC = () => {
  const [evolutionPredictions, setEvolutionPredictions] = useState<CulturalEvolutionPrediction[]>([]);
  const [timelineData, setTimelineData] = useState<TimelineReconstructionResult | null>(null);
  const [anomalies, setAnomalies] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);

  useEffect(() => {
    loadPredictiveData();
  }, []);

  const loadPredictiveData = async () => {
    setLoading(true);
    try {
      // Load evolution predictions for sample symbols
      const sampleSymbols = ['symbol_001', 'symbol_002', 'symbol_003'];
      const predictions = await Promise.all(
        sampleSymbols.map(id => predictiveAIService.predictSymbolEvolution(id, 100))
      );
      setEvolutionPredictions(predictions.filter(p => p !== null) as CulturalEvolutionPrediction[]);

      // Load timeline reconstruction
      const timeline = await temporalAnalysisService.reconstructTimeline(['Celtic', 'Norse', 'Germanic'], [-2000, 1000]);
      setTimelineData(timeline);

      // Load anomalies
      const detectedAnomalies = await predictiveAIService.detectArchaeologicalAnomalies('Celtic');
      setAnomalies(detectedAnomalies);

      // Load research recommendations
      const researchRecs = await predictiveAIService.generateResearchRecommendations('current_user', ['Celtic symbols', 'Medieval art']);
      setRecommendations(researchRecs);
    } catch (error) {
      console.error('Error loading predictive data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPriorityColor = (priority: number) => {
    if (priority >= 0.9) return 'bg-red-500';
    if (priority >= 0.7) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-3">
          <Brain className="h-8 w-8 animate-pulse text-blue-500" />
          <div className="text-lg">Processing AI Analysis...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Brain className="h-8 w-8 text-blue-600" />
            Predictive AI & Cultural Analytics
          </h1>
          <p className="text-slate-600 mt-2">
            Advanced machine learning for cultural pattern prediction and archaeological insights
          </p>
        </div>
        <div className="flex gap-2">
          <Badge className="bg-green-100 text-green-800">
            <Zap className="h-3 w-3 mr-1" />
            Real-time ML
          </Badge>
          <Badge className="bg-blue-100 text-blue-800">
            <Microscope className="h-3 w-3 mr-1" />
            Research Grade
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="evolution" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="evolution">Evolution Prediction</TabsTrigger>
          <TabsTrigger value="timeline">Timeline Analysis</TabsTrigger>
          <TabsTrigger value="anomalies">Anomaly Detection</TabsTrigger>
          <TabsTrigger value="recommendations">Research Insights</TabsTrigger>
          <TabsTrigger value="monte-carlo">Uncertainty Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="evolution" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Symbol Evolution Predictions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-4">
                    {evolutionPredictions.map((prediction, index) => (
                      <div 
                        key={index}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedSymbol === prediction.symbolId ? 'border-blue-500 bg-blue-50' : 'hover:bg-slate-50'
                        }`}
                        onClick={() => setSelectedSymbol(prediction.symbolId)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">Symbol {prediction.symbolId}</h4>
                          <Badge className={getConfidenceColor(prediction.confidenceScore)}>
                            {(prediction.confidenceScore * 100).toFixed(1)}% confidence
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Evolution Probability:</span>
                            <span className="font-medium">{(prediction.evolutionProbability * 100).toFixed(1)}%</span>
                          </div>
                          <Progress value={prediction.evolutionProbability * 100} className="h-2" />
                          <div className="text-xs text-slate-600">
                            Timeframe: {prediction.timeframe} years
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {selectedSymbol && (
              <Card>
                <CardHeader>
                  <CardTitle>Detailed Evolution Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const prediction = evolutionPredictions.find(p => p.symbolId === selectedSymbol);
                    if (!prediction) return null;

                    return (
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-3">Predicted Changes</h4>
                          <div className="space-y-3">
                            {Object.entries(prediction.predictedChanges).map(([type, value]) => (
                              <div key={type}>
                                <div className="flex justify-between text-sm mb-1">
                                  <span className="capitalize">{type.replace(/([A-Z])/g, ' $1')}</span>
                                  <span>{(value * 100).toFixed(1)}%</span>
                                </div>
                                <Progress value={value * 100} className="h-2" />
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium mb-2">Historical Basis</h4>
                          <div className="space-y-1">
                            {prediction.historicalBasis.map((basis, idx) => (
                              <div key={idx} className="text-sm text-slate-600 flex items-center gap-2">
                                <Clock className="h-3 w-3" />
                                {basis}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-6">
          {timelineData && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Historical Timeline Reconstruction
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {timelineData.symbols.map((symbol, index) => (
                      <div key={symbol.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div className="flex-1">
                          <h4 className="font-medium">{symbol.name}</h4>
                          <p className="text-sm text-slate-600">{symbol.culturalContext}</p>
                          <p className="text-xs text-slate-500">{symbol.estimatedDate}</p>
                        </div>
                        <Badge className={getConfidenceColor(symbol.dateConfidence)}>
                          {(symbol.dateConfidence * 100).toFixed(0)}%
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Key Transition Periods</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {timelineData.keyTransitionPeriods.map((period, index) => (
                      <div key={index} className="p-3 bg-slate-50 rounded-lg">
                        <div className="font-medium text-sm">{period.period}</div>
                        <p className="text-xs text-slate-600 mt-1">{period.description}</p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs">Significance</span>
                          <Progress value={period.significance * 100} className="w-16 h-1" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="anomalies" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  Archaeological Anomalies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {anomalies.map((anomaly, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">Anomaly {index + 1}</h4>
                        <Badge className={`${getPriorityColor(anomaly.researchPriority)} text-white`}>
                          {anomaly.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600 mb-3">{anomaly.description}</p>
                      <div>
                        <span className="text-xs font-medium">Research Priority: </span>
                        <span className="text-xs">{(anomaly.researchPriority * 100).toFixed(1)}%</span>
                      </div>
                      <Progress value={anomaly.researchPriority * 100} className="h-1 mt-1" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Suggested Investigations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {anomalies.flatMap(anomaly => anomaly.suggestedInvestigations).map((investigation, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 bg-slate-50 rounded">
                      <Microscope className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">{investigation}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((rec, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    {rec.type.charAt(0).toUpperCase() + rec.type.slice(1)}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Priority:</span>
                    <Badge className={getPriorityColor(rec.priority)}>
                      {(rec.priority * 100).toFixed(0)}%
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600">{rec.reasoning}</p>
                  <div className="text-xs text-slate-500">
                    <div>Expected: {rec.expectedOutcome}</div>
                    <div>Timeline: {rec.estimatedTimeframe}</div>
                  </div>
                  <Button size="sm" className="w-full">
                    <Lightbulb className="h-4 w-4 mr-1" />
                    Start Investigation
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="monte-carlo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Monte Carlo Uncertainty Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Statistical Confidence</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Mean Confidence:</span>
                      <span className="font-medium">75.3%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Standard Deviation:</span>
                      <span className="font-medium">±15.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>95% Confidence Interval:</span>
                      <span className="font-medium">[45.0%, 95.0%]</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Uncertainty Contributors</h4>
                  <div className="space-y-2">
                    {[
                      { factor: 'Dating Precision', contribution: 35 },
                      { factor: 'Cultural Attribution', contribution: 28 },
                      { factor: 'Preservation Bias', contribution: 22 },
                      { factor: 'Sample Size', contribution: 15 }
                    ].map((item, index) => (
                      <div key={index}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{item.factor}</span>
                          <span>{item.contribution}%</span>
                        </div>
                        <Progress value={item.contribution} className="h-2" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PredictiveAIDashboard;
