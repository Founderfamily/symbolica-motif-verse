import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { prompt, symbolName, culture, period } = await req.json()
    
    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'Le prompt est requis' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    const deepseekApiKey = Deno.env.get('DEEPSEEK_API_KEY')
    if (!deepseekApiKey) {
      return new Response(
        JSON.stringify({ error: 'Clé API DeepSeek non configurée' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Construire un prompt enrichi avec les informations du symbole
    const enrichedPrompt = `Créez une image artistique détaillée d'un symbole ${symbolName ? `nommé "${symbolName}"` : ''} ${culture ? `de la culture ${culture}` : ''} ${period ? `de la période ${period}` : ''}. 

${prompt}

Style: Art traditionnel détaillé, couleurs riches et authentiques, haute qualité, style documentaire artistique. L'image doit être claire, bien définie et respectueuse de l'héritage culturel.`

    // Appel à l'API DeepSeek pour la génération d'image
    const response = await fetch('https://api.deepseek.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${deepseekApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: enrichedPrompt,
        n: 1,
        size: "1024x1024",
        quality: "standard",
        response_format: "b64_json"
      }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Erreur API DeepSeek:', errorData)
      return new Response(
        JSON.stringify({ error: 'Erreur lors de la génération d\'image' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    const data = await response.json()
    
    if (!data.data || !data.data[0] || !data.data[0].b64_json) {
      return new Response(
        JSON.stringify({ error: 'Réponse invalide de l\'API DeepSeek' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    const base64Image = data.data[0].b64_json
    
    return new Response(
      JSON.stringify({ 
        success: true,
        image: `data:image/png;base64,${base64Image}`,
        prompt: enrichedPrompt
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Erreur dans generate-image-deepseek:', error)
    return new Response(
      JSON.stringify({ error: 'Erreur interne du serveur' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})