import { NotificationService } from '@/services/notificationService';
import { supabase } from '@/integrations/supabase/client';

export const createTestNotifications = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.log('User not authenticated');
    return;
  }

  console.log('Creating test notifications for user:', user.id);

  // Créer différents types de notifications de test
  const notifications = [
    {
      type: 'contribution' as const,
      title: 'Contribution approuvée',
      message: 'Votre contribution "Symbole Amazigh" a été approuvée par un administrateur.',
      actionUrl: '/contributions'
    },
    {
      type: 'community' as const,
      title: 'Nouveau membre dans votre groupe',
      message: 'Sarah Martin a rejoint le groupe "Archéologie Moderne".',
      actionUrl: '/community'
    },
    {
      type: 'achievement' as const,
      title: 'Badge débloqué',
      message: 'Félicitations ! Vous avez débloqué le badge "Explorateur Débutant".',
      actionUrl: '/profile/achievements'
    },
    {
      type: 'info' as const,
      title: 'Mise à jour système',
      message: 'De nouvelles fonctionnalités sont maintenant disponibles.',
      actionUrl: '/changelog'
    },
    {
      type: 'success' as const,
      title: 'Synchronisation réussie',
      message: 'Vos données ont été synchronisées avec succès.',
    }
  ];

  for (const notification of notifications) {
    try {
      const result = await NotificationService.createNotification(
        user.id,
        notification.type,
        notification.title,
        notification.message,
        notification.actionUrl
      );
      console.log(`Created notification: ${notification.title} - ID: ${result}`);
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  }

  console.log('Test notifications created successfully!');
};

// Auto-execute for development testing
// Uncomment the line below to create test notifications automatically
// createTestNotifications();