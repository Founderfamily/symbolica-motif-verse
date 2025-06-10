import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import Layout from '@/components/layout/Layout';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { AuthProvider } from '@/hooks/useAuth';

// Import pages
import HomePage from '@/pages/HomePage';
import AboutPage from '@/pages/AboutPage';
import SymbolsPage from '@/pages/SymbolsPage';
import SymbolDetailPage from '@/pages/SymbolDetailPage';
import CollectionsPage from '@/pages/CollectionsPage';
import CollectionDetailPage from '@/pages/CollectionDetailPage';
import QuestsPage from '@/pages/QuestsPage';
import QuestDetailPage from '@/pages/QuestDetailPage';
import CommunityPage from '@/pages/CommunityPage';
import GroupDetailPage from '@/pages/GroupDetailPage';
import ContributionsPage from '@/pages/ContributionsPage';
import NewContribution from '@/pages/NewContribution';
import ContributionDetail from '@/pages/ContributionDetail';
import Auth from '@/pages/Auth';
import Profile from '@/pages/Profile';
import UserProfilePage from '@/pages/UserProfilePage';
import NotFound from '@/pages/NotFound';

// Admin pages
import Dashboard from '@/pages/Admin/Dashboard';
import UsersManagement from '@/pages/Admin/UsersManagement';
import ContributionsManagement from '@/pages/Admin/ContributionsManagement';
import SymbolsManagement from '@/pages/Admin/SymbolsManagement';
import CollectionsManagement from '@/pages/Admin/CollectionsManagement';
import SystemSettings from '@/pages/Admin/SystemSettings';
import ContentManagement from '@/pages/Admin/ContentManagement';
import AnalysisExamplesManagement from '@/pages/Admin/AnalysisExamplesManagement';
import MasterExplorerPage from '@/pages/Admin/MasterExplorerPage';

// Other specialized pages
import AnalysisPage from '@/pages/AnalysisPage';
import SearchPage from '@/pages/SearchPage';
import TrendingPage from '@/pages/TrendingPage';
import MapExplorer from '@/pages/MapExplorer';
import RoadmapPage from '@/pages/RoadmapPage';
import ContactPage from '@/pages/ContactPage';
import LegalPage from '@/pages/LegalPage';
import PrivacyPage from '@/pages/PrivacyPage';
import TermsPage from '@/pages/TermsPage';

import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <ErrorBoundary>
            <Layout>
              <Routes>
                {/* Main pages */}
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/symbols" element={<SymbolsPage />} />
                <Route path="/symbols/:id" element={<SymbolDetailPage />} />
                <Route path="/collections" element={<CollectionsPage />} />
                <Route path="/collections/:slug" element={<CollectionDetailPage />} />
                <Route path="/quests" element={<QuestsPage />} />
                <Route path="/quests/:questId" element={<QuestDetailPage />} />
                <Route path="/community" element={<CommunityPage />} />
                <Route path="/community/groups/:groupId" element={<GroupDetailPage />} />

                {/* Contributions */}
                <Route path="/contributions" element={<ContributionsPage />} />
                <Route path="/contributions/new" element={<NewContribution />} />
                <Route path="/contributions/:id" element={<ContributionDetail />} />

                {/* User pages */}
                <Route path="/auth" element={<Auth />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/users/:userId" element={<UserProfilePage />} />

                {/* Admin pages */}
                <Route path="/admin" element={<Dashboard />} />
                <Route path="/admin/users" element={<UsersManagement />} />
                <Route path="/admin/contributions" element={<ContributionsManagement />} />
                <Route path="/admin/symbols" element={<SymbolsManagement />} />
                <Route path="/admin/collections" element={<CollectionsManagement />} />
                <Route path="/admin/content" element={<ContentManagement />} />
                <Route path="/admin/analysis-examples" element={<AnalysisExamplesManagement />} />
                <Route path="/admin/settings" element={<SystemSettings />} />
                <Route path="/admin/master-explorer" element={<MasterExplorerPage />} />

                {/* Specialized pages */}
                <Route path="/analysis" element={<AnalysisPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/trending" element={<TrendingPage />} />
                <Route path="/map" element={<MapExplorer />} />
                <Route path="/roadmap" element={<RoadmapPage />} />
                <Route path="/contact" element={<ContactPage />} />
                
                {/* Legal pages */}
                <Route path="/legal" element={<LegalPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/terms" element={<TermsPage />} />

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </ErrorBoundary>
          <Toaster />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
