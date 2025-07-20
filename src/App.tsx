import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

import HomePage from '@/pages/HomePage';
import SymbolsPage from '@/pages/SymbolsPage';
import SymbolDetailPage from '@/pages/SymbolDetailPage';
import AdminPage from '@/pages/AdminPage';
import SearchPage from '@/pages/SearchPage';
import TrendingPage from '@/pages/TrendingPage';
import CollectionsPage from '@/pages/CollectionsPage';
import CollectionDetailPage from '@/pages/CollectionDetailPage';
import TimelinePage from '@/pages/TimelinePage';

function App() {
  return (
    <BrowserRouter>
      <QueryClient>
        <Toaster />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/symbols" element={<SymbolsPage />} />
          <Route path="/symbols/:id" element={<SymbolDetailPage />} />
          <Route path="/timeline" element={<TimelinePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/trending" element={<TrendingPage />} />
          <Route path="/collections" element={<CollectionsPage />} />
          <Route path="/collections/:slug" element={<CollectionDetailPage />} />
          <Route path="*" element={<div className="min-h-screen flex items-center justify-center"><p className="text-xl text-gray-600">Page non trouvée</p></div>} />
        </Routes>
      </QueryClient>
    </BrowserRouter>
  );
}

export default App;
