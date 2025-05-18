
import { logger } from '../services/logService';
import { toast } from '@/components/ui/use-toast';

export interface AppError {
  code: string;
  message: string;
  details?: Record<string, any>;
  originalError?: Error;
}

export class ErrorHandler {
  /**
   * Handle API errors from Supabase and other sources
   */
  public static handleApiError(error: any, userMessage?: string): AppError {
    logger.error('API Error', { error });
    
    const appError: AppError = {
      code: error?.code || 'UNKNOWN_ERROR',
      message: userMessage || error?.message || 'Une erreur s\'est produite',
      details: error?.details || undefined,
      originalError: error
    };
    
    // Show user-friendly toast
    toast({
      title: "Erreur",
      description: appError.message,
      variant: "destructive",
    });
    
    return appError;
  }
  
  /**
   * Handle validation errors
   */
  public static handleValidationError(field: string, message: string): AppError {
    logger.warning(`Validation error: ${field}`, { field, message });
    
    const appError: AppError = {
      code: 'VALIDATION_ERROR',
      message: message,
      details: { field }
    };
    
    return appError;
  }
  
  /**
   * Handle authentication errors
   */
  public static handleAuthError(error: any): AppError {
    logger.error('Authentication error', { error });
    
    let userMessage: string;
    
    switch (error?.code) {
      case 'auth/email-already-in-use':
        userMessage = 'Cette adresse email est déjà utilisée';
        break;
      case 'auth/invalid-email':
        userMessage = 'Adresse email invalide';
        break;
      case 'auth/user-disabled':
        userMessage = 'Ce compte utilisateur a été désactivé';
        break;
      case 'auth/user-not-found':
        userMessage = 'Aucun utilisateur trouvé avec ces identifiants';
        break;
      case 'auth/wrong-password':
        userMessage = 'Mot de passe incorrect';
        break;
      case 'auth/invalid-credential':
        userMessage = 'Identifiants invalides';
        break;
      default:
        userMessage = 'Erreur d\'authentification';
    }
    
    toast({
      title: "Erreur d'authentification",
      description: userMessage,
      variant: "destructive",
    });
    
    return {
      code: error?.code || 'AUTH_ERROR',
      message: userMessage,
      details: error?.details || undefined,
      originalError: error
    };
  }
  
  /**
   * Handle map errors
   */
  public static handleMapError(error: any): AppError {
    logger.error('Map error', { error });
    
    let userMessage = 'An error occurred with the map.';
    
    // Check for specific Mapbox errors
    if (error?.status === 401 || (error.originalError && error.originalError?.status === 401)) {
      userMessage = 'Invalid Mapbox access token. Please provide a valid token.';
    } else if (error?.message) {
      userMessage = error.message;
    }
    
    const appError: AppError = {
      code: error?.code || 'MAP_ERROR',
      message: userMessage,
      details: error?.details || undefined,
      originalError: error
    };
    
    toast({
      title: "Map Error",
      description: userMessage,
      variant: "destructive",
    });
    
    return appError;
  }
}
