
import React from 'react';
import { SearchX } from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface SymbolListEmptyProps {
  isSearchResults?: boolean;
  onReset?: () => void;
}

const SymbolListEmpty: React.FC<SymbolListEmptyProps> = ({
  isSearchResults = false,
  onReset
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="bg-slate-100 p-3 rounded-full mb-4">
        <SearchX className="h-8 w-8 text-slate-400" />
      </div>
      
      <h3 className="text-lg font-medium mb-2">
        <I18nText translationKey="symbolList.emptyTitle" />
      </h3>
      
      <p className="text-slate-600 mb-6 max-w-md">
        <I18nText translationKey="symbolList.emptyDescription" />
      </p>
      
      {isSearchResults && onReset && (
        <Button onClick={onReset} variant="outline">
          <I18nText translationKey="search.clearResults" />
        </Button>
      )}
      
      {!isSearchResults && (
        <Button asChild>
          <Link to="/upload">
            <I18nText translationKey="symbolList.contribute" />
          </Link>
        </Button>
      )}
    </div>
  );
};

export default SymbolListEmpty;
