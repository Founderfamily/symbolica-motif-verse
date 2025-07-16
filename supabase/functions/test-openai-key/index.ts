import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Testing OpenAI API key...')
    
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    console.log('OpenAI API Key exists:', !!openaiApiKey)
    console.log('OpenAI API Key starts with:', openaiApiKey ? openaiApiKey.substring(0, 8) : 'undefined')
    
    if (!openaiApiKey) {
      return new Response(
        JSON.stringify({ 
          error: 'OpenAI API key not found',
          available_env: Object.keys(Deno.env.toObject())
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Test simple API call
    const response = await fetch('https://api.openai.com/v1/models', {
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
      },
    })

    console.log('OpenAI API response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.log('OpenAI API error:', errorText)
      return new Response(
        JSON.stringify({ 
          error: 'OpenAI API test failed',
          status: response.status,
          details: errorText
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'OpenAI API key is working!',
        status: response.status
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Test error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Test failed',
        details: error.message 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})