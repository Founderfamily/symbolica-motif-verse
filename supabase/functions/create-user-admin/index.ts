
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
    console.log('=== CREATE USER ADMIN FUNCTION START ===');
    console.log('Request method:', req.method);
    console.log('Request headers:', Object.fromEntries(req.headers.entries()));

    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    console.log('Authorization header present:', !!authHeader);
    console.log('Authorization header value:', authHeader ? authHeader.substring(0, 20) + '...' : 'null');
    
    if (!authHeader) {
      console.error('❌ No authorization header found');
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

    console.log('✅ Admin client created successfully');

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

    console.log('✅ Regular client created successfully');

    // Verify the requesting user is authenticated and is admin
    console.log('🔍 Attempting to get user...');
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    console.log('Auth result - User:', user ? `${user.id} (${user.email})` : 'null');
    console.log('Auth result - Error:', authError);
    
    if (authError) {
      console.error('❌ Authentication error:', authError);
      throw new Error(`Authentication failed: ${authError.message}`);
    }
    
    if (!user) {
      console.error('❌ No user found in token');
      throw new Error('Authentication failed: No user found');
    }

    console.log('✅ User authenticated:', user.id);

    // Check if user is admin
    console.log('🔍 Checking admin status...');
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    console.log('Profile query result - Data:', profile);
    console.log('Profile query result - Error:', profileError);

    if (profileError) {
      console.error('❌ Profile query error:', profileError);
      throw new Error(`Profile check failed: ${profileError.message}`);
    }

    if (!profile?.is_admin) {
      console.error('❌ User is not admin. Profile:', profile);
      throw new Error('Insufficient permissions: User is not admin');
    }

    console.log('✅ Admin status verified');

    // Parse request body
    const requestBody = await req.json();
    console.log('Request body received:', { ...requestBody, password: '[HIDDEN]' });
    
    const { email, password, username, full_name, is_admin }: CreateUserRequest = requestBody;

    if (!email || !password) {
      console.error('❌ Missing required fields');
      throw new Error('Email and password are required');
    }

    console.log('🔄 Creating user with email:', email);

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
      console.error('❌ Error creating user:', createError);
      throw createError;
    }

    if (!authData.user) {
      console.error('❌ No user data returned');
      throw new Error('Failed to create user: No user data returned');
    }

    console.log('✅ User created successfully:', authData.user.id);

    // Update the profile with admin status if needed
    if (is_admin) {
      console.log('🔄 Setting admin status...');
      const { error: updateError } = await supabaseAdmin
        .from('profiles')
        .update({ 
          is_admin: true,
          username,
          full_name 
        })
        .eq('id', authData.user.id);

      if (updateError) {
        console.error('❌ Error updating profile with admin status:', updateError);
        // Don't throw here, user is created but admin status might not be set
      } else {
        console.log('✅ Admin status set successfully');
      }
    } else {
      console.log('🔄 Updating profile with user data...');
      // Update profile with user data
      const { error: updateError } = await supabaseAdmin
        .from('profiles')
        .update({ 
          username,
          full_name 
        })
        .eq('id', authData.user.id);

      if (updateError) {
        console.error('❌ Error updating profile:', updateError);
      } else {
        console.log('✅ Profile updated successfully');
      }
    }

    // Log the admin action
    console.log('🔄 Logging admin action...');
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
      console.error('❌ Error logging action:', logError);
    } else {
      console.log('✅ Admin action logged successfully');
    }

    console.log('=== CREATE USER ADMIN FUNCTION SUCCESS ===');

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
    console.error('=== CREATE USER ADMIN FUNCTION ERROR ===');
    console.error('Error details:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An unexpected error occurred',
        success: false,
        debug_info: {
          error_name: error.name,
          error_message: error.message,
          timestamp: new Date().toISOString()
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
