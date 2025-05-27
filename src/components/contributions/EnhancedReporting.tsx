
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { BarChart, LineChart, PieChart, Download, TrendingUp, Calendar, FileText } from 'lucide-react';
import { CompleteContribution } from '@/types/contributions';
import { format as formatDate, startOfMonth, endOfMonth, subMonths, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

interface EnhancedReportingProps {
  contributions: CompleteContribution[];
}

interface ReportData {
  submissionTrends: Array<{ date: string; count: number }>;
  statusDistribution: Array<{ status: string; count: number; percentage: number }>;
  cultureAnalysis: Array<{ culture: string; count: number; approvalRate: number }>;
  periodAnalysis: Array<{ period: string; count: number; avgProcessingTime: number }>;
  geographicDistribution: Array<{ region: string; count: number }>;
  performanceMetrics: {
    totalSubmissions: number;
    approvalRate: number;
    avgProcessingTime: number;
    activeCultures: number;
    topContributor: string;
  };
}

const EnhancedReporting: React.FC<EnhancedReportingProps> = ({ contributions }) => {
  const [reportType, setReportType] = useState<'overview' | 'trends' | 'performance' | 'geographic'>('overview');
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: subMonths(new Date(), 3),
    to: new Date()
  });
  const [selectedCulture, setSelectedCulture] = useState<string>('all');

  const cultures = useMemo(() => 
    Array.from(new Set(contributions.map(c => c.cultural_context).filter(Boolean))),
    [contributions]
  );

  const reportData = useMemo((): ReportData => {
    const filteredContributions = contributions.filter(c => {
      const submissionDate = parseISO(c.created_at);
      const inDateRange = submissionDate >= dateRange.from && submissionDate <= dateRange.to;
      const cultureMatch = selectedCulture === 'all' || c.cultural_context === selectedCulture;
      return inDateRange && cultureMatch;
    });

    // Submission trends (monthly)
    const monthlyData: Record<string, number> = {};
    filteredContributions.forEach(c => {
      const month = formatDate(parseISO(c.created_at), 'yyyy-MM');
      monthlyData[month] = (monthlyData[month] || 0) + 1;
    });

    const submissionTrends = Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, count]) => ({ date, count }));

    // Status distribution
    const statusCounts = filteredContributions.reduce((acc, c) => {
      acc[c.status] = (acc[c.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const statusDistribution = Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count,
      percentage: Math.round((count / filteredContributions.length) * 100)
    }));

    // Culture analysis
    const cultureData: Record<string, { total: number; approved: number }> = {};
    filteredContributions.forEach(c => {
      if (c.cultural_context) {
        if (!cultureData[c.cultural_context]) {
          cultureData[c.cultural_context] = { total: 0, approved: 0 };
        }
        cultureData[c.cultural_context].total++;
        if (c.status === 'approved') {
          cultureData[c.cultural_context].approved++;
        }
      }
    });

    const cultureAnalysis = Object.entries(cultureData).map(([culture, data]) => ({
      culture,
      count: data.total,
      approvalRate: Math.round((data.approved / data.total) * 100)
    })).sort((a, b) => b.count - a.count);

    // Period analysis
    const periodData: Record<string, { count: number; totalProcessingTime: number }> = {};
    filteredContributions.forEach(c => {
      if (c.period) {
        if (!periodData[c.period]) {
          periodData[c.period] = { count: 0, totalProcessingTime: 0 };
        }
        periodData[c.period].count++;
        
        if (c.reviewed_at) {
          const processingTime = (parseISO(c.reviewed_at).getTime() - parseISO(c.created_at).getTime()) / (1000 * 60 * 60 * 24);
          periodData[c.period].totalProcessingTime += processingTime;
        }
      }
    });

    const periodAnalysis = Object.entries(periodData).map(([period, data]) => ({
      period,
      count: data.count,
      avgProcessingTime: data.count > 0 ? Math.round(data.totalProcessingTime / data.count * 10) / 10 : 0
    })).sort((a, b) => b.count - a.count);

    // Geographic distribution
    const locationData: Record<string, number> = {};
    filteredContributions.forEach(c => {
      if (c.location_name) {
        const region = c.location_name.split(',')[0].trim();
        locationData[region] = (locationData[region] || 0) + 1;
      }
    });

    const geographicDistribution = Object.entries(locationData)
      .map(([region, count]) => ({ region, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Performance metrics
    const approvedCount = filteredContributions.filter(c => c.status === 'approved').length;
    const approvalRate = filteredContributions.length > 0 ? Math.round((approvedCount / filteredContributions.length) * 100) : 0;
    
    const avgProcessingTime = filteredContributions
      .filter(c => c.reviewed_at)
      .reduce((sum, c) => {
        const processingTime = (parseISO(c.reviewed_at!).getTime() - parseISO(c.created_at).getTime()) / (1000 * 60 * 60 * 24);
        return sum + processingTime;
      }, 0) / filteredContributions.filter(c => c.reviewed_at).length || 0;

    const performanceMetrics = {
      totalSubmissions: filteredContributions.length,
      approvalRate,
      avgProcessingTime: Math.round(avgProcessingTime * 10) / 10,
      activeCultures: new Set(filteredContributions.map(c => c.cultural_context).filter(Boolean)).size,
      topContributor: 'Non disponible' // Would need user data
    };

    return {
      submissionTrends,
      statusDistribution,
      cultureAnalysis,
      periodAnalysis,
      geographicDistribution,
      performanceMetrics
    };
  }, [contributions, dateRange, selectedCulture]);

  const exportReport = (format: 'pdf' | 'excel' | 'csv') => {
    // Simple CSV export for now
    if (format === 'csv') {
      const csvData = [
        'Type,Valeur,Nombre,Pourcentage',
        ...reportData.statusDistribution.map(item => 
          `Statut,${item.status},${item.count},${item.percentage}%`
        ),
        ...reportData.cultureAnalysis.map(item => 
          `Culture,${item.culture},${item.count},${item.approvalRate}%`
        )
      ].join('\n');

      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `rapport-contributions-${formatDate(new Date(), 'yyyy-MM-dd')}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="space-y-6">
      {/* Report Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Rapports avancés
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Type de rapport</label>
              <Select value={reportType} onValueChange={(value: any) => setReportType(value)}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="overview">Vue d'ensemble</SelectItem>
                  <SelectItem value="trends">Tendances</SelectItem>
                  <SelectItem value="performance">Performance</SelectItem>
                  <SelectItem value="geographic">Géographique</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Culture</label>
              <Select value={selectedCulture} onValueChange={setSelectedCulture}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les cultures</SelectItem>
                  {cultures.map(culture => (
                    <SelectItem key={culture} value={culture}>
                      {culture}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Période</label>
              <DatePickerWithRange
                date={dateRange}
                onDateChange={(range) => range && setDateRange(range)}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={() => exportReport('csv')} className="flex items-center gap-1">
              <Download className="h-4 w-4" />
              Exporter CSV
            </Button>
            <Button variant="outline" onClick={() => exportReport('pdf')} className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              Exporter PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{reportData.performanceMetrics.totalSubmissions}</p>
              <p className="text-sm text-muted-foreground">Total soumissions</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{reportData.performanceMetrics.approvalRate}%</p>
              <p className="text-sm text-muted-foreground">Taux d'approbation</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">{reportData.performanceMetrics.avgProcessingTime}j</p>
              <p className="text-sm text-muted-foreground">Temps de traitement</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{reportData.performanceMetrics.activeCultures}</p>
              <p className="text-sm text-muted-foreground">Cultures actives</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-lg font-bold text-indigo-600">{reportData.performanceMetrics.topContributor}</p>
              <p className="text-sm text-muted-foreground">Top contributeur</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Content */}
      {reportType === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Distribution des statuts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {reportData.statusDistribution.map(item => (
                  <div key={item.status} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant={item.status === 'approved' ? 'default' : 'secondary'}>
                        {item.status}
                      </Badge>
                      <span className="text-sm">{item.count} contributions</span>
                    </div>
                    <span className="font-medium">{item.percentage}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top cultures</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {reportData.cultureAnalysis.slice(0, 5).map(item => (
                  <div key={item.culture} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{item.culture}</span>
                      <span>{item.count} contributions ({item.approvalRate}% approuvées)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(item.count / reportData.performanceMetrics.totalSubmissions) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {reportType === 'trends' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Tendances de soumission
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportData.submissionTrends.map(item => (
                <div key={item.date} className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {formatDate(parseISO(item.date + '-01'), 'MMMM yyyy', { locale: fr })}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${Math.min((item.count / Math.max(...reportData.submissionTrends.map(t => t.count))) * 100, 100)}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold w-8">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {reportType === 'geographic' && (
        <Card>
          <CardHeader>
            <CardTitle>Distribution géographique</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {reportData.geographicDistribution.map(item => (
                <div key={item.region} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{item.region}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(item.count / reportData.performanceMetrics.totalSubmissions) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold w-8">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EnhancedReporting;
