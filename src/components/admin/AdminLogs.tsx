import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslation } from '@/i18n/useTranslation';
import { I18nText } from '@/components/ui/i18n-text';
import { adminLogsService, AdminLog } from '@/services/admin/logsService';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function AdminLogs() {
  const { t } = useTranslation();
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [entityFilter, setEntityFilter] = useState<string>('all');
  const [actionFilter, setActionFilter] = useState<string>('all');
  
  useEffect(() => {
    loadLogs();
  }, []);
  
  const loadLogs = async () => {
    setLoading(true);
    try {
      const logsData = await adminLogsService.getRecentLogs(100);
      setLogs(logsData);
    } catch (error) {
      console.error('Error loading admin logs:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Get unique entity types and actions for filtering
  const entityTypes = ['all', ...new Set(logs.map(log => log.entity_type))];
  const actionTypes = ['all', ...new Set(logs.map(log => log.action))];
  
  // Filter logs based on search and filters
  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      searchTerm === '' || 
      log.admin_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.entity_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.details && JSON.stringify(log.details).toLowerCase().includes(searchTerm.toLowerCase()));
      
    const matchesEntity = entityFilter === 'all' || log.entity_type === entityFilter;
    const matchesAction = actionFilter === 'all' || log.action === actionFilter;
    
    return matchesSearch && matchesEntity && matchesAction;
  });
  
  const getActionBadgeVariant = (action: string) => {
    switch (action.toLowerCase()) {
      case 'create':
        return 'default';
      case 'update':
        return 'outline';
      case 'delete':
        return 'destructive';
      case 'approve':
        return 'secondary';
      case 'reject':
        return 'destructive';
      default:
        return 'secondary';
    }
  };
  
  // Format date in a readable way
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
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-semibold flex justify-between items-center">
          <span>
            <I18nText translationKey="admin.logs.title">
              Journal d'activité des administrateurs
            </I18nText>
          </span>
          <Button 
            variant="outline" 
            size="sm"
            onClick={loadLogs}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <I18nText translationKey="admin.logs.refresh">
                Rafraîchir
              </I18nText>
            )}
          </Button>
        </CardTitle>
        
        <div className="flex flex-col sm:flex-row gap-3 mt-2">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
            <Input
              placeholder={t('admin.logs.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={entityFilter} onValueChange={setEntityFilter}>
              <SelectTrigger className="w-[150px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder={t('admin.logs.entityFilter')} />
              </SelectTrigger>
              <SelectContent>
                {entityTypes.map(type => (
                  <SelectItem key={type} value={type}>
                    {type === 'all' ? 
                      t('admin.logs.allEntities') : 
                      type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-[150px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder={t('admin.logs.actionFilter')} />
              </SelectTrigger>
              <SelectContent>
                {actionTypes.map(action => (
                  <SelectItem key={action} value={action}>
                    {action === 'all' ? 
                      t('admin.logs.allActions') : 
                      action.charAt(0).toUpperCase() + action.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-10 w-10 animate-spin text-slate-400" />
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="text-center py-10 text-slate-500">
            <I18nText translationKey="admin.logs.noLogsFound">
              Aucune activité correspondant aux critères de recherche n'a été trouvée.
            </I18nText>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredLogs.map(log => (
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
                        {log.action}
                      </Badge>
                      <span className="ml-1 text-slate-700">
                        {log.entity_type}
                        {log.entity_id && <span className="text-xs text-slate-500 ml-1">#{log.entity_id.substring(0, 8)}</span>}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500">
                      {formatDate(log.created_at)}
                    </span>
                  </div>
                  
                  {log.details && Object.keys(log.details).length > 0 && (
                    <div className="mt-1 text-sm text-slate-600 bg-slate-50 p-2 rounded">
                      {Object.entries(log.details).map(([key, value]) => (
                        <div key={key} className="flex gap-2">
                          <span className="font-medium">{key}:</span>
                          <span>{typeof value === 'string' ? value : JSON.stringify(value)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
