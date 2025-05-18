
import React, { Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import Layout from './components/layout/Layout';
import TranslationProvider from './i18n/TranslationProvider';

// Common loading component for lazy-loaded routes
const LoadingFallback = () => (
  <div className="flex items-center justify-center w-full h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-amber-500"></div>
  </div>
);

// Lazily load pages for better performance
const HomePage = lazy(() => import('./pages/HomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const SymbolExplorer = lazy(() => import('./pages/SymbolExplorer'));
const SymbolDetail = lazy(() => import('./pages/SymbolDetail'));
const MapExplorerPage = lazy(() => import('./pages/MapExplorerPage'));
const ContributionsPage = lazy(() => import('./pages/ContributionsPage'));
const Auth = lazy(() => import('./pages/Auth'));
const NotFound = lazy(() => import('./pages/NotFound'));
const GroupsPage = lazy(() => import('./pages/Groups/GroupsPage'));
const GroupDetailPage = lazy(() => import('./pages/Groups/GroupDetailPage'));
const GroupCreatePage = lazy(() => import('./pages/Groups/GroupCreatePage'));
const ProfilePage = lazy(() => import('./pages/Profile'));

// Admin pages
const AdminLayout = lazy(() => import('./pages/Admin/AdminLayout'));
const Dashboard = lazy(() => import('./pages/Admin/Dashboard'));
const SymbolsManagement = lazy(() => import('./pages/Admin/SymbolsManagement'));
const SymbolEditor = lazy(() => import('./pages/Admin/SymbolEditor'));
const ContentManagement = lazy(() => import('./pages/Admin/ContentManagement'));
const ContributionsManagement = lazy(() => import('./pages/Admin/ContributionsManagement'));

// Wrapper that decides whether to use Layout or not
const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  
  // Admin pages have their own layout
  if (location.pathname.startsWith('/admin')) {
    return <>{children}</>;
  }
  
  // All other pages use the default Layout
  return <Layout>{children}</Layout>;
};

function App() {
  return (
    <TranslationProvider>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<PageWrapper><HomePage /></PageWrapper>} />
          <Route path="/about" element={<PageWrapper><AboutPage /></PageWrapper>} />
          <Route path="/explore" element={<PageWrapper><SymbolExplorer /></PageWrapper>} />
          <Route path="/explore/:id" element={<PageWrapper><SymbolDetail /></PageWrapper>} />
          <Route path="/map" element={<PageWrapper><MapExplorerPage /></PageWrapper>} />
          <Route path="/contribute" element={<PageWrapper><ContributionsPage /></PageWrapper>} />
          <Route path="/auth" element={<PageWrapper><Auth /></PageWrapper>} />
          <Route path="/profile" element={<PageWrapper><ProfilePage /></PageWrapper>} />
          
          {/* Groups routes */}
          <Route path="/groups" element={<PageWrapper><GroupsPage /></PageWrapper>} />
          <Route path="/groups/create" element={<PageWrapper><GroupCreatePage /></PageWrapper>} />
          <Route path="/groups/:slug" element={<PageWrapper><GroupDetailPage /></PageWrapper>} />
          
          {/* Admin routes - uses AdminLayout */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="" element={<Dashboard />} />
            <Route path="symbols" element={<SymbolsManagement />} />
            <Route path="symbols/:id" element={<SymbolEditor />} />
            <Route path="content" element={<ContentManagement />} />
            <Route path="contributions" element={<ContributionsManagement />} />
          </Route>
          
          {/* Not found route */}
          <Route path="*" element={<PageWrapper><NotFound /></PageWrapper>} />
        </Routes>
      </Suspense>
    </TranslationProvider>
  );
}

export default App;
