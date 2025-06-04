
import { useState, useEffect, useCallback } from 'react';
import { browserValidationService, ValidationReport } from '../services/browserValidationService';

export const useTranslationValidation = () => {
  const [report, setReport] = useState<ValidationReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validate = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const validationReport = await browserValidationService.validateAll();
      setReport(validationReport);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur de validation';
      setError(errorMessage);
      console.error('Erreur de validation:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearCache = useCallback(() => {
    browserValidationService.clearCache();
    setReport(null);
  }, []);

  useEffect(() => {
    // Charger le cache au montage
    const cached = browserValidationService.getCache();
    if (cached) {
      setReport(cached);
    }
  }, []);

  return {
    report,
    isLoading,
    error,
    validate,
    clearCache,
    hasErrors: report ? report.issues.filter(i => i.severity === 'error').length > 0 : false,
    hasWarnings: report ? report.issues.filter(i => i.severity === 'warning').length > 0 : false,
    totalIssues: report ? report.issues.length : 0
  };
};
