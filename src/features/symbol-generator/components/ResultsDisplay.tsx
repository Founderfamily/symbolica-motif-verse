
import React from 'react';
import { Button } from '@/components/ui/button';
import { ResultState } from '../types';

interface ResultsDisplayProps {
  resultStates: ResultState[];
  onGenerateMore: () => void;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ resultStates, onGenerateMore }) => {
  return (
    <div className="space-y-2 mt-6">
      <div className="font-semibold text-teal-700">
        {resultStates.filter(r => !r.error).length} symbole(s) ajouté(s) avec succès, {resultStates.filter(r => r.error).length} échec(s)
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {resultStates.map((res, idx) => (
          <div key={idx} className={`border rounded-lg p-3 ${res.error ? "border-red-300 bg-red-50" : "border-green-300 bg-green-50"}`}>
            <div>
              <strong>{res.symbol.name}</strong>{" "}
              <span className="text-xs text-stone-500">
                ({res.symbol.culture}{res.symbol.period ? `, ${res.symbol.period}` : ""})
              </span>
            </div>
            {res.error ? (
              <div className="text-xs text-red-700 mt-2">{res.error}</div>
            ) : (
              <>
                {res.symbol.description && (
                  <div className="text-xs text-stone-600 mt-1">{res.symbol.description}</div>
                )}
                <div className="text-xs text-stone-700 mt-1">
                  Collection : <span className="font-bold">{res.collection.collection_translations?.find((tr: any) => tr.language === 'fr')?.title || res.collection.slug}</span>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-end mt-3">
        <Button variant="outline" onClick={onGenerateMore}>
          Générer d'autres symboles
        </Button>
      </div>
    </div>
  );
};

