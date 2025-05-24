
import React, { useState } from 'react';
import { useTranslation } from '@/i18n/useTranslation';

export const DevHelper = () => {
  const { changeLanguage, currentLanguage } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  
  // Only show in development
  if (process.env.NODE_ENV !== 'development') return null;
  
  // Toggle with Ctrl+Alt+L
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.altKey && e.code === 'KeyL') {
        const newLang = currentLanguage === 'fr' ? 'en' : 'fr';
        changeLanguage(newLang);
      }
      if (e.ctrlKey && e.altKey && e.code === 'KeyT') {
        setIsVisible(!isVisible);
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentLanguage, changeLanguage, isVisible]);
  
  if (!isVisible) return null;
  
  return (
    <div className="fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-lg shadow-lg z-50">
      <div className="text-sm">
        <div>Language: {currentLanguage}</div>
        <div className="mt-1 text-xs opacity-75">
          Ctrl+Alt+L: Toggle language<br/>
          Ctrl+Alt+T: Toggle this panel
        </div>
        <button 
          onClick={() => setIsVisible(false)}
          className="mt-2 text-xs bg-blue-700 px-2 py-1 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default DevHelper;
