
export interface MCPSearchRequest {
  query: string;
  toolRequests?: string[];
  contextData?: Record<string, any>;
}

export interface MCPSearchResponse {
  success: boolean;
  response: any;
  mcpTools: any[];
  mcpToolResults?: any[];
  timestamp: string;
  processingTime?: number;
  error?: string;
  debug?: any;
  mode?: string;
}

export interface MCPToolResult {
  toolName: string;
  result: any;
  error?: string;
  callId: string;
}

// Timeouts réduits et sécurisés
export const FUNCTION_TIMEOUT = 8000; // 8 secondes client
export const SAFETY_TIMEOUT = 12000; // 12 secondes pour reset automatique
