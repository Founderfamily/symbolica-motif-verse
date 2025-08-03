import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('🚀 Proactive Investigation Edge Function called');
  
  if (req.method === 'OPTIONS') {
    console.log('✅ Handling CORS preflight request');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🔧 Initializing Supabase client...');
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    console.log('📨 Parsing request body...');
    const { questId, investigationType, context } = await req.json();
    
    console.log(`🔍 Début d'investigation proactive IA pour quête ${questId}`);
    console.log(`📋 Type d'investigation: ${investigationType}`);
    console.log(`🌍 Contexte:`, context);
    
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    console.log(`🧠 Utilisation OpenAI: ${openAIApiKey ? '✅ Activé' : '❌ Désactivé'}`);

    if (!openAIApiKey) {
      console.warn('⚠️ Clé OpenAI manquante - utilisation de données simulées');
    }

    // Récupérer les données de la quête et preuves existantes
    const questData = await getQuestData(supabase, questId);
    
    let result;

    switch (investigationType) {
      case 'search_historical_sources':
        result = await searchHistoricalSources(questData, context);
        break;
      case 'generate_theories':
        result = await generateTheories(questData, context);
        break;
      case 'find_missing_clues':
        result = await findMissingClues(questData, context);
        break;
      case 'cross_reference_data':
        result = await crossReferenceData(questData, context);
        break;
      case 'detect_anomalies':
        result = await detectAnomalies(questData, context);
        break;
      default:
        result = await fullInvestigation(questData, context);
    }

    console.log(`✅ Investigation IA terminée avec ${result.findings?.length || result.theories?.length || result.clues?.length || 0} découvertes`);

    return new Response(JSON.stringify({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
      aiPowered: !!openAIApiKey
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('❌ Erreur investigation IA:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

// Fonction pour récupérer les données de la quête
async function getQuestData(supabase: any, questId: string) {
  console.log(`📊 Récupération des données pour la quête ${questId}`);
  
  const { data: quest, error: questError } = await supabase
    .from('treasure_quests')
    .select('*')
    .eq('id', questId)
    .single();

  if (questError) {
    console.error('❌ Erreur récupération quête:', questError);
    throw new Error(`Impossible de récupérer la quête: ${questError.message}`);
  }

  const { data: evidence, error: evidenceError } = await supabase
    .from('quest_evidence')
    .select('*')
    .eq('quest_id', questId);

  if (evidenceError) {
    console.warn('⚠️ Erreur récupération preuves:', evidenceError);
  }

  const { data: theories, error: theoriesError } = await supabase
    .from('quest_theories')
    .select('*')
    .eq('quest_id', questId);

  if (theoriesError) {
    console.warn('⚠️ Erreur récupération théories:', theoriesError);
  }

  const questData = {
    ...quest,
    evidence: evidence || [],
    theories: theories || []
  };

  console.log(`📈 Données récupérées: ${evidence?.length || 0} preuves, ${theories?.length || 0} théories`);
  
  return questData;
}

// Fonction pour appeler OpenAI
async function callOpenAI(prompt: string, systemMessage: string = "Tu es un expert archéologue et historien qui analyse des quêtes de trésors historiques.") {
  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  
  if (!openAIApiKey) {
    console.warn('⚠️ OpenAI non disponible - génération de contenu simulé');
    return null;
  }

  try {
    console.log('🤖 Appel OpenAI en cours...');
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1500
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erreur OpenAI:', response.status, errorText);
      throw new Error(`Erreur OpenAI: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Réponse OpenAI reçue');
    
    return data.choices[0].message.content;
  } catch (error) {
    console.error('❌ Erreur appel OpenAI:', error);
    return null;
  }
}

async function searchHistoricalSources(questData: any, context: any) {
  console.log('🏛️ Recherche IA dans les sources historiques...');
  
  const prompt = `
Analyse cette quête de trésor et suggère des sources historiques pertinentes à rechercher:

QUÊTE: ${questData.title}
DESCRIPTION: ${questData.description}
PÉRIODE: ${questData.historical_period || 'Non spécifiée'}
RÉGION: ${questData.region || 'Non spécifiée'}

PREUVES EXISTANTES:
${questData.evidence.map((e: any) => `- ${e.title}: ${e.description}`).join('\n') || 'Aucune preuve'}

THÉORIES EXISTANTES:
${questData.theories.map((t: any) => `- ${t.title}: ${t.description}`).join('\n') || 'Aucune théorie'}

Génère 3-5 sources historiques spécifiques à rechercher pour cette quête, avec pour chacune:
- Le type de source (document, carte, photo, etc.)
- L'institution qui pourrait la posséder
- Le titre probable du document
- Pourquoi cette source serait pertinente
- Le niveau de priorité (1-5)

Réponds en JSON avec le format:
{
  "sources": [
    {
      "type": "document",
      "institution": "Archives...",
      "title": "Titre du document",
      "period": "1800-1850",
      "relevance": "Explication de la pertinence",
      "priority": 4,
      "credibility": 0.85
    }
  ]
}
`;

  const aiResponse = await callOpenAI(prompt);
  
  if (aiResponse) {
    try {
      const parsed = JSON.parse(aiResponse);
      console.log(`🎯 IA a trouvé ${parsed.sources?.length || 0} sources historiques`);
      
      return {
        searchType: 'ai_historical_sources',
        findings: parsed.sources || [],
        aiGenerated: true,
        totalSources: 'Analyse IA',
        relevantSources: parsed.sources?.length || 0,
        searchCoverage: 'Basé sur analyse IA contextuelle',
        nextSteps: [
          'Contacter les institutions identifiées',
          'Valider l\'existence des documents',
          'Prioriser selon les niveaux suggérés'
        ]
      };
    } catch (e) {
      console.error('❌ Erreur parsing réponse IA sources:', e);
    }
  }

  // Fallback si IA indisponible
  const fallbackSources = [
    {
      type: 'document',
      institution: 'Archives Départementales',
      title: `Registre paroissial - ${questData.region || 'Région'}`,
      period: questData.historical_period || 'XIXe siècle',
      relevance: 'Documents locaux souvent riches en détails historiques',
      priority: 4,
      credibility: 0.85
    }
  ];

  return {
    searchType: 'fallback_sources',
    findings: fallbackSources,
    aiGenerated: false,
    totalSources: 'Données de base',
    relevantSources: 1,
    searchCoverage: 'Recherche basique',
    nextSteps: ['Activer l\'IA pour une recherche plus approfondie']
  };
}

async function generateTheories(questData: any, context: any) {
  console.log('🧠 Génération IA de théories...');

  const prompt = `
Analyse cette quête de trésor et génère des théories innovantes basées sur l'analyse des données:

QUÊTE: ${questData.title}
DESCRIPTION: ${questData.description}
PÉRIODE: ${questData.historical_period || 'Non spécifiée'}
RÉGION: ${questData.region || 'Non spécifiée'}

PREUVES DISPONIBLES:
${questData.evidence.map((e: any) => `- ${e.title}: ${e.description} (Validation: ${e.validation_status})`).join('\n') || 'Aucune preuve'}

THÉORIES EXISTANTES:
${questData.theories.map((t: any) => `- ${t.title}: ${t.description}`).join('\n') || 'Aucune théorie'}

En tant qu'expert archéologue, génère 2-4 nouvelles théories innovantes qui:
1. Explorent des angles non couverts par les théories existantes
2. S'appuient sur les preuves disponibles
3. Sont plausibles historiquement
4. Proposent des pistes de recherche concrètes

Pour chaque théorie, fournis:
- Un titre accrocheur
- Le type (géographique, historique, culturel, technique)
- Un niveau de confiance (0-1)
- Une description détaillée
- Les preuves qui la supportent
- Les actions suggérées pour la valider

Réponds en JSON:
{
  "theories": [
    {
      "title": "Titre de la théorie",
      "type": "geographic",
      "confidence": 0.75,
      "description": "Description détaillée...",
      "supporting_evidence": ["Preuve 1", "Preuve 2"],
      "suggested_actions": ["Action 1", "Action 2"],
      "research_priority": "high"
    }
  ]
}
`;

  const aiResponse = await callOpenAI(prompt);
  
  if (aiResponse) {
    try {
      const parsed = JSON.parse(aiResponse);
      console.log(`🎯 IA a généré ${parsed.theories?.length || 0} nouvelles théories`);
      
      return {
        theoryType: 'ai_innovative_analysis',
        theories: parsed.theories || [],
        aiGenerated: true,
        analysisMethod: 'gpt_contextual_reasoning',
        confidenceLevel: parsed.theories?.reduce((acc: number, t: any) => acc + (t.confidence || 0), 0) / (parsed.theories?.length || 1),
        validationNeeded: true,
        expertReviewSuggested: true
      };
    } catch (e) {
      console.error('❌ Erreur parsing réponse IA théories:', e);
    }
  }

  // Fallback si IA indisponible
  const fallbackTheories = [
    {
      title: 'Analyse Required',
      type: 'system',
      confidence: 0.1,
      description: 'L\'IA est nécessaire pour générer des théories contextuelles pertinentes',
      supporting_evidence: ['Données insuffisantes sans IA'],
      suggested_actions: ['Configurer OpenAI API'],
      research_priority: 'critical'
    }
  ];

  return {
    theoryType: 'fallback_limited',
    theories: fallbackTheories,
    aiGenerated: false,
    analysisMethod: 'basic_fallback',
    confidenceLevel: 0.1,
    validationNeeded: true,
    expertReviewSuggested: true
  };
}

async function findMissingClues(questData: any, context: any) {
  console.log('🔍 Recherche IA d\'indices manquants...');

  const prompt = `
Analyse cette quête de trésor et identifie les indices cruciaux qui manquent pour résoudre l'énigme:

QUÊTE: ${questData.title}
DESCRIPTION: ${questData.description}
PÉRIODE: ${questData.historical_period || 'Non spécifiée'}
RÉGION: ${questData.region || 'Non spécifiée'}

PREUVES ACTUELLES:
${questData.evidence.map((e: any) => `- ${e.title} (${e.evidence_type}): ${e.description}`).join('\n') || 'Aucune preuve'}

THÉORIES EXISTANTES:
${questData.theories.map((t: any) => `- ${t.title}: ${t.description}`).join('\n') || 'Aucune théorie'}

En tant qu'expert détective historique, identifie 2-4 indices manquants cruciaux:
1. Analyse les patterns dans les preuves existantes
2. Identifie les lacunes logiques dans l'enquête
3. Propose des types d'indices spécifiques à rechercher
4. Évalue la probabilité de les trouver

Pour chaque indice manquant:
- Type (document, objet, lieu, témoin, etc.)
- Description précise de ce qu'il faut chercher
- Où et comment le chercher
- Probabilité de le trouver (0-1)
- Impact potentiel sur la résolution

Réponds en JSON:
{
  "missing_clues": [
    {
      "type": "document",
      "title": "Titre de l'indice",
      "description": "Description détaillée",
      "search_location": "Où chercher",
      "search_method": "Comment chercher",
      "probability": 0.8,
      "impact": "high",
      "expected_findings": ["Résultat 1", "Résultat 2"]
    }
  ]
}
`;

  const aiResponse = await callOpenAI(prompt);
  
  if (aiResponse) {
    try {
      const parsed = JSON.parse(aiResponse);
      console.log(`🎯 IA a identifié ${parsed.missing_clues?.length || 0} indices manquants`);
      
      return {
        missingClueType: 'ai_gap_analysis',
        clues: parsed.missing_clues || [],
        aiGenerated: true,
        analysisMethod: 'gpt_pattern_analysis',
        totalGaps: 'Analyse IA en cours',
        prioritizedGaps: parsed.missing_clues?.length || 0,
        completionRate: questData.evidence.length > 0 ? `${Math.min(90, questData.evidence.length * 20)}%` : '10%'
      };
    } catch (e) {
      console.error('❌ Erreur parsing réponse IA indices:', e);
    }
  }

  // Fallback si IA indisponible
  const fallbackClues = [
    {
      type: 'system',
      title: 'Configuration IA Requise',
      description: 'L\'IA est nécessaire pour analyser les patterns et identifier les indices manquants',
      search_location: 'Configuration système',
      search_method: 'Activer OpenAI API',
      probability: 1.0,
      impact: 'critical',
      expected_findings: ['Analyse contextuelle', 'Identification des lacunes']
    }
  ];

  return {
    missingClueType: 'fallback_basic',
    clues: fallbackClues,
    aiGenerated: false,
    analysisMethod: 'basic_fallback',
    totalGaps: 'Inconnu sans IA',
    prioritizedGaps: 1,
    completionRate: '5%'
  };
}

async function crossReferenceData(questData: any, context: any) {
  console.log('🔗 Cross-référencement IA des données...');

  const prompt = `
Effectue un cross-référencement intelligent des données de cette quête:

QUÊTE: ${questData.title}
DESCRIPTION: ${questData.description}
PÉRIODE: ${questData.historical_period || 'Non spécifiée'}
RÉGION: ${questData.region || 'Non spécifiée'}

PREUVES ANALYSÉES:
${questData.evidence.map((e: any, i: number) => `${i+1}. ${e.title} (${e.evidence_type}):\n   Description: ${e.description}\n   Lieu: ${e.location_name || 'Non spécifié'}\n   Status: ${e.validation_status}`).join('\n\n') || 'Aucune preuve'}

THÉORIES EXISTANTES:
${questData.theories.map((t: any, i: number) => `${i+1}. ${t.title}:\n   ${t.description}`).join('\n\n') || 'Aucune théorie'}

En tant qu'expert en analyse de données historiques:
1. Identifie les corrélations entre les différentes preuves
2. Trouve des patterns géographiques, temporels ou thématiques
3. Identifie les contradictions ou incohérences
4. Suggère des liens avec des événements historiques connus
5. Évalue la force de chaque corrélation

Réponds en JSON:
{
  "correlations": [
    {
      "type": "temporal/geographic/thematic/cultural",
      "strength": 0.85,
      "description": "Description de la corrélation",
      "involved_elements": ["Preuve 1", "Preuve 2"],
      "historical_context": "Contexte historique",
      "significance": "Importance de cette corrélation"
    }
  ],
  "contradictions": [
    {
      "description": "Description de la contradiction",
      "elements": ["Élément A", "Élément B"],
      "possible_explanations": ["Explication 1", "Explication 2"]
    }
  ]
}
`;

  const aiResponse = await callOpenAI(prompt);
  
  if (aiResponse) {
    try {
      const parsed = JSON.parse(aiResponse);
      console.log(`🎯 IA a trouvé ${parsed.correlations?.length || 0} corrélations`);
      
      const avgStrength = parsed.correlations?.reduce((acc: number, c: any) => acc + (c.strength || 0), 0) / (parsed.correlations?.length || 1);
      
      return {
        correlationType: 'ai_intelligent_analysis',
        correlations: parsed.correlations || [],
        contradictions: parsed.contradictions || [],
        aiGenerated: true,
        reliabilityScore: avgStrength || 0.5,
        dataQuality: questData.evidence.length > 2 ? 'sufficient' : 'limited',
        recommendedValidation: 'expert_review_and_field_verification'
      };
    } catch (e) {
      console.error('❌ Erreur parsing réponse IA corrélations:', e);
    }
  }

  // Fallback si IA indisponible
  const fallbackCorrelations = [
    {
      type: 'system_limitation',
      strength: 0.1,
      description: 'Cross-référencement manuel limité sans IA',
      involved_elements: ['Système'],
      historical_context: 'Configuration requise',
      significance: 'L\'IA permettrait une analyse approfondie des patterns'
    }
  ];

  return {
    correlationType: 'fallback_basic',
    correlations: fallbackCorrelations,
    contradictions: [],
    aiGenerated: false,
    reliabilityScore: 0.1,
    dataQuality: 'insufficient_without_ai',
    recommendedValidation: 'enable_ai_analysis'
  };
}

async function detectAnomalies(questData: any, context: any) {
  console.log('⚠️ Détection IA d\'anomalies...');

  const prompt = `
Analyse ces données de quête et détecte toutes les anomalies, incohérences ou éléments suspects:

QUÊTE: ${questData.title}
DESCRIPTION: ${questData.description}
PÉRIODE: ${questData.historical_period || 'Non spécifiée'}
RÉGION: ${questData.region || 'Non spécifiée'}

PREUVES À ANALYSER:
${questData.evidence.map((e: any, i: number) => `${i+1}. ${e.title} (${e.evidence_type}):\n   Description: ${e.description}\n   Localisation: ${e.location_name || 'Non spécifiée'}\n   Coordonnées: ${e.latitude ? `${e.latitude}, ${e.longitude}` : 'Non spécifiées'}\n   Période estimée: ${e.estimated_period || 'Non datée'}\n   Validation: ${e.validation_status}`).join('\n\n') || 'Aucune preuve'}

THÉORIES EXISTANTES:
${questData.theories.map((t: any, i: number) => `${i+1}. ${t.title}: ${t.description}`).join('\n\n') || 'Aucune théorie'}

En tant qu'expert détective historique, identifie toutes les anomalies possibles:
1. CHRONOLOGIQUES: éléments datés de manière incohérente
2. GÉOGRAPHIQUES: distributions spatiales suspectes
3. CULTURELLES: éléments qui ne correspondent pas au contexte
4. LOGIQUES: contradictions dans les preuves
5. TECHNIQUES: problèmes de validation ou de crédibilité

Pour chaque anomalie détectée:
- Type et sévérité (low/medium/high/critical)
- Description précise
- Éléments impliqués
- Explications possibles
- Actions recommandées

Réponds en JSON:
{
  "anomalies": [
    {
      "type": "chronological/geographic/cultural/logical/technical",
      "severity": "high",
      "description": "Description de l'anomalie",
      "involved_elements": ["Élément 1", "Élément 2"],
      "confidence": 0.85,
      "possible_explanations": ["Explication 1", "Explication 2"],
      "recommended_actions": ["Action 1", "Action 2"]
    }
  ]
}
`;

  const aiResponse = await callOpenAI(prompt);
  
  if (aiResponse) {
    try {
      const parsed = JSON.parse(aiResponse);
      console.log(`🎯 IA a détecté ${parsed.anomalies?.length || 0} anomalies`);
      
      const maxSeverity = parsed.anomalies?.reduce((max: string, a: any) => {
        const severityLevels = { low: 1, medium: 2, high: 3, critical: 4 };
        const currentLevel = severityLevels[a.severity as keyof typeof severityLevels] || 1;
        const maxLevel = severityLevels[max as keyof typeof severityLevels] || 1;
        return currentLevel > maxLevel ? a.severity : max;
      }, 'low') || 'low';
      
      return {
        anomalyType: 'ai_comprehensive_analysis',
        anomalies: parsed.anomalies || [],
        aiGenerated: true,
        totalDataPoints: questData.evidence.length + questData.theories.length,
        anomalousDataPoints: parsed.anomalies?.length || 0,
        alertLevel: maxSeverity,
        requiresExpertReview: parsed.anomalies?.some((a: any) => ['high', 'critical'].includes(a.severity)) || false
      };
    } catch (e) {
      console.error('❌ Erreur parsing réponse IA anomalies:', e);
    }
  }

  // Fallback si IA indisponible
  const fallbackAnomalies = [
    {
      type: 'system',
      severity: 'high',
      description: 'Impossible de détecter les anomalies sans analyse IA',
      involved_elements: ['Système d\'analyse'],
      confidence: 1.0,
      possible_explanations: ['Configuration OpenAI manquante'],
      recommended_actions: ['Configurer l\'API OpenAI', 'Relancer l\'analyse']
    }
  ];

  return {
    anomalyType: 'fallback_system_alert',
    anomalies: fallbackAnomalies,
    aiGenerated: false,
    totalDataPoints: questData.evidence.length + questData.theories.length,
    anomalousDataPoints: 1,
    alertLevel: 'high',
    requiresExpertReview: true
  };
}

async function fullInvestigation(questData: any, context: any) {
  console.log('🔬 Investigation IA complète en cours...');

  console.log('📊 Lancement des analyses parallèles...');
  
  const [sources, theories, clues, correlations, anomalies] = await Promise.all([
    searchHistoricalSources(questData, context),
    generateTheories(questData, context),
    findMissingClues(questData, context),
    crossReferenceData(questData, context),
    detectAnomalies(questData, context)
  ]);

  console.log('🔄 Synthèse des résultats...');

  // Calcul de la confiance globale basée sur l'IA
  const confidenceScores = [
    theories.confidenceLevel || 0.5,
    correlations.reliabilityScore || 0.5,
    sources.relevantSources ? Math.min(1, sources.relevantSources / 5) : 0.3,
    clues.prioritizedGaps ? Math.min(1, clues.prioritizedGaps / 3) : 0.4,
    anomalies.anomalousDataPoints === 0 ? 0.9 : Math.max(0.3, 1 - (anomalies.anomalousDataPoints * 0.2))
  ];
  
  const overallConfidence = confidenceScores.reduce((acc, score) => acc + score, 0) / confidenceScores.length;

  const aiPowered = sources.aiGenerated || theories.aiGenerated || clues.aiGenerated || correlations.aiGenerated || anomalies.aiGenerated;

  console.log(`✅ Investigation complète terminée - Confiance: ${(overallConfidence * 100).toFixed(1)}% (IA: ${aiPowered ? 'Activée' : 'Désactivée'})`);

  return {
    investigationType: aiPowered ? 'comprehensive_ai_powered' : 'comprehensive_basic',
    results: {
      historicalSources: sources,
      generatedTheories: theories,
      missingClues: clues,
      dataCorrelations: correlations,
      detectedAnomalies: anomalies
    },
    overallConfidence: Math.round(overallConfidence * 100) / 100,
    aiPowered,
    recommendedNextSteps: aiPowered ? [
      'Valider les théories IA sur le terrain',
      'Rechercher les sources historiques identifiées',
      'Investiguer les indices manquants prioritaires',
      'Résoudre les anomalies détectées',
      'Approfondir les corrélations prometteuses'
    ] : [
      'Configurer l\'IA OpenAI pour une analyse approfondie',
      'Relancer l\'investigation avec l\'IA activée',
      'Consulter un expert pour l\'analyse manuelle'
    ],
    estimatedTimeToCompletion: aiPowered ? '2-4 semaines' : 'Indéterminé sans IA',
    expertiseRequired: aiPowered ? ['Validation terrain', 'Recherche archivistique'] : ['Configuration IA', 'Expertise manuelle complète']
  };
}