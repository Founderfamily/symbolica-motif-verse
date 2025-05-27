
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeftRight, Clock, BookOpen, Sparkles } from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';
import SymbolComparator from '@/components/analysis/SymbolComparator';
import TemporalAnalysis from '@/components/analysis/TemporalAnalysis';
import AcademicExporter from '@/components/analysis/AcademicExporter';

const AnalysisPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('comparator');

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-gradient-to-br from-purple-500 to-blue-600 rounded-full p-3">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">
                <I18nText translationKey="analysis.title">Advanced Analysis Tools</I18nText>
              </h1>
              <p className="text-slate-600">
                <I18nText translationKey="analysis.subtitle">
                  Compare symbols, analyze temporal evolution, and export academic data
                </I18nText>
              </p>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="comparator" className="flex items-center gap-2">
              <ArrowLeftRight className="h-4 w-4" />
              <I18nText translationKey="analysis.symbolComparator">Symbol Comparator</I18nText>
            </TabsTrigger>
            <TabsTrigger value="temporal" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <I18nText translationKey="analysis.temporalAnalysis">Temporal Analysis</I18nText>
            </TabsTrigger>
            <TabsTrigger value="export" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <I18nText translationKey="analysis.academicExporter">Academic Export</I18nText>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="comparator" className="space-y-6">
            <SymbolComparator />
          </TabsContent>

          <TabsContent value="temporal" className="space-y-6">
            <TemporalAnalysis />
          </TabsContent>

          <TabsContent value="export" className="space-y-6">
            <AcademicExporter />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AnalysisPage;
