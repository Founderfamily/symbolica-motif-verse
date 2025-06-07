
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useTranslation } from '@/i18n/useTranslation';

export const SearchBar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative hidden md:block">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search className="h-5 w-5 text-slate-400" />
      </div>
      <Input
        type="search"
        placeholder={t('search.placeholder', { ns: 'header' })}
        className="pl-10 pr-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring focus:ring-blue-200 text-sm w-64"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </form>
  );
};
