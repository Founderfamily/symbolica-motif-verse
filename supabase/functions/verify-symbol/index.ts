
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

  const existingSourcesText = symbol.sources && symbol.sources.length > 0 
    ? `\n\nSOURCES DE RÉFÉRENCE DOCUMENTÉES:\n${symbol.sources.map(s => `- ${s.title || s.description} (${s.type || 'source'}): ${s.url || s.citation || 'non spécifiée'}${s.description ? ` - ${s.description}` : ''}`).join('\n')}\n`
    : '\n\nAUCUNE SOURCE DE RÉFÉRENCE DOCUMENTÉE.\n';

  const prompt = `PHASE 1 - RECHERCHE DE SOURCES ACADÉMIQUES:
En tant qu'expert en histoire et symbolisme, listez d'abord 3-5 sources académiques légitimes que vous connaissez sur ce symbole culturel:

Nom: ${symbol.name}
Culture: ${symbol.culture}
Période: ${symbol.period}${existingSourcesText}
Recherchez et listez des sources fiables comme:
- Musées nationaux et institutions culturelles
- Ouvrages académiques de référence  
- Articles de revues scientifiques
- Collections de musées spécialisés

Format pour les nouvelles sources trouvées:
SOURCES SUPPLÉMENTAIRES TROUVÉES:
- [Description] - [Citation complète]

PHASE 2 - ÉVALUATION:
Maintenant, en considérant TOUTES les sources (documentées + trouvées), évaluez:
1. L'exactitude historique de ces informations
2. La cohérence entre le nom, la culture et la période
3. La plausibilité de la description et de la signification
4. La qualité et fiabilité de toutes les sources disponibles

Répondez avec:
- Un statut: "verified" (vérifié), "disputed" (contesté), ou "unverified" (non vérifié)
- Un niveau de confiance (0-100%) - BONUS si sources fiables trouvées
- Un résumé en 2-3 phrases
- Une analyse détaillée`;

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

  const existingSourcesText = symbol.sources && symbol.sources.length > 0 
    ? `\n\nDOCUMENTED REFERENCE SOURCES:\n${symbol.sources.map(s => `- ${s.title || s.description} (${s.type || 'source'}): ${s.url || s.citation || 'not specified'}${s.description ? ` - ${s.description}` : ''}`).join('\n')}\n`
    : '\n\nNO DOCUMENTED REFERENCE SOURCES.\n';

  const prompt = `PHASE 1 - ACADEMIC SOURCE SEARCH:
As a cultural historian expert, first list 3-5 legitimate academic sources you know about this cultural symbol:

Symbol: ${symbol.name}
Culture: ${symbol.culture}
Period: ${symbol.period}${existingSourcesText}
Search for reliable sources such as:
- National museums and cultural institutions
- Academic reference works
- Scientific journal articles
- Specialized museum collections

Format for found sources:
ADDITIONAL SOURCES FOUND:
- [Description] - [Complete citation]

PHASE 2 - EVALUATION:
Now, considering ALL sources (documented + found), evaluate:
1. Historical accuracy of this information
2. Consistency between name, culture and period
3. Plausibility of description and significance
4. Quality and reliability of all available sources

Please provide:
- Status: verified/disputed/unverified
- Confidence level (0-100%) - BONUS if reliable sources found
- Brief summary in 2-3 sentences
- Detailed analysis`;

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

  const existingSourcesText = symbol.sources && symbol.sources.length > 0 
    ? `\n\nSOURCES DE RÉFÉRENCE DOCUMENTÉES:\n${symbol.sources.map(s => `- ${s.title || s.description} (${s.type || 'source'}): ${s.url || s.citation || 'non spécifiée'}${s.description ? ` - ${s.description}` : ''}`).join('\n')}\n`
    : '\n\nAUCUNE SOURCE DE RÉFÉRENCE DOCUMENTÉE.\n';

  const prompt = `PHASE 1 - RECHERCHE DE SOURCES ACADÉMIQUES:
En tant qu'expert en histoire et symbolisme, listez d'abord 3-5 sources académiques légitimes que vous connaissez sur ce symbole culturel:

Nom: ${symbol.name}
Culture: ${symbol.culture}
Période: ${symbol.period}${existingSourcesText}
Recherchez des sources fiables comme:
- Musées nationaux et institutions culturelles
- Ouvrages académiques de référence
- Articles de revues scientifiques
- Collections de musées spécialisés

Format pour les nouvelles sources trouvées:
SOURCES SUPPLÉMENTAIRES TROUVÉES:
- [Description] - [Citation complète]

PHASE 2 - ÉVALUATION:
Maintenant, en considérant TOUTES les sources (documentées + trouvées), évaluez:
1. L'exactitude historique de ces informations
2. La cohérence entre le nom, la culture et la période
3. La plausibilité de la description et de la signification
4. La qualité et fiabilité de toutes les sources disponibles

Répondez avec:
- Un statut: "verified" (vérifié), "disputed" (contesté), ou "unverified" (non vérifié)
- Un niveau de confiance (0-100%) - BONUS si sources fiables trouvées
- Un résumé en 2-3 phrases
- Une analyse détaillée`;

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

  const existingSourcesText = symbol.sources && symbol.sources.length > 0 
    ? `\n\nSOURCES DE RÉFÉRENCE DOCUMENTÉES:\n${symbol.sources.map(s => `- ${s.title || s.description} (${s.type || 'source'}): ${s.url || s.citation || 'non spécifiée'}${s.description ? ` - ${s.description}` : ''}`).join('\n')}\n`
    : '\n\nAUCUNE SOURCE DE RÉFÉRENCE DOCUMENTÉE.\n';

  const prompt = `PHASE 1 - RECHERCHE DE SOURCES ACADÉMIQUES:
En tant qu'expert en histoire et symbolisme, listez d'abord 3-5 sources académiques légitimes que vous connaissez sur ce symbole culturel:

Nom: ${symbol.name}
Culture: ${symbol.culture}
Période: ${symbol.period}${existingSourcesText}
Recherchez des sources fiables comme:
- Musées nationaux et institutions culturelles
- Ouvrages académiques de référence
- Articles de revues scientifiques
- Collections de musées spécialisés

Format pour les nouvelles sources trouvées:
SOURCES SUPPLÉMENTAIRES TROUVÉES:
- [Description] - [Citation complète]

PHASE 2 - ÉVALUATION:
Maintenant, en considérant TOUTES les sources (documentées + trouvées), évaluez:
1. L'exactitude historique de ces informations
2. La cohérence entre le nom, la culture et la période
3. La plausibilité de la description et de la signification
4. La qualité et fiabilité de toutes les sources disponibles

Répondez avec:
- Un statut: "verified" (vérifié), "disputed" (contesté), ou "unverified" (non vérifié)
- Un niveau de confiance (0-100%) - BONUS si sources fiables trouvées
- Un résumé en 2-3 phrases
- Une analyse détaillée`;

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

  const existingSourcesText = symbol.sources && symbol.sources.length > 0 
    ? `\n\nSOURCES DE RÉFÉRENCE DOCUMENTÉES:\n${symbol.sources.map(s => `- ${s.title || s.description} (${s.type || 'source'}): ${s.url || s.citation || 'non spécifiée'}${s.description ? ` - ${s.description}` : ''}`).join('\n')}\n`
    : '\n\nAUCUNE SOURCE DE RÉFÉRENCE DOCUMENTÉE.\n';

  const prompt = `MISSION: En tant qu'expert collaboratif en histoire et symbolisme, enrichissez activement la base de données avec de nouvelles sources académiques.

PHASE 1 - RECHERCHE PROACTIVE DE SOURCES:
Symbole à enrichir:
- Nom: ${symbol.name}
- Culture: ${symbol.culture}
- Période: ${symbol.period}${existingSourcesText}

🔍 RECHERCHEZ ET LISTEZ 3-5 SOURCES ACADÉMIQUES SUPPLÉMENTAIRES que vous connaissez:
- Ouvrages de référence sur cette culture/période
- Musées et institutions spécialisées
- Publications scientifiques reconnues
- Collections documentaires établies

FORMAT OBLIGATOIRE pour les nouvelles sources trouvées:
**SOURCES SUPPLÉMENTAIRES TROUVÉES:**
- [Nom institution/auteur] - [Titre complet] - [Type: musée/livre/article/etc.]
- [Nom institution/auteur] - [Titre complet] - [Type: musée/livre/article/etc.]

PHASE 2 - ÉVALUATION BIENVEILLANTE:
Adoptez une approche CONSTRUCTIVE en évaluant:
✅ Points forts: Que confirment les sources existantes et nouvelles?
✅ Cohérence historique: Le symbole s'inscrit-il logiquement dans son contexte?
✅ Qualité des informations: Les descriptions sont-elles plausibles?
✅ Richesse documentaire: Combien de sources (existantes + nouvelles) supportent les informations?

⚠️ ATTENTION: Ne pénalisez PAS pour des "formats de citation imparfaits" - valorisez le CONTENU des sources.

RÉPONSE ATTENDUE:
- **Statut**: verified/disputed/unverified
- **Niveau de confiance**: 0-100% (BONUS: +20% si vous trouvez 3+ nouvelles sources fiables)
- **Résumé**: 2-3 phrases positives sur les confirmations trouvées
- **Analyse détaillée**: Focus sur les CONFIRMATIONS plutôt que les lacunes`;

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
  
  const geminiResponse = data.candidates[0].content.parts[0].text;
  console.log(`Gemini raw response for symbol ${symbol.name}:`, geminiResponse);
  
  return parseVerificationResponse(geminiResponse, 'gemini');
};

function extractConfidenceScore(text: string, api: string): number {
  console.log(`Extracting confidence from ${api} response (first 400 chars): ${text.substring(0, 400)}`);
  
  const normalizedText = text.toLowerCase().replace(/\s+/g, ' ');
  
  const patterns = [
    /niveau de confiance[:\s]*(\d+)\s*%/gi,
    /confiance[:\s]*(\d+)\s*%/gi,
    /confidence[:\s]*(\d+)\s*%/gi,
    /(\d+)\s*%\s*de confiance/gi,
    /(\d+)\s*%\s*confidence/gi,
    /\*\*niveau de confiance[:\s]*(\d+)\s*%\*\*/gi,
    /\*\*confiance[:\s]*(\d+)\s*%\*\*/gi,
    /\*\*(\d+)\s*%\*\*/g,
    /\*(\d+)\s*%\*/g,
    /\b(\d+)\s*%\b/g
  ];

  let foundScores: number[] = [];
  let patternUsed = '';
  
  for (let i = 0; i < patterns.length; i++) {
    const pattern = patterns[i];
    let match;
    pattern.lastIndex = 0;
    
    while ((match = pattern.exec(normalizedText)) !== null) {
      const score = parseInt(match[1]);
      if (score >= 0 && score <= 100) {
        foundScores.push(score);
        patternUsed = `Pattern ${i + 1}: ${pattern.source.substring(0, 50)}...`;
        
        if (i < 3 && (pattern.source.includes('confiance') || pattern.source.includes('confidence'))) {
          console.log(`Found confidence score: ${score}% for API: ${api} using ${patternUsed}`);
          return score;
        }
      }
    }
    
    if (foundScores.length > 0 && i < 6) {
      break;
    }
  }
  
  if (foundScores.length > 0) {
    const meaningfulScores = foundScores.filter(s => s >= 10);
    if (meaningfulScores.length > 0) {
      const selectedScore = Math.max(...meaningfulScores);
      console.log(`Selected confidence score: ${selectedScore}% for API: ${api} from scores: [${foundScores.join(', ')}] using ${patternUsed}`);
      
      if (api === 'gemini' && hasReliableSourcesIndicators(text) && selectedScore >= 50) {
        const boostedScore = Math.min(95, selectedScore + 25);
        console.log(`Gemini source bonus applied: ${boostedScore}% (was ${selectedScore}%)`);
        return boostedScore;
      }
      
      return selectedScore;
    }
    const fallbackScore = Math.max(...foundScores);
    console.log(`Using fallback score: ${fallbackScore}% for API: ${api} from low scores: [${foundScores.join(', ')}]`);
    return fallbackScore;
  }

  console.log(`No percentage found, checking textual indicators for API: ${api}`);
  
  if (hasReliableSourcesIndicators(text)) {
    const baseScore = extractBasicConfidence(text);
    const finalScore = Math.min(95, baseScore + 20);
    console.log(`Reliable sources bonus applied: ${finalScore}% for API: ${api}`);
    return finalScore;
  }
  
  if (hasNoSourcesIndicators(text)) {
    const finalScore = Math.min(25, extractBasicConfidence(text));
    console.log(`No sources penalty applied: ${finalScore}% for API: ${api}`);
    return finalScore;
  }

  let textualScore = 25;
  
  if (api === 'openai') {
    if (text.includes('highly confident') || text.includes('très confiant')) textualScore = 75;
    else if (text.includes('confident') || text.includes('confiant')) textualScore = 60;
    else if (text.includes('likely') || text.includes('probable')) textualScore = 45;
    else if (text.includes('possible') || text.includes('might') || text.includes('pourrait')) textualScore = 25;
    else if (text.includes('uncertain') || text.includes('unclear') || text.includes('incertain')) textualScore = 15;
  }
  
  console.log(`Using textual pattern score: ${textualScore}% for API: ${api}`);
  return textualScore;
}

function hasReliableSourcesIndicators(text: string): boolean {
  const lowerText = text.toLowerCase();
  const reliableSourcesIndicators = [
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
    'données insuffisantes'
  ];
  
  return noSourcesIndicators.some(indicator => lowerText.includes(indicator));
}

const parseVerificationResponse = (response: string, api: string, sources?: string[]) => {
  let statusMatch = response.toLowerCase().match(/status:?\s*(verified|disputed|unverified)/);
  
  if (!statusMatch && api === 'perplexity') {
    statusMatch = response.match(/statut\s*:\s*\*\*(verified|disputed|unverified)\*\*/i);
  }
  
  const confidence = extractConfidenceScore(response, api);
  
  let status = 'unverified';
  
  if (statusMatch) {
    status = statusMatch[1].toLowerCase();
  } else {
    const lowerResponse = response.toLowerCase();
    
    if (hasNoSourcesIndicators(response)) {
      status = 'unverified';
    } else {
      const verifiedKeywords = ['verified', 'accurate', 'correct', 'authentic', 'confirmed', 'vérifié'];
      const disputedKeywords = ['disputed', 'questionable', 'unclear', 'uncertain', 'partial', 'contesté'];
      
      if (verifiedKeywords.some(word => lowerResponse.includes(word))) {
        status = 'verified';
      } else if (disputedKeywords.some(word => lowerResponse.includes(word))) {
        status = 'disputed';
      }
    }
  }
  
  if (confidence >= 70) {
    status = 'verified';
  } else if (confidence >= 50) {
    status = 'disputed'; 
  } else if (confidence < 30 || hasNoSourcesIndicators(response)) {
    status = 'unverified';
  }
  
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
