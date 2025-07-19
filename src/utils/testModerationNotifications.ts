import { supabase } from '@/integrations/supabase/client';

export const testModerationNotifications = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('Utilisateur non connecté');
      return;
    }

    console.log('🧪 Test des notifications de modération...');

    // 1. Créer un signalement de test
    const testReport = {
      symbol_id: 'c8424e84-1cf8-44b2-a3a1-4a1822465a92', // ID du symbole actuel
      item_type: 'comment',
      content: 'Test de signalement automatique',
      reported_by: user.id,
      reported_count: 1,
      status: 'pending'
    };

    console.log('📝 Création d\'un signalement de test...');
    const { data: reportData, error: reportError } = await supabase
      .from('symbol_moderation_items')
      .insert(testReport)
      .select()
      .single();

    if (reportError) {
      console.error('❌ Erreur lors de la création du signalement:', reportError);
      return;
    }

    console.log('✅ Signalement créé:', reportData);

    // 2. Vérifier que les notifications ont été créées
    setTimeout(async () => {
      console.log('🔍 Vérification des notifications créées...');
      
      const { data: notifications, error: notifError } = await supabase
        .from('notifications')
        .select('id, user_id, type, content, created_at')
        .like('content->entity_id', `%${reportData.id}%`);

      if (notifError) {
        console.error('❌ Erreur lors de la récupération des notifications:', notifError);
        return;
      }

      console.log('📧 Notifications trouvées:', notifications);

      // 3. Tester la résolution du signalement
      console.log('🔄 Test de résolution du signalement...');
      const { error: resolveError } = await supabase
        .from('symbol_moderation_items')
        .update({ 
          status: 'approved',
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', reportData.id);

      if (resolveError) {
        console.error('❌ Erreur lors de la résolution:', resolveError);
        return;
      }

      console.log('✅ Signalement résolu');

      // 4. Vérifier les notifications de résolution
      setTimeout(async () => {
        console.log('🔍 Vérification des notifications de résolution...');
        
        const { data: resolveNotifications, error: resolveNotifError } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);

        if (resolveNotifError) {
          console.error('❌ Erreur lors de la récupération des notifications de résolution:', resolveNotifError);
          return;
        }

        console.log('📧 Dernières notifications:', resolveNotifications);
        console.log('🎉 Test terminé avec succès !');
      }, 2000);
    }, 2000);

  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  }
};

// Fonction pour nettoyer les données de test
export const cleanupTestData = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    console.log('🧹 Nettoyage des données de test...');

    // Supprimer les signalements de test
    await supabase
      .from('symbol_moderation_items')
      .delete()
      .eq('content', 'Test de signalement automatique');

    // Supprimer les notifications de test
    await supabase
      .from('notifications')
      .delete()
      .like('content->title', '%Test%');

    console.log('✅ Nettoyage terminé');
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error);
  }
};