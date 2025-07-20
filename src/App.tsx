import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

import HomePage from '@/pages/HomePage';
import SymbolsPage from '@/pages/SymbolsPage';
import SymbolDetailPage from '@/pages/SymbolDetailPage';
import SearchPage from '@/pages/SearchPage';
import TrendingPage from '@/pages/TrendingPage';
import CollectionsPage from '@/pages/CollectionsPage';
import CollectionDetailPage from '@/pages/CollectionDetailPage';
import TimelinePage from '@/pages/TimelinePage';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/symbols" element={<SymbolsPage />} />
          <Route path="/symbols/:id" element={<SymbolDetailPage />} />
          <Route path="/timeline" element={<TimelinePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/trending" element={<TrendingPage />} />
          <Route path="/collections" element={<CollectionsPage />} />
          <Route path="/collections/:slug" element={<CollectionDetailPage />} />
          <Route path="*" element={<div className="min-h-screen flex items-center justify-center"><p className="text-xl text-gray-600">Page non trouvée</p></div>} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
