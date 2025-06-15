
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Proposal } from '../types';

interface ProposalCardProps {
  proposal: Proposal;
  index: number;
  isSelected: boolean;
  onToggleSelect: (index: number) => void;
  onRegenerate: (index: number) => void;
}

export const ProposalCard: React.FC<ProposalCardProps> = ({ proposal, index, isSelected, onToggleSelect, onRegenerate }) => {
  return (
    <div className={`relative border rounded-lg bg-stone-50 p-4 flex flex-col items-start ${isSelected ? "border-teal-400 shadow-md" : "border-stone-200"}`}>
      <label className="flex gap-2 items-center cursor-pointer mb-2">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelect(index)}
          className="accent-teal-600"
          disabled={proposal.isLoading}
        />
        <span className="font-medium text-teal-900">Sélectionner</span>
      </label>
      {proposal.isLoading ? (
        <div className="w-full flex items-center justify-center py-5">
          <Loader2 className="animate-spin w-6 h-6 text-gray-400" />
        </div>
      ) : proposal.error ? (
        <div className="text-red-500 text-sm">
          {proposal.error}
          <Button size="sm" variant="outline" className="mt-2" onClick={() => onRegenerate(index)}>
            Régénérer
          </Button>
        </div>
      ) : (
        <>
          <div>
            <span className="font-semibold">
              {proposal.suggestion?.name || "--"}
            </span>
            <span className="text-xs text-gray-500">
              {" "}
              ({proposal.suggestion?.culture}
              {proposal.suggestion?.period ? `, ${proposal.suggestion.period}` : ""})
            </span>
          </div>
          {proposal.suggestion?.description && (
            <div className="text-xs mt-1 text-stone-600 line-clamp-4">
              {proposal.suggestion.description}
            </div>
          )}
          {proposal.suggestion?.tags && (
            <div className="text-xs text-stone-400 mt-2">
              <b>Tags: </b>{Array.isArray(proposal.suggestion.tags) ? proposal.suggestion.tags.join(', ') : proposal.suggestion.tags}
            </div>
          )}
          <div className="text-xs text-teal-700 mt-2">
            Collection : <b>
              {proposal.collection?.collection_translations?.find((tr: any) => tr.language === 'fr')?.title || proposal.collection?.slug}
            </b>
          </div>
          <Button size="sm" variant="ghost" className="mt-3" onClick={() => onRegenerate(index)}>
            Régénérer ce symbole
          </Button>
        </>
      )}
    </div>
  );
};
