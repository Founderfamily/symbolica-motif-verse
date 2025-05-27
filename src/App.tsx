
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/hooks/useAuth';
import Layout from '@/components/layout/Layout';
import HomePage from '@/pages/HomePage';
import SymbolExplorer from '@/pages/SymbolExplorer';
import MapExplorer from '@/pages/MapExplorer';
import CollectionsPage from '@/pages/CollectionsPage';
import CollectionDetailPage from '@/pages/CollectionDetailPage';
import TrendingPage from '@/pages/TrendingPage';
import ContributionsPage from '@/pages/ContributionsPage';
import NewContribution from '@/pages/NewContribution';
import ContributionDetail from '@/pages/ContributionDetail';
import AnalysisPage from '@/pages/AnalysisPage';
import CommunityPage from '@/pages/CommunityPage';
import GroupDetailPage from '@/pages/GroupDetailPage';
import Auth from '@/pages/Auth';
import Profile from '@/pages/Profile';
import AboutPage from '@/pages/AboutPage';
import NotFound from '@/pages/NotFound';
import AdminLayout from '@/pages/Admin/AdminLayout';
import Dashboard from '@/pages/Admin/Dashboard';
import SymbolsManagement from '@/pages/Admin/SymbolsManagement';
import CollectionsManagement from '@/pages/Admin/CollectionsManagement';
import ContributionsManagement from '@/pages/Admin/ContributionsManagement';
import UsersManagement from '@/pages/Admin/UsersManagement';
import ContentManagement from '@/pages/Admin/ContentManagement';
import AnalysisExamplesManagement from '@/pages/Admin/AnalysisExamplesManagement';
import CommentModeration from '@/pages/Admin/CommentModeration';
import SystemSettings from '@/pages/Admin/SystemSettings';
import SymbolEditor from '@/pages/Admin/SymbolEditor';
import CollectionEditor from '@/pages/Admin/CollectionEditor';
import { Toaster } from '@/components/ui/toaster';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Layout><Outlet /></Layout>}>
              <Route index element={<HomePage />} />
              <Route path="symbols" element={<SymbolExplorer />} />
              <Route path="symbols/:id" element={<SymbolExplorer />} />
              <Route path="map" element={<MapExplorer />} />
              <Route path="collections" element={<CollectionsPage />} />
              <Route path="collections/:slug" element={<CollectionDetailPage />} />
              <Route path="trending" element={<TrendingPage />} />
              <Route path="contributions" element={<ContributionsPage />} />
              <Route path="contribute" element={<NewContribution />} />
              <Route path="contributions/new" element={<NewContribution />} />
              <Route path="contributions/:id" element={<ContributionDetail />} />
              <Route path="analysis" element={<AnalysisPage />} />
              <Route path="community" element={<CommunityPage />} />
              <Route path="groups/:slug" element={<GroupDetailPage />} />
              <Route path="auth" element={<Auth />} />
              <Route path="profile" element={<Profile />} />
              <Route path="about" element={<AboutPage />} />
            </Route>

            {/* Admin routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="symbols" element={<SymbolsManagement />} />
              <Route path="symbols/new" element={<SymbolEditor />} />
              <Route path="symbols/:id/edit" element={<SymbolEditor />} />
              <Route path="collections" element={<CollectionsManagement />} />
              <Route path="collections/new" element={<CollectionEditor />} />
              <Route path="collections/:id/edit" element={<CollectionEditor />} />
              <Route path="contributions" element={<ContributionsManagement />} />
              <Route path="users" element={<UsersManagement />} />
              <Route path="content" element={<ContentManagement />} />
              <Route path="analysis" element={<AnalysisExamplesManagement />} />
              <Route path="moderation" element={<CommentModeration />} />
              <Route path="settings" element={<SystemSettings />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
