
import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

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

// Admin pages
const AdminLayout = lazy(() => import('./pages/Admin/AdminLayout'));
const Dashboard = lazy(() => import('./pages/Admin/Dashboard'));
const SymbolsManagement = lazy(() => import('./pages/Admin/SymbolsManagement'));
const SymbolEditor = lazy(() => import('./pages/Admin/SymbolEditor'));
const ContentManagement = lazy(() => import('./pages/Admin/ContentManagement'));
const ContributionsManagement = lazy(() => import('./pages/Admin/ContributionsManagement'));

// Common loading component for lazy-loaded routes
const LoadingFallback = () => (
  <div className="flex items-center justify-center w-full h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-amber-500"></div>
  </div>
);

function App() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/explore" element={<SymbolExplorer />} />
        <Route path="/explore/:id" element={<SymbolDetail />} />
        <Route path="/map" element={<MapExplorerPage />} />
        <Route path="/contribute" element={<ContributionsPage />} />
        <Route path="/auth" element={<Auth />} />
        
        {/* Groups routes */}
        <Route path="/groups" element={<GroupsPage />} />
        <Route path="/groups/create" element={<GroupCreatePage />} />
        <Route path="/groups/:slug" element={<GroupDetailPage />} />
        
        {/* Admin routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="" element={<Dashboard />} />
          <Route path="symbols" element={<SymbolsManagement />} />
          <Route path="symbols/:id" element={<SymbolEditor />} />
          <Route path="content" element={<ContentManagement />} />
          <Route path="contributions" element={<ContributionsManagement />} />
        </Route>
        
        {/* Not found route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;
