
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/hooks/useAuth';
import Layout from '@/components/layout/Layout';
import AdminLayout from '@/pages/Admin/AdminLayout';

// Pages
import HomePage from '@/pages/HomePage';
import SymbolExplorer from '@/pages/SymbolExplorer';
import MapExplorer from '@/pages/MapExplorer';
import ContributionsPage from '@/pages/ContributionsPage';
import NewContribution from '@/pages/NewContribution';
import ContributionDetail from '@/pages/ContributionDetail';
import Profile from '@/pages/Profile';
import Auth from '@/pages/Auth';
import AboutPage from '@/pages/AboutPage';
import NotFound from '@/pages/NotFound';

// Collections Pages
import CollectionsPage from '@/pages/CollectionsPage';
import CollectionDetailPage from '@/pages/CollectionDetailPage';

// Admin Pages
import Dashboard from '@/pages/Admin/Dashboard';
import SymbolsManagement from '@/pages/Admin/SymbolsManagement';
import SymbolEditor from '@/pages/Admin/SymbolEditor';
import ContributionsManagement from '@/pages/Admin/ContributionsManagement';
import ContentManagement from '@/pages/Admin/ContentManagement';
import CollectionsManagement from '@/pages/Admin/CollectionsManagement';
import CollectionEditor from '@/pages/Admin/CollectionEditor';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <Routes>
            {/* Public routes with layout */}
            <Route path="/" element={<Layout><Outlet /></Layout>}>
              <Route index element={<HomePage />} />
              <Route path="symbols" element={<SymbolExplorer />} />
              <Route path="map" element={<MapExplorer />} />
              <Route path="collections" element={<CollectionsPage />} />
              <Route path="collections/:slug" element={<CollectionDetailPage />} />
              <Route path="contributions" element={<ContributionsPage />} />
              <Route path="contributions/new" element={<NewContribution />} />
              <Route path="contributions/:id" element={<ContributionDetail />} />
              <Route path="profile" element={<Profile />} />
              <Route path="about" element={<AboutPage />} />
            </Route>

            {/* Auth routes without layout */}
            <Route path="/auth" element={<Auth />} />

            {/* Admin routes with admin layout */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="symbols" element={<SymbolsManagement />} />
              <Route path="symbols/new" element={<SymbolEditor />} />
              <Route path="symbols/:id" element={<SymbolEditor />} />
              <Route path="collections" element={<CollectionsManagement />} />
              <Route path="collections/new" element={<CollectionEditor />} />
              <Route path="collections/:id" element={<CollectionEditor />} />
              <Route path="contributions" element={<ContributionsManagement />} />
              <Route path="content" element={<ContentManagement />} />
            </Route>

            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
