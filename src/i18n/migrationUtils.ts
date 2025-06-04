
/**
 * Utility functions for migrating from I18nText to t() usage
 */

export const convertI18nTextToT = (componentCode: string): string => {
  // Convert <I18nText translationKey="key" /> to {t('key')}
  const simpleI18nTextRegex = /<I18nText\s+translationKey="([^"]+)"\s*\/>/g;
  let convertedCode = componentCode.replace(simpleI18nTextRegex, "{t('$1')}");

  // Convert <I18nText translationKey="key" params={params} /> to {t('key', params)}
  const i18nTextWithParamsRegex = /<I18nText\s+translationKey="([^"]+)"\s+(?:params|values)=\{([^}]+)\}\s*\/>/g;
  convertedCode = convertedCode.replace(i18nTextWithParamsRegex, "{t('$1', $2)}");

  // Convert <I18nText translationKey="key">fallback</I18nText> to {t('key')}
  const i18nTextWithFallbackRegex = /<I18nText\s+translationKey="([^"]+)"[^>]*>([^<]*)<\/I18nText>/g;
  convertedCode = convertedCode.replace(i18nTextWithFallbackRegex, "{t('$1')}");

  return convertedCode;
};

export const addUseTranslationImport = (componentCode: string): string => {
  // Check if useTranslation is already imported
  if (componentCode.includes("useTranslation")) {
    return componentCode;
  }

  // Add import at the top
  const importRegex = /^(import.*from.*['"];?\n)+/m;
  const match = componentCode.match(importRegex);
  
  if (match) {
    const existingImports = match[0];
    const newImport = "import { useTranslation } from '@/i18n/useTranslation';\n";
    return componentCode.replace(existingImports, existingImports + newImport);
  }

  // If no imports found, add at the beginning
  return "import { useTranslation } from '@/i18n/useTranslation';\n\n" + componentCode;
};

export const addUseTranslationHook = (componentCode: string): string => {
  // Check if const { t } = useTranslation() already exists
  if (componentCode.includes("useTranslation()")) {
    return componentCode;
  }

  // Find the component function declaration
  const functionRegex = /(const\s+\w+\s*=\s*\([^)]*\)\s*=>\s*\{|function\s+\w+\s*\([^)]*\)\s*\{)/;
  const match = componentCode.match(functionRegex);

  if (match) {
    const hookDeclaration = "\n  const { t } = useTranslation();\n";
    const insertPosition = match.index! + match[0].length;
    
    return componentCode.slice(0, insertPosition) + 
           hookDeclaration + 
           componentCode.slice(insertPosition);
  }

  return componentCode;
};

export const migrateComponentToT = (componentCode: string): string => {
  let migratedCode = addUseTranslationImport(componentCode);
  migratedCode = addUseTranslationHook(migratedCode);
  migratedCode = convertI18nTextToT(migratedCode);
  
  return migratedCode;
};
