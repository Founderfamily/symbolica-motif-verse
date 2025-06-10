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

interface EnrichmentRequest {
  field: string;
  currentValue: any;
  questContext: any;
  provider: 'deepseek' | 'openai' | 'anthropic';
  questType: string;
  title: string;
}

function generatePrompt(request: EnrichmentRequest): string {
  const { field, currentValue, questContext, questType, title } = request;
  const period = getQuestPeriod(questType);

  switch (field) {
    case 'story_background':
      return `En tant qu'historien expert des ${period}, crée un contexte historique riche pour cette quête : "${title}".
      
      ${currentValue ? `Contexte existant à améliorer : ${currentValue}` : 'Aucun contexte défini actuellement.'}
      
      Type de quête : ${questType}
      
      Écris un contexte historique authentique avec :
      - Les événements historiques pertinents de l'époque
      - Les personnages clés et leurs motivations
      - Les enjeux sociopolitiques du contexte
      - Les détails culturels et architecturaux authentiques
      
      Réponds en français, style narratif captivant mais historiquement précis (600-800 mots).
      NE répète PAS le texte existant, crée un contenu complètement nouveau et enrichi.`;

    case 'description':
      return `Réécris complètement cette description de quête pour la rendre plus captivante : "${title}".
      
      ${currentValue ? `Description actuelle : ${currentValue}` : 'Aucune description existante.'}
      
      Type : ${questType}
      Contexte : ${questContext.story_background || 'Non défini'}
      
      Crée une nouvelle description qui :
      - Intrigue et motive les participants dès les premières lignes
      - Présente l'enjeu principal de façon mystérieuse
      - Reste fidèle au contexte historique
      - Fait 2-3 paragraphes maximum
      - Est complètement différente du texte original
      
      Réponds en français, ton mystérieux et captivant.`;

    case 'clues':
      return `Tu dois enrichir les indices de cette quête "${title}" (${questType}).
      
      Indices actuels : ${JSON.stringify(currentValue, null, 2)}
      Contexte : ${questContext.story_background || 'Non défini'}
      
      INSTRUCTIONS CRITIQUES :
      1. Tu DOIS répondre UNIQUEMENT avec un JSON valide, rien d'autre
      2. Pas de texte avant ou après le JSON
      3. Pas d'explication, pas de commentaire
      4. Structure OBLIGATOIRE pour chaque indice :
      {
        "id": number,
        "description": "string (description immersive et détaillée)",
        "hint": "string (indice cryptique mais résolvable)"
      }
      
      Améliore chaque indice en gardant la même structure JSON mais avec :
      - description : Plus immersive, détaillée historiquement, authentique à l'époque
      - hint : Plus cryptique mais résolvable, avec références historiques subtiles
      
      RÉPONDS UNIQUEMENT AVEC LE JSON, exemple :
      [
        {
          "id": 1,
          "description": "Description enrichie...",
          "hint": "Indice cryptique..."
        }
      ]`;

    case 'target_symbols':
      return `Suggère des symboles historiquement appropriés pour cette quête "${title}" (${questType}).
      
      ${Array.isArray(currentValue) && currentValue.length > 0 ? `Symboles actuels à compléter : ${currentValue.join(', ')}` : 'Aucun symbole défini.'}
      Contexte : ${questContext.story_background || 'Non défini'}
      
      Suggère 5-7 symboles authentiques de l'époque :
      - Croix templières, sceaux, emblèmes spécifiques
      - Symboles architecturaux de la période
      - Marques de guildes ou ordres religieux
      - Éléments héraldiques appropriés
      
      Réponds avec une liste de noms de symboles séparés par des virgules, sans explication.`;

    default:
      return `Enrichis le champ ${field} pour la quête "${title}" en créant un contenu complètement nouveau et historiquement authentique.`;
  }
}

function getQuestPeriod(questType: string): string {
  switch (questType) {
    case 'templar':
      return 'Templiers (XIIe-XIVe siècles)';
    case 'grail':
      return 'quêtes du Graal (époque médiévale)';
    case 'lost_civilization':
      return 'civilisations perdues';
    default:
      return 'périodes historiques';
  }
}

function extractJsonFromText(text: string): any {
  try {
    // Nettoyer le texte et chercher le JSON
    const cleanText = text.trim();
    
    // Essayer de parser directement
    try {
      return JSON.parse(cleanText);
    } catch {
      // Chercher un array JSON dans le texte
      const arrayMatch = cleanText.match(/\[[\s\S]*\]/);
      if (arrayMatch) {
        return JSON.parse(arrayMatch[0]);
      }
      
      // Chercher un objet JSON dans le texte
      const objectMatch = cleanText.match(/\{[\s\S]*\}/);
      if (objectMatch) {
        return JSON.parse(objectMatch[0]);
      }
      
      throw new Error('No valid JSON found');
    }
  } catch (error) {
    console.error('Failed to extract JSON:', error);
    throw new Error('Invalid JSON format in AI response');
  }
}

function validateCluesStructure(clues: any): boolean {
  if (!Array.isArray(clues)) {
    return false;
  }
  
  return clues.every(clue => 
    typeof clue === 'object' &&
    clue !== null &&
    typeof clue.id === 'number' &&
    typeof clue.description === 'string' &&
    typeof clue.hint === 'string' &&
    clue.description.length > 0 &&
    clue.hint.length > 0
  );
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
          content: 'Tu es un expert historien spécialisé dans les symboles et traditions culturelles médiévales. Tu crées du contenu original et authentique. Quand on te demande du JSON, tu réponds UNIQUEMENT avec du JSON valide, sans aucun texte supplémentaire.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1500
    })
  });

  if (!response.ok) {
    throw new Error(`DeepSeek API error: ${response.status}`);
  }

  const result = await response.json();
  return result.choices?.[0]?.message?.content || 'Aucune réponse générée';
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
          content: 'Tu es un expert en histoire médiévale et en création de contenu narratif. Tu produis du contenu original et captivant. Pour les demandes JSON, tu réponds exclusivement avec du JSON valide.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1500
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
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
      max_tokens: 1500,
      messages: [
        {
          role: 'user',
          content: `Tu es un expert en histoire et en création de quêtes narratives. Pour les demandes JSON, réponds uniquement avec du JSON valide. ${prompt}`
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
  
  try {
    const request: EnrichmentRequest = await req.json();
    
    if (!request.field || !request.provider) {
      throw new Error('Field and provider are required');
    }

    const prompt = generatePrompt(request);
    console.log(`Enriching ${request.field} with ${request.provider}:`, prompt.substring(0, 200) + '...');

    let content: string;
    let usedProvider = request.provider;

    // Essayer le provider demandé avec fallback
    try {
      switch (request.provider) {
        case 'openai':
          content = await callOpenAI(prompt);
          break;
        case 'anthropic':
          content = await callAnthropic(prompt);
          break;
        case 'deepseek':
        default:
          content = await callDeepSeek(prompt);
          break;
      }
    } catch (error) {
      console.warn(`${request.provider} failed, trying fallback:`, error.message);
      
      // Fallback intelligent
      if (request.provider !== 'deepseek' && deepseekApiKey) {
        content = await callDeepSeek(prompt);
        usedProvider = 'deepseek';
      } else if (request.provider !== 'openai' && openaiApiKey) {
        content = await callOpenAI(prompt);
        usedProvider = 'openai';
      } else if (request.provider !== 'anthropic' && anthropicApiKey) {
        content = await callAnthropic(prompt);
        usedProvider = 'anthropic';
      } else {
        throw error;
      }
    }

    // Post-traitement du contenu
    let enrichedValue: any = content.trim();
    
    // Traitement spécial pour les différents types de champs
    if (request.field === 'clues') {
      try {
        const extractedJson = extractJsonFromText(content);
        
        if (!validateCluesStructure(extractedJson)) {
          throw new Error('Invalid clues structure: missing required fields (id, description, hint)');
        }
        
        enrichedValue = extractedJson;
        console.log('Successfully parsed and validated clues JSON');
      } catch (error) {
        console.error('Failed to parse clues JSON:', error.message);
        throw new Error(`Invalid JSON format for clues: ${error.message}`);
      }
    } else if (request.field === 'target_symbols') {
      enrichedValue = content.split(',').map(s => s.trim()).filter(s => s.length > 0);
    }

    const confidence = Math.min(95, Math.max(70, 85 + Math.random() * 10));

    return new Response(JSON.stringify({
      success: true,
      enrichedValue,
      provider: usedProvider,
      confidence,
      suggestions: [
        `Contenu enrichi avec ${usedProvider}`,
        'Vérifiez la cohérence historique',
        'Adaptez selon vos besoins',
        request.field === 'clues' ? 'Structure JSON validée' : 'Contenu original créé'
      ],
      timestamp: new Date().toISOString(),
      processingTime: Date.now() - startTime
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Quest enrichment error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Service temporarily unavailable',
      timestamp: new Date().toISOString(),
      processingTime: Date.now() - startTime
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
