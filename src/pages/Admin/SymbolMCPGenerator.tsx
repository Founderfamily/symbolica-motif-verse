
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkle } from 'lucide-react';
import { useSymbolGenerator } from '@/features/symbol-generator/useSymbolGenerator';
import { GeneratorForm } from '@/features/symbol-generator/components/GeneratorForm';
import { ProposalsGrid } from '@/features/symbol-generator/components/ProposalsGrid';
import { ResultsDisplay } from '@/features/symbol-generator/components/ResultsDisplay';

const SymbolMCPGenerator: React.FC = () => {
  const {
    theme,
    setTheme,
    isLoading,
    proposals,
    selectedIndices,
    resultStates,
    allSelected,
    handleResetMemory,
    handlePropose,
    handleRegenerate,
    handleToggleSelect,
    handleSelectAll,
    handleAcceptAndCreateBatch,
    startOver,
  } = useSymbolGenerator();

  const showInitialForm = !isLoading && proposals.length === 0 && resultStates.length === 0;
  const showProposals = !isLoading && proposals.length > 0;
  const showResults = !isLoading && resultStates.length > 0;
  const showLoading = isLoading && proposals.every(p => p.isLoading);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkle className="w-5 h-5 text-yellow-500" />
            Générateur de Symboles de France
          </CardTitle>
          <div className="text-sm text-stone-600 mt-2">
            Génère 5 symboles authentiques de l'histoire de France et de ses régions.
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={handleResetMemory}>Vider la mémoire</Button>
            <span className="text-xs text-stone-500">Évite les répétitions récentes.</span>
          </div>
        </CardHeader>
        <CardContent>
          {showLoading && (
            <div className="text-center text-stone-500 py-8 flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Traitement en cours… Veuillez patienter.
            </div>
          )}

          {showInitialForm && (
            <GeneratorForm
              theme={theme}
              onThemeChange={setTheme}
              onPropose={handlePropose}
              isLoading={isLoading}
            />
          )}
          
          {showProposals && (
            <ProposalsGrid
              proposals={proposals}
              selectedIndices={selectedIndices}
              allSelected={allSelected}
              onToggleSelect={handleToggleSelect}
              onRegenerate={handleRegenerate}
              onSelectAll={handleSelectAll}
              onAcceptAndCreateBatch={handleAcceptAndCreateBatch}
              onGenerateNew={handlePropose}
            />
          )}

          {showResults && (
            <ResultsDisplay
              resultStates={resultStates}
              onGenerateMore={startOver}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SymbolMCPGenerator;
