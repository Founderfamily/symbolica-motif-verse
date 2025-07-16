import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Replicate from "https://esm.sh/replicate@0.25.2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const body = await req.json()
    const { prompt } = body
    
    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'Le prompt est requis' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    const replicateApiKey = Deno.env.get('REPLICATE_API_KEY')
    if (!replicateApiKey) {
      return new Response(
        JSON.stringify({ error: 'Clé API Replicate non configurée' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    const replicate = new Replicate({
      auth: replicateApiKey,
    })

    console.log("Generating image with Flux model:", prompt)
    
    const output = await replicate.run(
      "black-forest-labs/flux-schnell",
      {
        input: {
          prompt: `Clean visual image without any text, words, or labels. ${prompt}`,
          go_fast: true,
          megapixels: "1",
          num_outputs: 1,
          aspect_ratio: "1:1",
          output_format: "webp",
          output_quality: 80,
          num_inference_steps: 4
        }
      }
    )

    console.log("Flux generation response:", output)
    
    if (!output || !Array.isArray(output) || output.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Réponse invalide de l\'API Replicate' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Récupérer l'URL de l'image
    const imageUrl = output[0]
    
    // Télécharger l'image et la convertir en base64
    const imageResponse = await fetch(imageUrl)
    if (!imageResponse.ok) {
      throw new Error('Impossible de télécharger l\'image générée')
    }
    
    const imageBuffer = await imageResponse.arrayBuffer()
    const base64Image = btoa(String.fromCharCode(...new Uint8Array(imageBuffer)))
    
    return new Response(
      JSON.stringify({ 
        success: true,
        image: `data:image/webp;base64,${base64Image}`,
        prompt: prompt
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error("Error in generate-image function:", error)
    return new Response(
      JSON.stringify({ error: 'Erreur: ' + error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})