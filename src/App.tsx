
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import SymbolExplorer from './pages/SymbolExplorer';
import NotFoundPage from './pages/NotFound';
import ContributionsPage from './pages/ContributionsPage';
import ProfilePage from './pages/Profile';
import MapExplorerPage from './pages/MapExplorer';
import '@/i18n/config';
import LanguageDebugger from './i18n/LanguageDebugger';
import { AuthProvider } from './hooks/useAuth';
import Auth from './pages/Auth';

// Import admin components
import AdminLayout from './pages/Admin/AdminLayout';
import Dashboard from './pages/Admin/Dashboard';
import ContentManagement from './pages/Admin/ContentManagement';
import SymbolsManagement from './pages/Admin/SymbolsManagement';
import ContributionsManagement from './pages/Admin/ContributionsManagement';
import SymbolEditor from './pages/Admin/SymbolEditor'; // Import the SymbolEditor component

const App = () => {
  return (
    <AuthProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/explore" element={<SymbolExplorer />} />
          <Route path="/map" element={<MapExplorerPage />} />
          <Route path="/contributions" element={<ContributionsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/auth" element={<Auth />} />
          
          {/* Admin routes with AdminLayout wrapper */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="content" element={<ContentManagement />} />
            <Route path="symbols" element={<SymbolsManagement />} />
            <Route path="symbols/:id" element={<SymbolEditor />} /> {/* Add route for SymbolEditor */}
            <Route path="contributions" element={<ContributionsManagement />} />
          </Route>
          
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
      
      {/* Language debugger tool (only visible in development) */}
      <LanguageDebugger />
    </AuthProvider>
  );
};

export default App;
