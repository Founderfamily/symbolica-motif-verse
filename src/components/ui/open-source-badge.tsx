
import React from 'react';
import { I18nText } from '@/components/ui/i18n-text';

type OpenSourceBadgeProps = {
  className?: string;
};

export function OpenSourceBadge({ className = '' }: OpenSourceBadgeProps) {
  return (
    <div className={`inline-flex items-center bg-slate-800 text-white text-xs rounded-full px-3 py-1 ${className}`}>
      <svg 
        className="h-3.5 w-3.5 mr-1.5" 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <path d="M12 2a10 10 0 0 0-3.16 19.5c.5.09.68-.22.68-.48v-1.7c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.1.39-1.99 1.03-2.69a3.6 3.6 0 0 1 .1-2.64s.84-.27 2.75 1.02a9.58 9.58 0 0 1 5 0c1.91-1.3 2.75-1.02 2.75-1.02.37.92.14 1.77.07 2.64.64.7 1.03 1.6 1.03 2.69 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85l-.01 2.75c0 .26.18.58.69.48A10 10 0 0 0 12 2z"></path>
      </svg>
      <I18nText translationKey="sections.openSource" highlightMissing={true} />
    </div>
  );
}

export default OpenSourceBadge;
