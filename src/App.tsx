
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import SymbolExplorer from './pages/SymbolExplorer';
import NotFoundPage from './pages/NotFoundPage';
import ContributionsPage from './pages/ContributionsPage';
import ProfilePage from './pages/ProfilePage';
import MapExplorerPage from './pages/MapExplorerPage';
import '@/i18n/config';
import LanguageDebugger from './i18n/LanguageDebugger';

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/explore" element={<SymbolExplorer />} />
          <Route path="/map" element={<MapExplorerPage />} />
          <Route path="/contributions" element={<ContributionsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
      
      {/* Language debugger tool (only visible in development) */}
      <LanguageDebugger />
    </Router>
  );
};

export default App;
