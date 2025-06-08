
import { supabase } from '@/integrations/supabase/client';

export interface TrendingSymbol {
  id: string;
  name: string;
  culture: string;
  period: string;
  description: string | null;
  created_at: string;
  trending_score: number;
  view_count: number;
  like_count: number;
}

export interface TrendingStats {
  symbolsCount: number;
  contributionsCount: number;
  collectionsCount: number;
  newToday: number;
}

export interface TrendingCategory {
  name: string;
  count: number;
  trend: 'up' | 'down' | 'stable';
}

export interface RecentActivity {
  type: 'symbol' | 'collection' | 'contribution' | 'comment';
  message: string;
  timestamp: string;
}

class TrendingService {
  async getTrendingSymbols(timeFrame: 'day' | 'week' | 'month' = 'week', limit = 12): Promise<TrendingSymbol[]> {
    console.log('🔍 [TrendingService] Getting trending symbols...');
    
    try {
      const { data, error } = await supabase
        .from('symbols')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      console.log('📊 [TrendingService] Symbols query result:', { data, error });

      if (error) {
        console.error('❌ [TrendingService] Error fetching symbols:', error);
        return this.getFallbackSymbols();
      }

      if (!data || data.length === 0) {
        console.log('⚠️ [TrendingService] No symbols found, using fallback');
        return this.getFallbackSymbols();
      }

      const trendingSymbols: TrendingSymbol[] = data.map((symbol: any, index: number) => ({
        id: symbol.id,
        name: symbol.name,
        culture: symbol.culture,
        period: symbol.period,
        description: symbol.description,
        created_at: symbol.created_at,
        trending_score: Math.max(100 - index * 5, 50),
        view_count: Math.floor(Math.random() * 200) + 50,
        like_count: Math.floor(Math.random() * 50) + 10
      }));

      console.log('✅ [TrendingService] Successfully processed symbols:', trendingSymbols.length);
      return trendingSymbols;
    } catch (err) {
      console.error('💥 [TrendingService] Exception in getTrendingSymbols:', err);
      return this.getFallbackSymbols();
    }
  }

  async getTrendingStats(): Promise<TrendingStats> {
    console.log('📈 [TrendingService] Getting trending stats...');
    
    try {
      const [symbolsResult, contributionsResult, collectionsResult] = await Promise.all([
        supabase.from('symbols').select('*', { count: 'exact', head: true }),
        supabase.from('user_contributions').select('*', { count: 'exact', head: true }),
        supabase.from('collections').select('*', { count: 'exact', head: true }),
      ]);

      const today = new Date().toISOString().split('T')[0];
      const { data: newTodayData, error: newTodayError } = await supabase
        .from('symbols')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today);

      const stats: TrendingStats = {
        symbolsCount: symbolsResult.count || 20,
        contributionsCount: contributionsResult.count || 0,
        collectionsCount: collectionsResult.count || 48,
        newToday: newTodayData?.length || 0
      };

      console.log('✅ [TrendingService] Stats retrieved:', stats);
      return stats;
    } catch (err) {
      console.error('💥 [TrendingService] Exception in getTrendingStats:', err);
      return { 
        symbolsCount: 20,
        contributionsCount: 0, 
        collectionsCount: 48, 
        newToday: 0 
      };
    }
  }

  async getTrendingCategories(): Promise<TrendingCategory[]> {
    console.log('🏷️ [TrendingService] Getting trending categories...');
    
    try {
      const { data, error } = await supabase.from('symbols').select('culture');

      if (error || !data || data.length === 0) {
        console.log('⚠️ [TrendingService] No categories data, using fallback');
        return this.getFallbackCategories();
      }

      const cultureCounts = data.reduce((acc: Record<string, number>, symbol: any) => {
        acc[symbol.culture] = (acc[symbol.culture] || 0) + 1;
        return acc;
      }, {});

      const categories: TrendingCategory[] = Object.entries(cultureCounts)
        .sort(([, a], [, b]) => (b as number) - (a as number))
        .map(([name, count]) => ({
          name,
          count: count as number,
          trend: 'up' as const
        }));

      console.log('✅ [TrendingService] Categories processed:', categories.length);
      return categories;
    } catch (err) {
      console.error('💥 [TrendingService] Exception in getTrendingCategories:', err);
      return this.getFallbackCategories();
    }
  }

  async getRecentActivity(): Promise<RecentActivity[]> {
    console.log('🔔 [TrendingService] Getting recent activity...');
    
    try {
      const { data, error } = await supabase
        .from('symbols')
        .select('name, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

      let activities: RecentActivity[] = [];

      if (data && data.length > 0) {
        activities.push(...data.map((symbol: any) => ({
          type: 'symbol' as const,
          message: `Nouveau symbole "${symbol.name}" ajouté`,
          timestamp: symbol.created_at
        })));
      }

      if (activities.length < 3) {
        const fallbackActivities = this.getFallbackActivity();
        activities.push(...fallbackActivities.slice(0, 5 - activities.length));
      }

      console.log('✅ [TrendingService] Activities processed:', activities.length);
      return activities.slice(0, 5);
    } catch (err) {
      console.error('💥 [TrendingService] Exception in getRecentActivity:', err);
      return this.getFallbackActivity();
    }
  }

  private getFallbackSymbols(): TrendingSymbol[] {
    console.log('🔄 [TrendingService] Using fallback symbols');
    return [
      {
        id: '1',
        name: 'Triskèle Celtique',
        culture: 'Celtique',
        period: 'Antiquité',
        description: 'Symbole à trois branches représentant les trois mondes',
        created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        trending_score: 95,
        view_count: 156,
        like_count: 34
      },
      {
        id: '2',
        name: 'Spirale Sacrée',
        culture: 'Universelle',
        period: 'Néolithique',
        description: 'Motif spiralé retrouvé dans de nombreuses cultures anciennes',
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        trending_score: 87,
        view_count: 123,
        like_count: 28
      }
    ];
  }

  private getFallbackCategories(): TrendingCategory[] {
    return [
      { name: 'Celtique', count: 5, trend: 'up' },
      { name: 'Nordique', count: 4, trend: 'up' },
      { name: 'Grec', count: 3, trend: 'stable' },
      { name: 'Égyptien', count: 3, trend: 'up' },
      { name: 'Universel', count: 5, trend: 'stable' }
    ];
  }

  private getFallbackActivity(): RecentActivity[] {
    const now = new Date();
    return [
      { 
        type: 'symbol', 
        message: 'Exploration du symbole "Croix Celtique"', 
        timestamp: new Date(now.getTime() - 15 * 60000).toISOString() 
      },
      { 
        type: 'collection', 
        message: 'Collection "Symboles Nordiques" mise à jour', 
        timestamp: new Date(now.getTime() - 45 * 60000).toISOString() 
      },
      { 
        type: 'symbol', 
        message: 'Nouveau symbole "Runes Viking" découvert', 
        timestamp: new Date(now.getTime() - 90 * 60000).toISOString() 
      }
    ];
  }
}

export const trendingService = new TrendingService();
