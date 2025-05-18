
import React from 'react';
import { I18nText } from '@/components/ui/i18n-text';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UploadCloud, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const ContributionsPage = () => {
  // Mock data - in a real app this would come from an API
  const contributionStats = {
    total: 12,
    validated: 8,
    pending: 4,
    rejected: 0
  };
  
  // Mock contributions - empty for this example
  const contributions = [];
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        <I18nText translationKey="contributions.title" />
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total uploads stat */}
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <UploadCloud className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">
                <I18nText translationKey="contributions.stats.total" />
              </p>
              <p className="text-3xl font-bold">{contributionStats.total}</p>
            </div>
          </CardContent>
        </Card>
        
        {/* Validated stat */}
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">
                <I18nText translationKey="contributions.stats.validated" />
              </p>
              <p className="text-3xl font-bold">{contributionStats.validated}</p>
            </div>
          </CardContent>
        </Card>
        
        {/* Pending stat */}
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-amber-100 p-3 rounded-full">
              <Clock className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">
                <I18nText translationKey="contributions.stats.pending" />
              </p>
              <p className="text-3xl font-bold">{contributionStats.pending}</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>
            <I18nText translationKey="contributions.myUploads" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          {contributions.length > 0 ? (
            <div className="divide-y">
              {/* Contributions list would be here */}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="bg-slate-100 inline-flex p-3 rounded-full mb-4">
                <UploadCloud className="h-8 w-8 text-slate-500" />
              </div>
              <h3 className="text-lg font-medium mb-2">
                <I18nText translationKey="contributions.empty" />
              </h3>
              <p className="text-slate-500 mb-6 max-w-md mx-auto">
                <I18nText translationKey="contributions.emptyDescription" />
              </p>
              <Button asChild>
                <Link to="/upload">
                  <UploadCloud className="mr-2 h-4 w-4" />
                  <I18nText translationKey="contributions.upload" />
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ContributionsPage;
