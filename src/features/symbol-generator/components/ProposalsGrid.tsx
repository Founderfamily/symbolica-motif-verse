
import React from 'react';
import { Button } from '@/components/ui/button';
import { Proposal } from '../types';
import { ProposalCard } from './ProposalCard';

interface ProposalsGridProps {
  proposals: Proposal[];
  selectedIndices: number[];
  allSelected: boolean;
  onToggleSelect: (index: number) => void;
  onRegenerate: (index: number) => void;
  onSelectAll: () => void;
  onAcceptAndCreateBatch: () => void;
  onGenerateNew: () => void;
}

export const ProposalsGrid: React.FC<ProposalsGridProps> = ({
  proposals,
  selectedIndices,
  allSelected,
  onToggleSelect,
  onRegenerate,
  onSelectAll,
  onAcceptAndCreateBatch,
  onGenerateNew,
}) => {
  return (
    <div>
      <div className="flex gap-2 mb-4 items-center">
        <Button size="sm" variant="outline" onClick={onSelectAll}>
          {allSelected ? "Tout désélectionner" : "Tout sélectionner"}
        </Button>
        <span className="text-xs text-teal-700">
          {selectedIndices.length} sur {proposals.filter(p => !p.error && !p.isLoading).length} sélectionné{selectedIndices.length > 1 ? "s" : ""}
        </span>
        <Button
          size="sm"
          variant="default"
          onClick={onAcceptAndCreateBatch}
          disabled={selectedIndices.length === 0}
          className="ml-auto"
        >
          Créer {selectedIndices.length > 1 ? `${selectedIndices.length} symboles` : "le symbole"}
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {proposals.map((proposal, i) => (
          <ProposalCard
            key={i}
            index={i}
            proposal={proposal}
            isSelected={selectedIndices.includes(i)}
            onToggleSelect={onToggleSelect}
            onRegenerate={onRegenerate}
          />
        ))}
      </div>
      <div className="flex justify-center mt-5">
        <Button variant="outline" size="sm" onClick={onGenerateNew}>
          Générer 5 nouveaux symboles
        </Button>
      </div>
    </div>
  );
};
