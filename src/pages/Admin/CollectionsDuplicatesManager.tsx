
import React from 'react';
import { DuplicateCollectionsManager } from '@/components/admin/DuplicateCollectionsManager';

const CollectionsDuplicatesManager = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Gestion des Doublons</h1>
        <p className="text-slate-600 mt-2">
          Détectez et fusionnez les collections en doublon pour maintenir une base de données propre.
        </p>
      </div>

      <DuplicateCollectionsManager />
    </div>
  );
};

export default CollectionsDuplicatesManager;
