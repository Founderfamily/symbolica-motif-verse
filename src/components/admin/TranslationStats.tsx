
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { I18nText } from "@/components/ui/i18n-text";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { ValidationResultEntry } from '@/i18n/services/translationDatabaseService';
import { RefreshCw, CheckCircle as CheckCircleIcon, AlertCircle as AlertCircleIcon } from "lucide-react";

// Stats Grid component to display translation statistics
const StatsGrid = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
      <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded text-center">
        <div className="text-2xl font-bold">{stats.totalEn}</div>
        <div className="text-sm">English Keys</div>
      </div>
      
      <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded text-center">
        <div className="text-2xl font-bold">{stats.totalFr}</div>
        <div className="text-sm">French Keys</div>
      </div>
      
      <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded text-center">
        <div className="text-2xl font-bold text-red-700 dark:text-red-400">{stats.missingEn}</div>
        <div className="text-sm">Missing in English</div>
      </div>
      
      <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded text-center">
        <div className="text-2xl font-bold text-red-700 dark:text-red-400">{stats.missingFr}</div>
        <div className="text-sm">Missing in French</div>
      </div>
      
      <div className="p-3 bg-amber-100 dark:bg-amber-900/20 rounded text-center">
        <div className="text-2xl font-bold text-amber-700 dark:text-amber-400">{stats.formatIssues}</div>
        <div className="text-sm">Format Issues</div>
      </div>
    </div>
  );
};

// Validation History component to display recent validations
const ValidationHistoryList = ({ validations }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  if (validations.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        No validation history found
      </div>
    );
  }
  
  return (
    <div className="space-y-3">
      {validations.map((validation) => (
        <div 
          key={validation.id} 
          className="p-3 border rounded flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            {validation.valid ? (
              <CheckCircleIcon className="h-5 w-5 text-green-500" />
            ) : (
              <AlertCircleIcon className="h-5 w-5 text-red-500" />
            )}
            
            <div>
              <div className="text-sm font-medium">
                {validation.valid ? 'Validation Passed' : 'Validation Failed'}
              </div>
              <div className="text-xs text-muted-foreground">
                {validation.timestamp ? formatDate(validation.timestamp) : 'Unknown date'}
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            {validation.missing_count_en > 0 && (
              <Badge variant="outline" className="text-red-500 border-red-200">
                {validation.missing_count_en} EN missing
              </Badge>
            )}
            
            {validation.missing_count_fr > 0 && (
              <Badge variant="outline" className="text-red-500 border-red-200">
                {validation.missing_count_fr} FR missing
              </Badge>
            )}
            
            {validation.format_issues_count > 0 && (
              <Badge variant="outline" className="text-amber-500 border-amber-200">
                {validation.format_issues_count} format issues
              </Badge>
            )}
            
            {validation.invalid_key_format_count > 0 && (
              <Badge variant="outline" className="text-blue-500 border-blue-200">
                {validation.invalid_key_format_count} key format issues
              </Badge>
            )}
            
            {validation.valid && (
              <Badge variant="outline" className="text-green-500 border-green-200">
                All good
              </Badge>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

// Main TranslationStats component
const TranslationStats: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [validationHistory, setValidationHistory] = useState<ValidationResultEntry[]>([]);
  const [translationStats, setTranslationStats] = useState({
    totalEn: 0,
    totalFr: 0,
    missingEn: 0,
    missingFr: 0,
    formatIssues: 0
  });
  const { toast } = useToast();

  const fetchValidationHistory = async () => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('translation_validations')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      
      setValidationHistory(data || []);
      
      // Set current stats from the latest validation if available
      if (data && data.length > 0) {
        const latest = data[0];
        setTranslationStats({
          totalEn: 0, // These aren't stored in validation results
          totalFr: 0,
          missingEn: latest.missing_count_en,
          missingFr: latest.missing_count_fr,
          formatIssues: latest.format_issues_count
        });
      }
      
      // Fetch total count of translations
      const { count: enCount, error: enError } = await supabase
        .from('translations')
        .select('*', { count: 'exact', head: true })
        .eq('language', 'en');
      
      if (enError) throw enError;
      
      const { count: frCount, error: frError } = await supabase
        .from('translations')
        .select('*', { count: 'exact', head: true })
        .eq('language', 'fr');
      
      if (frError) throw frError;
      
      setTranslationStats(prev => ({
        ...prev,
        totalEn: enCount || 0,
        totalFr: frCount || 0
      }));
      
    } catch (error: any) {
      console.error("Error fetching translation validation history:", error);
      toast({
        title: "Error loading translation stats",
        description: error.message || "Could not load translation statistics",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchValidationHistory();
  }, []);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          <I18nText translationKey="admin.translation.stats.title">
            Translation Statistics
          </I18nText>
        </CardTitle>
        <CardDescription>
          <I18nText translationKey="admin.translation.stats.description">
            Overview of translation status and recent validation results
          </I18nText>
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-6">
            <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <StatsGrid stats={translationStats} />
            
            <h3 className="text-lg font-semibold mb-3">Recent Validation History</h3>
            
            {/* Validation History List */}
            <ValidationHistoryList validations={validationHistory} />
            
            <div className="mt-6 flex justify-end">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={fetchValidationHistory}
                disabled={isLoading}
              >
                {isLoading ? (
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="mr-2 h-4 w-4" />
                )}
                Refresh Stats
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default TranslationStats;
