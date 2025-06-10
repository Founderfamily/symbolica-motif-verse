import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import Layout from '@/components/layout/Layout';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { AuthProvider } from '@/hooks/useAuth';
import { ThemeProvider } from 'next-themes';
import ProtectedRoute from '@/components/common/ProtectedRoute';

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
import MasterExplorer from '@/pages/Admin/MasterExplorer';
import ContributionsModerationPage from '@/pages/Admin/ContributionsModerationPage';
import QuestEnrichmentPage from '@/pages/Admin/QuestEnrichmentPage';

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

// Advanced pages - Previously missing routes
import EnterprisePage from '@/pages/EnterprisePage';
import MCPSearchPage from '@/pages/MCPSearchPage';
import MobileAppPage from '@/pages/MobileApp';
import SymbolExplorer from '@/pages/SymbolExplorer';

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
    <Router>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ThemeProvider defaultTheme="light" storageKey="ui-theme">
            <div className="min-h-screen bg-background">
              <Layout>
                <Routes>
                  {/* Main pages */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/symbols" element={<SymbolsPage />} />
                  <Route path="/symbols/:id" element={<SymbolDetailPage />} />
                  <Route path="/symbol-explorer" element={<SymbolExplorer />} />
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
                  <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><Dashboard /></ProtectedRoute>} />
                  <Route path="/admin/master-explorer" element={<ProtectedRoute requiredRole="admin"><MasterExplorer /></ProtectedRoute>} />
                  <Route path="/admin/quest-enrichment" element={<ProtectedRoute requiredRole="admin"><QuestEnrichmentPage /></ProtectedRoute>} />
                  <Route path="/admin/users" element={<UsersManagement />} />
                  <Route path="/admin/contributions" element={<ContributionsManagement />} />
                  <Route path="/admin/contributions/moderation" element={<ContributionsModerationPage />} />
                  <Route path="/admin/symbols" element={<SymbolsManagement />} />
                  <Route path="/admin/collections" element={<CollectionsManagement />} />
                  <Route path="/admin/content" element={<ContentManagement />} />
                  <Route path="/admin/analysis-examples" element={<AnalysisExamplesManagement />} />
                  <Route path="/admin/settings" element={<SystemSettings />} />

                  {/* Specialized pages */}
                  <Route path="/analysis" element={<AnalysisPage />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/trending" element={<TrendingPage />} />
                  <Route path="/map" element={<MapExplorer />} />
                  <Route path="/roadmap" element={<RoadmapPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  
                  {/* Advanced features - Previously missing routes */}
                  <Route path="/enterprise" element={<EnterprisePage />} />
                  <Route path="/mcp-search" element={<MCPSearchPage />} />
                  <Route path="/mobile" element={<MobileAppPage />} />
                  
                  {/* Legal pages */}
                  <Route path="/legal" element={<LegalPage />} />
                  <Route path="/privacy" element={<PrivacyPage />} />
                  <Route path="/terms" element={<TermsPage />} />

                  {/* 404 */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>
            </div>
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
    </Router>
  );
}

export default App;
