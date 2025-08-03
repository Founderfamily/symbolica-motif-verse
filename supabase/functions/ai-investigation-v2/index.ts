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
    const body = await req.json();
    console.log('📝 [AI-INVESTIGATION-V2] Body reçu:', JSON.stringify(body));

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

    // Action par défaut
    console.log('❓ [AI-INVESTIGATION-V2] Action inconnue:', body.action);
    return new Response(JSON.stringify({ 
      status: 'error', 
      message: 'Action non reconnue',
      availableActions: ['ping', 'test_openai'],
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