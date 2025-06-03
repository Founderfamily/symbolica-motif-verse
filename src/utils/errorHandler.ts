
import { logger } from '../services/logService';
import { toast } from '@/components/ui/use-toast';

export interface AppError {
  code: string;
  message: string;
  details?: Record<string, any>;
  originalError?: Error;
  context?: string;
}

export class ErrorHandler {
  private static instance: ErrorHandler;
  private errorCallbacks: Array<(error: AppError) => void> = [];

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  /**
   * Subscribe to error events
   */
  onError(callback: (error: AppError) => void): () => void {
    this.errorCallbacks.push(callback);
    return () => {
      const index = this.errorCallbacks.indexOf(callback);
      if (index > -1) {
        this.errorCallbacks.splice(index, 1);
      }
    };
  }

  /**
   * Notify all error subscribers
   */
  private notifyErrorCallbacks(error: AppError): void {
    this.errorCallbacks.forEach(callback => {
      try {
        callback(error);
      } catch (err) {
        console.error('Error in error callback:', err);
      }
    });
  }

  /**
   * Handle API errors from Supabase and other sources
   */
  public static handleApiError(error: any, userMessage?: string, context?: string): AppError {
    logger.error('API Error', { error, context });
    
    const appError: AppError = {
      code: error?.code || 'UNKNOWN_ERROR',
      message: userMessage || error?.message || 'Une erreur s\'est produite',
      details: error?.details || undefined,
      originalError: error,
      context
    };
    
    // Show user-friendly toast
    toast({
      title: "Erreur",
      description: appError.message,
      variant: "destructive",
    });
    
    // Notify subscribers
    ErrorHandler.getInstance().notifyErrorCallbacks(appError);
    
    return appError;
  }
  
  /**
   * Handle validation errors
   */
  public static handleValidationError(field: string, message: string, context?: string): AppError {
    logger.warning(`Validation error: ${field}`, { field, message, context });
    
    const appError: AppError = {
      code: 'VALIDATION_ERROR',
      message: message,
      details: { field },
      context
    };
    
    // Notify subscribers
    ErrorHandler.getInstance().notifyErrorCallbacks(appError);
    
    return appError;
  }
  
  /**
   * Handle authentication errors
   */
  public static handleAuthError(error: any, context?: string): AppError {
    logger.error('Authentication error', { error, context });
    
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
    
    const appError = {
      code: error?.code || 'AUTH_ERROR',
      message: userMessage,
      details: error?.details || undefined,
      originalError: error,
      context
    };

    // Notify subscribers
    ErrorHandler.getInstance().notifyErrorCallbacks(appError);
    
    return appError;
  }
  
  /**
   * Handle component errors (React ErrorBoundary)
   */
  public static handleComponentError(error: Error, errorInfo: React.ErrorInfo, context?: string): AppError {
    logger.error('Component error', { error: error.message, stack: error.stack, errorInfo, context });
    
    const appError: AppError = {
      code: 'COMPONENT_ERROR',
      message: 'Une erreur s\'est produite lors du rendu du composant',
      details: { 
        componentStack: errorInfo.componentStack
      },
      originalError: error,
      context
    };

    // Don't show toast for component errors as ErrorBoundary handles UI
    // Notify subscribers
    ErrorHandler.getInstance().notifyErrorCallbacks(appError);
    
    return appError;
  }

  /**
   * Handle image loading errors
   */
  public static handleImageError(src: string, context?: string): AppError {
    logger.warning('Image loading error', { src, context });
    
    const appError: AppError = {
      code: 'IMAGE_LOAD_ERROR',
      message: `Impossible de charger l'image: ${src}`,
      details: { src },
      context
    };

    // Notify subscribers
    ErrorHandler.getInstance().notifyErrorCallbacks(appError);
    
    return appError;
  }
  
  /**
   * Handle map errors
   */
  public static handleMapError(error: any, context?: string): AppError {
    logger.error('Map error', { error, context });
    
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
      originalError: error,
      context
    };
    
    toast({
      title: "Map Error",
      description: userMessage,
      variant: "destructive",
    });
    
    // Notify subscribers
    ErrorHandler.getInstance().notifyErrorCallbacks(appError);
    
    return appError;
  }
  
  /**
   * Handle data loading errors
   */
  public static handleDataLoadError(error: any, entityName: string, context?: string): AppError {
    logger.error(`Data loading error for ${entityName}`, { error, context });
    
    const userMessage = `Failed to load ${entityName} data. Please try again later.`;
    
    const appError: AppError = {
      code: error?.code || 'DATA_LOAD_ERROR',
      message: userMessage,
      details: { entityName, originalMessage: error?.message },
      originalError: error,
      context
    };
    
    toast({
      title: "Data Error",
      description: userMessage,
      variant: "destructive",
    });
    
    // Notify subscribers
    ErrorHandler.getInstance().notifyErrorCallbacks(appError);
    
    return appError;
  }

  /**
   * Generic error handler
   */
  public static handleGenericError(error: any, context?: string, userMessage?: string): AppError {
    logger.error('Generic error', { error, context });
    
    const appError: AppError = {
      code: error?.code || 'GENERIC_ERROR',
      message: userMessage || error?.message || 'Une erreur inattendue s\'est produite',
      details: error?.details || undefined,
      originalError: error,
      context
    };

    if (userMessage) {
      toast({
        title: "Erreur",
        description: userMessage,
        variant: "destructive",
      });
    }
    
    // Notify subscribers
    ErrorHandler.getInstance().notifyErrorCallbacks(appError);
    
    return appError;
  }
}
