
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from '@/hooks/useAuth';
import Layout from '@/components/layout/Layout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import HomePage from '@/pages/HomePage';
import AnalysisPage from '@/pages/AnalysisPage';
import ContributionsPage from '@/pages/ContributionsPage';
import SymbolExplorer from '@/pages/SymbolExplorer';
import CommunityPage from '@/pages/CommunityPage';
import UserProfilePage from '@/pages/UserProfilePage';
import Profile from '@/pages/Profile';
import EnterprisePage from '@/pages/EnterprisePage';
import NotFound from '@/pages/NotFound';
import CollectionsPage from '@/pages/CollectionsPage';
import CollectionDetailPage from '@/pages/CollectionDetailPage';
import MobileAppPage from '@/pages/MobileApp';
import MapExplorer from '@/pages/MapExplorer';
import SymbolsPage from '@/pages/SymbolsPage';
import MCPSearchPage from '@/pages/MCPSearchPage';
import Auth from '@/pages/Auth';
import NewContribution from '@/pages/NewContribution';
import TrendingPage from '@/pages/TrendingPage';
import SearchPage from '@/pages/SearchPage';
import LegalPage from '@/pages/LegalPage';
import PrivacyPage from '@/pages/PrivacyPage';
import TermsPage from '@/pages/TermsPage';
import ContactPage from '@/pages/ContactPage';
import PasswordReset from '@/components/auth/PasswordReset';

// Admin pages
import AdminLayout from '@/pages/Admin/AdminLayout';
import Dashboard from '@/pages/Admin/Dashboard';
import UsersManagement from '@/pages/Admin/UsersManagement';
import ContributionsManagement from '@/pages/Admin/ContributionsManagement';
import ContributionsModerationPage from '@/pages/Admin/ContributionsModerationPage';
import SymbolsManagement from '@/pages/Admin/SymbolsManagement';
import CollectionsManagement from '@/pages/Admin/CollectionsManagement';
import SystemSettings from '@/pages/Admin/SystemSettings';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 60 * 1000, // 1 minute
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <div className="min-h-screen bg-background">
            <Routes>
              {/* Mobile app route - accessible without layout for full mobile experience */}
              <Route path="/mobile" element={<MobileAppPage />} />
              
              {/* Password reset route - standalone */}
              <Route path="/reset-password" element={<PasswordReset />} />
              
              {/* Admin routes with AdminLayout - protected */}
              <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Dashboard />} />
                <Route path="users" element={<UsersManagement />} />
                <Route path="contributions" element={<ContributionsManagement />} />
                <Route path="moderation" element={<ContributionsModerationPage />} />
                <Route path="symbols" element={<SymbolsManagement />} />
                <Route path="collections" element={<CollectionsManagement />} />
                <Route path="settings" element={<SystemSettings />} />
              </Route>
              
              {/* All other routes with standard layout */}
              <Route path="/" element={<Layout><Outlet /></Layout>}>
                {/* Public routes */}
                <Route index element={<HomePage />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/symbols" element={<SymbolsPage />} />
                <Route path="/symbols/:id" element={<SymbolExplorer />} />
                <Route path="/collections" element={<CollectionsPage />} />
                <Route path="/collections/:slug" element={<CollectionDetailPage />} />
                <Route path="/community" element={<CommunityPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/trending" element={<TrendingPage />} />
                <Route path="/profile/:username" element={<UserProfilePage />} />
                <Route path="/profile/:username/edit" element={<Profile />} />
                <Route path="/legal" element={<LegalPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/contact" element={<ContactPage />} />
                
                {/* Protected routes - require authentication */}
                <Route path="/enterprise" element={
                  <ProtectedRoute>
                    <EnterprisePage />
                  </ProtectedRoute>
                } />
                <Route path="/analysis" element={
                  <ProtectedRoute>
                    <AnalysisPage />
                  </ProtectedRoute>
                } />
                <Route path="/map" element={
                  <ProtectedRoute>
                    <MapExplorer />
                  </ProtectedRoute>
                } />
                <Route path="/mcp-search" element={
                  <ProtectedRoute>
                    <MCPSearchPage />
                  </ProtectedRoute>
                } />
                <Route path="/contributions" element={
                  <ProtectedRoute>
                    <ContributionsPage />
                  </ProtectedRoute>
                } />
                <Route path="/contribute" element={
                  <ProtectedRoute>
                    <NewContribution />
                  </ProtectedRoute>
                } />
                
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
            <Toaster />
          </div>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
