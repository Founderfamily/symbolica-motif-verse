
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CreateUserRequest {
  email: string;
  password: string;
  username?: string;
  full_name?: string;
  is_admin?: boolean;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Create Supabase client with service role key for admin operations
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Create regular client to verify the requesting user is admin
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        },
        global: {
          headers: { Authorization: authHeader }
        }
      }
    );

    // Verify the requesting user is authenticated and is admin
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new Error('Authentication failed');
    }

    // Check if user is admin
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    if (profileError || !profile?.is_admin) {
      throw new Error('Insufficient permissions');
    }

    // Parse request body
    const { email, password, username, full_name, is_admin }: CreateUserRequest = await req.json();

    console.log('Creating user with email:', email);

    // Create user using admin client
    const { data: authData, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      user_metadata: {
        username,
        full_name
      },
      email_confirm: true // Auto-confirm email to avoid verification step
    });

    if (createError) {
      console.error('Error creating user:', createError);
      throw createError;
    }

    if (!authData.user) {
      throw new Error('Failed to create user');
    }

    console.log('User created successfully:', authData.user.id);

    // Update the profile with admin status if needed
    if (is_admin) {
      const { error: updateError } = await supabaseAdmin
        .from('profiles')
        .update({ 
          is_admin: true,
          username,
          full_name 
        })
        .eq('id', authData.user.id);

      if (updateError) {
        console.error('Error updating profile:', updateError);
        // Don't throw here, user is created but admin status might not be set
      }
    } else {
      // Update profile with user data
      const { error: updateError } = await supabaseAdmin
        .from('profiles')
        .update({ 
          username,
          full_name 
        })
        .eq('id', authData.user.id);

      if (updateError) {
        console.error('Error updating profile:', updateError);
      }
    }

    // Log the admin action
    const { error: logError } = await supabaseAdmin
      .from('admin_logs')
      .insert({
        admin_id: user.id,
        action: 'create_user',
        entity_type: 'user',
        entity_id: authData.user.id,
        details: {
          email,
          username,
          full_name,
          is_admin
        }
      });

    if (logError) {
      console.error('Error logging action:', logError);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        user_id: authData.user.id,
        message: 'User created successfully'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in create-user-admin function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An unexpected error occurred',
        success: false
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
