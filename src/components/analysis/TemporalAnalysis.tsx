
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, TrendingUp, Calendar, Zap } from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';
import { SymbolData } from '@/types/supabase';
import { supabase } from '@/integrations/supabase/client';

interface TemporalData {
  period: string;
  symbols: SymbolData[];
  characteristics: string[];
  historicalEvents: string[];
}

interface TimelineEvent {
  year: number;
  period: string;
  description: string;
  symbolCount: number;
  significance: 'low' | 'medium' | 'high';
}

const TemporalAnalysis: React.FC = () => {
  const [selectedCulture, setSelectedCulture] = useState<string>('');
  const [cultures, setCultures] = useState<string[]>([]);
  const [temporalData, setTemporalData] = useState<TemporalData[]>([]);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCultures();
  }, []);

  useEffect(() => {
    if (selectedCulture) {
      analyzeTemporalEvolution();
    }
  }, [selectedCulture]);

  const fetchCultures = async () => {
    try {
      const { data, error } = await supabase
        .from('symbols')
        .select('culture')
        .order('culture');
      
      if (error) throw error;
      
      const uniqueCultures = [...new Set(data?.map(item => item.culture))];
      setCultures(uniqueCultures);
    } catch (error) {
      console.error('Error fetching cultures:', error);
    }
  };

  const analyzeTemporalEvolution = async () => {
    if (!selectedCulture) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('symbols')
        .select('*')
        .eq('culture', selectedCulture)
        .order('period');
      
      if (error) throw error;
      
      // Group by period
      const groupedData: { [key: string]: SymbolData[] } = {};
      data?.forEach(symbol => {
        if (!groupedData[symbol.period]) {
          groupedData[symbol.period] = [];
        }
        groupedData[symbol.period].push(symbol);
      });
      
      // Create temporal data structure
      const temporal = Object.entries(groupedData).map(([period, symbols]) => ({
        period,
        symbols,
        characteristics: extractCharacteristics(symbols),
        historicalEvents: getHistoricalEvents(period)
      }));
      
      setTemporalData(temporal);
      setTimeline(generateTimeline(temporal));
      
    } catch (error) {
      console.error('Error analyzing temporal evolution:', error);
    } finally {
      setLoading(false);
    }
  };

  const extractCharacteristics = (symbols: SymbolData[]): string[] => {
    // Extract common patterns/characteristics from symbols in this period
    const allFunctions = symbols.flatMap(s => s.function || []);
    const allMediums = symbols.flatMap(s => s.medium || []);
    const allTechniques = symbols.flatMap(s => s.technique || []);
    
    return [
      ...new Set([...allFunctions, ...allMediums, ...allTechniques])
    ].slice(0, 5);
  };

  const getHistoricalEvents = (period: string): string[] => {
    // Mock historical events data
    const events: { [key: string]: string[] } = {
      'Ancient': ['Rise of first civilizations', 'Development of writing systems'],
      'Classical': ['Expansion of empires', 'Trade route establishment'],
      'Medieval': ['Religious movements', 'Cultural exchanges'],
      'Renaissance': ['Artistic revolution', 'Scientific discoveries'],
      'Modern': ['Industrial revolution', 'Global communications'],
      'Contemporary': ['Digital age', 'Cultural globalization']
    };
    
    return events[period] || [];
  };

  const generateTimeline = (data: TemporalData[]): TimelineEvent[] => {
    return data.map((item, index) => ({
      year: 1000 + index * 500, // Mock years
      period: item.period,
      description: `${item.symbols.length} symbols documented`,
      symbolCount: item.symbols.length,
      significance: item.symbols.length > 5 ? 'high' : item.symbols.length > 2 ? 'medium' : 'low'
    }));
  };

  const getSignificanceColor = (significance: string) => {
    switch (significance) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-amber-500';
      default: return 'bg-green-500';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            <I18nText translationKey="analysis.temporalAnalysis">Temporal Analysis</I18nText>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4">
              <Select value={selectedCulture} onValueChange={setSelectedCulture}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Select a culture to analyze" />
                </SelectTrigger>
                <SelectContent>
                  {cultures.map(culture => (
                    <SelectItem key={culture} value={culture}>
                      {culture}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {selectedCulture && (
                <Button variant="outline" className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  <I18nText translationKey="analysis.generateReport">Generate Report</I18nText>
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {loading && (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="flex items-center justify-center gap-2 text-slate-500">
              <Zap className="h-5 w-5 animate-spin" />
              <I18nText translationKey="analysis.analyzingEvolution">Analyzing evolution...</I18nText>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Timeline Visualization */}
      {timeline.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <I18nText translationKey="analysis.evolutionTimeline">Evolution Timeline</I18nText>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-200"></div>
              <div className="space-y-6">
                {timeline.map((event, index) => (
                  <div key={index} className="relative flex items-start gap-4">
                    <div className={`w-3 h-3 rounded-full ${getSignificanceColor(event.significance)} relative z-10`}></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{event.period}</h4>
                        <Badge variant="outline" className="text-xs">
                          {event.symbolCount} symbols
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600">{event.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Period Analysis Cards */}
      {temporalData.length > 0 && (
        <div className="grid gap-6">
          {temporalData.map((data, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{data.period} Period</span>
                  <Badge>{data.symbols.length} symbols</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-medium mb-2 text-slate-700">
                      <I18nText translationKey="analysis.characteristics">Characteristics</I18nText>
                    </h4>
                    <div className="space-y-1">
                      {data.characteristics.map((char, i) => (
                        <Badge key={i} variant="secondary" className="mr-1 mb-1">
                          {char}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2 text-slate-700">
                      <I18nText translationKey="analysis.historicalContext">Historical Context</I18nText>
                    </h4>
                    <ul className="text-sm text-slate-600 space-y-1">
                      {data.historicalEvents.map((event, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="w-1 h-1 bg-slate-400 rounded-full mt-2 flex-shrink-0"></span>
                          {event}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2 text-slate-700">
                      <I18nText translationKey="analysis.symbolExamples">Symbol Examples</I18nText>
                    </h4>
                    <div className="space-y-1">
                      {data.symbols.slice(0, 3).map((symbol, i) => (
                        <div key={i} className="text-sm">
                          <span className="font-medium">{symbol.name}</span>
                        </div>
                      ))}
                      {data.symbols.length > 3 && (
                        <div className="text-xs text-slate-500">
                          +{data.symbols.length - 3} more symbols
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TemporalAnalysis;
