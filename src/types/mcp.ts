
export interface MCPSearchRequest {
  query: string;
  provider?: 'deepseek' | 'openai' | 'anthropic';
}

export interface MCPSearchResponse {
  success: boolean;
  content?: string;
  provider?: string;
  error?: string;
  timestamp: string;
  processingTime: number;
}
