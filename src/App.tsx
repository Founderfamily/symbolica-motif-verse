
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/hooks/useAuth';
import Index from '@/pages/Index';
import About from '@/pages/About';
import Auth from '@/pages/Auth';
import AdminLayout from '@/pages/Admin/AdminLayout';
import Dashboard from '@/pages/Admin/Dashboard';
import SymbolsManagement from '@/pages/Admin/SymbolsManagement';
import SymbolEditor from '@/pages/Admin/SymbolEditor';
import NotFound from '@/pages/NotFound';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="symbols" element={<SymbolsManagement />} />
            <Route path="symbols/:id" element={<SymbolEditor />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
