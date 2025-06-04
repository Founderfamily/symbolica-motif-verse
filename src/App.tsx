
import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/sonner'
import Layout from '@/components/layout/Layout'
import HomePage from '@/pages/HomePage'
import SymbolsPage from '@/pages/SymbolsPage'
import CollectionsPage from '@/pages/CollectionsPage'
import CommunityPage from '@/pages/CommunityPage'
import Profile from '@/pages/Profile'
import ContributionsPage from '@/pages/ContributionsPage'
import MapExplorer from '@/pages/MapExplorer'
import AboutPage from '@/pages/AboutPage'
import Auth from '@/pages/Auth'
import NotFound from '@/pages/NotFound'
import { TranslationDevTools } from '@/components/dev/TranslationDevTools'
import './i18n/config'
import './App.css'

// React Query client
// https://tanstack.com/query/v5/
function App() {
  console.log('🚀 App component loaded');

  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: 1,
      },
    },
  }))

  console.log('🔧 QueryClient initialized');

  try {
    console.log('🎨 Starting App render');
    
    return (
      <QueryClientProvider client={queryClient}>
        <Router>
          <div className="min-h-screen bg-background">
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/*" element={
                <Layout>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/symbols" element={<SymbolsPage />} />
                    <Route path="/collections" element={<CollectionsPage />} />
                    <Route path="/community" element={<CommunityPage />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/contributions" element={<ContributionsPage />} />
                    <Route path="/map" element={<MapExplorer />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Layout>
              } />
            </Routes>
            <Toaster />
            <TranslationDevTools />
          </div>
        </Router>
      </QueryClientProvider>
    )
  } catch (error) {
    console.error('❌ Error in App component:', error);
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Application Error</h1>
          <p className="text-gray-700 mb-4">Something went wrong while loading the application.</p>
          <pre className="text-xs text-left bg-gray-100 p-4 rounded overflow-auto">
            {error instanceof Error ? error.message : String(error)}
          </pre>
        </div>
      </div>
    );
  }
}

export default App
