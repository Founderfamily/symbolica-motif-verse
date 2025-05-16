
import React, { useState, useEffect } from 'react';
import { useTranslation } from './useTranslation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertCircle, Languages, CheckCircle2 } from 'lucide-react';

interface MissingTranslation {
  key: string;
  lang: string;
  found?: boolean;
  element?: HTMLElement;
}

// Add interface for the React DevTools global hook
declare global {
  interface Window {
    __REACT_DEVTOOLS_GLOBAL_HOOK__?: any;
  }
}

export const TranslationValidator = () => {
  const { i18n } = useTranslation();
  const [showPanel, setShowPanel] = useState(false);
  const [missingTranslations, setMissingTranslations] = useState<MissingTranslation[]>([]);
  const [directTranslations, setDirectTranslations] = useState<string[]>([]);
  
  // Initializes the translation validator and sets up event listeners
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    const checkTranslations = () => {
      const translationElements = document.querySelectorAll('[data-i18n-key]');
      const missing: MissingTranslation[] = [];
      
      // Check for elements with missing or mismatched translations
      translationElements.forEach((element) => {
        const key = element.getAttribute('data-i18n-key');
        const isMissing = element.getAttribute('data-i18n-missing') === 'true';
        const isMismatched = element.getAttribute('data-i18n-mismatched') === 'true';
        
        if (key && (isMissing || isMismatched)) {
          // Get supported languages
          const supportedLngs = i18n.options.supportedLngs || ['fr', 'en'];
          
          supportedLngs.forEach(lang => {
            if (lang !== 'cimode') { // Skip special language codes
              const exists = i18n.exists(key, { lng: lang });
              if (!exists) {
                missing.push({
                  key,
                  lang,
                  found: false,
                  element: element as HTMLElement
                });
              } else if (isMismatched) {
                missing.push({
                  key,
                  lang,
                  found: true,
                  element: element as HTMLElement
                });
              }
            }
          });
        }
      });
      
      // Also look for direct t() calls in the component tree that might be missing data-i18n-key attributes
      const findDirectTCalls = () => {
        // Check if React DevTools is available
        if (typeof window.__REACT_DEVTOOLS_GLOBAL_HOOK__ !== 'undefined') {
          console.warn('Looking for direct t() calls without I18nText component...');
          // This would need special React DevTools implementation
        }
      };
      
      findDirectTCalls();
      
      setMissingTranslations(missing);
      
      // Log results
      if (missing.length > 0) {
        console.warn(`Found ${missing.length} missing or mismatched translations`);
      } else {
        console.info('All translations are valid!');
      }
    };
    
    // Set up event handler
    window.addEventListener('validate-translations', checkTranslations);
    
    // Add a listener for function exposed globally
    if (window && typeof (window as any).checkTranslations !== 'function') {
      (window as any).checkTranslations = checkTranslations;
    }
    
    return () => {
      window.removeEventListener('validate-translations', checkTranslations);
    };
  }, [i18n]);
  
  // Check for direct t() usage in components - this would detect components using t() 
  // directly instead of I18nText which could cause translation issues
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;
    
    // We'll use a MutationObserver to watch for DOM changes that might indicate
    // text nodes being added without proper I18nText wrapper
    const detectTextNodesWithoutI18n = () => {
      // Find all text nodes directly in components that might be translations
      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        null
      );
      
      const suspiciousTexts: string[] = [];
      
      while (walker.nextNode()) {
        const text = walker.currentNode.nodeValue?.trim();
        if (text && text.length > 3 && !text.match(/^\d+(\.\d+)?$/) && !text.match(/^[a-zA-Z0-9\s.,:;!?()[\]{}]+$/)) {
          // Text that might be a translation key or value
          if (!walker.currentNode.parentElement?.closest('[data-i18n-key]')) {
            suspiciousTexts.push(text);
          }
        }
      }
      
      if (suspiciousTexts.length > 0) {
        setDirectTranslations(suspiciousTexts);
      }
    };
    
    // Run detection on mount
    setTimeout(detectTextNodesWithoutI18n, 2000);
    
  }, []);
  
  const handleValidate = () => {
    const event = new CustomEvent('validate-translations');
    window.dispatchEvent(event);
    setShowPanel(true);
  };
  
  const scrollToElement = (element?: HTMLElement) => {
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Add a temporary highlight
      element.style.outline = '3px solid red';
      element.style.backgroundColor = 'rgba(255,0,0,0.1)';
      setTimeout(() => {
        element.style.outline = '';
        element.style.backgroundColor = '';
      }, 2000);
    }
  };
  
  // Skip in production
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }
  
  return (
    <>
      {/* Floating button in bottom right corner */}
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={handleValidate}
          className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white"
          size="sm"
        >
          <Languages className="w-4 h-4" />
          Check Translations
        </Button>
      </div>
      
      {/* Results panel */}
      {showPanel && (
        <div className="fixed top-20 right-4 z-50 w-80 bg-white shadow-xl rounded-lg border border-slate-200 overflow-hidden">
          <div className="bg-slate-100 p-3 flex justify-between items-center">
            <h3 className="font-medium text-slate-800 flex items-center gap-2">
              <Languages className="w-4 h-4" />
              Translation Status
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPanel(false)}
            >
              ✕
            </Button>
          </div>
          
          <div className="p-4">
            {missingTranslations.length > 0 ? (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-red-600">
                    {missingTranslations.filter(t => !t.found).length} missing translations
                  </span>
                </div>
                
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                  <span className="text-sm text-amber-600">
                    {missingTranslations.filter(t => t.found).length} format mismatches
                  </span>
                </div>
                
                <ScrollArea className="h-64">
                  <div className="space-y-2 pr-2">
                    {missingTranslations.map((item, idx) => (
                      <div 
                        key={`${item.key}-${item.lang}-${idx}`} 
                        className="text-xs p-2 rounded bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100"
                        onClick={() => scrollToElement(item.element)}
                      >
                        <div className="font-mono mb-1 flex justify-between items-center">
                          <span className="font-medium">{item.key}</span>
                          <Badge variant={item.found ? "outline" : "destructive"} className="ml-2 text-[10px]">
                            {item.lang}
                          </Badge>
                        </div>
                        <span className={`block ${item.found ? 'text-amber-600' : 'text-red-600'}`}>
                          {item.found ? 'Format mismatch' : 'Missing translation'}
                        </span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </>
            ) : (
              <div className="flex flex-col items-center gap-2 text-center my-8">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
                <span className="font-medium text-green-700">All translations valid!</span>
              </div>
            )}
            
            {directTranslations.length > 0 && (
              <div className="mt-4 border-t pt-3">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium">Possible direct text found:</span>
                </div>
                <ScrollArea className="h-40">
                  <div className="space-y-2 pr-2">
                    {directTranslations.map((text, idx) => (
                      <div 
                        key={idx} 
                        className="text-xs p-2 rounded bg-blue-50 border border-blue-100"
                      >
                        <span className="block text-blue-700">{text.length > 50 ? text.substring(0, 50) + '...' : text}</span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default TranslationValidator;
