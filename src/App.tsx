import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import HomePage from '@/pages/HomePage';
import SymbolsPage from '@/pages/SymbolsPage';
import CollectionsPage from '@/pages/CollectionsPage';
import CommunityPage from '@/pages/CommunityPage';
import TrendingPage from '@/pages/TrendingPage';
import Auth from '@/pages/Auth';
import Profile from '@/pages/Profile';
import MapExplorer from '@/pages/MapExplorer';
import AnalysisPage from '@/pages/AnalysisPage';
import ContributionsPage from '@/pages/ContributionsPage';
import NewContribution from '@/pages/NewContribution';
import LegalPage from '@/pages/LegalPage';
import PrivacyPage from '@/pages/PrivacyPage';
import TermsPage from '@/pages/TermsPage';
import ContactPage from '@/pages/ContactPage';
import EnterprisePage from '@/pages/EnterprisePage';
import Dashboard from '@/pages/Admin/Dashboard';
import UsersManagement from '@/pages/Admin/UsersManagement';
import ContributionsManagement from '@/pages/Admin/ContributionsManagement';
import SymbolsManagement from '@/pages/Admin/SymbolsManagement';
import CollectionsManagement from '@/pages/Admin/CollectionsManagement';
import SystemSettings from '@/pages/Admin/SystemSettings';
import NotFoundPage from '@/pages/NotFoundPage';
import LazyCollectionDetailPage from '@/components/collections/LazyCollectionDetailPage';

import { initializationService } from '@/services/admin/initializationService';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

function App() {
  useEffect(() => {
    // Initialiser les services automatiques au démarrage de l'app
    const initializeServices = async () => {
      try {
        await initializationService.initializeAutoServices();
        await initializationService.performInitialHealthCheck();
      } catch (error) {
        console.error('Erreur initialisation services:', error);
      }
    };

    initializeServices();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-slate-50">
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/symbols" element={<SymbolsPage />} />
              <Route path="/collections" element={<CollectionsPage />} />
              <Route path="/collection/:id" element={<LazyCollectionDetailPage />} />
              <Route path="/community" element={<CommunityPage />} />
              <Route path="/trending" element={<TrendingPage />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/profile/:username" element={<Profile />} />
              <Route path="/map" element={<MapExplorer />} />
              <Route path="/analysis" element={<AnalysisPage />} />
              <Route path="/contributions" element={<ContributionsPage />} />
              <Route path="/contribute" element={<NewContribution />} />
              <Route path="/legal" element={<LegalPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/enterprise" element={<EnterprisePage />} />

              {/* Admin Routes */}
              <Route path="/admin" element={<Dashboard />} />
              <Route path="/admin/users" element={<UsersManagement />} />
              <Route path="/admin/contributions" element={<ContributionsManagement />} />
              <Route path="/admin/symbols" element={<SymbolsManagement />} />
              <Route path="/admin/collections" element={<CollectionsManagement />} />
              <Route path="/admin/settings" element={<SystemSettings />} />

              {/* Not Found Route */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Layout>
          <Toaster position="top-right" />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
