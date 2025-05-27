
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeftRight, Plus, X, Sparkles, Download } from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';
import { useAuth } from '@/hooks/useAuth';
import { useGamification } from '@/hooks/useGamification';
import { SymbolData } from '@/types/supabase';
import SymbolSelector from './SymbolSelector';

interface ComparisonResult {
  similarity: number;
  sharedCultures: string[];
  commonPatterns: string[];
  differences: string[];
}

const SymbolComparator: React.FC = () => {
  const { user } = useAuth();
  const { awardPoints } = useGamification();
  const [selectedSymbols, setSelectedSymbols] = useState<SymbolData[]>([]);
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showSelector, setShowSelector] = useState(false);

  const handleAddSymbol = (symbol: SymbolData) => {
    if (selectedSymbols.length < 4 && !selectedSymbols.find(s => s.id === symbol.id)) {
      setSelectedSymbols([...selectedSymbols, symbol]);
      setShowSelector(false);
    }
  };

  const handleRemoveSymbol = (symbolId: string) => {
    setSelectedSymbols(selectedSymbols.filter(s => s.id !== symbolId));
    setComparisonResult(null);
  };

  const handleCompare = async () => {
    if (selectedSymbols.length < 2) return;
    
    setIsAnalyzing(true);
    try {
      // Simulation d'analyse comparative
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockResult: ComparisonResult = {
        similarity: Math.random() * 100,
        sharedCultures: selectedSymbols
          .flatMap(s => [s.culture])
          .filter((culture, index, arr) => arr.indexOf(culture) !== index),
        commonPatterns: ['Geometric patterns', 'Circular motifs', 'Symmetrical design'],
        differences: ['Color usage', 'Line thickness', 'Cultural context']
      };
      
      setComparisonResult(mockResult);
      
      // Award points for comparison
      if (user) {
        await awardPoints(
          'analysis',
          15,
          selectedSymbols[0].id,
          { 
            analysisType: 'symbol_comparison',
            symbolsCompared: selectedSymbols.length 
          }
        );
      }
    } catch (error) {
      console.error('Comparison failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleExport = () => {
    const exportData = {
      symbols: selectedSymbols,
      comparison: comparisonResult,
      timestamp: new Date().toISOString(),
      analyst: user?.username || 'Anonymous'
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `symbol-comparison-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowLeftRight className="h-5 w-5" />
            <I18nText translationKey="analysis.symbolComparator">Symbol Comparator</I18nText>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Symbol Selection Area */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {selectedSymbols.map((symbol) => (
                <div key={symbol.id} className="relative border border-slate-200 rounded-lg p-3">
                  <button
                    onClick={() => handleRemoveSymbol(symbol.id)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  <h4 className="font-medium text-sm mb-1">{symbol.name}</h4>
                  <Badge variant="outline" className="text-xs">{symbol.culture}</Badge>
                </div>
              ))}
              
              {selectedSymbols.length < 4 && (
                <button
                  onClick={() => setShowSelector(true)}
                  className="border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center text-slate-500 hover:border-slate-400 hover:text-slate-600 transition-colors"
                >
                  <Plus className="h-6 w-6 mb-2" />
                  <span className="text-sm">
                    <I18nText translationKey="analysis.addSymbol">Add Symbol</I18nText>
                  </span>
                </button>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button 
                onClick={handleCompare}
                disabled={selectedSymbols.length < 2 || isAnalyzing}
                className="flex items-center gap-2"
              >
                <Sparkles className="h-4 w-4" />
                {isAnalyzing ? (
                  <I18nText translationKey="analysis.analyzing">Analyzing...</I18nText>
                ) : (
                  <I18nText translationKey="analysis.compare">Compare</I18nText>
                )}
              </Button>
              
              {comparisonResult && (
                <Button variant="outline" onClick={handleExport} className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  <I18nText translationKey="analysis.export">Export</I18nText>
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comparison Results */}
      {comparisonResult && (
        <Card>
          <CardHeader>
            <CardTitle>
              <I18nText translationKey="analysis.comparisonResults">Comparison Results</I18nText>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium text-slate-700">
                  <I18nText translationKey="analysis.similarity">Similarity Score</I18nText>
                </h4>
                <div className="text-2xl font-bold text-blue-600">
                  {comparisonResult.similarity.toFixed(1)}%
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium text-slate-700">
                  <I18nText translationKey="analysis.commonPatterns">Common Patterns</I18nText>
                </h4>
                <div className="space-y-1">
                  {comparisonResult.commonPatterns.map((pattern, index) => (
                    <Badge key={index} variant="secondary" className="mr-1">
                      {pattern}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium text-slate-700">
                  <I18nText translationKey="analysis.differences">Key Differences</I18nText>
                </h4>
                <div className="space-y-1">
                  {comparisonResult.differences.map((diff, index) => (
                    <Badge key={index} variant="outline" className="mr-1">
                      {diff}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Symbol Selector Modal */}
      {showSelector && (
        <SymbolSelector
          onSelect={handleAddSymbol}
          onClose={() => setShowSelector(false)}
          excludeIds={selectedSymbols.map(s => s.id)}
        />
      )}
    </div>
  );
};

export default SymbolComparator;
