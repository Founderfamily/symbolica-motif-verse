// Edge Function ultra-simple pour tester la connectivité IA
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

console.log('🚀 [AI-INVESTIGATION-V2] Function démarrée - première ligne exécutée');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('📥 [AI-INVESTIGATION-V2] Requête reçue:', req.method);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('✅ [AI-INVESTIGATION-V2] CORS preflight - réponse envoyée');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🔍 [AI-INVESTIGATION-V2] Parsing body...');
    
    // Protection contre les timeouts et erreurs de parsing
    let body;
    try {
      const bodyText = await req.text();
      console.log('📄 [AI-INVESTIGATION-V2] Body text length:', bodyText.length);
      body = JSON.parse(bodyText);
      console.log('📝 [AI-INVESTIGATION-V2] Body parsé avec succès. Action:', body?.action);
    } catch (parseError) {
      console.error('❌ [AI-INVESTIGATION-V2] Erreur parsing body:', parseError);
      return new Response(JSON.stringify({ 
        status: 'error', 
        message: 'Erreur de format de requête',
        error: parseError.message
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Test de base - répondre "pong"
    if (body.action === 'ping') {
      console.log('🏓 [AI-INVESTIGATION-V2] Ping reçu - réponse pong');
      return new Response(JSON.stringify({ 
        status: 'success', 
        message: 'pong',
        timestamp: new Date().toISOString(),
        receivedData: body
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Test avec OpenAI si clé disponible
    if (body.action === 'test_openai') {
      console.log('🤖 [AI-INVESTIGATION-V2] Test OpenAI demandé');
      
      const openaiKey = Deno.env.get('OPENAI_API_KEY');
      console.log('🔑 [AI-INVESTIGATION-V2] OpenAI key disponible:', !!openaiKey);
      
      if (!openaiKey) {
        console.log('❌ [AI-INVESTIGATION-V2] Pas de clé OpenAI');
        return new Response(JSON.stringify({ 
          status: 'error', 
          message: 'Clé OpenAI manquante',
          openaiKeyAvailable: false
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      console.log('🔗 [AI-INVESTIGATION-V2] Appel OpenAI...');
      const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'Tu es un assistant de test. Réponds simplement "Test OpenAI réussi".' },
            { role: 'user', content: 'Test de connectivité' }
          ],
          max_tokens: 50
        }),
      });

      console.log('📊 [AI-INVESTIGATION-V2] OpenAI status:', openaiResponse.status);
      
      if (!openaiResponse.ok) {
        const errorText = await openaiResponse.text();
        console.log('❌ [AI-INVESTIGATION-V2] Erreur OpenAI:', errorText);
        return new Response(JSON.stringify({ 
          status: 'error', 
          message: 'Erreur OpenAI',
          error: errorText,
          openaiStatus: openaiResponse.status
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const openaiData = await openaiResponse.json();
      console.log('✅ [AI-INVESTIGATION-V2] OpenAI réponse reçue');
      
      return new Response(JSON.stringify({ 
        status: 'success', 
        message: 'OpenAI connecté avec succès',
        aiResponse: openaiData.choices[0].message.content,
        timestamp: new Date().toISOString()
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // === NOUVELLES FONCTIONNALITÉS IA ===

    // Investigation complète d'une quête
    if (body.action === 'full_investigation') {
      console.log('🔍 [AI-INVESTIGATION-V2] Investigation complète demandée');
      
      const openaiKey = Deno.env.get('OPENAI_API_KEY');
      const supabaseUrl = Deno.env.get('SUPABASE_URL');
      const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY');
      
      if (!openaiKey) {
        return new Response(JSON.stringify({ 
          status: 'error', 
          message: 'Clé OpenAI manquante' 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Créer client Supabase
      const supabase = createClient(supabaseUrl!, supabaseKey!);
      
      const questData = body.questData || {};
      const questId = body.questId;
      const userId = body.userId || 'anonymous';
      
      // Vérifier l'authentification pour la sauvegarde - plus strict
      const canSave = userId !== 'anonymous' && userId && userId.length > 30; // UUID valide
      
      console.log('📝 [AI-INVESTIGATION-V2] Données quête reçues:', Object.keys(questData));

      // Récupérer les preuves existantes pour cette quête
      console.log('🔍 [AI-INVESTIGATION-V2] Récupération des preuves existantes...');
      const { data: existingEvidence, error: evidenceError } = await supabase
        .from('quest_evidence')
        .select('*')
        .eq('quest_id', questId);

      if (evidenceError) {
        console.error('❌ [AI-INVESTIGATION-V2] Erreur récupération preuves:', evidenceError);
      }

      const evidenceContext = existingEvidence && existingEvidence.length > 0 
        ? `\n\nPREUVES EXISTANTES SOUMISES PAR LA COMMUNAUTÉ :\n${existingEvidence.map((evidence: any, index: number) => 
            `${index + 1}. ${evidence.title} (${evidence.evidence_type})
               - Description: ${evidence.description || 'Non spécifiée'}
               - Localisation: ${evidence.location_name || 'Non spécifiée'}
               - Statut de validation: ${evidence.validation_status}
               - Score: ${evidence.validation_score}`
          ).join('\n')}`
        : '\n\nAucune preuve n\'a encore été soumise par la communauté pour cette quête.';

      const investigationPrompt = `Tu es un expert en recherche historique et symbolique. Analyse cette quête de trésor et fournis une investigation complète.

Données de la quête:
- Titre: ${questData.title || 'Non spécifié'}
- Type: ${questData.quest_type || 'Non spécifié'}
- Difficulté: ${questData.difficulty_level || 'Non spécifié'}
- Description: ${questData.description || 'Non spécifié'}
- Contexte historique: ${questData.story_background || 'Non spécifié'}

Indices de la quête :
${questData.clues?.map((clue: any, index: number) => 
  `${index + 1}. ${clue.title}: ${clue.description} (Indice: ${clue.hint})`
).join('\n')}

${evidenceContext}

Instructions:
1. Analyse les éléments historiques et symboliques
2. Identifie les connexions potentielles entre les indices
3. Intègre et analyse les preuves existantes soumises par la communauté
4. Suggère des pistes de recherche supplémentaires basées sur les éléments historiques et les preuves
5. Propose des théories sur la localisation
6. Recommande des sources à consulter
7. Identifie les types de preuves supplémentaires à rechercher

Réponds en français avec une analyse structurée et détaillée.`;

      try {
        const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openaiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: 'Tu es un expert en investigation historique et symbolique spécialisé dans la recherche de trésors.' },
              { role: 'user', content: investigationPrompt }
            ],
            max_tokens: 1500,
            temperature: 0.7
          }),
        });

        if (!openaiResponse.ok) {
          throw new Error(`OpenAI API error: ${openaiResponse.status}`);
        }

        const openaiData = await openaiResponse.json();
        const investigationResult = openaiData.choices[0].message.content;
        console.log('✅ [AI-INVESTIGATION-V2] Investigation complète générée');
        
        // Sauvegarder l'investigation dans la base de données si l'utilisateur est authentifié
        let savedInvestigation = null;
        let saveError = null;
        
        if (canSave) {
          console.log('💾 [AI-INVESTIGATION-V2] Sauvegarde en base...');
          const { data: saved, error: error } = await supabase
            .from('ai_investigations')
            .insert({
              quest_id: questId,
              investigation_type: 'full_investigation',
              result_content: {
                investigation: investigationResult,
                quest_data: questData,
                evidence_count: existingEvidence?.length || 0
              },
              evidence_used: existingEvidence || [],
              created_by: userId
            })
            .select()
            .single();

          savedInvestigation = saved;
          saveError = error;

          if (saveError) {
            console.error('❌ [AI-INVESTIGATION-V2] Erreur sauvegarde:', saveError);
          } else {
            console.log('✅ [AI-INVESTIGATION-V2] Investigation sauvegardée avec l\'ID:', savedInvestigation.id);
          }
        } else {
          console.log('⚠️ [AI-INVESTIGATION-V2] Pas de sauvegarde - utilisateur non authentifié');
        }
        
        // Réponse ultra-robuste avec fallbacks multiples
        const responseData = {
          status: 'success', 
          message: canSave ? 'Investigation complète générée et sauvegardée' : 'Investigation générée (non sauvegardée - connexion requise)',
          investigation: investigationResult,
          investigation_id: savedInvestigation?.id,
          saved: !!savedInvestigation,
          save_error: saveError?.message,
          auth_required: !canSave,
          timestamp: new Date().toISOString(),
          // Fallbacks pour compatibilité
          content: investigationResult, // Alias pour investigation
          result: investigationResult,  // Autre alias
          success: true,
          data: investigationResult
        };

        console.log('🎯 [AI-INVESTIGATION-V2] Envoi réponse robuste. Clés:', Object.keys(responseData));

        return new Response(JSON.stringify(responseData), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      } catch (error) {
        console.error('❌ [AI-INVESTIGATION-V2] Erreur investigation:', error);
        return new Response(JSON.stringify({ 
          status: 'error', 
          message: 'Erreur lors de l\'investigation',
          error: error.message
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // Recherche de sources historiques
    if (body.action === 'search_historical_sources') {
      console.log('📚 [AI-INVESTIGATION-V2] Recherche sources historiques');
      
      const openaiKey = Deno.env.get('OPENAI_API_KEY');
      if (!openaiKey) {
        return new Response(JSON.stringify({ 
          status: 'error', 
          message: 'Clé OpenAI manquante' 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const questData = body.questData || {};
      const searchPrompt = `Recherche et identifie des sources historiques pertinentes pour cette quête:

Contexte de la quête:
- Titre: ${questData.title || 'Non spécifié'}
- Culture/Époque: ${questData.culture || questData.period || 'Non spécifié'}
- Localisation: ${questData.location || 'Non spécifié'}
- Symboles associés: ${JSON.stringify(questData.target_symbols || [])}

Trouve et suggère:
1. Archives historiques à consulter
2. Manuscrits anciens pertinents
3. Cartes historiques de la région
4. Chroniques et témoignages d'époque
5. Sources archéologiques
6. Bases de données spécialisées

Pour chaque source, indique: nom, période, localisation, pertinence et accessibilité.`;

      try {
        const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openaiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: 'Tu es un archiviste expert et historien spécialisé dans la localisation de sources historiques.' },
              { role: 'user', content: searchPrompt }
            ],
            max_tokens: 1200,
            temperature: 0.6
          }),
        });

        if (!openaiResponse.ok) {
          throw new Error(`OpenAI API error: ${openaiResponse.status}`);
        }

        const openaiData = await openaiResponse.json();
        console.log('✅ [AI-INVESTIGATION-V2] Sources historiques trouvées');
        
        return new Response(JSON.stringify({ 
          status: 'success', 
          message: 'Sources historiques identifiées',
          sources: openaiData.choices[0].message.content,
          timestamp: new Date().toISOString()
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      } catch (error) {
        console.error('❌ [AI-INVESTIGATION-V2] Erreur recherche sources:', error);
        return new Response(JSON.stringify({ 
          status: 'error', 
          message: 'Erreur lors de la recherche de sources',
          error: error.message
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // Génération de théories
    if (body.action === 'generate_theories') {
      console.log('💡 [AI-INVESTIGATION-V2] Génération de théories');
      
      const openaiKey = Deno.env.get('OPENAI_API_KEY');
      if (!openaiKey) {
        return new Response(JSON.stringify({ 
          status: 'error', 
          message: 'Clé OpenAI manquante' 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const questData = body.questData || {};
      const evidenceData = body.evidenceData || [];
      
      const theoriesPrompt = `Génère des théories d'investigation pour cette quête en te basant sur les données disponibles:

Quête: ${questData.title || 'Non spécifié'}
Type: ${questData.quest_type || 'Non spécifié'}
Context: ${questData.description || 'Non spécifié'}

Indices disponibles: ${JSON.stringify(questData.clues || [])}
Preuves soumises: ${evidenceData.length} éléments

Génère 3-5 théories différentes avec:
1. Nom de la théorie
2. Description détaillée
3. Éléments supportant cette théorie
4. Prédictions vérifiables
5. Niveau de confiance (1-10)
6. Prochaines étapes suggérées

Sois créatif mais reste basé sur les faits disponibles.`;

      try {
        const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openaiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: 'Tu es un théoricien expert en chasse au trésor, capable de formuler des hypothèses créatives mais fondées.' },
              { role: 'user', content: theoriesPrompt }
            ],
            max_tokens: 1400,
            temperature: 0.8
          }),
        });

        if (!openaiResponse.ok) {
          throw new Error(`OpenAI API error: ${openaiResponse.status}`);
        }

        const openaiData = await openaiResponse.json();
        console.log('✅ [AI-INVESTIGATION-V2] Théories générées');
        
        return new Response(JSON.stringify({ 
          status: 'success', 
          message: 'Théories d\'investigation générées',
          theories: openaiData.choices[0].message.content,
          timestamp: new Date().toISOString()
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      } catch (error) {
        console.error('❌ [AI-INVESTIGATION-V2] Erreur génération théories:', error);
        return new Response(JSON.stringify({ 
          status: 'error', 
          message: 'Erreur lors de la génération de théories',
          error: error.message
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // Analyse des connexions
    if (body.action === 'analyze_connections') {
      console.log('🔗 [AI-INVESTIGATION-V2] Analyse des connexions');
      
      const openaiKey = Deno.env.get('OPENAI_API_KEY');
      if (!openaiKey) {
        return new Response(JSON.stringify({ 
          status: 'error', 
          message: 'Clé OpenAI manquante' 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const questData = body.questData || {};
      const evidenceData = body.evidenceData || [];
      const theoriesData = body.theoriesData || [];
      
      const connectionsPrompt = `Analyse les connexions entre tous les éléments de cette investigation:

QUÊTE: ${questData.title || 'Non spécifié'}
INDICES: ${JSON.stringify(questData.clues || [])}
PREUVES: ${evidenceData.length} éléments soumis
THÉORIES: ${theoriesData.length} théories proposées

Identifie et analyse:
1. Connexions entre les indices officiels
2. Relations entre les preuves soumises
3. Support des preuves pour chaque théorie
4. Patterns géographiques ou temporels
5. Éléments manquants critiques
6. Contradictions à résoudre
7. Convergences significatives

Présente ton analyse sous forme de carte des connexions avec forces de liaison.`;

      try {
        const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openaiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: 'Tu es un analyste expert en investigation, spécialisé dans l\'identification de patterns et connexions.' },
              { role: 'user', content: connectionsPrompt }
            ],
            max_tokens: 1300,
            temperature: 0.7
          }),
        });

        if (!openaiResponse.ok) {
          throw new Error(`OpenAI API error: ${openaiResponse.status}`);
        }

        const openaiData = await openaiResponse.json();
        console.log('✅ [AI-INVESTIGATION-V2] Analyse des connexions terminée');
        
        return new Response(JSON.stringify({ 
          status: 'success', 
          message: 'Analyse des connexions terminée',
          connections: openaiData.choices[0].message.content,
          timestamp: new Date().toISOString()
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      } catch (error) {
        console.error('❌ [AI-INVESTIGATION-V2] Erreur analyse connexions:', error);
        return new Response(JSON.stringify({ 
          status: 'error', 
          message: 'Erreur lors de l\'analyse des connexions',
          error: error.message
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // Action par défaut
    console.log('❓ [AI-INVESTIGATION-V2] Action inconnue:', body.action);
    return new Response(JSON.stringify({ 
      status: 'error', 
      message: 'Action non reconnue',
      availableActions: ['ping', 'test_openai', 'full_investigation', 'search_historical_sources', 'generate_theories', 'analyze_connections'],
      receivedAction: body.action
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('💥 [AI-INVESTIGATION-V2] Erreur:', error);
    return new Response(JSON.stringify({ 
      status: 'error', 
      message: error.message,
      stack: error.stack 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});