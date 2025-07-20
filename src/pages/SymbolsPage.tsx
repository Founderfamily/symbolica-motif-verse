import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SymbolData } from '@/types/supabase';
import SymbolGrid from '@/components/sections/SymbolGrid';
import { Button } from '@/components/ui/button';
import { Filter, BarChart3, AlertCircle, Clock } from 'lucide-react';
import { ImageStatsWidget } from '@/components/admin/ImageStatsWidget';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';

const SymbolsPage: React.FC = () => {
  const [showOnlyWithPhotos, setShowOnlyWithPhotos] = useState(false);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Symboles Culturels
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Découvrez notre collection de symboles avec images optimisées
          </p>
        </div>

        {/* Navigation to Timeline */}
        <div className="mb-6 text-center">
          <Link to="/timeline">
            <Button variant="outline" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Voir la Timeline Historique
            </Button>
          </Link>
        </div>

        {/* Statistics and Image Widget */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                <p className="text-blue-900 font-semibold">
                  Collection de symboles culturels
                </p>
              </div>
              
              <Button
                variant={showOnlyWithPhotos ? "default" : "outline"}
                size="sm"
                onClick={() => setShowOnlyWithPhotos(!showOnlyWithPhotos)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                {showOnlyWithPhotos ? "Tous les symboles" : "Avec photos uniquement"}
              </Button>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <ImageStatsWidget />
          </div>
        </div>

        {/* Symbols Grid */}
        <SymbolGrid />
      </div>
    </Layout>
  );
};


export default SymbolsPage;
