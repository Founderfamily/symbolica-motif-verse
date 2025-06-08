
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import ContributionConversionManager from '@/components/admin/ContributionConversionManager';

const ContributionConversionPage: React.FC = () => {
  const { user, isAdmin } = useAuth();

  if (!user || !isAdmin) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Conversion des Contributions
          </h1>
          <p className="text-slate-600">
            Gérez la conversion automatique des contributions approuvées en symboles
          </p>
        </div>

        <ContributionConversionManager />
      </div>
    </div>
  );
};

export default ContributionConversionPage;
