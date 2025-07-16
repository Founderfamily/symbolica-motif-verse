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
    console.log('Starting image generation request...')
    
    const { prompt, symbolName, culture, period } = await req.json()
    
    console.log('Request data:', { prompt, symbolName, culture, period })
    
    if (!prompt) {
      console.log('Error: No prompt provided')
      return new Response(
        JSON.stringify({ error: 'Le prompt est requis' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    console.log('OpenAI API Key exists:', !!openaiApiKey)
    
    if (!openaiApiKey) {
      console.log('Error: OpenAI API key not configured')
      return new Response(
        JSON.stringify({ error: 'Clé API OpenAI non configurée' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Construire un prompt enrichi avec les informations du symbole
    const enrichedPrompt = `Créez une image artistique détaillée d'un symbole ${symbolName ? `nommé "${symbolName}"` : ''} ${culture ? `de la culture ${culture}` : ''} ${period ? `de la période ${period}` : ''}. 

${prompt}

Style: Art traditionnel détaillé, couleurs riches et authentiques, haute qualité, style documentaire artistique. L'image doit être claire, bien définie et respectueuse de l'héritage culturel.`

    console.log('Enriched prompt:', enrichedPrompt)

    console.log('Making request to OpenAI...')
    
    // Appel à l'API OpenAI pour la génération d'image
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: enrichedPrompt,
        n: 1,
        size: "1024x1024",
        quality: "standard",
        response_format: "b64_json"
      }),
    })

    console.log('OpenAI response status:', response.status)

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Erreur API OpenAI:', errorData)
      return new Response(
        JSON.stringify({ error: 'Erreur lors de la génération d\'image', details: errorData }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    console.log('Getting response data...')
    const data = await response.json()
    console.log('Response data structure:', Object.keys(data))
    
    if (!data.data || !data.data[0] || !data.data[0].b64_json) {
      console.log('Invalid response structure:', data)
      return new Response(
        JSON.stringify({ error: 'Réponse invalide de l\'API OpenAI', data }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    const base64Image = data.data[0].b64_json
    console.log('Image generated successfully, base64 length:', base64Image.length)
    
    return new Response(
      JSON.stringify({ 
        success: true,
        image: `data:image/png;base64,${base64Image}`,
        prompt: enrichedPrompt
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Erreur dans generate-image-openai:', error)
    console.error('Error details:', error.message, error.stack)
    return new Response(
      JSON.stringify({ error: 'Erreur interne du serveur', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})