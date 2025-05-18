
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import SymbolExplorer from './pages/SymbolExplorer';
import NotFoundPage from './pages/NotFound';
import ContributionsPage from './pages/ContributionsPage';
import ProfilePage from './pages/Profile';
import MapExplorer from './pages/MapExplorer';
import '@/i18n/config';
import LanguageDebugger from './i18n/LanguageDebugger';
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
    <>
      <Routes>
        <Route path="/" element={<Layout><HomePage /></Layout>} />
        <Route path="/about" element={<Layout><AboutPage /></Layout>} />
        <Route path="/explore" element={<Layout><SymbolExplorer /></Layout>} />
        <Route path="/map" element={<Layout><MapExplorer /></Layout>} />
        <Route path="/contributions" element={<Layout><ContributionsPage /></Layout>} />
        <Route path="/profile" element={<Layout><ProfilePage /></Layout>} />
        <Route path="/auth" element={<Layout><Auth /></Layout>} />
        
        {/* Admin routes with AdminLayout wrapper */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="content" element={<ContentManagement />} />
          <Route path="symbols" element={<SymbolsManagement />} />
          <Route path="symbols/:id" element={<SymbolEditor />} /> {/* Route for SymbolEditor */}
          <Route path="contributions" element={<ContributionsManagement />} />
        </Route>
        
        <Route path="*" element={<Layout><NotFoundPage /></Layout>} />
      </Routes>
      
      {/* Language debugger tool (only visible in development) - placed outside Routes */}
      <LanguageDebugger />
    </>
  );
};

export default App;
