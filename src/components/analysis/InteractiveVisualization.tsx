
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line, ScatterChart, Scatter, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Treemap, Cell, PieChart, Pie
} from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Play, Pause, RotateCcw, Download, Maximize2 } from 'lucide-react';

interface VisualizationData {
  temporal_evolution: any[];
  cultural_networks: any[];
  pattern_clusters: any[];
  geographic_spread: any[];
  similarity_matrix: number[][];
}

interface InteractiveVisualizationProps {
  data: VisualizationData;
  symbols: string[];
}

const InteractiveVisualization: React.FC<InteractiveVisualizationProps> = ({ data, symbols }) => {
  const [activeView, setActiveView] = useState<'temporal' | 'network' | 'clusters' | 'geographic'>('temporal');
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeSlider, setTimeSlider] = useState(0);
  const [selectedCluster, setSelectedCluster] = useState<string | null>(null);

  // Mock data for demonstration
  const temporalData = [
    { period: '3000 BCE', symbols: 5, complexity: 2.3, cultural_diversity: 1.2 },
    { period: '2000 BCE', symbols: 12, complexity: 3.1, cultural_diversity: 2.1 },
    { period: '1000 BCE', symbols: 23, complexity: 4.2, cultural_diversity: 3.8 },
    { period: '0 CE', symbols: 45, complexity: 5.6, cultural_diversity: 5.2 },
    { period: '1000 CE', symbols: 67, complexity: 6.8, cultural_diversity: 6.9 },
    { period: '2000 CE', symbols: 89, complexity: 7.2, cultural_diversity: 8.1 }
  ];

  const networkData = [
    { culture: 'Celtic', x: 10, y: 20, connections: 8, influence: 65 },
    { culture: 'Norse', x: 25, y: 35, connections: 12, influence: 78 },
    { culture: 'Germanic', x: 40, y: 15, connections: 6, influence: 45 },
    { culture: 'Slavic', x: 55, y: 40, connections: 9, influence: 58 },
    { culture: 'Greek', x: 70, y: 25, connections: 15, influence: 85 }
  ];

  const clusterData = [
    { name: 'Geometric Patterns', value: 234, complexity: 'High', cultures: 8 },
    { name: 'Ritual Symbols', value: 189, complexity: 'Medium', cultures: 12 },
    { name: 'Nature Motifs', value: 156, complexity: 'Medium', cultures: 15 },
    { name: 'Abstract Forms', value: 123, complexity: 'High', cultures: 6 },
    { name: 'Decorative Elements', value: 98, complexity: 'Low', cultures: 20 }
  ];

  const radarData = [
    { subject: 'Complexity', A: 120, B: 110, fullMark: 150 },
    { subject: 'Cultural Spread', A: 98, B: 130, fullMark: 150 },
    { subject: 'Temporal Persistence', A: 86, B: 90, fullMark: 150 },
    { subject: 'Symbolic Richness', A: 99, B: 85, fullMark: 150 },
    { subject: 'Evolution Rate', A: 85, B: 65, fullMark: 150 },
    { subject: 'Cross-Cultural Adoption', A: 65, B: 85, fullMark: 150 }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setTimeSlider(prev => (prev + 1) % temporalData.length);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, temporalData.length]);

  const chartConfig = {
    symbols: { label: "Symbols", color: "#8884d8" },
    complexity: { label: "Complexity", color: "#82ca9d" },
    cultural_diversity: { label: "Cultural Diversity", color: "#ffc658" }
  };

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Interactive Analysis Visualization
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {isPlaying ? 'Pause' : 'Play'} Animation
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Maximize2 className="h-4 w-4 mr-2" />
                Fullscreen
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-sm font-medium">Time Period:</span>
            <input
              type="range"
              min="0"
              max={temporalData.length - 1}
              value={timeSlider}
              onChange={(e) => setTimeSlider(parseInt(e.target.value))}
              className="flex-1"
            />
            <Badge variant="outline">
              {temporalData[timeSlider]?.period || 'Unknown'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Visualization Tabs */}
      <Tabs value={activeView} onValueChange={(value) => setActiveView(value as any)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="temporal">Temporal Evolution</TabsTrigger>
          <TabsTrigger value="network">Cultural Networks</TabsTrigger>
          <TabsTrigger value="clusters">Pattern Clusters</TabsTrigger>
          <TabsTrigger value="geographic">Geographic Spread</TabsTrigger>
        </TabsList>

        <TabsContent value="temporal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Symbol Evolution Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={temporalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line type="monotone" dataKey="symbols" stroke="var(--color-symbols)" strokeWidth={2} />
                    <Line type="monotone" dataKey="complexity" stroke="var(--color-complexity)" strokeWidth={2} />
                    <Line type="monotone" dataKey="cultural_diversity" stroke="var(--color-cultural_diversity)" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Comparative Analysis Radar</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis />
                    <Radar name="Symbol A" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                    <Radar name="Symbol B" dataKey="B" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                  </RadarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="network" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cultural Influence Network</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart data={networkData}>
                    <CartesianGrid />
                    <XAxis type="number" dataKey="x" name="Geographic Position" />
                    <YAxis type="number" dataKey="y" name="Temporal Position" />
                    <ChartTooltip cursor={{ strokeDasharray: '3 3' }} />
                    <Scatter name="Cultures" dataKey="influence" fill="#8884d8">
                      {networkData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={`hsl(${entry.influence * 3}, 70%, 50%)`} />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clusters" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pattern Cluster Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <Treemap
                    data={clusterData}
                    dataKey="value"
                    ratio={4/3}
                    stroke="#fff"
                    fill="#8884d8"
                  >
                    {clusterData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`hsl(${index * 60}, 70%, 50%)`} />
                    ))}
                  </Treemap>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {clusterData.map((cluster, index) => (
              <Card 
                key={cluster.name}
                className={`cursor-pointer transition-all ${
                  selectedCluster === cluster.name ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedCluster(cluster.name)}
              >
                <CardContent className="p-4">
                  <h3 className="font-semibold">{cluster.name}</h3>
                  <p className="text-sm text-muted-foreground">{cluster.value} symbols</p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline">{cluster.complexity} Complexity</Badge>
                    <Badge variant="secondary">{cluster.cultures} Cultures</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="geographic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Geographic Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-blue-200 rounded-full flex items-center justify-center">
                    🗺️
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Interactive Map Coming Soon</h3>
                  <p className="text-muted-foreground">
                    3D geographic visualization with time-based symbol spread animation
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InteractiveVisualization;
