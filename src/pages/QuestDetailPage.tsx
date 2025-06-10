
import React from 'react';
import { useParams } from 'react-router-dom';

export default function QuestDetailPage() {
  const { questId } = useParams();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Détails de la Quête</h1>
      <p className="text-slate-600">Quête ID: {questId}</p>
    </div>
  );
}
