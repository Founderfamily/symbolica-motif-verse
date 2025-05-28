
export interface MCPSearchRequest {
  query: string;
}

export interface MCPSearchResponse {
  success: boolean;
  content: string;
  timestamp: string;
  processingTime?: number;
  error?: string;
}
