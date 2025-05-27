
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import ApiDocumentation from '@/components/enterprise/ApiDocumentation';
import MobileApp from '@/components/enterprise/MobileApp';
import SecurityDashboard from '@/components/enterprise/SecurityDashboard';

const EnterprisePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center space-y-6">
            <Badge variant="outline" className="bg-white/10 border-white/20 text-white">
              Enterprise Suite
            </Badge>
            <h1 className="text-5xl font-bold">
              World-Class Digital Heritage Platform
            </h1>
            <p className="text-xl text-slate-200 max-w-3xl mx-auto">
              Enterprise-grade cultural symbol analysis with advanced AI, 
              comprehensive APIs, mobile applications, and enterprise security
            </p>
            <div className="flex justify-center gap-4 pt-4">
              <Badge className="bg-green-500/20 text-green-300 border-green-400">
                99.9% Uptime SLA
              </Badge>
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-400">
                Enterprise Security
              </Badge>
              <Badge className="bg-purple-500/20 text-purple-300 border-purple-400">
                Global Scale
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <Tabs defaultValue="api" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="api">Enterprise API & SDKs</TabsTrigger>
            <TabsTrigger value="mobile">Mobile Applications</TabsTrigger>
            <TabsTrigger value="security">Security & Compliance</TabsTrigger>
          </TabsList>

          <TabsContent value="api">
            <ApiDocumentation />
          </TabsContent>

          <TabsContent value="mobile">
            <MobileApp />
          </TabsContent>

          <TabsContent value="security">
            <SecurityDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EnterprisePage;
