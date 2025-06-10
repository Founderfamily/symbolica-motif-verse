
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Configuration des API keys
const deepseekApiKey = Deno.env.get('DEEPSEEK_API_KEY');
const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');

// Input sanitization function
function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') {
    throw new Error('Invalid input');
  }
  
  return input
    .replace(/<[^>]*>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim()
    .slice(0, 2000);
}

// Rate limiting
const requestCounts = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 15;
const RATE_WINDOW = 60000;

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

async function callOpenAI(prompt: string): Promise<string> {
  if (!openaiApiKey) throw new Error('OpenAI API key not configured');
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openaiApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Tu es un expert en histoire et symboles culturels. Réponds de manière précise et détaillée en français.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const result = await response.json();
  return result.choices?.[0]?.message?.content || 'Aucune réponse générée';
}

async function callDeepSeek(prompt: string): Promise<string> {
  if (!deepseekApiKey) throw new Error('DeepSeek API key not configured');
  
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
          content: 'Tu es un expert historien spécialisé dans les symboles et traditions culturelles. Réponds avec précision et détail en français.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    })
  });

  if (!response.ok) {
    throw new Error(`DeepSeek API error: ${response.status}`);
  }

  const result = await response.json();
  return result.choices?.[0]?.message?.content || 'Aucune réponse générée';
}

async function callAnthropic(prompt: string): Promise<string> {
  if (!anthropicApiKey) throw new Error('Anthropic API key not configured');
  
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': anthropicApiKey,
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1000,
      messages: [
        {
          role: 'user',
          content: `Tu es un expert en histoire et symboles culturels. Réponds de manière précise et détaillée en français.\n\n${prompt}`
        }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`Anthropic API error: ${response.status}`);
  }

  const result = await response.json();
  return result.content?.[0]?.text || 'Aucune réponse générée';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();
  const clientId = req.headers.get('x-forwarded-for') || 'unknown';
  
  try {
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

    const { query, provider = 'deepseek' } = await req.json();
    
    if (!query) {
      throw new Error('Query is required');
    }

    const sanitizedQuery = sanitizeInput(query);
    if (sanitizedQuery.length === 0) {
      throw new Error('Invalid query content');
    }

    let content: string;
    let usedProvider = provider;

    // Essayer le provider demandé, avec fallback automatique
    try {
      switch (provider) {
        case 'openai':
          content = await callOpenAI(sanitizedQuery);
          break;
        case 'anthropic':
          content = await callAnthropic(sanitizedQuery);
          break;
        case 'deepseek':
        default:
          content = await callDeepSeek(sanitizedQuery);
          break;
      }
    } catch (error) {
      console.warn(`${provider} failed, trying fallback:`, error.message);
      
      // Fallback intelligent
      if (provider !== 'deepseek' && deepseekApiKey) {
        content = await callDeepSeek(sanitizedQuery);
        usedProvider = 'deepseek';
      } else if (provider !== 'openai' && openaiApiKey) {
        content = await callOpenAI(sanitizedQuery);
        usedProvider = 'openai';
      } else if (provider !== 'anthropic' && anthropicApiKey) {
        content = await callAnthropic(sanitizedQuery);
        usedProvider = 'anthropic';
      } else {
        throw error;
      }
    }

    // Sanitize response content
    const sanitizedContent = content
      .replace(/<script[^>]*>.*?<\/script>/gi, '')
      .replace(/javascript:/gi, '');

    return new Response(JSON.stringify({
      success: true,
      content: sanitizedContent,
      provider: usedProvider,
      timestamp: new Date().toISOString(),
      processingTime: Date.now() - startTime
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Function error:', error);
    
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
