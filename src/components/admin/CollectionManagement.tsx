import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCollections } from '@/hooks/useCollections';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, Users, Hash, TrendingUp, AlertTriangle } from 'lucide-react';

interface CollectionStats {
  id: string;
  title: string;
  symbol_count: number;
  is_featured: boolean;
  activity_score: number;
}

export const CollectionManagement: React.FC = () => {
  const { data: collections, isLoading } = useCollections();
  const [stats, setStats] = useState<CollectionStats[]>([]);
  const [loading, setLoading] = useState(false);

  const loadStats = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('collections_with_symbols')
        .select('*');
      
      if (error) throw error;
      
      const statsData = data?.map(collection => {
        const translations = Array.isArray(collection.collection_translations) 
          ? collection.collection_translations 
          : [];
        const symbols = Array.isArray(collection.collection_symbols) 
          ? collection.collection_symbols 
          : [];
        
        return {
          id: collection.id || '',
          title: (translations[0] as any)?.title || 'Unknown',
          symbol_count: symbols.length,
          is_featured: collection.is_featured || false,
          activity_score: Math.floor(Math.random() * 100) // Placeholder for real activity tracking
        };
      }) || [];
      
      setStats(statsData);
    } catch (error) {
      console.error('Error loading collection stats:', error);
      toast.error('Failed to load collection statistics');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadStats();
  }, []);

  const getHealthStatus = (symbolCount: number, activityScore: number) => {
    if (symbolCount >= 10 && activityScore >= 60) return 'healthy';
    if (symbolCount >= 5 && activityScore >= 30) return 'warning';
    return 'critical';
  };

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading || loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Collection Management</h2>
          <p className="text-muted-foreground">
            Monitor and manage collection health and growth
          </p>
        </div>
        <Button onClick={loadStats} variant="outline">
          Refresh Stats
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Hash className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Total Collections</span>
            </div>
            <div className="text-2xl font-bold">{stats.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Healthy Collections</span>
            </div>
            <div className="text-2xl font-bold text-green-600">
              {stats.filter(s => getHealthStatus(s.symbol_count, s.activity_score) === 'healthy').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">At Risk</span>
            </div>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.filter(s => getHealthStatus(s.symbol_count, s.activity_score) === 'warning').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Featured</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {stats.filter(s => s.is_featured).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Collections List */}
      <Card>
        <CardHeader>
          <CardTitle>Collection Health Monitor</CardTitle>
          <CardDescription>
            Track collection performance and identify collections that need attention
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.map((collection) => {
              const healthStatus = getHealthStatus(collection.symbol_count, collection.activity_score);
              return (
                <div
                  key={collection.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div>
                      <h3 className="font-medium">{collection.title}</h3>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span>{collection.symbol_count} symbols</span>
                        <span>•</span>
                        <span>{collection.activity_score}% activity</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {collection.is_featured && (
                      <Badge variant="secondary">Featured</Badge>
                    )}
                    <Badge className={getHealthColor(healthStatus)}>
                      {healthStatus === 'healthy' && 'Healthy'}
                      {healthStatus === 'warning' && 'At Risk'}
                      {healthStatus === 'critical' && 'Critical'}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};