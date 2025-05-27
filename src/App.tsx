import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/sonner";
import Layout from '@/components/layout/Layout';
import HomePage from '@/pages/HomePage';
import AnalysisPage from '@/pages/AnalysisPage';
import ContributionsPage from '@/pages/ContributionsPage';
import SymbolDetailsPage from '@/pages/SymbolDetailsPage';
import SearchPage from '@/pages/SearchPage';
import ProfilePage from '@/pages/ProfilePage';
import EditProfilePage from '@/pages/EditProfilePage';
import AdminPage from '@/pages/AdminPage';
import EnterprisePage from '@/pages/EnterprisePage';
import NotFoundPage from '@/pages/NotFoundPage';
import LegalPage from '@/pages/LegalPage';
import PrivacyPage from '@/pages/PrivacyPage';
import TermsPage from '@/pages/TermsPage';
import ContactPage from '@/pages/ContactPage';
import CollectionsPage from '@/pages/CollectionsPage';
import MobileAppPage from '@/pages/MobileApp';

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
        <div className="min-h-screen bg-background">
          <Routes>
            {/* Mobile app route - accessible without layout for full mobile experience */}
            <Route path="/mobile" element={<MobileAppPage />} />
            
            {/* All other routes with standard layout */}
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="/analysis" element={<AnalysisPage />} />
              <Route path="/contributions" element={<ContributionsPage />} />
              <Route path="/symbols/:id" element={<SymbolDetailsPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/profile/:username" element={<ProfilePage />} />
              <Route path="/profile/:username/edit" element={<EditProfilePage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/enterprise" element={<EnterprisePage />} />
              <Route path="/collections" element={<CollectionsPage />} />
              <Route path="/legal" element={<LegalPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
          <Toaster />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
