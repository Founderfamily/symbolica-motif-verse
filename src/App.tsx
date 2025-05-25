import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient } from 'react-query';

import Layout from '@/components/layout/Layout';
import Home from '@/pages/Home';
import Auth from '@/pages/Auth';
import Profile from '@/pages/Profile';
import Admin from '@/pages/Admin';
import ContributionsManagement from '@/pages/Admin/ContributionsManagement';
import Contributions from '@/pages/Contributions';
import NewContribution from '@/pages/NewContribution';
import ContributionDetail from '@/pages/ContributionDetail';
import ContributionsGallery from '@/pages/ContributionsGallery';

function App() {
  return (
    <QueryClient>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/contributions" element={<ContributionsManagement />} />
            <Route path="/contributions" element={<Contributions />} />
            <Route path="/contributions/gallery" element={<ContributionsGallery />} />
            <Route path="/contributions/new" element={<NewContribution />} />
            <Route path="/contributions/:id" element={<ContributionDetail />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </QueryClient>
  );
}

export default App;
