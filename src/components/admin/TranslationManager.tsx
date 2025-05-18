
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { I18nText } from "@/components/ui/i18n-text";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useTranslationDatabase } from '@/i18n/hooks/useTranslationDatabase';
import { Download, Upload, RefreshCw, AlertTriangle, CheckCircle, Database, FileText } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const TranslationManager: React.FC = () => {
  const {
    isLoading,
    checkTranslationsExist,
    forceInitialization,
    exportToFiles,
    getStatistics,
  } = useTranslationDatabase();

  const [dbHasTranslations, setDbHasTranslations] = useState<boolean | null>(null);
  const [stats, setStats] = useState({
    totalEn: 0,
    totalFr: 0,
    missingEn: 0,
    missingFr: 0,
    formatIssues: 0,
  });

  // Check database status on component mount
  useEffect(() => {
    const initializeComponent = async () => {
      const hasTranslations = await checkTranslationsExist();
      setDbHasTranslations(hasTranslations);
      
      if (hasTranslations) {
        const statistics = await getStatistics();
        setStats(statistics);
      }
    };
    
    initializeComponent();
  }, []);

  const handleImport = async () => {
    const success = await forceInitialization();
    if (success) {
      setDbHasTranslations(true);
      // Refresh statistics
      const statistics = await getStatistics();
      setStats(statistics);
    }
  };

  const handleExport = async () => {
    await exportToFiles();
  };

  const handleRefresh = async () => {
    const hasTranslations = await checkTranslationsExist();
    setDbHasTranslations(hasTranslations);
    
    if (hasTranslations) {
      const statistics = await getStatistics();
      setStats(statistics);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          <I18nText translationKey="admin.translation.manager.title">
            Translation Database Manager
          </I18nText>
        </CardTitle>
        <CardDescription>
          <I18nText translationKey="admin.translation.manager.description">
            Manage translation synchronization between database and files
          </I18nText>
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Database Status Alert */}
        {dbHasTranslations === true && (
          <Alert className="bg-green-50 text-green-800 border-green-200 dark:bg-green-950 dark:text-green-200 dark:border-green-900">
            <CheckCircle className="h-5 w-5" />
            <AlertTitle>Database initialized</AlertTitle>
            <AlertDescription>
              Translations are available in the database
            </AlertDescription>
          </Alert>
        )}
        
        {dbHasTranslations === false && (
          <Alert variant="destructive">
            <AlertTriangle className="h-5 w-5" />
            <AlertTitle>Database not initialized</AlertTitle>
            <AlertDescription>
              No translations found in the database. Please import from files.
            </AlertDescription>
          </Alert>
        )}
        
        {dbHasTranslations === null && !isLoading && (
          <Alert variant="default" className="bg-slate-100 border-slate-200 dark:bg-slate-900 dark:border-slate-800">
            <AlertTriangle className="h-5 w-5" />
            <AlertTitle>Database status unknown</AlertTitle>
            <AlertDescription>
              Could not determine translation database status
            </AlertDescription>
          </Alert>
        )}
        
        {isLoading && (
          <div className="space-y-3">
            <p className="text-center text-muted-foreground">Checking database status...</p>
            <Progress value={undefined} className="w-full h-2" />
          </div>
        )}
        
        {/* Statistics Display */}
        {dbHasTranslations && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded text-center">
              <Database className="h-5 w-5 mx-auto mb-2 text-primary" />
              <div className="text-xl font-bold">{stats.totalEn}</div>
              <div className="text-sm">English Translations</div>
            </div>
            
            <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded text-center">
              <Database className="h-5 w-5 mx-auto mb-2 text-primary" />
              <div className="text-xl font-bold">{stats.totalFr}</div>
              <div className="text-sm">French Translations</div>
            </div>
            
            <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded text-center">
              <AlertTriangle className="h-5 w-5 mx-auto mb-2 text-amber-500" />
              <div className="text-xl font-bold text-amber-500">
                {stats.missingEn + stats.missingFr}
              </div>
              <div className="text-sm">Missing Translations</div>
            </div>
            
            <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded text-center">
              <AlertTriangle className="h-5 w-5 mx-auto mb-2 text-red-500" />
              <div className="text-xl font-bold text-red-500">
                {stats.formatIssues}
              </div>
              <div className="text-sm">Format Issues</div>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={handleImport}
            disabled={isLoading}
          >
            {isLoading ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Upload className="mr-2 h-4 w-4" />
            )}
            Import from Files
          </Button>
          
          <Button
            variant="outline"
            onClick={handleExport}
            disabled={isLoading || !dbHasTranslations}
          >
            {isLoading ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            Export to Files
          </Button>
        </div>
        
        <Button
          variant="ghost"
          onClick={handleRefresh}
          disabled={isLoading}
        >
          {isLoading ? (
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="mr-2 h-4 w-4" />
          )}
          Refresh Status
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TranslationManager;
