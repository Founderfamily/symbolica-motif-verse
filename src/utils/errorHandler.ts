
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

  onError(callback: (error: AppError) => void): () => void {
    this.errorCallbacks.push(callback);
    return () => {
      const index = this.errorCallbacks.indexOf(callback);
      if (index > -1) {
        this.errorCallbacks.splice(index, 1);
      }
    };
  }

  private notifyErrorCallbacks(error: AppError): void {
    this.errorCallbacks.forEach(callback => {
      try {
        callback(error);
      } catch (err) {
        logger.error('Error in error callback', { error: err });
      }
    });
  }

  /**
   * Gestionnaire d'erreurs API principal
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
    
    toast({
      title: "Erreur",
      description: appError.message,
      variant: "destructive",
    });
    
    ErrorHandler.getInstance().notifyErrorCallbacks(appError);
    return appError;
  }
  
  /**
   * Gestionnaire d'erreurs d'authentification
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

    ErrorHandler.getInstance().notifyErrorCallbacks(appError);
    return appError;
  }
  
  /**
   * Gestionnaire d'erreurs de composants
   */
  public static handleComponentError(error: Error, errorInfo: React.ErrorInfo, context?: string): AppError {
    logger.error('Component error', { 
      error: error.message, 
      stack: error.stack, 
      errorInfo, 
      context 
    });
    
    const appError: AppError = {
      code: 'COMPONENT_ERROR',
      message: 'Une erreur s\'est produite lors du rendu du composant',
      details: { 
        componentStack: errorInfo.componentStack
      },
      originalError: error,
      context
    };

    ErrorHandler.getInstance().notifyErrorCallbacks(appError);
    return appError;
  }

  /**
   * Gestionnaire d'erreurs génériques
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
    
    ErrorHandler.getInstance().notifyErrorCallbacks(appError);
    return appError;
  }
}
