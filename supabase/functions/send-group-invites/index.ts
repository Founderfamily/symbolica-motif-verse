
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { groupId, groupName, emails, customMessage, inviterEmail } = await req.json()

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Récupérer les détails du groupe
    const { data: group } = await supabaseClient
      .from('interest_groups')
      .select('*')
      .eq('id', groupId)
      .single()

    if (!group) {
      throw new Error('Groupe non trouvé')
    }

    // Template email
    const emailTemplate = (email: string, inviteToken: string) => ({
      to: email,
      subject: `Invitation à rejoindre le groupe "${groupName}"`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Vous êtes invité(e) à rejoindre un groupe d'intérêt !</h2>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0 0 10px 0; color: #333;">${groupName}</h3>
            <p style="margin: 0; color: #666;">${group.description || 'Découvrez et partagez des symboles culturels fascinants.'}</p>
          </div>
          
          ${customMessage ? `
            <div style="border-left: 4px solid #3b82f6; padding-left: 15px; margin: 20px 0;">
              <p style="color: #333; font-style: italic;">"${customMessage}"</p>
              <small style="color: #666;">- ${inviterEmail}</small>
            </div>
          ` : ''}
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${Deno.env.get('SUPABASE_URL')}/groups/${group.slug}?invite=${inviteToken}" 
               style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Rejoindre le groupe
            </a>
          </div>
          
          <div style="background: #f1f5f9; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <h4 style="margin: 0 0 10px 0;">À propos de Cultural Heritage Symbols</h4>
            <p style="margin: 0; font-size: 14px; color: #666;">
              Une plateforme collaborative pour découvrir, documenter et partager les symboles du patrimoine culturel mondial.
            </p>
          </div>
          
          <p style="font-size: 12px; color: #999; text-align: center;">
            Si vous ne souhaitez plus recevoir ces invitations, 
            <a href="#" style="color: #999;">cliquez ici</a>.
          </p>
        </div>
      `
    })

    // Envoyer les invitations
    const results = await Promise.allSettled(
      emails.map(async (email: string) => {
        // Générer un token d'invitation unique
        const inviteToken = crypto.randomUUID()
        
        // Stocker l'invitation en base
        await supabaseClient
          .from('group_invites')
          .insert({
            group_id: groupId,
            email,
            invited_by: inviterEmail,
            invite_token: inviteToken,
            custom_message: customMessage
          })

        // Ici vous pourriez intégrer un service d'email comme SendGrid, Resend, etc.
        // Pour la démo, on simule l'envoi
        console.log(`Email sent to ${email} for group ${groupName}`)
        
        return { email, success: true }
      })
    )

    const successful = results.filter(r => r.status === 'fulfilled').length
    const failed = results.filter(r => r.status === 'rejected').length

    return new Response(
      JSON.stringify({
        success: true,
        sent: successful,
        failed: failed,
        total: emails.length
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error.message,
        success: false
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
