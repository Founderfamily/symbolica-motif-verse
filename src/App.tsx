
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
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
      
      {/* Language debugger tool (only visible in development) */}
      <LanguageDebugger />
    </AuthProvider>
  );
};

export default App;
