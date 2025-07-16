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
  // Debug logging pour tracer les extractions
  console.log(`Extracting confidence from ${api} response (first 400 chars): ${text.substring(0, 400)}`);
  
  // Normalize text for better matching
  const normalizedText = text.toLowerCase().replace(/\s+/g, ' ');
  
  // Enhanced patterns to extract confidence score, prioritizing explicit percentage statements
  const patterns = [
    // PRIORITY 1: Direct confidence statements with specific percentages
    /niveau de confiance[:\s]*(\d+)\s*%/gi,
    /confiance[:\s]*(\d+)\s*%/gi,
    /confidence[:\s]*(\d+)\s*%/gi,
    /(\d+)\s*%\s*de confiance/gi,
    /(\d+)\s*%\s*confidence/gi,
    
    // PRIORITY 2: Markdown formatted percentages with stars/bold
    /\*\*niveau de confiance[:\s]*(\d+)\s*%\*\*/gi,
    /\*\*confiance[:\s]*(\d+)\s*%\*\*/gi,
    /\*\*(\d+)\s*%\*\*/g,
    /\*(\d+)\s*%\*/g,
    
    // PRIORITY 3: Score/evaluation patterns with percentages
    /score[:\s]*(\d+)\s*%/gi,
    /(\d+)\s*%\s*score/gi,
    /évaluation[:\s]*(\d+)\s*%/gi,
    /(\d+)\s*%\s*d'évaluation/gi,
    
    // PRIORITY 4: Reliability/fiabilité patterns
    /fiabilité[:\s]*(\d+)\s*%/gi,
    /reliability[:\s]*(\d+)\s*%/gi,
    /(\d+)\s*%\s*de fiabilité/gi,
    /(\d+)\s*%\s*fiabilité/gi,
    /(\d+)\s*%\s*reliability/gi,
    
    // PRIORITY 5: Certainty/certitude patterns
    /certitude[:\s]*(\d+)\s*%/gi,
    /certainty[:\s]*(\d+)\s*%/gi,
    /(\d+)\s*%\s*de certitude/gi,
    /(\d+)\s*%\s*certitude/gi,
    /(\d+)\s*%\s*certainty/gi,
    
    // PRIORITY 6: Accuracy patterns
    /précision[:\s]*(\d+)\s*%/gi,
    /accuracy[:\s]*(\d+)\s*%/gi,
    /(\d+)\s*%\s*de précision/gi,
    /(\d+)\s*%\s*précision/gi,
    /(\d+)\s*%\s*accuracy/gi,
    
    // PRIORITY 7: Specific Gemini patterns (French responses, common patterns)
    /(\d+)\s*%\s*\([^)]*confiance[^)]*\)/gi,
    /\(.*confiance.*(\d+)\s*%.*\)/gi,
    
    // PRIORITY 8: Generic percentage patterns (least specific, last resort)
    /\b(\d+)\s*%\b/g
  ];

  let foundScores: number[] = [];
  let patternUsed = '';
  
  // Try each pattern in priority order and collect valid scores
  for (let i = 0; i < patterns.length; i++) {
    const pattern = patterns[i];
    let match;
    // Reset regex index for each pattern
    pattern.lastIndex = 0;
    
    while ((match = pattern.exec(normalizedText)) !== null) {
      const score = parseInt(match[1]);
      if (score >= 0 && score <= 100) {
        foundScores.push(score);
        patternUsed = `Pattern ${i + 1}: ${pattern.source.substring(0, 50)}...`;
        
        // For high-priority confidence patterns (patterns 1-3), return immediately
        if (i < 3 && (pattern.source.includes('confiance') || pattern.source.includes('confidence'))) {
          console.log(`Found confidence score: ${score}% for API: ${api} using ${patternUsed}`);
          return score;
        }
      }
    }
    
    // If we found scores in high-priority patterns, don't continue to lower priority ones
    if (foundScores.length > 0 && i < 6) {
      break;
    }
  }
  
  // If we found any valid percentage scores, use the highest reasonable one
  if (foundScores.length > 0) {
    // Remove extremely low scores that are likely not confidence scores
    const meaningfulScores = foundScores.filter(s => s >= 10);
    if (meaningfulScores.length > 0) {
      // Take the highest score from meaningful scores (more likely to be the actual confidence)
      const selectedScore = Math.max(...meaningfulScores);
      console.log(`Selected confidence score: ${selectedScore}% for API: ${api} from scores: [${foundScores.join(', ')}] using ${patternUsed}`);
      
      // Special handling for Gemini: if we found sources and have a decent score, boost it
      if (api === 'gemini' && hasReliableSourcesIndicators(text) && selectedScore >= 50) {
        const boostedScore = Math.min(95, selectedScore + 25);
        console.log(`Gemini source bonus applied: ${boostedScore}% (was ${selectedScore}%)`);
        return boostedScore;
      }
      
      return selectedScore;
    }
    // If no meaningful scores, return the highest found score anyway
    const fallbackScore = Math.max(...foundScores);
    console.log(`Using fallback score: ${fallbackScore}% for API: ${api} from low scores: [${foundScores.join(', ')}]`);
    return fallbackScore;
  }

  // Fallback: Check for textual confidence indicators
  console.log(`No percentage found, checking textual indicators for API: ${api}`);
  
  // Check for reliable sources indicators first
  if (hasReliableSourcesIndicators(text)) {
    const baseScore = extractBasicConfidence(text);
    const finalScore = Math.min(95, baseScore + 20);
    console.log(`Reliable sources bonus applied: ${finalScore}% for API: ${api}`);
    return finalScore;
  }
  
  // Check for no sources indicators - strict scoring
  if (hasNoSourcesIndicators(text)) {
    const finalScore = Math.min(25, extractBasicConfidence(text));
    console.log(`No sources penalty applied: ${finalScore}% for API: ${api}`);
    return finalScore;
  }

  // API-specific textual patterns
  let textualScore = 25; // Default fallback
  
  if (api === 'openai') {
    if (text.includes('highly confident') || text.includes('très confiant')) textualScore = 75;
    else if (text.includes('confident') || text.includes('confiant')) textualScore = 60;
    else if (text.includes('likely') || text.includes('probable')) textualScore = 45;
    else if (text.includes('possible') || text.includes('might') || text.includes('pourrait')) textualScore = 25;
    else if (text.includes('uncertain') || text.includes('unclear') || text.includes('incertain')) textualScore = 15;
  }
  
  if (api === 'anthropic') {
    if (text.includes('high confidence') || text.includes('haute confiance')) textualScore = 70;
    else if (text.includes('moderate confidence') || text.includes('confiance modérée')) textualScore = 50;
    else if (text.includes('low confidence') || text.includes('faible confiance')) textualScore = 25;
    else if (text.includes('uncertain') || text.includes('incertain')) textualScore = 15;
  }
  
  if (api === 'deepseek') {
    if (text.includes('very reliable') || text.includes('highly accurate')) textualScore = 70;
    else if (text.includes('reliable') || text.includes('accurate')) textualScore = 55;
    else if (text.includes('somewhat reliable') || text.includes('partiellement fiable')) textualScore = 35;
    else if (text.includes('unreliable') || text.includes('inaccurate') || text.includes('peu fiable')) textualScore = 15;
  }
  
  if (api === 'perplexity') {
    if (text.includes('well-documented') || text.includes('multiple sources') || text.includes('bien documenté')) textualScore = 75;
    else if (text.includes('documented') || text.includes('sources available') || text.includes('documenté')) textualScore = 55;
    else if (text.includes('limited sources') || text.includes('few references') || text.includes('sources limitées')) textualScore = 25;
    else if (text.includes('no clear sources') || text.includes('unverified') || text.includes('pas de sources claires')) textualScore = 10;
  }
  
  if (api === 'gemini') {
    // Enhanced Gemini pattern matching with debug logging
    console.log(`Analyzing Gemini textual patterns in: ${text.substring(0, 200)}...`);
    
    // Look for French responses from Gemini (it often responds in French)
    if (text.includes('très fiable') || text.includes('haute fiabilité') || text.includes('bien établi')) {
      textualScore = 85;
      console.log(`Gemini high confidence French pattern detected: ${textualScore}%`);
    }
    else if (text.includes('fiable') || text.includes('documenté') || text.includes('vérifié') || text.includes('établi')) {
      textualScore = 70;
      console.log(`Gemini moderate confidence French pattern detected: ${textualScore}%`);
    }
    else if (text.includes('partiellement') || text.includes('en partie') || text.includes('moyennement')) {
      textualScore = 45;
      console.log(`Gemini partial confidence French pattern detected: ${textualScore}%`);
    }
    // English patterns
    else if (text.includes('high certainty') || text.includes('well-established') || text.includes('highly reliable')) {
      textualScore = 85;
      console.log(`Gemini high confidence English pattern detected: ${textualScore}%`);
    }
    else if (text.includes('moderate certainty') || text.includes('established') || text.includes('reliable')) {
      textualScore = 70;
      console.log(`Gemini moderate confidence English pattern detected: ${textualScore}%`);
    }
    else if (text.includes('low certainty') || text.includes('uncertain') || text.includes('peu certain')) {
      textualScore = 25;
      console.log(`Gemini low confidence pattern detected: ${textualScore}%`);
    }
    else if (text.includes('very uncertain') || text.includes('unestablished') || text.includes('très incertain')) {
      textualScore = 15;
      console.log(`Gemini very low confidence pattern detected: ${textualScore}%`);
    }
    else {
      console.log(`No specific Gemini pattern found, using default: ${textualScore}%`);
    }
  }
  
  console.log(`Using textual pattern score: ${textualScore}% for API: ${api}`);
  return textualScore;
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

function extractSourcesFromResponse(response: string): Array<{title: string, url: string, type: string, description?: string}> {
  const sources: Array<{title: string, url: string, type: string, description?: string}> = [];
  
  // Enhanced patterns to extract sources from AI responses
  const sourcePatterns = [
    // French patterns
    /SOURCES SUPPLÉMENTAIRES TROUVÉES:\s*([\s\S]*?)(?=\n\n|PHASE|$)/i,
    /NOUVELLES SOURCES TROUVÉES:\s*([\s\S]*?)(?=\n\n|PHASE|$)/i,
    /SOURCES ACADÉMIQUES TROUVÉES:\s*([\s\S]*?)(?=\n\n|PHASE|$)/i,
    
    // English patterns
    /ADDITIONAL SOURCES FOUND:\s*([\s\S]*?)(?=\n\n|PHASE|$)/i,
    /NEW SOURCES FOUND:\s*([\s\S]*?)(?=\n\n|PHASE|$)/i,
    /ACADEMIC SOURCES FOUND:\s*([\s\S]*?)(?=\n\n|PHASE|$)/i,
  ];
  
  for (const pattern of sourcePatterns) {
    const match = response.match(pattern);
    if (match && match[1]) {
      const sourcesText = match[1].trim();
      
      // Split by lines and parse each source
      const lines = sourcesText.split('\n').filter(line => line.trim().startsWith('-') || line.trim().startsWith('•'));
      
      for (const line of lines) {
        const cleanLine = line.replace(/^[-•]\s*/, '').trim();
        
        // Try to parse structured source format: "Description - Citation"
        const parts = cleanLine.split(' - ');
        if (parts.length >= 2) {
          const description = parts[0].trim();
          const citation = parts.slice(1).join(' - ').trim();
          
          // Try to extract URL from citation
          const urlMatch = citation.match(/(https?:\/\/[^\s]+)/);
          const url = urlMatch ? urlMatch[1] : '';
          
          // Determine source type based on content
          let type = 'academic';
          if (citation.toLowerCase().includes('musée') || citation.toLowerCase().includes('museum')) {
            type = 'museum';
          } else if (citation.toLowerCase().includes('archive') || citation.toLowerCase().includes('archiv')) {
            type = 'archive';
          } else if (citation.toLowerCase().includes('journal') || citation.toLowerCase().includes('revue')) {
            type = 'journal';
          } else if (citation.toLowerCase().includes('livre') || citation.toLowerCase().includes('book')) {
            type = 'book';
          } else if (url) {
            type = 'website';
          }
          
          sources.push({
            title: description,
            url: url || citation,
            type: type,
            description: citation
          });
        } else if (cleanLine.length > 10) {
          // Fallback: treat entire line as a source
          const urlMatch = cleanLine.match(/(https?:\/\/[^\s]+)/);
          sources.push({
            title: cleanLine.substring(0, 100) + (cleanLine.length > 100 ? '...' : ''),
            url: urlMatch ? urlMatch[1] : '',
            type: 'reference',
            description: cleanLine
          });
        }
      }
      
      if (sources.length > 0) {
        console.log(`Extracted ${sources.length} sources from ${pattern.source}`);
        break; // Stop after first successful extraction
      }
    }
  }
  
  return sources;
}

const parseVerificationResponse = (response: string, api: string, sources?: string[]) => {
  // Extract status from response with improved patterns for different APIs
  let statusMatch = response.toLowerCase().match(/status:?\s*(verified|disputed|unverified)/);
  
  // Special handling for Perplexity format: "Statut : **verified**"
  if (!statusMatch && api === 'perplexity') {
    statusMatch = response.match(/statut\s*:\s*\*\*(verified|disputed|unverified)\*\*/i);
  }
  
  // Use improved confidence extraction
  const confidence = extractConfidenceScore(response, api);
  
  // Extract new sources from AI response
  const extractedSources = extractSourcesFromResponse(response);
  
  // Determine status based on content analysis
  let status = 'unverified';
  
  if (statusMatch) {
    status = statusMatch[1].toLowerCase();
  } else {
    // Analyze content for verification keywords and lack of sources
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
  
  // Prioritize confidence over content analysis for final status
  // If confidence is high (≥70%), force verified status regardless of source mentions
  if (confidence >= 70) {
    status = 'verified';
  } else if (confidence >= 50) {
    status = 'disputed'; 
  } else if (confidence < 30 || hasNoSourcesIndicators(response)) {
    status = 'unverified';
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
    extractedSources: extractedSources, // New field for AI-found sources
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

        // Save verification result
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

        // If AI found new sources, add them to the symbol
        if (result.extractedSources && result.extractedSources.length > 0) {
          // Get current symbol sources
          const { data: currentSymbol } = await supabase
            .from('symbols')
            .select('sources')
            .eq('id', symbolId)
            .single();

          const currentSources = currentSymbol?.sources || [];
          
          // Merge with new sources, avoiding duplicates
          const newSources = [...currentSources];
          for (const newSource of result.extractedSources) {
            const isDuplicate = currentSources.some(existing => 
              existing.title === newSource.title || 
              (existing.url && newSource.url && existing.url === newSource.url)
            );
            
            if (!isDuplicate) {
              newSources.push(newSource);
            }
          }

          // Update symbol with new sources
          if (newSources.length > currentSources.length) {
            await supabase
              .from('symbols')
              .update({ sources: newSources })
              .eq('id', symbolId);
            
            console.log(`Added ${newSources.length - currentSources.length} new sources to symbol ${symbolId}`);
          }
        }

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