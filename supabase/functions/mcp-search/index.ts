
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const deepseekApiKey = Deno.env.get('DEEPSEEK_API_KEY');

// Input sanitization function
function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') {
    throw new Error('Invalid input');
  }
  
  // Remove HTML tags and potentially dangerous content
  return input
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim()
    .slice(0, 500); // Limit length
}

// Rate limiting (simple in-memory store for demo)
const requestCounts = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10; // requests per minute
const RATE_WINDOW = 60000; // 1 minute

function checkRateLimit(clientId: string): boolean {
  const now = Date.now();
  const record = requestCounts.get(clientId);
  
  if (!record || now > record.resetTime) {
    requestCounts.set(clientId, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }
  
  if (record.count >= RATE_LIMIT) {
    return false;
  }
  
  record.count++;
  return true;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();
  const clientId = req.headers.get('x-forwarded-for') || 'unknown';
  
  try {
    // Rate limiting
    if (!checkRateLimit(clientId)) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Rate limit exceeded. Please try again later.',
        timestamp: new Date().toISOString(),
        processingTime: Date.now() - startTime
      }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { query } = await req.json();
    
    // Input validation and sanitization
    if (!query) {
      throw new Error('Query is required');
    }

    const sanitizedQuery = sanitizeInput(query);
    if (sanitizedQuery.length === 0) {
      throw new Error('Invalid query content');
    }

    if (!deepseekApiKey) {
      console.error('DEEPSEEK_API_KEY not configured');
      throw new Error('Service configuration error');
    }

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${deepseekApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'You are a cultural symbols expert. Provide detailed analysis of symbols, their meanings, and cultural contexts. Keep responses informative and appropriate.'
          },
          {
            role: 'user',
            content: sanitizedQuery
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      console.error(`DeepSeek API error: ${response.status}`);
      throw new Error('External service error');
    }

    const result = await response.json();
    const content = result.choices?.[0]?.message?.content || 'No response generated';

    // Sanitize the response content as well
    const sanitizedContent = content
      .replace(/<script[^>]*>.*?<\/script>/gi, '') // Remove script tags
      .replace(/javascript:/gi, ''); // Remove javascript: protocol

    return new Response(JSON.stringify({
      success: true,
      content: sanitizedContent,
      timestamp: new Date().toISOString(),
      processingTime: Date.now() - startTime
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Function error:', error);
    
    // Generic error response - don't expose internal details
    const errorMessage = error.message.includes('Rate limit') 
      ? error.message 
      : 'Service temporarily unavailable';

    return new Response(JSON.stringify({
      success: false,
      error: errorMessage,
      timestamp: new Date().toISOString(),
      processingTime: Date.now() - startTime
    }), {
      status: error.message.includes('Rate limit') ? 429 : 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
