
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Layout from '@/components/layout/Layout';
import HomePage from '@/pages/HomePage';
import Auth from '@/pages/Auth';
import Profile from '@/pages/Profile';
import Dashboard from '@/pages/Admin/Dashboard';
import ContributionsManagement from '@/pages/Admin/ContributionsManagement';
import Contributions from '@/pages/Contributions';
import NewContribution from '@/pages/NewContribution';
import ContributionDetail from '@/pages/ContributionDetail';
import ContributionsGallery from '@/pages/ContributionsGallery';
import { AuthProvider } from '@/hooks/useAuth';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin" element={<Dashboard />} />
              <Route path="/admin/contributions" element={<ContributionsManagement />} />
              <Route path="/contributions" element={<Contributions />} />
              <Route path="/contributions/gallery" element={<ContributionsGallery />} />
              <Route path="/contributions/new" element={<NewContribution />} />
              <Route path="/contributions/:id" element={<ContributionDetail />} />
            </Routes>
          </Layout>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
