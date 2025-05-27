
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeftRight, 
  Globe, 
  Clock, 
  Palette, 
  Target,
  TrendingUp,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';
import SymbolSelector from './SymbolSelector';
import { compareSymbols, ComparisonResult } from '@/services/advancedAnalysisService';

const SymbolComparator: React.FC = () => {
  const [selectedSymbol1, setSelectedSymbol1] = useState<string | null>(null);
  const [selectedSymbol2, setSelectedSymbol2] = useState<string | null>(null);
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('similarities');

  useEffect(() => {
    if (selectedSymbol1 && selectedSymbol2) {
      performComparison();
    }
  }, [selectedSymbol1, selectedSymbol2]);

  const performComparison = async () => {
    if (!selectedSymbol1 || !selectedSymbol2) return;
    
    setLoading(true);
    try {
      const result = await compareSymbols(selectedSymbol1, selectedSymbol2);
      setComparisonResult(result);
    } catch (error) {
      console.error('Error comparing symbols:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRelationshipColor = (type: string) => {
    switch (type) {
      case 'derivative': return 'bg-blue-100 text-blue-800';
      case 'parallel_evolution': return 'bg-green-100 text-green-800';
      case 'cultural_exchange': return 'bg-purple-100 text-purple-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getConfidenceLevel = (score: number) => {
    if (score >= 0.8) return { level: 'High', color: 'text-green-600' };
    if (score >= 0.6) return { level: 'Medium', color: 'text-yellow-600' };
    return { level: 'Low', color: 'text-red-600' };
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ArrowLeftRight className="h-5 w-5" />
            <span>Symbol Comparison Tool</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Symbol 1 Selection */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Symbol 1</h3>
              <SymbolSelector
                onSymbolSelect={setSelectedSymbol1}
                selectedSymbol={selectedSymbol1}
                placeholder="Select first symbol for comparison"
              />
              {comparisonResult?.symbol1 && (
                <Card className="border-blue-200">
                  <CardContent className="p-4">
                    <h4 className="font-medium">{comparisonResult.symbol1.name}</h4>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="secondary">{comparisonResult.symbol1.culture}</Badge>
                      <Badge variant="outline">{comparisonResult.symbol1.period}</Badge>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Symbol 2 Selection */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Symbol 2</h3>
              <SymbolSelector
                onSymbolSelect={setSelectedSymbol2}
                selectedSymbol={selectedSymbol2}
                placeholder="Select second symbol for comparison"
              />
              {comparisonResult?.symbol2 && (
                <Card className="border-green-200">
                  <CardContent className="p-4">
                    <h4 className="font-medium">{comparisonResult.symbol2.name}</h4>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="secondary">{comparisonResult.symbol2.culture}</Badge>
                      <Badge variant="outline">{comparisonResult.symbol2.period}</Badge>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {loading && (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-2 border-slate-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-600">Analyzing symbol relationships...</p>
            </div>
          )}
        </CardContent>
      </Card>

      {comparisonResult && !loading && (
        <div className="space-y-6">
          {/* Comparison Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Comparison Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getRelationshipColor(comparisonResult.relationship_type)}`}>
                    {comparisonResult.relationship_type.replace('_', ' ').toUpperCase()}
                  </div>
                  <p className="text-sm text-slate-600 mt-2">Relationship Type</p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <span className={`text-2xl font-bold ${getConfidenceLevel(comparisonResult.confidence_score).color}`}>
                      {Math.round(comparisonResult.confidence_score * 100)}%
                    </span>
                    {comparisonResult.confidence_score >= 0.7 ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-yellow-500" />
                    )}
                  </div>
                  <p className="text-sm text-slate-600 mt-2">Confidence Score</p>
                  <Progress value={comparisonResult.confidence_score * 100} className="mt-2" />
                </div>

                <div className="text-center">
                  <TrendingUp className="h-8 w-8 text-blue-500 mx-auto" />
                  <p className="text-sm text-slate-600 mt-2">Analysis Complete</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Comparison */}
          <Card>
            <CardContent className="p-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="similarities">Similarities</TabsTrigger>
                  <TabsTrigger value="differences">Differences</TabsTrigger>
                  <TabsTrigger value="cultural">Cultural</TabsTrigger>
                  <TabsTrigger value="temporal">Temporal</TabsTrigger>
                </TabsList>

                <TabsContent value="similarities" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center space-x-2">
                          <Globe className="h-4 w-4" />
                          <span>Cultural Similarities</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {comparisonResult.similarities.cultural.length > 0 ? (
                          <ul className="space-y-2">
                            {comparisonResult.similarities.cultural.map((similarity, index) => (
                              <li key={index} className="flex items-start space-x-2">
                                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                <span className="text-sm">{similarity}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-slate-500">No cultural similarities found</p>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center space-x-2">
                          <Clock className="h-4 w-4" />
                          <span>Temporal Similarities</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {comparisonResult.similarities.temporal.length > 0 ? (
                          <ul className="space-y-2">
                            {comparisonResult.similarities.temporal.map((similarity, index) => (
                              <li key={index} className="flex items-start space-x-2">
                                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                <span className="text-sm">{similarity}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-slate-500">No temporal similarities found</p>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="differences" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center space-x-2">
                          <Globe className="h-4 w-4" />
                          <span>Cultural Differences</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {comparisonResult.differences.cultural.length > 0 ? (
                          <ul className="space-y-2">
                            {comparisonResult.differences.cultural.map((difference, index) => (
                              <li key={index} className="flex items-start space-x-2">
                                <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                                <span className="text-sm">{difference}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-slate-500">No cultural differences identified</p>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center space-x-2">
                          <Clock className="h-4 w-4" />
                          <span>Temporal Differences</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {comparisonResult.differences.temporal.length > 0 ? (
                          <ul className="space-y-2">
                            {comparisonResult.differences.temporal.map((difference, index) => (
                              <li key={index} className="flex items-start space-x-2">
                                <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                                <span className="text-sm">{difference}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-slate-500">No temporal differences identified</p>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="cultural">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Cultural Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium mb-3">{comparisonResult.symbol1.name}</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-slate-600">Culture:</span>
                              <Badge>{comparisonResult.symbol1.culture}</Badge>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-slate-600">Regions:</span>
                              <span className="text-sm">{comparisonResult.symbol1.geographic_distribution.regions.length}</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-3">{comparisonResult.symbol2.name}</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-slate-600">Culture:</span>
                              <Badge>{comparisonResult.symbol2.culture}</Badge>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-slate-600">Regions:</span>
                              <span className="text-sm">{comparisonResult.symbol2.geographic_distribution.regions.length}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="temporal">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Temporal Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium mb-3">{comparisonResult.symbol1.name}</h4>
                          <div className="space-y-3">
                            <div>
                              <span className="text-sm text-slate-600">Period:</span>
                              <p className="font-medium">{comparisonResult.symbol1.period}</p>
                            </div>
                            <div>
                              <span className="text-sm text-slate-600">Earliest Occurrence:</span>
                              <p className="text-sm">{comparisonResult.symbol1.temporal_analysis.earliest_occurrence}</p>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-3">{comparisonResult.symbol2.name}</h4>
                          <div className="space-y-3">
                            <div>
                              <span className="text-sm text-slate-600">Period:</span>
                              <p className="font-medium">{comparisonResult.symbol2.period}</p>
                            </div>
                            <div>
                              <span className="text-sm text-slate-600">Earliest Occurrence:</span>
                              <p className="text-sm">{comparisonResult.symbol2.temporal_analysis.earliest_occurrence}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SymbolComparator;
