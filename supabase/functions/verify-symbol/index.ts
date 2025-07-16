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
  sources?: Array<{
    title: string;
    url: string;
    type: string;
    description?: string;
  }>;
}

interface VerificationRequest {
  api: string;
  symbol?: SymbolData;
  symbolId?: string;
  symbolName?: string;
}

const verifyWithOpenAI = async (symbol: SymbolData) => {
  const apiKey = Deno.env.get('OPENAI_API_KEY');
  if (!apiKey) throw new Error('OpenAI API key not configured');

  const sourcesText = symbol.sources && symbol.sources.length > 0 
    ? `\n\nSOURCES DE RÉFÉRENCE DISPONIBLES:\n${symbol.sources.map(s => `- ${s.title} (${s.type}): ${s.url}${s.description ? ` - ${s.description}` : ''}`).join('\n')}\n\nVeuillez consulter ces sources pour valider les informations ci-dessus.\n`
    : '\n\nAUCUNE SOURCE DE RÉFÉRENCE FOURNIE - Veuillez évaluer uniquement sur vos connaissances générales.\n';

  const prompt = `En tant qu'expert en histoire et symbolisme, veuillez analyser et vérifier les informations suivantes sur ce symbole:

Nom: ${symbol.name}
Culture: ${symbol.culture}
Période: ${symbol.period}
Description: ${symbol.description || 'Non spécifiée'}
Signification: ${symbol.significance || 'Non spécifiée'}
Contexte historique: ${symbol.historical_context || 'Non spécifié'}${sourcesText}
Veuillez évaluer:
1. L'exactitude historique de ces informations
2. La cohérence entre le nom, la culture et la période
3. La plausibilité de la description et de la signification
4. Toute incohérence ou erreur potentielle
5. La qualité et fiabilité des sources fournies (si disponibles)

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

  const sourcesText = symbol.sources && symbol.sources.length > 0 
    ? `\n\nAVAILABLE REFERENCE SOURCES:\n${symbol.sources.map(s => `- ${s.title} (${s.type}): ${s.url}${s.description ? ` - ${s.description}` : ''}`).join('\n')}\n\nPlease consult these sources to validate the information above. These sources should significantly influence your confidence level.\n`
    : '\n\nNO REFERENCE SOURCES PROVIDED - Please evaluate based only on general knowledge. This should result in a lower confidence level.\n';

  const prompt = `Analyze this cultural symbol for historical accuracy:

Symbol: ${symbol.name}
Culture: ${symbol.culture}
Period: ${symbol.period}
Description: ${symbol.description || 'Not specified'}
Significance: ${symbol.significance || 'Not specified'}
Historical context: ${symbol.historical_context || 'Not specified'}${sourcesText}
Please verify:
1. Historical accuracy of this information
2. Consistency between name, culture and period
3. Plausibility of description and significance
4. Any inconsistencies or potential errors
5. Quality and reliability of provided sources (if available)

Please provide:
- Status: verified/disputed/unverified
- Confidence level (0-100%) - Consider whether reliable sources are provided
- Brief summary in 2-3 sentences
- Detailed analysis with your reference sources`;

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

  const sourcesText = symbol.sources && symbol.sources.length > 0 
    ? `\n\nSOURCES DE RÉFÉRENCE DISPONIBLES:\n${symbol.sources.map(s => `- ${s.title} (${s.type}): ${s.url}${s.description ? ` - ${s.description}` : ''}`).join('\n')}\n\nVeuillez consulter ces sources pour valider les informations ci-dessus.\n`
    : '\n\nAUCUNE SOURCE DE RÉFÉRENCE FOURNIE - Veuillez évaluer uniquement sur vos connaissances générales.\n';

  const prompt = `En tant qu'expert en histoire et symbolisme, veuillez analyser et vérifier les informations suivantes sur ce symbole:

Nom: ${symbol.name}
Culture: ${symbol.culture}
Période: ${symbol.period}
Description: ${symbol.description || 'Non spécifiée'}
Signification: ${symbol.significance || 'Non spécifiée'}
Contexte historique: ${symbol.historical_context || 'Non spécifié'}${sourcesText}
Veuillez évaluer:
1. L'exactitude historique de ces informations
2. La cohérence entre le nom, la culture et la période
3. La plausibilité de la description et de la signification
4. Toute incohérence ou erreur potentielle
5. La qualité et fiabilité des sources fournies (si disponibles)

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
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 1024,
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

  const sourcesText = symbol.sources && symbol.sources.length > 0 
    ? `\n\nSOURCES DE RÉFÉRENCE DISPONIBLES:\n${symbol.sources.map(s => `- ${s.title} (${s.type}): ${s.url}${s.description ? ` - ${s.description}` : ''}`).join('\n')}\n\nVeuillez consulter ces sources pour valider les informations ci-dessus. Ces sources doivent significativement influencer votre niveau de confiance.\n`
    : '\n\nAUCUNE SOURCE DE RÉFÉRENCE FOURNIE - Veuillez évaluer uniquement sur vos connaissances générales. Ceci devrait résulter en un niveau de confiance plus faible.\n';

  const prompt = `En tant qu'expert en histoire et symbolisme, veuillez analyser et vérifier les informations suivantes sur ce symbole:

Nom: ${symbol.name}
Culture: ${symbol.culture}
Période: ${symbol.period}
Description: ${symbol.description || 'Non spécifiée'}
Signification: ${symbol.significance || 'Non spécifiée'}
Contexte historique: ${symbol.historical_context || 'Non spécifié'}${sourcesText}
Veuillez évaluer:
1. L'exactitude historique de ces informations
2. La cohérence entre le nom, la culture et la période
3. La plausibilité de la description et de la signification
4. Toute incohérence ou erreur potentielle
5. La qualité et fiabilité des sources fournies (si disponibles)

Répondez avec:
- Un statut: "verified" (vérifié), "disputed" (contesté), ou "unverified" (non vérifié)
- Un niveau de confiance (0-100%) - Considérez si des sources fiables sont fournies
- Un résumé en 2-3 phrases
- Une analyse détaillée avec vos sources de référence`;

  const response = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'sonar-pro',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 1000,
      temperature: 0.2,
      top_p: 0.9,
      return_citations: true,
      return_images: false,
      return_related_questions: false,
      search_recency_filter: 'month'
    }),
  });

  const data = await response.json();
  
  if (!response.ok) {
    console.error('Perplexity API Error:', data);
    throw new Error(`Perplexity API error: ${data.error?.message || data.message || response.statusText}`);
  }
  
  return parseVerificationResponse(data.choices[0].message.content, 'perplexity', data.citations);
};

const verifyWithGemini = async (symbol: SymbolData) => {
  const apiKey = Deno.env.get('GEMINI_API_KEY');
  if (!apiKey) throw new Error('Gemini API key not configured');

  const sourcesText = symbol.sources && symbol.sources.length > 0 
    ? `\n\nSOURCES DE RÉFÉRENCE DISPONIBLES:\n${symbol.sources.map(s => `- ${s.title} (${s.type}): ${s.url}${s.description ? ` - ${s.description}` : ''}`).join('\n')}\n\nVeuillez consulter ces sources pour valider les informations ci-dessus. Ces sources doivent significativement influencer votre niveau de confiance.\n`
    : '\n\nAUCUNE SOURCE DE RÉFÉRENCE FOURNIE - Veuillez évaluer uniquement sur vos connaissances générales. Ceci devrait résulter en un niveau de confiance plus faible.\n';

  const prompt = `En tant qu'expert en histoire et symbolisme, veuillez analyser et vérifier les informations suivantes sur ce symbole:

Nom: ${symbol.name}
Culture: ${symbol.culture}
Période: ${symbol.period}
Description: ${symbol.description || 'Non spécifiée'}
Signification: ${symbol.significance || 'Non spécifiée'}
Contexte historique: ${symbol.historical_context || 'Non spécifié'}${sourcesText}
Veuillez évaluer:
1. L'exactitude historique de ces informations
2. La cohérence entre le nom, la culture et la période
3. La plausibilité de la description et de la signification
4. Toute incohérence ou erreur potentielle
5. La qualité et fiabilité des sources fournies (si disponibles)

Répondez avec:
- Un statut: "verified" (vérifié), "disputed" (contesté), ou "unverified" (non vérifié)
- Un niveau de confiance (0-100%) - Considérez si des sources fiables sont fournies
- Un résumé en 2-3 phrases
- Une analyse détaillée avec vos sources de référence`;

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
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
        topK: 32,
        topP: 1,
        maxOutputTokens: 1024,
        stopSequences: []
      },
      safetySettings: [
        {
          "category": "HARM_CATEGORY_HARASSMENT",
          "threshold": "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          "category": "HARM_CATEGORY_HATE_SPEECH",
          "threshold": "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    }),
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(`Gemini API error: ${data.error?.message || response.statusText}`);
  }
  
  return parseVerificationResponse(data.candidates[0].content.parts[0].text, 'gemini');
};

function extractConfidenceScore(text: string, api: string): number {
  // Check for reliable sources indicators first - higher scoring
  if (hasReliableSourcesIndicators(text)) {
    const baseScore = extractBasicConfidence(text);
    return Math.min(95, baseScore + 20); // Bonus for having reliable sources
  }
  
  // Check for no sources indicators - strict scoring
  if (hasNoSourcesIndicators(text)) {
    return Math.min(25, extractBasicConfidence(text)); // Maximum 25% if no sources
  }
  
  // Enhanced confidence percentage extraction with multilingual support
  const patterns = [
    /confidence[:\s]*(\d+)%/i,
    /(\d+)%\s*confidence/i,
    /score[:\s]*(\d+)%/i,
    /(\d+)%\s*score/i,
    /fiabilité[:\s]*(\d+)%/i,
    /(\d+)%\s*fiabilité/i,
    /niveau de confiance[:\s]*(\d+)%/i,
    /(\d+)%\s*niveau de confiance/i,
    /certitude[:\s]*(\d+)%/i,
    /(\d+)%\s*certitude/i,
    /reliability[:\s]*(\d+)%/i,
    /(\d+)%\s*reliability/i,
    /certain[ty]*[:\s]*(\d+)%/i,
    /(\d+)%\s*certain/i
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const score = parseInt(match[1]);
      // Strict cap at 30% if no sources detected even with explicit score
      return hasNoSourcesIndicators(text) ? Math.min(30, score) : score;
    }
  }
  
  // API-specific patterns with much stricter scoring
  if (api === 'openai') {
    if (text.includes('highly confident') || text.includes('très confiant')) return 75;
    if (text.includes('confident') || text.includes('confiant')) return 60;
    if (text.includes('likely') || text.includes('probable')) return 45;
    if (text.includes('possible') || text.includes('might') || text.includes('pourrait')) return 25;
    if (text.includes('uncertain') || text.includes('unclear') || text.includes('incertain')) return 15;
  }
  
  if (api === 'anthropic') {
    if (text.includes('high confidence') || text.includes('haute confiance')) return 70;
    if (text.includes('moderate confidence') || text.includes('confiance modérée')) return 50;
    if (text.includes('low confidence') || text.includes('faible confiance')) return 25;
    if (text.includes('uncertain') || text.includes('incertain')) return 15;
  }
  
  if (api === 'deepseek') {
    if (text.includes('very reliable') || text.includes('highly accurate')) return 70;
    if (text.includes('reliable') || text.includes('accurate')) return 55;
    if (text.includes('somewhat reliable') || text.includes('partiellement fiable')) return 35;
    if (text.includes('unreliable') || text.includes('inaccurate') || text.includes('peu fiable')) return 15;
  }
  
  if (api === 'perplexity') {
    if (text.includes('well-documented') || text.includes('multiple sources') || text.includes('bien documenté')) return 75;
    if (text.includes('documented') || text.includes('sources available') || text.includes('documenté')) return 55;
    if (text.includes('limited sources') || text.includes('few references') || text.includes('sources limitées')) return 25;
    if (text.includes('no clear sources') || text.includes('unverified') || text.includes('pas de sources claires')) return 10;
  }
  
  if (api === 'gemini') {
    if (text.includes('high certainty') || text.includes('well-established') || text.includes('bien établi')) return 70;
    if (text.includes('moderate certainty') || text.includes('established') || text.includes('établi')) return 50;
    if (text.includes('low certainty') || text.includes('uncertain') || text.includes('peu certain')) return 25;
    if (text.includes('very uncertain') || text.includes('unestablished') || text.includes('très incertain')) return 15;
  }
  
  return 25; // Default fallback
}

function hasReliableSourcesIndicators(text: string): boolean {
  const lowerText = text.toLowerCase();
  const reliableSourcesIndicators = [
    // English indicators
    'france bleu',
    'reliable sources',
    'documented sources',
    'credible sources',
    'official sources',
    'verified sources',
    'multiple sources',
    'well-documented',
    'authoritative sources',
    'peer-reviewed',
    'scholarly sources',
    'academic sources',
    'museum sources',
    'historical records',
    'official documentation',
    'archive sources',
    'reputable sources',
    'established sources',
    
    // French indicators
    'sources fiables',
    'sources documentées',
    'sources crédibles',
    'sources officielles',
    'sources vérifiées',
    'sources multiples',
    'bien documenté',
    'sources autoritaires',
    'sources académiques',
    'sources savantes',
    'sources de musée',
    'archives historiques',
    'documentation officielle',
    'sources d\'archives',
    'sources réputées',
    'sources établies'
  ];
  
  return reliableSourcesIndicators.some(indicator => lowerText.includes(indicator));
}

function extractBasicConfidence(text: string): number {
  // Helper function to extract basic confidence without source penalty
  const patterns = [
    /confidence[:\s]*(\d+)%/i,
    /(\d+)%\s*confidence/i,
    /score[:\s]*(\d+)%/i,
    /(\d+)%\s*certain/i,
    /reliability[:\s]*(\d+)%/i,
    /fiabilité[:\s]*(\d+)%/i
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return parseInt(match[1]);
    }
  }
  return 15;
}

function hasNoSourcesIndicators(text: string): boolean {
  const lowerText = text.toLowerCase();
  const noSourcesIndicators = [
    // English indicators
    'no reliable sources',
    'insufficient information',
    'cannot verify',
    'no sources',
    'lack of sources',
    'insufficient evidence',
    'no concrete evidence',
    'difficult to verify',
    'little documentation',
    'lack of documentation',
    'no historical evidence',
    'cannot confirm',
    'unable to verify',
    'unverified claim',
    'no documentation',
    'limited evidence',
    'no clear sources',
    'uncertain origins',
    'dubious authenticity',
    'questionable sources',
    'unreliable information',
    'no supporting evidence',
    'lacks evidence',
    'insufficient data',
    
    // French indicators
    'pas de sources fiables',
    'informations insuffisantes',
    'sources manquantes',
    'aucune source',
    'manque de sources',
    'données insuffisantes',
    'preuves insuffisantes',
    'pas de preuves concrètes',
    'impossible à vérifier',
    'difficile à vérifier',
    'peu de documentation',
    'manque de documentation',
    'pas de preuves historiques',
    'ne peut pas confirmer',
    'incapable de vérifier',
    'affirmation non vérifiée',
    'pas de documentation',
    'preuves limitées',
    'pas de sources claires',
    'origines incertaines',
    'authenticité douteuse',
    'sources douteuses',
    'informations peu fiables',
    'aucune preuve à l\'appui',
    'manque de preuves',
    'données insuffisantes',
    
    // German indicators (common in academic sources)
    'keine zuverlässigen quellen',
    'unzureichende informationen',
    'nicht verifizierbar',
    'keine quellen',
    'mangel an quellen',
    
    // Spanish indicators
    'no hay fuentes fiables',
    'información insuficiente',
    'no se puede verificar',
    'sin fuentes',
    'falta de fuentes',
    
    // Italian indicators
    'nessuna fonte affidabile',
    'informazioni insufficienti',
    'non verificabile',
    'mancanza di fonti'
  ];
  
  return noSourcesIndicators.some(indicator => lowerText.includes(indicator));
}

const parseVerificationResponse = (response: string, api: string, sources?: string[]) => {
  // Extract status from response
  const statusMatch = response.toLowerCase().match(/status:?\s*(verified|disputed|unverified)/);
  
  // Use improved confidence extraction
  const confidence = extractConfidenceScore(response, api);
  
  // Determine status based on content analysis
  let status = 'unverified';
  
  if (statusMatch) {
    status = statusMatch[1];
  } else {
    // Analyze content for verification keywords and lack of sources
    const lowerResponse = response.toLowerCase();
    
    if (hasNoSourcesIndicators(response)) {
      status = 'unverified';
    } else {
      const verifiedKeywords = ['verified', 'accurate', 'correct', 'authentic', 'confirmed'];
      const disputedKeywords = ['disputed', 'questionable', 'unclear', 'uncertain', 'partial'];
      
      if (verifiedKeywords.some(word => lowerResponse.includes(word))) {
        status = 'verified';
      } else if (disputedKeywords.some(word => lowerResponse.includes(word))) {
        status = 'disputed';
      }
    }
  }
  
  // Force status based on confidence level and content analysis
  if (confidence <= 30 || hasNoSourcesIndicators(response)) {
    status = 'unverified';
  } else if (confidence <= 60) {
    status = 'disputed';
  } else if (confidence >= 75 || hasReliableSourcesIndicators(response)) {
    status = 'verified';
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
    const { api, symbol, symbolId, symbolName, userId, autoSave }: VerificationRequest & { 
      userId?: string; 
      autoSave?: boolean 
    } = await req.json();

    if (!api || (!symbol && !symbolId)) {
      return new Response(
        JSON.stringify({ error: 'API and symbol data (symbol object or symbolId) are required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // If we only have symbolId, fetch symbol data from database
    let symbolData: SymbolData;
    if (symbol) {
      symbolData = symbol;
    } else if (symbolId) {
      try {
        const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2.49.4');
        
        const supabase = createClient(
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
          {
            auth: {
              autoRefreshToken: false,
              persistSession: false
            }
          }
        );

        const { data: symbolFromDb, error } = await supabase
          .from('symbols')
          .select('name, culture, period, description, significance, historical_context, sources')
          .eq('id', symbolId)
          .single();

        if (error || !symbolFromDb) {
          return new Response(
            JSON.stringify({ error: 'Symbol not found in database' }),
            { 
              status: 404, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }

        symbolData = {
          name: symbolFromDb.name,
          culture: symbolFromDb.culture,
          period: symbolFromDb.period,
          description: symbolFromDb.description,
          significance: symbolFromDb.significance,
          historical_context: symbolFromDb.historical_context,
          sources: symbolFromDb.sources || []
        };
      } catch (dbError) {
        console.error('Error fetching symbol from database:', dbError);
        // Fallback to minimal data if available
        symbolData = {
          name: symbolName || 'Symbole inconnu',
          culture: 'Culture non spécifiée',
          period: 'Période non spécifiée'
        };
      }
    } else {
      return new Response(
        JSON.stringify({ error: 'Either symbol object or symbolId must be provided' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    let result;
    
    switch (api) {
      case 'openai':
        result = await verifyWithOpenAI(symbolData);
        break;
      case 'deepseek':
        result = await verifyWithDeepSeek(symbolData);
        break;
      case 'anthropic':
        result = await verifyWithAnthropic(symbolData);
        break;
      case 'perplexity':
        result = await verifyWithPerplexity(symbolData);
        break;
      case 'gemini':
        result = await verifyWithGemini(symbolData);
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

    // Auto-save if requested
    if (autoSave && symbolId && userId) {
      try {
        const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2.49.4');
        
        const supabase = createClient(
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
          {
            auth: {
              autoRefreshToken: false,
              persistSession: false
            }
          }
        );

        await supabase.from('symbol_verifications').insert({
          symbol_id: symbolId,
          api: result.api,
          status: result.status,
          confidence: result.confidence,
          summary: result.summary,
          details: result.details,
          sources: result.sources || [],
          verified_by: userId
        });

        console.log(`Auto-saved verification result for ${api} on symbol ${symbolId}`);
      } catch (saveError) {
        console.error('Error auto-saving verification result:', saveError);
        // Continue with the response even if save fails
      }
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