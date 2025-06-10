import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AdminHeader } from '@/components/layout/AdminHeader';
import { AdminQuickActions } from '@/components/admin/AdminQuickActions';
import { DashboardSystemWidgets } from '@/components/admin/DashboardSystemWidgets';
import { AdminWelcomeCard } from '@/components/admin/AdminWelcomeCard';
import { BookOpen, ArrowRight } from 'lucide-react';

const Dashboard = () => {
  const [userCount, setUserCount] = useState(0);
  const [contributionCount, setContributionCount] = useState(0);
  const [symbolCount, setSymbolCount] = useState(0);
  const [collectionCount, setCollectionCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user count
        const { data: users, error: usersError, count: usersCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact' });
        if (usersError) throw usersError;
        setUserCount(usersCount || 0);

        // Fetch contribution count
        const { data: contributions, error: contributionsError, count: contributionsCount } = await supabase
          .from('contributions')
          .select('*', { count: 'exact' });
        if (contributionsError) throw contributionsError;
        setContributionCount(contributionsCount || 0);

        // Fetch symbol count
        const { data: symbols, error: symbolsError, count: symbolsCount } = await supabase
          .from('symbols')
          .select('*', { count: 'exact' });
        if (symbolsError) throw symbolsError;
        setSymbolCount(symbolsCount || 0);

        // Fetch collection count
        const { data: collections, error: collectionsError, count: collectionsCount } = await supabase
          .from('collections')
          .select('*', { count: 'exact' });
        if (collectionsError) throw collectionsError;
        setCollectionCount(collectionsCount || 0);

      } catch (error: any) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdminWelcomeCard />
        
        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <AdminQuickActions />
            
            {/* Master Explorer Card */}
            <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg p-6 text-white">
              <div className="flex items-center">
                <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                  <BookOpen className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium opacity-90">Master Explorer</p>
                  <p className="text-lg font-semibold">Enrichir les Quêtes</p>
                </div>
              </div>
              <div className="mt-4">
                <Link
                  to="/admin/master-explorer"
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-amber-600 bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors"
                >
                  Accéder
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Analytics and System Widgets */}
        <DashboardSystemWidgets />
      </div>
    </div>
  );
};

export default Dashboard;
