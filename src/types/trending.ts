
export interface TrendingMetric {
  id: string;
  entity_type: 'symbol' | 'collection' | 'contribution';
  entity_id: string;
  metric_type: 'view' | 'like' | 'comment' | 'share';
  user_id?: string;
  created_at: string;
}

export interface TrendingSymbolResult {
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

declare global {
  namespace Database {
    interface Functions {
      get_trending_symbols: {
        Args: {
          p_limit?: number;
          p_timeframe_hours?: number;
        };
        Returns: TrendingSymbolResult[];
      };
      calculate_trending_score: {
        Args: {
          p_entity_type: string;
          p_entity_id: string;
          p_timeframe_hours?: number;
        };
        Returns: number;
      };
    }
  }
}
