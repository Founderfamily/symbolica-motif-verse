
export interface Pattern {
  id: string;
  name: string;
  description?: string;
  symbol_id: string;
  pattern_type: 'geometric' | 'figurative' | 'abstract' | 'decorative';
  complexity_level: 'simple' | 'medium' | 'complex';
  cultural_significance?: string;
  historical_context?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  translations?: {
    [language: string]: {
      name?: string;
      description?: string;
      cultural_significance?: string;
      historical_context?: string;
    };
  };
}

export interface ImageAnnotation {
  id: string;
  image_id: string;
  image_type: 'symbol' | 'contribution';
  pattern_id?: string;
  annotation_data: {
    type: 'rectangle' | 'polygon' | 'circle';
    coordinates: number[];
    width?: number;
    height?: number;
    radius?: number;
  };
  confidence_score?: number;
  validation_status: 'pending' | 'validated' | 'rejected';
  created_by?: string;
  validated_by?: string;
  created_at: string;
  updated_at: string;
  notes?: string;
  pattern?: Pattern;
}

export interface AIPatternSuggestion {
  id: string;
  image_id: string;
  image_type: 'symbol' | 'contribution';
  suggested_patterns: {
    pattern_name: string;
    confidence_score: number;
    bounding_box: number[];
    description?: string;
  }[];
  processing_status: 'pending' | 'processing' | 'completed' | 'failed';
  ai_model_version?: string;
  processing_time_ms?: number;
  created_at: string;
  processed_at?: string;
  error_message?: string;
}

export interface ValidationVote {
  id: string;
  annotation_id: string;
  user_id: string;
  vote_type: 'approve' | 'reject' | 'needs_review';
  comment?: string;
  created_at: string;
}
