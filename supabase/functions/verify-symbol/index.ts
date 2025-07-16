import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SymbolData {
  name: string;
  culture: string;
  period: string;
  description?: string;
  significance?: string;
  historical_context?: string;
}

interface VerificationRequest {
  api: string;
  symbol: SymbolData;
}

const verifyWithOpenAI = async (symbol: SymbolData) => {
  const apiKey = Deno.env.get('OPENAI_API_KEY');
  if (!apiKey) throw new Error('OpenAI API key not configured');

  const prompt = `En tant qu'expert en histoire et symbolisme, veuillez analyser et vérifier les informations suivantes sur ce symbole:

Nom: ${symbol.name}
Culture: ${symbol.culture}
Période: ${symbol.period}
Description: ${symbol.description || 'Non spécifiée'}
Signification: ${symbol.significance || 'Non spécifiée'}
Contexte historique: ${symbol.historical_context || 'Non spécifié'}

Veuillez évaluer:
1. L'exactitude historique de ces informations
2. La cohérence entre le nom, la culture et la période
3. La plausibilité de la description et de la signification
4. Toute incohérence ou erreur potentielle

Répondez avec:
- Un statut: "verified" (vérifié), "disputed" (contesté), ou "unverified" (non vérifié)
- Un niveau de confiance (0-100%)
- Un résumé en 2-3 phrases
- Une analyse détaillée avec vos sources de référence`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'Vous êtes un expert historien spécialisé dans les symboles et leur signification culturelle. Soyez précis et factuel dans vos analyses.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
    }),
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(`OpenAI API error: ${data.error?.message || response.statusText}`);
  }
  
  return parseVerificationResponse(data.choices[0].message.content, 'openai');
};

const verifyWithDeepSeek = async (symbol: SymbolData) => {
  const apiKey = Deno.env.get('DEEPSEEK_API_KEY');
  if (!apiKey) throw new Error('DeepSeek API key not configured');

  const prompt = `Analyze this cultural symbol for historical accuracy:

Symbol: ${symbol.name}
Culture: ${symbol.culture}
Period: ${symbol.period}
Description: ${symbol.description || 'Not specified'}
Significance: ${symbol.significance || 'Not specified'}
Historical context: ${symbol.historical_context || 'Not specified'}

Please verify the factual accuracy and provide:
- Status: verified/disputed/unverified
- Confidence level (0-100%)
- Brief summary
- Detailed analysis with reasoning`;

  const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: 'You are a cultural historian expert in symbols and their meanings. Provide factual, evidence-based analysis.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.2,
    }),
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(`DeepSeek API error: ${data.error?.message || response.statusText}`);
  }
  
  return parseVerificationResponse(data.choices[0].message.content, 'deepseek');
};

const verifyWithAnthropic = async (symbol: SymbolData) => {
  const apiKey = Deno.env.get('ANTHROPIC_API_KEY');
  if (!apiKey) throw new Error('Anthropic API key not configured');

  const prompt = `En tant qu'expert en histoire et symbolisme, veuillez analyser et vérifier les informations suivantes sur ce symbole:

Nom: ${symbol.name}
Culture: ${symbol.culture}
Période: ${symbol.period}
Description: ${symbol.description || 'Non spécifiée'}
Signification: ${symbol.significance || 'Non spécifiée'}
Contexte historique: ${symbol.historical_context || 'Non spécifié'}

Veuillez évaluer:
1. L'exactitude historique de ces informations
2. La cohérence entre le nom, la culture et la période
3. La plausibilité de la description et de la signification
4. Toute incohérence ou erreur potentielle

Répondez avec:
- Un statut: "verified" (vérifié), "disputed" (contesté), ou "unverified" (non vérifié)
- Un niveau de confiance (0-100%)
- Un résumé en 2-3 phrases
- Une analyse détaillée avec vos sources de référence`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 1000,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    }),
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(`Anthropic API error: ${data.error?.message || response.statusText}`);
  }
  
  return parseVerificationResponse(data.content[0].text, 'anthropic');
};

const verifyWithPerplexity = async (symbol: SymbolData) => {
  const apiKey = Deno.env.get('PERPLEXITY_API_KEY');
  if (!apiKey) throw new Error('Perplexity API key not configured');

  const prompt = `En tant qu'expert en histoire et symbolisme, veuillez analyser et vérifier les informations suivantes sur ce symbole:

Nom: ${symbol.name}
Culture: ${symbol.culture}
Période: ${symbol.period}
Description: ${symbol.description || 'Non spécifiée'}
Signification: ${symbol.significance || 'Non spécifiée'}
Contexte historique: ${symbol.historical_context || 'Non spécifié'}

Veuillez évaluer:
1. L'exactitude historique de ces informations
2. La cohérence entre le nom, la culture et la période
3. La plausibilité de la description et de la signification
4. Toute incohérence ou erreur potentielle

Répondez avec:
- Un statut: "verified" (vérifié), "disputed" (contesté), ou "unverified" (non vérifié)
- Un niveau de confiance (0-100%)
- Un résumé en 2-3 phrases
- Une analyse détaillée avec vos sources de référence`;

  const response = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.1-sonar-large-128k-online',
      messages: [
        {
          role: 'system',
          content: 'Vous êtes un expert historien spécialisé dans les symboles et leur signification culturelle. Soyez précis et factuel dans vos analyses.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.2,
      return_citations: true,
    }),
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(`Perplexity API error: ${data.error?.message || response.statusText}`);
  }
  
  return parseVerificationResponse(data.choices[0].message.content, 'perplexity', data.citations);
};

const verifyWithGemini = async (symbol: SymbolData) => {
  const apiKey = Deno.env.get('GEMINI_API_KEY');
  if (!apiKey) throw new Error('Gemini API key not configured');

  const prompt = `En tant qu'expert en histoire et symbolisme, veuillez analyser et vérifier les informations suivantes sur ce symbole:

Nom: ${symbol.name}
Culture: ${symbol.culture}
Période: ${symbol.period}
Description: ${symbol.description || 'Non spécifiée'}
Signification: ${symbol.significance || 'Non spécifiée'}
Contexte historique: ${symbol.historical_context || 'Non spécifié'}

Veuillez évaluer:
1. L'exactitude historique de ces informations
2. La cohérence entre le nom, la culture et la période
3. La plausibilité de la description et de la signification
4. Toute incohérence ou erreur potentielle

Répondez avec:
- Un statut: "verified" (vérifié), "disputed" (contesté), ou "unverified" (non vérifié)
- Un niveau de confiance (0-100%)
- Un résumé en 2-3 phrases
- Une analyse détaillée avec vos sources de référence`;

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 1000,
      }
    }),
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(`Gemini API error: ${data.error?.message || response.statusText}`);
  }
  
  return parseVerificationResponse(data.candidates[0].content.parts[0].text, 'gemini');
};

const parseVerificationResponse = (response: string, api: string, sources?: string[]) => {
  // Extract status, confidence, summary and details from response
  const statusMatch = response.toLowerCase().match(/status:?\s*(verified|disputed|unverified)/);
  const confidenceMatch = response.match(/confidence:?\s*(\d+)%?/i);
  
  // Default values
  let status = 'unverified';
  let confidence = 50;
  
  if (statusMatch) {
    status = statusMatch[1];
  } else {
    // Fallback: analyze content for verification keywords
    const verifiedKeywords = ['verified', 'accurate', 'correct', 'authentic', 'confirmed'];
    const disputedKeywords = ['disputed', 'questionable', 'unclear', 'uncertain', 'partial'];
    
    const lowerResponse = response.toLowerCase();
    if (verifiedKeywords.some(word => lowerResponse.includes(word))) {
      status = 'verified';
      confidence = 75;
    } else if (disputedKeywords.some(word => lowerResponse.includes(word))) {
      status = 'disputed';
      confidence = 40;
    }
  }
  
  if (confidenceMatch) {
    confidence = parseInt(confidenceMatch[1]);
  }
  
  // Extract summary (first paragraph or first few sentences)
  const sentences = response.split(/[.!?]+/).filter(s => s.trim().length > 10);
  const summary = sentences.slice(0, 2).join('. ').trim() + '.';
  
  return {
    api,
    status: status as 'verified' | 'disputed' | 'unverified',
    confidence,
    summary: summary || 'Analyse terminée',
    details: response,
    sources: sources || [],
  };
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { api, symbol }: VerificationRequest = await req.json();

    if (!api || !symbol) {
      return new Response(
        JSON.stringify({ error: 'API and symbol data are required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    let result;
    
    switch (api) {
      case 'openai':
        result = await verifyWithOpenAI(symbol);
        break;
      case 'deepseek':
        result = await verifyWithDeepSeek(symbol);
        break;
      case 'anthropic':
        result = await verifyWithAnthropic(symbol);
        break;
      case 'perplexity':
        result = await verifyWithPerplexity(symbol);
        break;
      case 'gemini':
        result = await verifyWithGemini(symbol);
        break;
      default:
        return new Response(
          JSON.stringify({ error: `Unsupported API: ${api}` }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
    }

    return new Response(
      JSON.stringify(result),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in verify-symbol function:', error);
    
    return new Response(
      JSON.stringify({ 
        api: 'unknown',
        status: 'error',
        confidence: 0,
        summary: 'Erreur lors de la vérification',
        details: error instanceof Error ? error.message : 'Erreur inconnue',
        sources: []
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});