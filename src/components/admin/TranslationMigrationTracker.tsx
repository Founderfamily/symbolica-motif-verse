
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { I18nText } from "@/components/ui/i18n-text";
import TranslationStats from './TranslationStats';

export interface MigrationStats {
  totalFiles: number;
  migratedFiles: number;
  partiallyMigrated: number;
  notMigrated: number;
  migrationPercentage: number;
}

const TranslationMigrationTracker = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<MigrationStats | null>(null);
  const [showFilesModal, setShowFilesModal] = useState(false);
  const [problemFiles, setProblemFiles] = useState<string[]>([]);
  const { toast } = useToast();
  
  const fetchStats = async () => {
    setIsLoading(true);
    
    try {
      // This would normally be an API call
      // Here we're simulating stats calculation from the codebase
      const directUsageCounts = simulateDirectUsageCounts();
      const totalFiles = Object.keys(directUsageCounts).length;
      const notMigrated = Object.keys(directUsageCounts).filter(file => 
        directUsageCounts[file].directUsageCount > 0 && directUsageCounts[file].i18nTextCount === 0
      ).length;
      
      const migratedFiles = Object.keys(directUsageCounts).filter(file => 
        directUsageCounts[file].directUsageCount === 0 && directUsageCounts[file].i18nTextCount > 0
      ).length;
      
      const partiallyMigrated = totalFiles - migratedFiles - notMigrated;
      const migrationPercentage = totalFiles > 0 ? Math.round((migratedFiles / totalFiles) * 100) : 0;
      
      setStats({
        totalFiles,
        migratedFiles,
        partiallyMigrated,
        notMigrated,
        migrationPercentage
      });
      
      // Get problematic files (those with the most direct t() calls)
      const problemFilesArray = Object.keys(directUsageCounts)
        .filter(file => directUsageCounts[file].directUsageCount > 0)
        .sort((a, b) => 
          directUsageCounts[b].directUsageCount - directUsageCounts[a].directUsageCount
        )
        .slice(0, 10);
      
      setProblemFiles(problemFilesArray);
      
    } catch (error) {
      console.error("Error fetching migration stats:", error);
      toast({
        title: "Error fetching migration stats",
        description: "Could not retrieve the current migration status.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Simulated function to count direct usage vs I18nText components
  const simulateDirectUsageCounts = () => {
    // In a real implementation, this would scan the codebase
    // Here we're returning simulated results
    return {
      "src/components/sections/Hero.tsx": { directUsageCount: 5, i18nTextCount: 2 },
      "src/components/sections/Features.tsx": { directUsageCount: 3, i18nTextCount: 7 },
      "src/components/symbols/SymbolCard.tsx": { directUsageCount: 0, i18nTextCount: 5 },
      "src/components/ui/TranslatedInput.tsx": { directUsageCount: 1, i18nTextCount: 3 },
      "src/components/layout/Header.tsx": { directUsageCount: 4, i18nTextCount: 0 },
    };
  };
  
  // Run a migration for a specific file
  const runFileMigration = (filePath: string) => {
    toast({
      title: "Migration initiated",
      description: `Running migration for ${filePath}`,
    });
    
    // In a real implementation, this would call the migration script
    setTimeout(() => {
      toast({
        title: "Migration complete",
        description: `Successfully migrated ${filePath}`,
      });
      fetchStats(); // Refresh stats
    }, 1500);
  };
  
  useEffect(() => {
    fetchStats();
  }, []);
  
  return (
    <div className="space-y-8">
      {/* Translation DB Stats Component */}
      <TranslationStats />
      
      <Card className="w-full">
        <CardHeader>
          <CardTitle>
            <I18nText translationKey="admin.translation.migrationTracker.title">
              Translation Migration Progress
            </I18nText>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">Loading stats...</div>
          ) : stats ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">
                    <I18nText translationKey="admin.translation.migrationTracker.progress">
                      Migration Progress
                    </I18nText>
                  </span>
                  <span className="text-sm font-medium">{stats.migrationPercentage}%</span>
                </div>
                <Progress value={stats.migrationPercentage} />
              </div>
              
              <div className="grid grid-cols-3 gap-2 text-center text-sm">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded">
                  <div className="font-bold">{stats.migratedFiles}</div>
                  <div className="text-xs">
                    <I18nText translationKey="admin.translation.migrationTracker.migratedFiles">
                      Migrated
                    </I18nText>
                  </div>
                </div>
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded">
                  <div className="font-bold">{stats.partiallyMigrated}</div>
                  <div className="text-xs">
                    <I18nText translationKey="admin.translation.migrationTracker.partiallyMigrated">
                      Partial
                    </I18nText>
                  </div>
                </div>
                <div className="p-2 bg-red-100 dark:bg-red-900 rounded">
                  <div className="font-bold">{stats.notMigrated}</div>
                  <div className="text-xs">
                    <I18nText translationKey="admin.translation.migrationTracker.notMigrated">
                      Not Started
                    </I18nText>
                  </div>
                </div>
              </div>
              
              {problemFiles.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium mb-2">
                    <I18nText translationKey="admin.translation.migrationTracker.filesNeedingAttention">
                      Files Needing Attention
                    </I18nText>
                  </h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {problemFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-slate-100 dark:bg-slate-800 rounded text-xs">
                        <span className="truncate max-w-[70%]">{file}</span>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => runFileMigration(file)}
                        >
                          <I18nText translationKey="admin.translation.migrationTracker.migrate">
                            Migrate
                          </I18nText>
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex justify-end mt-4">
                <Button 
                  size="sm"
                  variant="outline" 
                  onClick={fetchStats} 
                  disabled={isLoading}
                >
                  <I18nText translationKey="admin.translation.migrationTracker.refresh">
                    Refresh Stats
                  </I18nText>
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <I18nText translationKey="admin.translation.migrationTracker.noStats">
                No migration stats available
              </I18nText>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TranslationMigrationTracker;
