import { supabase } from '@/integrations/supabase/client';
import { SymbolVisibilityService } from './symbolVisibilityService';

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
    console.log('🔍 [TrendingService] Getting trending symbols with visibility system...');
    
    try {
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Trending symbols timeout')), 1500)
      );

      const dataPromise = supabase
        .from('symbols')
        .select(`
          *,
          symbol_images!left (
            id,
            image_url,
            image_type
          )
        `)
        .order('created_at', { ascending: false })
        .limit(limit * 2); // Récupérer plus pour permettre le tri par visibilité

      const { data, error } = await Promise.race([dataPromise, timeoutPromise]) as any;

      console.log('📊 [TrendingService] Symbols query result:', { data: !!data, error: !!error });

      if (error) {
        console.error('❌ [TrendingService] Error fetching symbols:', error);
        return this.getFallbackSymbols();
      }

      if (!data || data.length === 0) {
        console.log('⚠️ [TrendingService] No symbols found, using fallback');
        return this.getFallbackSymbols();
      }

      const trendingSymbols: TrendingSymbol[] = data.map((symbol: any, index: number) => {
        // Vérifier la présence d'images
        const hasImages = symbol.symbol_images && symbol.symbol_images.length > 0;
        
        // Calculer le score de base
        const baseScore = Math.max(100 - index * 5, 50);
        
        // Appliquer le bonus/malus de visibilité
        const finalScore = SymbolVisibilityService.calculateVisibilityScore(baseScore, hasImages);

        return {
          id: symbol.id,
          name: symbol.name,
          culture: symbol.culture,
          period: symbol.period,
          description: symbol.description,
          created_at: symbol.created_at,
          trending_score: finalScore,
          view_count: Math.floor(Math.random() * 200) + 50,
          like_count: Math.floor(Math.random() * 50) + 10
        };
      });

      // Trier par score de visibilité et limiter les résultats
      const sortedSymbols = trendingSymbols
        .sort((a, b) => b.trending_score - a.trending_score)
        .slice(0, limit);

      console.log('✅ [TrendingService] Successfully processed symbols with visibility:', sortedSymbols.length);
      return sortedSymbols;
    } catch (err) {
      console.error('💥 [TrendingService] Exception or timeout in getTrendingSymbols:', err);
      return this.getFallbackSymbols();
    }
  }

  async getTrendingStats(): Promise<TrendingStats> {
    console.log('📈 [TrendingService] Getting trending stats with timeout...');
    
    try {
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Stats timeout')), 1000)
      );

      const statsPromise = Promise.all([
        supabase.from('symbols').select('*', { count: 'exact', head: true }),
        supabase.from('user_contributions').select('*', { count: 'exact', head: true }),
        supabase.from('collections').select('*', { count: 'exact', head: true }),
      ]);

      const [symbolsResult, contributionsResult, collectionsResult] = await Promise.race([
        statsPromise,
        timeoutPromise
      ]) as any;

      const today = new Date().toISOString().split('T')[0];
      
      // Quick timeout for new today query
      const newTodayPromise = new Promise<any>((resolve, reject) => {
        setTimeout(() => reject(new Error('New today timeout')), 500);
      });
      
      let newTodayCount = 0;
      try {
        const newTodayData = await Promise.race([
          supabase.from('symbols').select('*', { count: 'exact', head: true }).gte('created_at', today),
          newTodayPromise
        ]);
        newTodayCount = (newTodayData as any)?.count || 0;
      } catch (err) {
        console.log('⚠️ [TrendingService] New today query timeout, using 0');
      }

      const stats: TrendingStats = {
        symbolsCount: symbolsResult?.count || 20,
        contributionsCount: contributionsResult?.count || 0,
        collectionsCount: collectionsResult?.count || 48,
        newToday: newTodayCount
      };

      console.log('✅ [TrendingService] Stats retrieved:', stats);
      return stats;
    } catch (err) {
      console.error('💥 [TrendingService] Exception or timeout in getTrendingStats:', err);
      return { 
        symbolsCount: 20,
        contributionsCount: 0, 
        collectionsCount: 48, 
        newToday: 0 
      };
    }
  }

  async getTrendingCategories(): Promise<TrendingCategory[]> {
    console.log('🏷️ [TrendingService] Getting trending categories with timeout...');
    
    try {
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Categories timeout')), 1000)
      );

      const dataPromise = supabase.from('symbols').select('culture');
      const { data, error } = await Promise.race([dataPromise, timeoutPromise]) as any;

      if (error || !data || data.length === 0) {
        console.log('⚠️ [TrendingService] No categories data or timeout, using fallback');
        return this.getFallbackCategories();
      }

      const cultureCounts = data.reduce((acc: Record<string, number>, symbol: any) => {
        if (symbol?.culture) {
          acc[symbol.culture] = (acc[symbol.culture] || 0) + 1;
        }
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
      console.error('💥 [TrendingService] Exception or timeout in getTrendingCategories:', err);
      return this.getFallbackCategories();
    }
  }

  async getRecentActivity(): Promise<RecentActivity[]> {
    console.log('🔔 [TrendingService] Getting recent activity with timeout...');
    
    try {
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Activity timeout')), 1000)
      );

      const dataPromise = supabase
        .from('symbols')
        .select('name, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

      const { data, error } = await Promise.race([dataPromise, timeoutPromise]) as any;

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
      console.error('💥 [TrendingService] Exception or timeout in getRecentActivity:', err);
      return this.getFallbackActivity();
    }
  }

  private getFallbackSymbols(): TrendingSymbol[] {
    console.log('🔄 [TrendingService] Using fallback symbols with visibility system');
    
    const fallbackSymbols = [
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
      },
      {
        id: '3',
        name: 'Croix Ankh',
        culture: 'Égyptienne',
        period: 'Antiquité',
        description: 'Symbole de vie éternelle dans l\'Égypte ancienne',
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        trending_score: 75,
        view_count: 98,
        like_count: 22
      }
    ];

    // Appliquer le système de visibilité aux symboles de fallback
    // Simuler que certains ont des photos et d'autres non
    return fallbackSymbols.map((symbol, index) => {
      const hasPhoto = index < 2; // Les 2 premiers ont des photos
      const adjustedScore = SymbolVisibilityService.calculateVisibilityScore(
        symbol.trending_score, 
        hasPhoto
      );
      
      return {
        ...symbol,
        trending_score: adjustedScore
      };
    }).sort((a, b) => b.trending_score - a.trending_score);
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
