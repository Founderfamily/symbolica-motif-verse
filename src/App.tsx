
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/hooks/useAuth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Index from '@/pages/Index';
import About from '@/pages/About';
import Auth from '@/pages/Auth';
import Profile from '@/pages/Profile';
import AdminLayout from '@/pages/Admin/AdminLayout';
import Dashboard from '@/pages/Admin/Dashboard';
import SymbolsManagement from '@/pages/Admin/SymbolsManagement';
import SymbolEditor from '@/pages/Admin/SymbolEditor';
import ContentManagement from '@/pages/Admin/ContentManagement';
import ContributionsManagement from '@/pages/Admin/ContributionsManagement';
import Contributions from '@/pages/Contributions';
import NewContribution from '@/pages/NewContribution';
import ContributionDetail from '@/pages/ContributionDetail';
import NotFound from '@/pages/NotFound';
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
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/contributions" element={<Contributions />} />
            <Route path="/contributions/new" element={<NewContribution />} />
            <Route path="/contributions/:id" element={<ContributionDetail />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="symbols" element={<SymbolsManagement />} />
              <Route path="symbols/:id" element={<SymbolEditor />} />
              <Route path="content" element={<ContentManagement />} />
              <Route path="contributions" element={<ContributionsManagement />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
