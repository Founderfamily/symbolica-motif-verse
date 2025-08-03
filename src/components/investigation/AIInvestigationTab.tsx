import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SimpleAITest } from './SimpleAITest';
import { Button } from '@/components/ui/button';
import { Brain } from 'lucide-react';
import { TreasureQuest } from '@/types/quests';

interface AIInvestigationTabProps {
  quest: TreasureQuest;
}

const AIInvestigationTab: React.FC<AIInvestigationTabProps> = ({ quest }) => {
  return (
    <div className="space-y-6">
      {/* Interface Simplifiée - Test IA Direct */}
      <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Brain className="h-6 w-6 text-primary animate-pulse" />
            <div>
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Test IA - Interface Simplifiée
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Test direct de connectivité et fonctionnalité IA
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <SimpleAITest questId={quest.id} />
        </CardContent>
      </Card>
    </div>
  );
};

export default AIInvestigationTab;