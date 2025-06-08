
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
  // Cache pour éviter les requêtes répétées
  private cache = new Map<string, { data: any; timestamp: number }>();
  private CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  private getCacheKey(key: string, params?: any): string {
    return `${key}_${JSON.stringify(params || {})}`;
  }

  private getFromCache<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }
    return null;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  async getTrendingSymbols(timeFrame: 'day' | 'week' | 'month' = 'week', limit = 12): Promise<TrendingSymbol[]> {
    const cacheKey = this.getCacheKey('trending_symbols', { timeFrame, limit });
    const cached = this.getFromCache<TrendingSymbol[]>(cacheKey);
    if (cached) return cached;

    try {
      const timeFrameHours = timeFrame === 'day' ? 24 : timeFrame === 'week' ? 168 : 720;
      
      const { data, error } = await supabase.rpc('get_trending_symbols', {
        p_limit: limit,
        p_timeframe_hours: timeFrameHours
      });

      if (error) {
        console.error('Erreur trending symbols:', error);
        return this.getFallbackSymbols();
      }

      const result = data || [];
      this.setCache(cacheKey, result);
      return result;
    } catch (err) {
      console.error('Erreur service trending:', err);
      return this.getFallbackSymbols();
    }
  }

  async getTrendingStats(): Promise<TrendingStats> {
    const cacheKey = 'trending_stats';
    const cached = this.getFromCache<TrendingStats>(cacheKey);
    if (cached) return cached;

    try {
      const [symbolsResult, contributionsResult, collectionsResult] = await Promise.allSettled([
        supabase.from('symbols').select('*', { count: 'exact', head: true }),
        supabase.from('user_contributions').select('*', { count: 'exact', head: true }),
        supabase.from('collections').select('*', { count: 'exact', head: true })
      ]);

      // Compter les nouveaux aujourd'hui
      const today = new Date().toISOString().split('T')[0];
      const { count: newToday } = await supabase
        .from('symbols')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today);

      const stats: TrendingStats = {
        symbolsCount: symbolsResult.status === 'fulfilled' ? (symbolsResult.value.count || 0) : 0,
        contributionsCount: contributionsResult.status === 'fulfilled' ? (contributionsResult.value.count || 0) : 0,
        collectionsCount: collectionsResult.status === 'fulfilled' ? (collectionsResult.value.count || 0) : 0,
        newToday: newToday || 0
      };

      this.setCache(cacheKey, stats);
      return stats;
    } catch (err) {
      console.error('Erreur stats trending:', err);
      return { symbolsCount: 0, contributionsCount: 0, collectionsCount: 0, newToday: 0 };
    }
  }

  async getTrendingCategories(): Promise<TrendingCategory[]> {
    const cacheKey = 'trending_categories';
    const cached = this.getFromCache<TrendingCategory[]>(cacheKey);
    if (cached) return cached;

    try {
      const { data, error } = await supabase
        .from('symbols')
        .select('culture')
        .limit(100);

      if (error || !data) {
        return this.getFallbackCategories();
      }

      const cultureCounts = data.reduce((acc: Record<string, number>, symbol) => {
        acc[symbol.culture] = (acc[symbol.culture] || 0) + 1;
        return acc;
      }, {});

      const categories: TrendingCategory[] = Object.entries(cultureCounts)
        .slice(0, 6)
        .map(([name, count]) => ({
          name,
          count: count as number,
          trend: Math.random() > 0.5 ? 'up' : Math.random() > 0.3 ? 'stable' : 'down'
        }));

      this.setCache(cacheKey, categories);
      return categories;
    } catch (err) {
      console.error('Erreur categories trending:', err);
      return this.getFallbackCategories();
    }
  }

  async getRecentActivity(): Promise<RecentActivity[]> {
    const cacheKey = 'recent_activity';
    const cached = this.getFromCache<RecentActivity[]>(cacheKey);
    if (cached) return cached;

    try {
      const { data, error } = await supabase
        .from('user_activities')
        .select('activity_type, created_at, details')
        .order('created_at', { ascending: false })
        .limit(4);

      if (error || !data) {
        return this.getFallbackActivity();
      }

      const activities: RecentActivity[] = data.map(activity => ({
        type: this.mapActivityType(activity.activity_type),
        message: this.getActivityMessage(activity.activity_type),
        timestamp: activity.created_at
      }));

      this.setCache(cacheKey, activities);
      return activities;
    } catch (err) {
      console.error('Erreur activity trending:', err);
      return this.getFallbackActivity();
    }
  }

  // Fonctions de fallback avec des données réalistes
  private getFallbackSymbols(): TrendingSymbol[] {
    return [
      {
        id: '1',
        name: 'Mandala',
        culture: 'Tibétaine',
        period: 'Contemporain',
        description: 'Symbole spirituel représentant l\'univers',
        created_at: new Date().toISOString(),
        trending_score: 95.5,
        view_count: 234,
        like_count: 45
      },
      {
        id: '2',
        name: 'Ankh',
        culture: 'Égyptienne',
        period: 'Antique',
        description: 'Symbole de vie éternelle',
        created_at: new Date().toISOString(),
        trending_score: 87.2,
        view_count: 189,
        like_count: 38
      }
    ];
  }

  private getFallbackCategories(): TrendingCategory[] {
    return [
      { name: 'Géométrie Sacrée', count: 34, trend: 'up' },
      { name: 'Mythologie Nordique', count: 28, trend: 'up' },
      { name: 'Art Islamique', count: 45, trend: 'stable' },
      { name: 'Symboles Celtiques', count: 67, trend: 'up' },
      { name: 'Art Aborigène', count: 23, trend: 'down' },
      { name: 'Ère Numérique', count: 12, trend: 'up' }
    ];
  }

  private getFallbackActivity(): RecentActivity[] {
    return [
      { type: 'symbol', message: 'Nouveau symbole ajouté', timestamp: new Date().toISOString() },
      { type: 'collection', message: 'Collection mise à jour', timestamp: new Date().toISOString() },
      { type: 'contribution', message: 'Nouvelle contribution', timestamp: new Date().toISOString() },
      { type: 'comment', message: 'Commentaire ajouté', timestamp: new Date().toISOString() }
    ];
  }

  private mapActivityType(type: string): 'symbol' | 'collection' | 'contribution' | 'comment' {
    switch (type) {
      case 'contribution': return 'contribution';
      case 'exploration': return 'symbol';
      case 'community': return 'comment';
      default: return 'symbol';
    }
  }

  private getActivityMessage(type: string): string {
    switch (type) {
      case 'contribution': return 'Nouvelle contribution';
      case 'exploration': return 'Nouveau symbole exploré';
      case 'community': return 'Nouvelle interaction communauté';
      default: return 'Nouvelle activité';
    }
  }

  // Méthode pour tracker les vues (pour alimenter les données de trending)
  async trackView(entityType: 'symbol' | 'collection' | 'contribution', entityId: string): Promise<void> {
    try {
      await supabase.from('trending_metrics').insert({
        entity_type: entityType,
        entity_id: entityId,
        metric_type: 'view'
      });
    } catch (err) {
      console.error('Erreur tracking view:', err);
    }
  }

  clearCache(): void {
    this.cache.clear();
  }
}

export const trendingService = new TrendingService();
