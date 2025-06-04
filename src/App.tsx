import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/sonner'
import { Layout } from '@/components/layout/Layout'
import { HomePage } from '@/pages/HomePage'
import { SymbolsPage } from '@/pages/SymbolsPage'
import { CollectionsPage } from '@/pages/CollectionsPage'
import { CommunityPage } from '@/pages/CommunityPage'
import { ProfilePage } from '@/pages/Profile'
import { ContributionsPage } from '@/pages/ContributionsPage'
import { MapExplorer } from '@/pages/MapExplorer'
import { AboutPage } from '@/pages/AboutPage'
import { Auth } from '@/pages/Auth'
import { NotFound } from '@/pages/NotFound'
import { TranslationDevTools } from '@/components/dev/TranslationDevTools'
import './i18n/config'
import './App.css'

// React Query client
// https://tanstack.com/query/v5/
function App() {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: 1,
      },
    },
  }))

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
                  <Route path="/profile" element={<ProfilePage />} />
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
}

export default App
