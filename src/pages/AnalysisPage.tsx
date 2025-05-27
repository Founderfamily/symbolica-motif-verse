
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import AnalysisDashboard from '@/components/analysis/AnalysisDashboard';
import SymbolComparator from '@/components/analysis/SymbolComparator';
import TemporalAnalysis from '@/components/analysis/TemporalAnalysis';
import PredictiveAIDashboard from '@/components/analysis/PredictiveAIDashboard';
import { Brain, BarChart3, GitCompare, Clock, Zap } from 'lucide-react';

const AnalysisPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center space-y-6">
            <div className="flex justify-center gap-3">
              <Badge variant="outline" className="bg-white/10 border-white/20 text-white">
                <Brain className="h-4 w-4 mr-1" />
                AI-Powered
              </Badge>
              <Badge variant="outline" className="bg-white/10 border-white/20 text-white">
                <Zap className="h-4 w-4 mr-1" />
                Research Grade
              </Badge>
            </div>
            <h1 className="text-4xl font-bold">
              Advanced Cultural Symbol Analysis
            </h1>
            <p className="text-xl text-slate-200 max-w-3xl mx-auto">
              Cutting-edge AI and machine learning tools for archaeological research,
              pattern recognition, and cultural evolution analysis
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <Tabs defaultValue="dashboard" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analysis Dashboard
            </TabsTrigger>
            <TabsTrigger value="predictive-ai" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Predictive AI
            </TabsTrigger>
            <TabsTrigger value="comparison" className="flex items-center gap-2">
              <GitCompare className="h-4 w-4" />
              Symbol Comparison
            </TabsTrigger>
            <TabsTrigger value="temporal" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Temporal Analysis
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <AnalysisDashboard />
          </TabsContent>

          <TabsContent value="predictive-ai">
            <PredictiveAIDashboard />
          </TabsContent>

          <TabsContent value="comparison">
            <SymbolComparator />
          </TabsContent>

          <TabsContent value="temporal">
            <TemporalAnalysis />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AnalysisPage;
