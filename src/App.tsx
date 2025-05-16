
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/hooks/useAuth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Index from '@/pages/Index';
import About from '@/pages/About';
import Auth from '@/pages/Auth';
import Profile from '@/pages/Profile';
import SymbolExplorer from '@/pages/SymbolExplorer';
import MapExplorer from '@/pages/MapExplorer';
import Contributions from '@/pages/Contributions';
import NewContribution from '@/pages/NewContribution';
import ContributionDetail from '@/pages/ContributionDetail';
import NotFound from '@/pages/NotFound';
import AdminLayout from '@/pages/Admin/AdminLayout';
import Dashboard from '@/pages/Admin/Dashboard';
import ContentManagement from '@/pages/Admin/ContentManagement';
import SymbolsManagement from '@/pages/Admin/SymbolsManagement';
import SymbolEditor from '@/pages/Admin/SymbolEditor';
import ContributionsManagement from '@/pages/Admin/ContributionsManagement';
import { TranslationValidator } from '@/i18n/TranslationValidator';
import './App.css';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename="/">
        <AuthProvider>
          {/* Initialize translation validator */}
          <TranslationValidator />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/explore" element={<SymbolExplorer />} />
            <Route path="/map" element={<MapExplorer />} />
            <Route path="/contributions" element={<Contributions />} />
            <Route path="/contributions/new" element={<NewContribution />} />
            <Route path="/contributions/:id" element={<ContributionDetail />} />
            <Route path="/admin" element={<AdminLayout />} >
              <Route index element={<Dashboard />} />
              <Route path="content" element={<ContentManagement />} />
              <Route path="symbols" element={<SymbolsManagement />} />
              <Route path="symbols/:id" element={<SymbolEditor />} />
              <Route path="contributions" element={<ContributionsManagement />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
