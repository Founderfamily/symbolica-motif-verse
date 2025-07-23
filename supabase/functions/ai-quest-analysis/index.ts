import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { questId, analysisType = 'general' } = await req.json()

    // Get auth header
    const authHeader = req.headers.get('Authorization')!
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    // Get quest data
    const { data: quest, error: questError } = await supabaseClient
      .from('treasure_quests')
      .select('*')
      .eq('id', questId)
      .single()

    if (questError) throw questError

    // Get quest evidence
    const { data: evidence, error: evidenceError } = await supabaseClient
      .from('quest_evidence')
      .select('*')
      .eq('quest_id', questId)

    if (evidenceError) throw evidenceError

    // Get quest documents
    const { data: documents, error: documentsError } = await supabaseClient
      .from('quest_documents')
      .select('*')
      .eq('quest_id', questId)

    if (documentsError) throw documentsError

    // Prepare context for AI
    const questContext = {
      title: quest.title,
      description: quest.description,
      story_background: quest.story_background,
      clues: quest.clues || [],
      evidence: evidence || [],
      documents: documents || [],
    }

    // Generate AI prompt based on analysis type
    let prompt = ""
    if (analysisType === 'general') {
      prompt = `En tant qu'expert en investigations historiques, analysez cette quête au trésor et fournissez une analyse détaillée:

Quête: ${quest.title}
Description: ${quest.description}
Histoire: ${quest.story_background}

Indices disponibles: ${JSON.stringify(quest.clues)}
Preuves soumises: ${evidence.length} éléments
Documents: ${documents.length} documents

Fournissez une analyse structurée qui inclut:
1. État actuel de l'investigation
2. Points forts et faiblesses des preuves
3. Recommandations pour la suite
4. Théories émergentes
5. Prochaines étapes suggérées

Répondez en français de manière claire et actionnable.`
    } else if (analysisType === 'theory') {
      prompt = `En tant qu'historien expert, générez une théorie plausible pour cette quête au trésor:

Contexte: ${quest.title}
${quest.story_background}

Indices: ${JSON.stringify(quest.clues)}
Preuves: ${evidence.map(e => `${e.title}: ${e.description}`).join('\n')}

Générez une théorie cohérente qui:
1. Explique les indices existants
2. Propose une localisation probable
3. Justifie historiquement la théorie
4. Suggère des actions de validation

Format: Théorie structurée en français, maximum 500 mots.`
    }

    // Call OpenAI
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Vous êtes un expert en histoire française et en investigations de trésors historiques. Vous analysez des quêtes avec précision et rigueur scientifique.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    })

    if (!openAIResponse.ok) {
      throw new Error(`OpenAI API error: ${openAIResponse.statusText}`)
    }

    const openAIData = await openAIResponse.json()
    const analysis = openAIData.choices[0]?.message?.content

    if (!analysis) {
      throw new Error('No analysis generated')
    }

    // Create activity record
    const { data: user } = await supabaseClient.auth.getUser()
    if (user.user) {
      await supabaseClient
        .from('quest_activities')
        .insert({
          quest_id: questId,
          user_id: user.user.id,
          activity_type: analysisType === 'theory' ? 'theory' : 'ai_analysis',
          activity_data: {
            analysis_type: analysisType,
            analysis: analysis.substring(0, 200) + '...',
            full_analysis: analysis
          }
        })
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        analysis,
        context: questContext 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Error in AI analysis:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})