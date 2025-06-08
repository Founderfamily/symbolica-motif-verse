
import { useEffect } from 'react';
import { useAuth } from './useAuth';
import { initializationService } from '@/services/admin/initializationService';

/**
 * Hook pour initialiser les services admin uniquement quand nécessaire
 * Évite les timeouts au démarrage global de l'app
 */
export const useLazyAdminServices = () => {
  const { isAdmin, user } = useAuth();

  useEffect(() => {
    // Initialiser uniquement si l'utilisateur est admin
    if (!isAdmin || !user) return;

    console.log('🔧 [LazyAdminServices] Initializing admin services...');

    const initializeAdminServices = async () => {
      try {
        await initializationService.initializeAutoServices();
        await initializationService.performInitialHealthCheck();
        console.log('✅ [LazyAdminServices] Admin services initialized');
      } catch (error) {
        console.error('❌ [LazyAdminServices] Error initializing admin services:', error);
      }
    };

    // Différer l'initialisation pour ne pas bloquer l'UI
    const timeoutId = setTimeout(initializeAdminServices, 2000);

    return () => clearTimeout(timeoutId);
  }, [isAdmin, user]);
};
