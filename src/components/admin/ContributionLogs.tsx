
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { adminLogsService, AdminLog } from '@/services/admin/logsService';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Json } from '@/integrations/supabase/types';

export default function ContributionLogs() {
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadLogs();
  }, []);
  
  const loadLogs = async () => {
    setLoading(true);
    try {
      const logsData = await adminLogsService.getRecentLogs(50);
      // Filter logs related to contributions
      const contributionLogs = logsData.filter(log => 
        log.entity_type === 'contribution' || 
        log.action.includes('contribution') ||
        log.action === 'moderate_contribution' ||
        log.action === 'convert_contribution_to_symbol'
      );
      setLogs(contributionLogs);
    } catch (error) {
      console.error('Error loading contribution logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatLogDetails = (details: Json): Record<string, any> => {
    if (details === null || details === undefined) {
      return {};
    }
    if (typeof details === 'object' && !Array.isArray(details)) {
      return details as Record<string, any>;
    }
    return { value: details };
  };

  const getActionBadgeVariant = (action: string) => {
    switch (action.toLowerCase()) {
      case 'moderate_contribution':
        return 'default';
      case 'convert_contribution_to_symbol':
        return 'secondary';
      case 'delete_contribution':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'moderate_contribution':
        return 'Modération';
      case 'convert_contribution_to_symbol':
        return 'Conversion';
      case 'delete_contribution':
        return 'Suppression';
      default:
        return action;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-semibold flex justify-between items-center">
          <span>Historique des contributions</span>
          <Button 
            variant="outline" 
            size="sm"
            onClick={loadLogs}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-10 w-10 animate-spin text-slate-400" />
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-10 text-slate-500">
            Aucun historique de modération trouvé.
          </div>
        ) : (
          <div className="space-y-4">
            {logs.map(log => {
              const formattedDetails = formatLogDetails(log.details);
              
              return (
                <div 
                  key={log.id} 
                  className="flex gap-3 p-3 rounded-md hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-none"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {log.admin_name?.charAt(0) || 'A'}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-medium">{log.admin_name}</span>
                        <span className="mx-1 text-slate-400">·</span>
                        <Badge variant={getActionBadgeVariant(log.action)}>
                          {getActionLabel(log.action)}
                        </Badge>
                        {log.entity_id && (
                          <span className="ml-2 text-xs text-slate-500">
                            #{log.entity_id.substring(0, 8)}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-500">
                        {formatDate(log.created_at)}
                      </span>
                    </div>
                    
                    {formattedDetails && Object.keys(formattedDetails).length > 0 && (
                      <div className="mt-2 text-sm text-slate-600 bg-slate-50 p-2 rounded">
                        {Object.entries(formattedDetails).map(([key, value]) => (
                          <div key={key} className="flex gap-2">
                            <span className="font-medium capitalize">{key.replace('_', ' ')}:</span>
                            <span>{typeof value === 'string' ? value : JSON.stringify(value)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
