
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from '@/hooks/useAuth';
import Layout from '@/components/layout/Layout';
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
import MobileAppPage from '@/pages/MobileApp';
import MapExplorer from '@/pages/MapExplorer';
import SymbolsPage from '@/pages/SymbolsPage';

// Admin pages
import AdminLayout from '@/pages/Admin/AdminLayout';
import Dashboard from '@/pages/Admin/Dashboard';
import UsersManagement from '@/pages/Admin/UsersManagement';
import ContributionsManagement from '@/pages/Admin/ContributionsManagement';
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

// Simple placeholder components for missing pages
const SearchPage = () => <div className="p-8"><h1>Search Page</h1></div>;
const LegalPage = () => <div className="p-8"><h1>Legal Page</h1></div>;
const PrivacyPage = () => <div className="p-8"><h1>Privacy Page</h1></div>;
const TermsPage = () => <div className="p-8"><h1>Terms Page</h1></div>;
const ContactPage = () => <div className="p-8"><h1>Contact Page</h1></div>;

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <div className="min-h-screen bg-background">
            <Routes>
              {/* Mobile app route - accessible without layout for full mobile experience */}
              <Route path="/mobile" element={<MobileAppPage />} />
              
              {/* Admin routes with AdminLayout */}
              <Route path="/admin" element={<AdminLayout><Outlet /></AdminLayout>}>
                <Route index element={<Dashboard />} />
                <Route path="users" element={<UsersManagement />} />
                <Route path="contributions" element={<ContributionsManagement />} />
                <Route path="symbols" element={<SymbolsManagement />} />
                <Route path="collections" element={<CollectionsManagement />} />
                <Route path="settings" element={<SystemSettings />} />
              </Route>
              
              {/* All other routes with standard layout */}
              <Route path="/" element={<Layout><Outlet /></Layout>}>
                <Route index element={<HomePage />} />
                <Route path="/analysis" element={<AnalysisPage />} />
                <Route path="/contributions" element={<ContributionsPage />} />
                <Route path="/symbols" element={<SymbolsPage />} />
                <Route path="/symbols/:id" element={<SymbolExplorer />} />
                <Route path="/map" element={<MapExplorer />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/profile/:username" element={<UserProfilePage />} />
                <Route path="/profile/:username/edit" element={<Profile />} />
                <Route path="/enterprise" element={<EnterprisePage />} />
                <Route path="/collections" element={<CollectionsPage />} />
                <Route path="/community" element={<CommunityPage />} />
                <Route path="/legal" element={<LegalPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/contact" element={<ContactPage />} />
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
