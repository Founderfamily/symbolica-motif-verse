
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
    let errorCode = 'MAP_ERROR';
    
    // Check for specific Mapbox errors
    if (error?.status === 401 || (error.originalError && error.originalError?.status === 401)) {
      userMessage = 'Invalid Mapbox access token. Please provide a valid token.';
      errorCode = 'MAP_AUTH_ERROR';
    } else if (error?.status === 403) {
      userMessage = 'Access to this map resource is forbidden. Check your Mapbox account permissions.';
      errorCode = 'MAP_FORBIDDEN_ERROR';
    } else if (error?.status === 404) {
      userMessage = 'Map resource not found. The style or resource might not exist.';
      errorCode = 'MAP_NOT_FOUND_ERROR';
    } else if (error?.status === 429) {
      userMessage = 'Too many map requests. You may have exceeded your Mapbox rate limit.';
      errorCode = 'MAP_RATE_LIMIT_ERROR';
    } else if (error?.message) {
      userMessage = error.message;
    }
    
    const appError: AppError = {
      code: error?.code || errorCode,
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
  
  /**
   * Handle data loading errors
   */
  public static handleDataLoadError(error: any, entityName: string): AppError {
    logger.error(`Data loading error for ${entityName}`, { error });
    
    const userMessage = `Failed to load ${entityName} data. Please try again later.`;
    
    const appError: AppError = {
      code: error?.code || 'DATA_LOAD_ERROR',
      message: userMessage,
      details: { entityName, originalMessage: error?.message },
      originalError: error
    };
    
    toast({
      title: "Data Error",
      description: userMessage,
      variant: "destructive",
    });
    
    return appError;
  }
}
