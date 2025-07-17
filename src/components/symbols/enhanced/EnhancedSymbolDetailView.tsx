import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SymbolDetailView } from '@/components/symbols/SymbolDetailView';
import { SymbolMantras } from '@/components/symbols/spiritual/SymbolMantras';
import { SymbolChakras } from '@/components/symbols/spiritual/SymbolChakras';
import { SymbolRituals } from '@/components/symbols/spiritual/SymbolRituals';
import { SymbolQuiz } from '@/components/symbols/interactive/SymbolQuiz';
import { SymbolSacredSites } from '@/components/symbols/interactive/SymbolSacredSites';
import { BookOpen, Zap, Flame, Brain, MapPin, Images, Sparkles, ExternalLink } from 'lucide-react';
import type { SymbolData } from '@/types/supabase';

interface EnhancedSymbolDetailViewProps {
  symbol: SymbolData;
}

export const EnhancedSymbolDetailView: React.FC<EnhancedSymbolDetailViewProps> = ({ symbol }) => {
  return (
    <div className="space-y-6">
      {/* Onglets enrichis pour l'expérience complète */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Images className="h-4 w-4" />
            <span className="hidden sm:inline">Vue d'ensemble</span>
          </TabsTrigger>
          <TabsTrigger value="spiritual" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Spirituel</span>
          </TabsTrigger>
          <TabsTrigger value="chakras" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            <span className="hidden sm:inline">Chakras</span>
          </TabsTrigger>
          <TabsTrigger value="rituals" className="flex items-center gap-2">
            <Flame className="h-4 w-4" />
            <span className="hidden sm:inline">Rituels</span>
          </TabsTrigger>
          <TabsTrigger value="quiz" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            <span className="hidden sm:inline">Quiz</span>
          </TabsTrigger>
          <TabsTrigger value="sites" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span className="hidden sm:inline">Sites</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <SymbolDetailView symbol={symbol} />
        </TabsContent>

        <TabsContent value="spiritual" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SymbolMantras symbolId={symbol.id} />
            <div className="space-y-6">
              {/* Espace pour d'autres contenus spirituels */}
              <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg p-6 border border-primary/20">
                <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Pratiques spirituelles
                </h3>
                <p className="text-sm text-muted-foreground">
                  Découvrez les mantras sacrés associés à ce symbole. Les mantras sont des formules spirituelles 
                  qui peuvent être récitées pour la méditation et l'élévation spirituelle.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="chakras" className="space-y-6">
          <SymbolChakras symbolId={symbol.id} />
        </TabsContent>

        <TabsContent value="rituals" className="space-y-6">
          <SymbolRituals symbolId={symbol.id} />
        </TabsContent>

        <TabsContent value="quiz" className="space-y-6">
          <SymbolQuiz symbolId={symbol.id} />
        </TabsContent>

        <TabsContent value="sites" className="space-y-6">
          <SymbolSacredSites symbolId={symbol.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};