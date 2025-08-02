import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { questId, analysisType = 'general' } = await req.json();
    
    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get OpenAI API key
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!openaiApiKey) {
      console.log('OpenAI API key not found, using mock response');
      return new Response(
        JSON.stringify({
          success: true,
          analysis: analysisType === 'theory' 
            ? generateMockTheory(questId)
            : generateMockAnalysis(questId),
          context: { questId, analysisType, mock: true }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch quest data
    const { data: quest, error: questError } = await supabase
      .from('treasure_quests')
      .select('*')
      .eq('id', questId)
      .single();

    if (questError) {
      throw new Error(`Quest not found: ${questError.message}`);
    }

    // Fetch related evidence
    const { data: evidence } = await supabase
      .from('quest_evidence')
      .select('*')
      .eq('quest_id', questId);

    // Fetch existing theories
    const { data: theories } = await supabase
      .from('quest_theories')
      .select('*')
      .eq('quest_id', questId);

    // Prepare context for AI
    const context = {
      quest: quest,
      evidence: evidence || [],
      theories: theories || [],
      cluesCount: quest.clues ? quest.clues.length : 0
    };

    // Generate AI analysis
    const prompt = analysisType === 'theory' 
      ? buildTheoryPrompt(context)
      : buildAnalysisPrompt(context);

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
            content: 'Tu es un expert en histoire et archéologie, spécialisé dans l\'analyse de quêtes de trésors historiques. Réponds en français avec précision et rigueur académique.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1500
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const aiResponse = await response.json();
    const analysis = aiResponse.choices[0].message.content;

    // If generating a theory, save it to database
    if (analysisType === 'theory') {
      // Use current user or admin as author
      const { data: { user } } = await supabase.auth.getUser();
      let authorId = user?.id || 'db68da96-d289-425b-9162-a474c1805eb3'; // fallback to admin
      
      const { error: theoryError } = await supabase
        .from('quest_theories')
        .insert({
          quest_id: questId,
          author_id: authorId,
          title: `Théorie IA - ${new Date().toLocaleDateString('fr-FR')}`,
          description: analysis,
          theory_type: 'ai_generated',
          supporting_evidence: evidence?.map(e => e.title) || [],
          confidence_level: Math.floor(Math.random() * 30) + 70, // 70-99%
          status: 'active'
        });

      if (theoryError) {
        console.error('Error saving theory:', theoryError);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        analysis,
        context: { questId, analysisType, evidenceCount: evidence?.length || 0 }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in ai-quest-analysis function:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Erreur lors de l\'analyse IA'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

function buildTheoryPrompt(context: any): string {
  return `Analyse cette quête de trésor et génère une nouvelle théorie basée sur les données suivantes :

**Quête :** ${context.quest.title}
**Description :** ${context.quest.description || 'Non spécifiée'}
**Type :** ${context.quest.quest_type}
**Nombre d'indices :** ${context.cluesCount}

**Preuves existantes :**
${context.evidence.map((e: any) => `- ${e.title}: ${e.description || 'Aucune description'}`).join('\n') || 'Aucune preuve disponible'}

**Théories existantes :**
${context.theories.map((t: any) => `- ${t.title}: ${t.description.substring(0, 100)}...`).join('\n') || 'Aucune théorie existante'}

Génère une nouvelle théorie originale et plausible en format markdown avec :
1. **Titre de la théorie**
2. **Hypothèse principale** 
3. **Arguments supportant cette théorie**
4. **Preuves à rechercher**
5. **Étapes de vérification recommandées**

Sois précis, académique et base-toi sur des faits historiques plausibles.`;
}

function buildAnalysisPrompt(context: any): string {
  return `Analyse cette quête de trésor historique :

**Quête :** ${context.quest.title}
**Description :** ${context.quest.description || 'Non spécifiée'}
**Statut :** ${context.quest.status}
**Indices :** ${context.cluesCount}
**Preuves soumises :** ${context.evidence.length}
**Théories actives :** ${context.theories.length}

Fournis une analyse complète en markdown incluant :
1. **État d'avancement** de l'investigation
2. **Points forts** et faiblesses actuels
3. **Recommandations stratégiques** pour la suite
4. **Risques** et opportunités
5. **Prochaines étapes** prioritaires

Sois objectif et constructif dans tes recommandations.`;
}

function generateMockTheory(questId: string): string {
  return `## Théorie IA Générée

Basée sur l'analyse des indices disponibles pour cette quête, voici une théorie plausible :

### Hypothèse principale
Les indices suggèrent une connexion historique avec les ordres monastiques du XIIIe siècle, particulièrement liée aux donations et aux cachettes de guerre.

### Arguments supportant cette théorie
- **Contexte historique** : La période correspond aux troubles politiques du royaume
- **Références architecturales** : Les descriptions évoquent l'art gothique naissant
- **Géographie cohérente** : Les lieux mentionnés suivent les routes commerciales médiévales
- **Sources documentaires** : Plusieurs chroniques de l'époque font référence à des "trésors cachés"

### Preuves à rechercher
1. **Archives monastiques** de la région pour la période 1200-1300
2. **Plans architecturaux** des bâtiments mentionnés
3. **Registres de donations** aux ordres religieux
4. **Études géophysiques** des sites présumés

### Étapes de vérification recommandées
- Consultation des archives départementales
- Expertise paléographique des documents
- Reconnaissance terrain avec détecteurs
- Collaboration avec les historiens locaux

*Cette analyse est générée par IA et nécessite une validation par des experts historiens.*`;
}

function generateMockAnalysis(questId: string): string {
  return `## Analyse IA de la Quête

### État d'avancement
L'investigation présente un niveau de développement **prometteur** avec des bases solides pour une résolution.

### Points forts identifiés
- **Méthodologie rigoureuse** : Approche scientifique des indices
- **Sources diversifiées** : Multiple angles d'investigation
- **Engagement communautaire** : Participation active des chercheurs
- **Documentation structurée** : Organisation claire des données

### Recommandations stratégiques
1. **Validation croisée** : Vérifier les indices avec sources multiples
2. **Expertise spécialisée** : Consulter des historiens de la période
3. **Investigation terrain** : Organiser des reconnaissances ciblées
4. **Collaboration institutionnelle** : Partenariat avec universités et musées

### Risques et opportunités
**Risques :**
- Dispersion des efforts sur trop de pistes
- Manque de validation scientifique
- Détérioration des sources historiques

**Opportunités :**
- Découverte de nouvelles sources d'archives
- Utilisation de technologies modernes (LiDAR, géophysique)
- Médiatisation pour mobiliser des experts

### Prochaines étapes prioritaires
- Centraliser et digitaliser toutes les sources
- Effectuer une analyse critique des preuves existantes
- Établir un calendrier de recherches terrain
- Créer un réseau d'experts collaborateurs

*Analyse générée par IA - Validation humaine recommandée*`;
}