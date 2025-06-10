import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import QuestsPage from './pages/QuestsPage';
import QuestDetailPage from './pages/QuestDetailPage';
import ContributePage from './pages/ContributePage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/Admin/AdminDashboard';
import UsersManagement from './pages/Admin/UsersManagement';
import RoleManagement from './pages/Admin/RoleManagement';
import { I18nProvider } from './i18n/I18nProvider';
import './App.css';

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
      <I18nProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/quests" element={<QuestsPage />} />
              <Route path="/quests/:questId" element={<QuestDetailPage />} />
              <Route path="/contribute" element={<ContributePage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<UsersManagement />} />
              <Route path="/admin/roles" element={<RoleManagement />} />
            </Routes>
          </Layout>
          <Toaster />
        </Router>
      </I18nProvider>
    </QueryClientProvider>
  );
}

export default App;
