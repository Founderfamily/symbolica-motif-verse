
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import QuestEnrichmentEditor from '@/components/admin/QuestEnrichmentEditor';

const QuestEnrichmentPage: React.FC = () => {
  const { user, isAdmin } = useAuth();

  if (!user || !isAdmin) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto py-8 px-4">
        <QuestEnrichmentEditor />
      </div>
    </div>
  );
};

export default QuestEnrichmentPage;
