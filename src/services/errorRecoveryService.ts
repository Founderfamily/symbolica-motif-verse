
export interface RecoveryStrategy {
  name: string;
  priority: number;
  canRecover: (error: Error) => boolean;
  recover: () => Promise<boolean>;
}

export class ErrorRecoveryService {
  private strategies: RecoveryStrategy[] = [];
  private retryAttempts = new Map<string, number>();
  private maxRetries = 3;

  addStrategy(strategy: RecoveryStrategy) {
    this.strategies.push(strategy);
    this.strategies.sort((a, b) => b.priority - a.priority);
  }

  async recoverFromError(error: Error, context: string): Promise<boolean> {
    const errorKey = `${context}-${error.message}`;
    const attempts = this.retryAttempts.get(errorKey) || 0;

    if (attempts >= this.maxRetries) {
      console.error(`Max retry attempts reached for ${errorKey}`);
      return false;
    }

    for (const strategy of this.strategies) {
      if (strategy.canRecover(error)) {
        try {
          const recovered = await strategy.recover();
          if (recovered) {
            this.retryAttempts.delete(errorKey);
            return true;
          }
        } catch (recoveryError) {
          console.warn(`Recovery strategy ${strategy.name} failed:`, recoveryError);
        }
      }
    }

    this.retryAttempts.set(errorKey, attempts + 1);
    return false;
  }

  clearRetryHistory(context?: string) {
    if (context) {
      for (const key of this.retryAttempts.keys()) {
        if (key.startsWith(context)) {
          this.retryAttempts.delete(key);
        }
      }
    } else {
      this.retryAttempts.clear();
    }
  }
}

export const errorRecoveryService = new ErrorRecoveryService();

// Stratégies de récupération pour l'IA proactive
const uiRecoveryStrategy: RecoveryStrategy = {
  name: 'UI Recovery',
  priority: 1,
  canRecover: (error: Error) => error.message.includes('Investigation déjà en cours') || error.message.includes('déjà en cours'),
  recover: async () => {
    console.log('🔄 Tentative de récupération UI');
    // Force une remise à zéro des états
    window.dispatchEvent(new CustomEvent('reset-ai-interface'));
    return true;
  }
};

const networkRecoveryStrategy: RecoveryStrategy = {
  name: 'Network Recovery',
  priority: 2,
  canRecover: (error: Error) => error.message.includes('fetch') || error.message.includes('network'),
  recover: async () => {
    console.log('🌐 Tentative de récupération réseau');
    // Attendre un peu puis retry
    await new Promise(resolve => setTimeout(resolve, 1000));
    return true;
  }
};

// Ajouter les stratégies au service
errorRecoveryService.addStrategy(uiRecoveryStrategy);
errorRecoveryService.addStrategy(networkRecoveryStrategy);
