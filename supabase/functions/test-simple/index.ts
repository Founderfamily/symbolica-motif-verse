
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('🧪 TEST SIMPLE: Function called successfully!');
  console.log('🌐 TEST SIMPLE: Request method:', req.method);
  console.log('🌐 TEST SIMPLE: Request URL:', req.url);

  if (req.method === 'OPTIONS') {
    console.log('✅ TEST SIMPLE: Handling CORS preflight');
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();
  
  try {
    console.log('📥 TEST SIMPLE: Processing request');
    
    const processingTime = Date.now() - startTime;
    console.log(`✅ TEST SIMPLE: Completed in ${processingTime}ms`);

    return new Response(JSON.stringify({
      success: true,
      message: 'Test simple function works!',
      timestamp: new Date().toISOString(),
      processingTime: processingTime,
      method: req.method,
      url: req.url
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    const processingTime = Date.now() - startTime;
    console.error('❌ TEST SIMPLE: Error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
      processingTime: processingTime
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
